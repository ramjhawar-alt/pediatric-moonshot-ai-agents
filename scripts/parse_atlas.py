"""
parse_atlas.py  (v4 — robust extract_tables() extraction)

Key design decisions:
- Uses pdfplumber's extract_tables() for structured extraction
- Per-row ordered non-null extraction: fields mapped by LEFT-TO-RIGHT position,
  not by fixed column indices (handles Cardiology's variable column drift)
- Per-condition _col_to_field: tracks exact column indices for this condition's
  fields so within-table continuation rows are mapped correctly
- Cross-table update: when a new table starts, updates current condition's
  _col_to_field from the new table's layout (fixes cross-page continuation)
- Condition ID detection: uses first non-null cell on the row, not just col[0]
  (fixes Cardiology #11 which has an empty col[0] at the bottom of the page)
- Nephrology treatment: detected in high-index columns of continuation rows
"""

import json
import re
from pathlib import Path

import pdfplumber

ROOT = Path(__file__).parent.parent
ATLAS_SOURCES = {
    "cancer":     ROOT / "atlases/cancer/Pediatric_Cancer_Atlas_2026.pdf",
    "cardiology": ROOT / "atlases/cardiology/Pediatric_Cardiology_Atlas_2026.pdf",
    "nephrology": ROOT / "atlases/nephrology/Pediatric_Nephrology_Atlas_2026.pdf",
    "neurology":  ROOT / "atlases/neurology/Pediatric_Neurology_Atlas_2026.pdf",
}
OUT_DIR = ROOT / "src/data/atlas"

AGENT_MAP = {
    "cardiology": {1: "bav", 25: "hcm", 36: "dcm", 40: "kawasaki", 56: "pah", 59: "lqts", 80: "rvot"},
    "nephrology": {2: "fsgs-primary", 3: "fsgs-secondary", 4: "apol1", 6: "igan", 10: "c3g", 111: "ahus"},
    "neurology":  {1: "dravet", 20: "tsc", 33: "rett", 35: "angelman", 54: "bexs",
                   55: "sma", 56: "dmd", 86: "mps2-hunter", 87: "mps3a-sanfilippo"},
    "cancer":     {},
}

CATEGORY_RANGES = {
    "cancer": [
        (1,   10,  "Leukemia & MDS"),
        (11,  19,  "Lymphoma"),
        (20,  36,  "CNS Tumors"),
        (37,  49,  "Solid Tumors — Embryonal & Neural"),
        (50,  69,  "Sarcomas & Rare Solid Tumors"),
        (70,  87,  "Germ Cell, Endocrine & Other Carcinomas"),
        (88,  104, "Histiocytic, NUT, Fusion & Predisposition"),
    ],
    "cardiology": [
        (1,   35,  "Structural Congenital Heart Disease"),
        (36,  52,  "Cardiomyopathies"),
        (53,  67,  "Arrhythmias"),
        (68,  75,  "Inflammatory / Acquired"),
        (76,  84,  "Connective Tissue Disorders & Aortopathies"),
        (85,  91,  "Vascular & Metabolic Conditions"),
        (92,  96,  "Genetic Syndromes with Cardiac Involvement"),
        (97,  99,  "Cardiac Tumors"),
        (100, 104, "Interventional Cardiology"),
    ],
    "nephrology": [
        (1,   18,  "Glomerulopathies"),
        (19,  55,  "Hereditary / Genetic Kidney Diseases"),
        (56,  70,  "Ciliopathies / Cystic Diseases"),
        (71,  90,  "Tubulopathies"),
        (91,  100, "Congenital Anomalies / Structural Disorders"),
        (101, 110, "Infectious & Inflammatory"),
        (111, 118, "Vascular & Thrombotic Diseases"),
        (119, 128, "Metabolic / Storage / Crystalline Disorders"),
        (129, 135, "Hypertension — Pediatric"),
        (136, 139, "Neurogenic Bladder / Functional Urological"),
        (140, 143, "Trauma & Post-Surgical Complications"),
        (144, 148, "Drug-Induced & Toxin-Related"),
        (149, 155, "Systemic Disease Manifestations"),
        (156, 162, "Acute Kidney Injury"),
        (163, 167, "Chronic Kidney Disease"),
        (168, 172, "Hemolytic Uremic Syndrome & TMA"),
        (173, 176, "Rare & Emerging Pediatric Nephrology"),
    ],
    "neurology": [
        (1,   30,  "Epilepsy & Seizure Disorders"),
        (31,  55,  "Neurodevelopmental Disorders"),
        (56,  74,  "Neuromuscular Diseases"),
        (75,  118, "Neurometabolic & Storage Disorders"),
        (119, 123, "Neonatal & Acquired Neurological Injuries"),
        (124, 132, "Cerebrovascular Disorders"),
        (133, 145, "Autoimmune & Inflammatory Neurological Disorders"),
        (146, 159, "Movement Disorders"),
        (160, 176, "Structural / Brain Malformations"),
        (177, 188, "Neurocutaneous Syndromes"),
        (189, 193, "Sleep & Autonomic Disorders"),
        (194, 200, "Headache & Pain Disorders"),
        (201, 215, "Pediatric CNS Tumors / Neuro-Oncology"),
        (216, 226, "Neuroinfectious Disorders"),
        (227, 233, "Other Neurological Conditions"),
    ],
}

