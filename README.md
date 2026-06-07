# Pediatric Moonshot — Precise AI Diagnostic Agents

> *"If you know the enemy and know yourself, you need not fear the result of a hundred battles."*
> — Sun Tzu, The Art of War · Pediatric Moonshot

**AI can accelerate diagnosis and treatment for children rurally, locally and globally.**

---

## What This Project Is

This repository contains the design architecture and clinical knowledge foundation for **disease-precise AI diagnostic agents** targeting pediatric medicine — built on the [Pediatric Moonshot](https://pediatricmoonshot.org) Atlas framework.

Each agent is a **100-point weighted scoring system** that reads a patient's complete medical record and outputs:
1. A **calibrated diagnostic confidence score** for a specific condition
2. A **disease progression trajectory** (Fast / Moderate / Slow) grounded in clinical guidelines

The agents are designed to work at the **point of care** — in rural clinics, community hospitals, and lower-income settings where pediatric specialists are unavailable but children still get sick.

---

## The Problem

Pediatric medicine is undergoing a knowledge explosion — and it is outpacing infrastructure.

| Atlas | Conditions (2026) | Growth Since 2000 | Conditions Since 2000 |
|-------|------------------|-------------------|----------------------|
| **Neurology** | 233 | +72% | ~98 entirely new |
| **Nephrology** | 176 | +68% | ~71 entirely new |
| **Cardiology** | 104 | +37% | ~28 entirely new |
| **Cancer** | 104 | +30% | ~24 new or redefined |

The conditions added since 2000 are **rarer**, not more common:

- **Timothy Syndrome** — ~25 known cases globally
- **NGLY1-CDDG** — ~50 known patients globally
- **CSNK2B / Poirier-Bienvenu** — <100 cases reported worldwide
- **H3K27M DIPG** — <100 US cases per year

No single institution sees enough of these patients to build clinical expertise. Data is siloed. Diagnostic odysseys lasting 5+ years are the norm for rare conditions.

> *"Federated, privacy-preserving AI is not a methodological preference for these diseases — it is a mathematical necessity."*
> — Pediatric Moonshot 25-Year Nephrology Analysis, 2026

---

## Repository Structure

```
├── atlases/                    # Pediatric Moonshot disease atlases (PDFs)
│   ├── cancer/                 # 104 conditions · 11 categories
│   ├── cardiology/             # 104 conditions · 11 categories
│   ├── nephrology/             # 176 conditions · 17 categories
│   └── neurology/              # 233 conditions · 15 categories
│
├── agents/                     # Precise AI agent design files (xlsx)
│   ├── cardiology/             # 7 conditions · diagnosis + progression sheets
│   ├── kidney/                 # 6 conditions · diagnosis + progression sheets
│   └── neurology/              # 9 conditions · diagnosis sheets
│
├── research/                   # 25-year knowledge growth analysis papers
│   ├── 25yr_Cancer_Knowledge_Growth.docx
│   ├── 25yr_Cardiology_Knowledge_Growth.docx
│   ├── 25yr_Nephrology_Knowledge_Growth.docx
│   └── 25yr_Neurology_Knowledge_Growth.docx
│
├── docs/
│   ├── agent-framework.md      # How the 100-point agent system works
│   └── atlas-overview.md       # Full atlas specifications and category breakdowns
│
└── CLAUDE.md                   # AI assistant rules for this repo
```

---

## The AI Agent Framework

Each agent sheet maps clinical domains → binary questions → weighted points:

```
Domain              Question                                    Answer      Pts   Cost
─────────────────────────────────────────────────────────────────────────────────────
Echo / Imaging      Does 2D echo show bicuspid aortic valve     Yes — clearly  25   Small
                    morphology on parasternal short axis?       bicuspid
Echo / Imaging      Is there aortic root dilation (Z-score      Yes             7   Small
                    >2 in children; >4.0 cm in adults)?
Genetics            First-degree relative with confirmed BAV?   Yes             8   Small
...                 ...                                         ...           ...   ...
                                                                        TOTAL: 100
```

**Confidence output:**

| Score | Interpretation | Action |
|-------|---------------|--------|
| 🔴 80–100 | High confidence — confirmed or highly probable | Proceed with full protocol |
| 🟡 50–79 | Moderate confidence | Additional targeted testing |
| 🟢 < 50 | Low confidence | Reassess; rule out alternatives |

Each condition also has a **Progression Sheet** — a separate 100-point Adverse Prognostic Score predicting disease trajectory, grounded in the same published guidelines (ACC/AHA, ESC, KDIGO, AHA, JCS).

→ See [`docs/agent-framework.md`](docs/agent-framework.md) for full specification.

---

## Agents Built to Date

### Cardiology — 7 Conditions
`Bicuspid Aortic Valve · Hypertrophic Cardiomyopathy · Dilated Cardiomyopathy · Kawasaki Disease · Pulmonary Arterial Hypertension · Long QT Syndrome · Pulmonary Valve / RVOT Disease`

Each with a **Diagnosis Sheet** + **Progression Sheet** (14 total agent sheets).

### Kidney Disease — 6 Conditions
`FSGS Primary · FSGS Secondary · APOL1-Mediated Nephropathy · IgA Nephropathy · C3 Glomerulopathy · Atypical HUS`

Each with a **Diagnosis Sheet** + **Progression Sheet** (12 total agent sheets).

### Neurology — 9 Conditions
`Dravet Syndrome · Tuberous Sclerosis Complex · Rett Syndrome · Angelman Syndrome · BEXS Syndrome · Spinal Muscular Atrophy · Duchenne Muscular Dystrophy · MPS II Hunter · MPS IIIA Sanfilippo`

(9 diagnosis sheets; progression sheets in development)

> **Architecture note:** Agent sheet numbers correspond directly to the condition's number in the Pediatric Moonshot Atlas (e.g., Neuro Sheet `#1 Dravet` = Atlas condition #1). This establishes a scalable, traceable pipeline: any of the **617 total conditions** across all four atlases can have an agent built using the same framework.

---

## The Disease Atlases

Four atlases — one per specialty — serve as the clinical knowledge foundation. Each entry includes: biology, US and global incidence, diagnostic workup, and treatment (Standard of Care vs. Emerging/Investigational).

| Atlas | Conditions | Validated By |
|-------|-----------|-------------|
| Cancer | 104 | COG · SIOPE · PBTC · WHO 2021/2022 |
| Cardiology | 104 | ACC/AHA · ESC · AHA |
| Nephrology | 176 | ABP Pediatric Nephrology Board · RCPCH SPIN · ERKNet · ESPN/IPNA |
| Neurology | 233 | CNF Disorder Directory · Orphanet · ClinicalTrials.gov |

→ See [`docs/atlas-overview.md`](docs/atlas-overview.md) for full category breakdowns and format specifications.

---

## About Pediatric Moonshot

[Pediatric Moonshot](https://pediatricmoonshot.org), founded by **Timothy Chou, Ph.D.**, is building the data infrastructure required to end preventable childhood disease. The organization's atlases — cataloguing every known pediatric condition across four major specialties — form the clinical backbone of this AI agent system.

---

## Development

This repository follows conventional commits and standard GitHub flow. See [`CLAUDE.md`](CLAUDE.md) for the development rules governing all work in this repo.
