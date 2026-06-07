# Pediatric Moonshot Disease Atlases — Overview

## What the Atlases Are

The Pediatric Moonshot Disease Atlases are comprehensive clinical reference documents — one per specialty — cataloguing every known pediatric condition with standardized entries covering biology, epidemiology, diagnosis, and treatment. They are the **knowledge foundation** on which the AI agents are built.

Each atlas opens with the same guiding principle:

> *"If you know the enemy and know yourself, you need not fear the result of a hundred battles."*
> — Sun Tzu, The Art of War

---

## The Four Atlases at a Glance

| Atlas | Conditions | Categories | Hereditary | Version / Date |
|-------|-----------|------------|-----------|---------------|
| **Cancer** | 104 | 11 | — | March 2026 |
| **Cardiology** | 104 | 11 | — | March 2026, Version 9 |
| **Nephrology** | 176 | 17 | 118 of 176 (67%) | March 2026, Version 1.0 |
| **Neurology** | **233** | 15 | Tiered (see below) | April 2026 |

---

## Atlas Formats

Each atlas uses a standardized multi-column format. Atlases differ slightly by specialty:

### Cancer & Cardiology (5-column format)
`# | Condition | Description | Frequency (US / Global) | Diagnosis | Treatment (SOC + Emerging)`

### Nephrology (6-column format — richest clinical detail)
`# | Condition Name | Description | Frequency / Epidemiology | Current Diagnostic Methods | Current Treatment (SOC vs. Emerging)`

- **Navy left border** = Standard of Care (FDA-approved / guideline-endorsed)
- **Amber left border** = Emerging / Investigational (late-stage trials, accelerated approvals)
- FDA approval years highlighted inline
- Validated by: ABP Pediatric Nephrology Board · RCPCH SPIN · ERKNet · ESPN/IPNA

### Neurology (6-column format — most epidemiologically rigorous)
`# | Condition/Disease | Short Description | Frequency (Est. US | Est. Global) | Current Diagnostic | Current Therapeutic`

- Includes `✓ VERIFIED [CONFIRMED]` and `✓ VERIFIED [UPDATED]` notations with source citations per entry
- US and global patient estimates given separately with reference trails
- Hereditary tiers marked per condition:
  - 🧬🧬🧬 Strong Hereditary Predisposition (monogenic / high-penetrance)
  - 🧬🧬 Moderate Hereditary Predisposition
  - 🧬 Mild / Partial Hereditary Association
  - *(no emoji)* No significant hereditary component

---

## The 25-Year Knowledge Growth Case

Paired with each atlas is an academic-style analysis paper (JAMA format) answering: *"How much more do we know than we did in year 2000?"*

| Specialty | Year-2000 Count | 2026 Count | Growth | Primary Driver |
|-----------|----------------|------------|--------|----------------|
| Cancer | ~80 | 104 | **+30%** | Molecular profiling splitting morphological tumor categories |
| Cardiology | ~76 | 104 | **+37%** | Inherited arrhythmia genetics; connective tissue aortopathies; Fontan complications |
| Nephrology | ~105 | 176 | **+68%** | Genomics splitting nephrotic syndrome subtypes; complement pathway mapping; APOL1 discovery |
| Neurology | ~135 | 233 | **+72%** | Whole-exome sequencing resolving overlapping syndromes; autoimmune encephalitis discovery (2007) |

### Why This Matters for AI

The conditions added since 2000 are **rarer**, not more common. Extreme examples:

- **Timothy Syndrome** (cardiology): ~25 known cases globally
- **NGLY1-CDDG** (neurology): ~50 known patients globally
- **H3K27M DIPG** (cancer): <100 US cases per year
- **CSNK2B / Poirier-Bienvenu Syndrome** (neurology): <100 cases reported

> *"Federated, privacy-preserving AI is not a methodological preference for these diseases — it is a mathematical necessity."*
> — Pediatric Moonshot 25-Year Nephrology Analysis, 2026

At current growth rates, a 2050 Atlas would contain:
- **~295** kidney diseases
- **~400** neurological conditions
- **~145** cancers

The infrastructure must be built now.

---

## Neurology Atlas — 15 Categories (233 Conditions)

1. Epilepsy & Seizure Disorders
2. Neurodevelopmental Disorders
3. Neuromuscular Diseases
4. Neurometabolic & Storage Disorders
5. Neonatal & Acquired Neurological Injuries
6. Cerebrovascular Disorders
7. Autoimmune & Inflammatory Neurological Disorders
8. Movement Disorders
9. Structural / Brain Malformations
10. Neurocutaneous Syndromes (Phakomatoses)
11. Sleep & Autonomic Disorders
12. Headache & Pain Disorders
13. *(additional categories completing the count to 233)*

## Nephrology Atlas — 17 Categories (176 Conditions)

1. Glomerulopathies
2. Hereditary / Genetic Kidney Diseases
3. *(15 additional categories spanning Tubulopathies, TMA, AKI, CKD, Transplant, Congenital Anomalies, Metabolic/Stone disease, Hypertension, and others)*