HEREDITY_TIERS = {3: "strong", 2: "dominant", 1: "associated", 0: "none"}
FIELD_ORDER = ['_name', '_desc', '_freq', '_diag', '_treat']


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def slugify(name: str) -> str:
    name = name.lower()
    name = re.sub(r'[^\w\s-]', ' ', name)
    name = re.sub(r'\s+', '-', name.strip())
    return re.sub(r'-+', '-', name)[:80].strip('-')


def count_heredity(text: str) -> int:
    return text.count('🧬')


def clean_name(name: str) -> str:
    return re.sub(r'🧬+', '', name).strip()


def get_category(cond_id: int, specialty: str) -> str:
    for start, end, cat in CATEGORY_RANGES.get(specialty, []):
        if start <= cond_id <= end:
            return cat
    return "Other"


def cell_text(cell) -> str:
    return str(cell).strip() if cell else ''


def non_null_cells(row: list) -> list:
    """Return list of (col_idx, text) for non-empty cells, sorted by col_idx."""
    return sorted(
        [(i, cell_text(c)) for i, c in enumerate(row) if cell_text(c)],
        key=lambda x: x[0]
    )


def is_condition_id(text: str) -> bool:
    """True if text is a 1–3 digit integer representing a valid condition number."""
    if not text:
        return False
    return bool(re.match(r'^\d{1,3}$', text.strip())) and 1 <= int(text.strip()) <= 300


# ---------------------------------------------------------------------------
# Table-level column-map detection (used for cross-table continuation)
# ---------------------------------------------------------------------------

def detect_table_col_map(table: list) -> dict | None:
    """
    Detect column mapping from first data row (with a valid condition ID).
    Returns {field_name: col_idx, ...} or None if no data rows found.
    'treat' may be None if treatment only appears in continuation rows (Nephrology).
    """
    for row in table:
        cells = non_null_cells(row)
        if not cells:
            continue
        first_col, first_text = cells[0]
        if not is_condition_id(first_text):
            continue

        data_cells = cells[1:]  # skip the number cell
        if len(data_cells) < 4:
            continue

        indices = [i for i, _ in data_cells]
        return {
            'name':         indices[0],
            'desc':         indices[1] if len(indices) > 1 else None,
            'freq':         indices[2] if len(indices) > 2 else None,
            'diag':         indices[3] if len(indices) > 3 else None,
            'treat':        indices[4] if len(indices) > 4 else None,
            'max_data_col': max(indices),
        }
    return None


def col_map_to_field_lookup(col_map: dict) -> dict:
    """Convert a table-level col_map to a {col_idx: '_field'} lookup."""
    mapping = {}
    for field_key, col_idx in col_map.items():
        if col_idx is not None and field_key in ('name', 'desc', 'freq', 'diag', 'treat'):
            mapping[col_idx] = f'_{field_key}'
    return mapping


# ---------------------------------------------------------------------------
# Per-row extraction (handles variable column positions within same table)
# ---------------------------------------------------------------------------

