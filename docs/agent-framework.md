# Precise AI Agent Framework

## Overview

Each AI agent is a **100-point weighted diagnostic scoring system** that draws from a patient's complete medical record to output a calibrated confidence score for a specific pediatric condition — and a separate 100-point adverse prognostic score to predict disease trajectory.

Every question, point value, and cost tier is grounded in published clinical guidelines (ACC/AHA, ESC, KDIGO, AHA, WHO) and the corresponding Pediatric Moonshot Atlas entry.

---

## Diagnostic Agent Structure

Each condition has one **Diagnosis Sheet** with the following columns:

| Column | Description |
|--------|-------------|
| **Domain** | Clinical area the question draws from (e.g., Echo/Imaging, Genetics, Labs, ECG, Physical Exam, Biomarkers, Symptoms) |
| **Question** | Binary yes/no question derived from the complete medical record |
| **Confirming Answer** | Clinical meaning of "Yes" — includes specificity, sensitivity, and guideline reference |
| **Points** | Diagnostic weight of this finding (higher = more pathognomonic) |
| **Cost** | Test burden tier |

### Cost Tiers

| Tier | Meaning | Approximate Cost |
|------|---------|-----------------|
| **Small** | Existing record / standard test (e.g., echo, ECG, CBC, clinical exam) | $0–$200 |
| **Medium** | Targeted test or genetic panel | $200–$1,500 |
| **Large** | Advanced imaging or procedure (CT, MRI, cardiac catheterization, RHC, biopsy) | $1,500–$5,000+ |

### Confidence Score Interpretation

| Score | Confidence | Recommended Action |
|-------|-----------|-------------------|
| 🔴 **80–100** | High — confirmed or highly probable | Proceed with full diagnostic and management protocol |
| 🟡 **50–79** | Moderate — suggestive but incomplete | Additional targeted testing indicated; specialist referral |
| 🟢 **< 50** | Low — insufficient evidence | Reassess; rule out alternative diagnoses |

---

## Progression Agent Structure

Each condition also has a **Progression Sheet** — an independent 100-point **Adverse Prognostic Score** — measuring disease trajectory rather than diagnosis confidence.

Each progression sheet cites the specific clinical guideline it is grounded in (e.g., *"ACC/AHA 2021 BAV Guidelines / ESC 2021 VHD"*).

### Progression Score Interpretation

| Score | Trajectory | Clinical Implication |
|-------|-----------|---------------------|
| 🔴 **66–100** | Fast Progression | Urgent intervention; surgical evaluation or advanced therapy referral |
| 🟡 **21–65** | Moderate Progression | Structured surveillance every 6–12 months; optimize medical therapy |
| 🟢 **0–20** | Slow Progression | Annual monitoring; favorable long-term outlook |

---

## Design Principles

1. **Atlas-grounded** — Every question traces directly to a condition entry in the corresponding Pediatric Moonshot Atlas (Cancer, Cardiology, Nephrology, or Neurology). Agent sheet numbers map directly to Atlas condition numbers.

2. **Cost-aware** — The Small/Medium/Large cost tier allows the agent to operate in resource-constrained settings (rural clinics, community hospitals, lower-income countries) where advanced imaging may be unavailable.

3. **Guideline-cited** — Each progression sheet header cites the clinical guideline it reflects (ACC/AHA, ESC, KDIGO, AHA, JCS). This makes every output clinically defensible.

4. **Federated-ready** — The scoring framework is designed to aggregate signal across distributed patient records without requiring centralized data storage — essential for rare conditions where no single institution sees enough cases.

---

## Agents Built to Date

### Cardiology (7 conditions, 14 agent sheets + 1 Maternal)
| # | Condition | Domains |
|---|-----------|---------|
| 1 | Bicuspid Aortic Valve (BAV) | Echo/Imaging (45pts), Physical Exam, Genetics, Hemodynamic/Doppler, Associated Conditions, Symptoms |
| 25 | Hypertrophic Cardiomyopathy (HCM) | Echo (35pts), Cardiac MRI, ECG, Genetics, Symptoms, SCD Risk Markers |
| 36 | Dilated Cardiomyopathy (DCM) | Echo, Cardiac MRI, Genetics, ECG, Biomarkers, Symptoms |
| 40 | Kawasaki Disease | Fever, Classic Clinical Features (5 criteria), Echo, Labs, Demographics, IVIG Response |
| 56 | Pulmonary Arterial Hypertension (PAH) | Echo/Imaging, Right Heart Catheterization, Biomarkers, Genetics, Functional Status, Treatment Response |
| 59 | Long QT Syndrome (LQTS) | ECG, Genetics, Symptoms, Family History, Stress Testing |
| 80 | Pulmonary Valve / RVOT Disease | Echo, Catheterization, ECG, Genetics, Symptoms |

### Kidney Disease (6 conditions, 12 agent sheets)
| # | Condition |
|---|-----------|
| 2 | FSGS — Primary/Idiopathic |
| 3 | FSGS — Secondary |
| 4 | APOL1-Mediated Nephropathy |
| 6 | IgA Nephropathy (IgAN) |
| 10 | C3 Glomerulopathy (C3G) |
| 110 | Atypical Hemolytic Uremic Syndrome (aHUS) |

### Neurology (9 conditions, 9 agent sheets)
| # | Condition |
|---|-----------|
| 1 | Dravet Syndrome |
| 20 | Tuberous Sclerosis Complex (TSC) |
| 33 | Rett Syndrome (MECP2) |
| 35 | Angelman Syndrome |
| 54 | BEXS Syndrome (HNRNPH2) |
| 55 | Spinal Muscular Atrophy (SMA) |
| 56 | Duchenne Muscular Dystrophy (DMD) |
| 86 | Mucopolysaccharidosis Type II (Hunter Syndrome) |
| 87 | Mucopolysaccharidosis Type IIIA (Sanfilippo) |

> **Note:** Agent sheet numbers correspond directly to the condition's number in the Pediatric Moonshot Atlas — establishing a systematic, scalable, and traceable architecture. Any of the 233 Neurology / 176 Nephrology / 104 Cardiology / 104 Cancer conditions can have an agent built using the same framework.