def extract_condition_row(cond_id: int, row: list) -> dict:
    """
    Extract condition fields using ordered non-null approach.
    The n-th non-null data cell (after the number cell) maps to the n-th field:
    name, desc, freq, diag, treat — regardless of actual column indices.

    Also records _col_to_field: {col_idx: '_field'} for continuation row matching.
    """
    cells = non_null_cells(row)
    # Skip the first cell (the condition number, might be at col[0] or col[1])
    data_cells = cells[1:]

    result = {'_id': cond_id, '_col_to_field': {}, '_max_data_col': 0}
    for field in FIELD_ORDER:
        result[field] = ''

    for j, (col_idx, text) in enumerate(data_cells):
        if j < len(FIELD_ORDER):
            fname = FIELD_ORDER[j]
            result[fname] = text
            result['_col_to_field'][col_idx] = fname

    if result['_col_to_field']:
        result['_max_data_col'] = max(result['_col_to_field'].keys())

    return result


# ---------------------------------------------------------------------------
# Continuation row handling
# ---------------------------------------------------------------------------

def append_continuation(current: dict, row: list) -> None:
    """
    Append continuation row content to the current condition.
    Uses the condition's own _col_to_field mapping.
    Nephrology treatment (in high-index columns) handled separately.
    """
    col_to_field = current['_col_to_field']
    max_col = current['_max_data_col']
    has_treat = '_treat' in col_to_field.values()

    for col_idx, text in non_null_cells(row):
        if col_idx in col_to_field:
            current[col_to_field[col_idx]] += ' ' + text
        elif not has_treat and col_idx > max_col:
            # Nephrology pattern: treatment text appears in high-index columns
            # not present in the main data row
            current['_treat'] += ' ' + text


def update_col_map_for_new_table(current: dict, table_col_map: dict) -> None:
    """
    When a condition crosses a page/table boundary, update its _col_to_field
    to match the new table's column layout.
    This ensures cross-page continuation rows are correctly assigned.
    """
    if table_col_map is None:
        return
    new_lookup = col_map_to_field_lookup(table_col_map)
    current['_col_to_field'] = new_lookup
    current['_max_data_col'] = table_col_map.get('max_data_col', 0)


# ---------------------------------------------------------------------------
# Field parsers
# ---------------------------------------------------------------------------

def parse_frequency(raw: str) -> dict:
    if not raw:
        return {"us": "", "global": "", "sources": ""}
    raw = raw.replace('\n', ' ')
    us_m = re.search(r'US\s*[:\s](.+?)(?=Global|World|Source|Reference|\Z)',
                     raw, re.IGNORECASE | re.DOTALL)
    gl_m = re.search(r'(?:Global|World)\s*[:\s](.+?)(?=Source|Reference|\Z)',
                     raw, re.IGNORECASE | re.DOTALL)
    src_m = re.search(r'(?:Source|Reference)[s]?\s*[:\s](.+)',
                      raw, re.IGNORECASE | re.DOTALL)
    # Strip trailing pipe separator used in Neurology: "~160 – ~230 | Global:…"
    us = us_m.group(1).strip().rstrip('|').strip() if us_m else ""
    global_ = gl_m.group(1).strip() if gl_m else ""
    sources = src_m.group(1).strip() if src_m else ""
    if not us and not global_:
        us = raw.strip()
    return {"us": us, "global": global_, "sources": sources}


def parse_treatment(raw: str, specialty: str) -> dict:
    if not raw:
        return {"standardOfCare": "", "emerging": ""}
    raw = raw.strip()
    if specialty == 'nephrology':
        split_idx = len(raw)
        for marker in ["Emerging/Investigational", "Near-Approval"]:
            idx = raw.find(marker)
            if 0 < idx < split_idx:
                split_idx = idx
        if split_idx < len(raw):
            soc = re.sub(r'Standard of Care\s*', '', raw[:split_idx]).strip().strip('|').strip()
            emerging = raw[split_idx:].strip()
        else:
            soc = re.sub(r'Standard of Care\s*', '', raw).strip()
            emerging = ""
        return {"standardOfCare": soc, "emerging": emerging}
    else:
        m = re.search(r'\bEmerging\b', raw, re.IGNORECASE)
        if m and m.start() > 10:
            soc = re.sub(r'^SOC\s*[:\-–—]?\s*', '', raw[:m.start()],
                         flags=re.IGNORECASE).strip()
            return {"standardOfCare": soc, "emerging": raw[m.start():].strip()}
        soc = re.sub(r'^SOC\s*[:\-–—]?\s*', '', raw, flags=re.IGNORECASE).strip()
        return {"standardOfCare": soc, "emerging": ""}


def clean_text(text: str) -> str:
    """Normalize whitespace and remove leading/trailing garbage."""
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r' {2,}', ' ', text)
    return text.strip()


def finalize(raw: dict, specialty: str, agent_map: dict) -> dict:
    cond_id = raw['_id']
    name_raw = clean_text(raw['_name'])
    heredity_count = min(count_heredity(name_raw), 3)
    name = clean_name(name_raw)

    freq = parse_frequency(clean_text(raw['_freq']))
    treatment = parse_treatment(raw['_treat'].strip(), specialty)

    return {
        'id':           cond_id,
        'slug':         slugify(name),
        'specialty':    specialty,
        'category':     get_category(cond_id, specialty),
        'name':         name,
        'heredityTier': HEREDITY_TIERS.get(heredity_count, 'none'),
        'description':  clean_text(raw['_desc']),
        'frequency':    freq,
        'diagnosis':    clean_text(raw['_diag']),
        'treatment':    treatment,
        'hasAgent':     cond_id in agent_map,
        'agentSlug':    agent_map.get(cond_id),
    }


# ---------------------------------------------------------------------------
# Main parser
# ---------------------------------------------------------------------------

def parse_atlas_pdf(specialty: str, pdf_path: Path) -> list:
    agent_map = AGENT_MAP.get(specialty, {})
    conditions = []
    current = None     # active condition being built
    last_table_col_map = None  # col_map from most recent table

    def save():
        nonlocal current
        if current:
            conditions.append(finalize(current, specialty, agent_map))
            current = None

    with pdfplumber.open(pdf_path) as pdf:
        print(f"  {pdf_path.name}: {len(pdf.pages)} pages")

        for page in pdf.pages:
            for table in page.extract_tables():
                # Detect this table's column layout from its first data row
                table_col_map = detect_table_col_map(table)

                # If current condition crosses into a new table, update its
                # column mapping so continuation rows are correctly matched
                if current is not None and table_col_map is not None:
                    update_col_map_for_new_table(current, table_col_map)

                if table_col_map is not None:
                    last_table_col_map = table_col_map

                for row in table:
                    cells = non_null_cells(row)
                    if not cells:
                        continue

                    # Check col[0] specifically for the continuation test.
                    # first_text (first non-null cell) may be at col[1] or
                    # higher — we must NOT use it for the "is col[0] empty?"
                    # check, because continuation rows in Nephrology and
                    # Cardiology have their content at high column indices
                    # while col[0] is genuinely empty.
                    col0_text = cell_text(row[0]) if row else ''
                    first_col, first_text = cells[0]

                    # ── New condition ─────────────────────────────────────
                    # Condition ID may be at col[0] or col[1] (e.g. #11 in
                    # Cardiology has an extra empty col[0] at page bottom)
                    if is_condition_id(first_text):
                        save()
                        current = extract_condition_row(int(first_text), row)
                        continue

                    # ── Continuation row ──────────────────────────────────
                    # col[0] must be empty; content is in other columns
                    if current is not None and not col0_text:
                        append_continuation(current, row)

        save()

    # Deduplicate (keep first occurrence), sort by ID
    seen: set = set()
    result = []
    for c in sorted(conditions, key=lambda x: x['id']):
        if c['id'] not in seen:
            seen.add(c['id'])
            result.append(c)

    return result


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for specialty, pdf_path in ATLAS_SOURCES.items():
        print(f"\n=== {specialty.upper()} ===")
        if not pdf_path.exists():
            print(f"  ERROR: not found: {pdf_path}")
            continue

        conditions = parse_atlas_pdf(specialty, pdf_path)
        out_path = OUT_DIR / f"{specialty}.json"

        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(conditions, f, indent=2, ensure_ascii=False)

        agent_count = sum(1 for c in conditions if c['hasAgent'])
        print(f"  ✓ {out_path.relative_to(ROOT)}")
        print(f"    {len(conditions)} conditions | {agent_count} with agents")

        # Show first 3 and spot-check known difficult ones
        for c in conditions[:3]:
            print(f"    #{c['id']} [{c['category']}] {c['name']!r}")
            print(f"      desc: {c['description'][:80]!r}")
            print(f"      soc:  {c['treatment']['standardOfCare'][:70]!r}")

    print("\n✅ Done")


if __name__ == '__main__':
    main()
