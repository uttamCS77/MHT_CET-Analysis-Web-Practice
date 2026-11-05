# MHT CET 2022–2026 Complete PYQ Analysis & Smart Preparation Platform

A full-stack, research-grade examination analytics and topic-wise preparation platform built on the complete collection of **12,422 official MHT CET PCM previous-year questions from 83 shifts across 2022, 2023, 2024, 2025, and 2026**.

---

## 1. Project Overview & Empirical Scope

- **Exam Scope**: Maharashtra Common Entrance Test (MHT CET) – Physics, Chemistry, and Mathematics (PCM).
- **Target Years**: 2022, 2023, 2024, 2025, and 2026.
- **Primary Data Source**: [ExamSide MHT CET Repository](https://questions.examside.com/past-years/year-wise/jee/mht-cet)
- **Total Shifts Scanned**: **83 shifts** (100% extraction success, 0 missing or inaccessible shifts).
  - **2022**: 12 shifts
  - **2023**: 12 shifts
  - **2024**: 16 shifts
  - **2025**: 16 shifts
  - **2026**: 27 shifts
- **Total Questions Analyzed**: **12,422 real previous-year questions**
  - **Physics**: 4,138 questions across 28 chapters
  - **Chemistry**: 4,137 questions across 34 chapters
  - **Mathematics**: 4,147 questions across 29 chapters
- **Classified Subtopics**: **238 granular topics** evaluated and ranked by 5-year shift density.
- **Interactive Quiz Questions**: All 12,422 questions available with 846 representative questions enriched with full option text, official answer keys, step-by-step solutions, and diagrams.

---

## 2. Key Features

### A. Deep Chapter & Topic Frequency Hierarchy
- **Level 1**: Subject (Physics, Chemistry, Mathematics)
- **Level 2**: Chapters (aligned with Maharashtra State Board HSC Class 12 (80%) + Class 11 (20%))
- **Level 3**: Granular Subtopics with annual breakdown (`'22`, `'23`, `'24`, `'25`, `'26`), 5-year total, average per shift, paper coverage %, subject weightage %, and priority classification.
- **Instant Search, Filter & Sort**: Search by chapter/topic, filter by priority tier or year, and sort by question count, average, or coverage.

### B. Top 20 Most Important Subtopics per Subject
- **Physics Top 20**: Ranked high-yield subtopics (e.g., *Young's Double Slit Experiment*, *LCR Resonance Circuits*, *Meter Bridge & Wheatstone Bridge*, *Photoelectric Effect*).
- **Chemistry Top 20**: Ranked high-yield subtopics (e.g., *Unit Cell Calculations & Density*, *Colligative Properties & Van 't Hoff Factor*, *Nernst Equation & Cell EMF*, *Kohlrausch's Law*).
- **Mathematics Top 20**: Ranked high-yield subtopics (e.g., *Dot Product & Cross Product of Vectors*, *Direction Cosines & Direction Ratios*, *Order & Degree of Differential Equations*, *Linear Differential Equations*).
- Each entry includes annual counts, 5-year totals, average per paper, paper presence percentage, and analytical justification.

### C. Fully Functional Topic-Wise PYQ Quiz System
- **1-Click "JUMP TO PYQs"**: Present beside every single topic in the chapter tables and Top 20 lists.
- **Exam Shift Metadata**: Each question displays its exact year and shift (e.g., `MHT CET 2026 20th May Morning Shift`).
- **Interactive Options & Question Palette**: Select answers, mark for review, clear choices, and navigate via the live question palette.
- **Evaluation & Solutions**: Automated scoring, accuracy percentage, time tracking, celebratory confetti, question-by-question review, official answer keys, and step-by-step solutions.
- **Filter & Practice Modes**: Filter by year, shift (Morning/Evening), or practice only unanswered or incorrect questions.

### D. Export & Download Center
- **Excel (.xlsx)**: Comprehensive workbook containing 8 dedicated sheets:
  1. *Overview* (Executive summary & dataset metadata)
  2. *Physics* (Full chapter & topic frequency metrics)
  3. *Chemistry* (Full chapter & topic frequency metrics)
  4. *Mathematics* (Full chapter & topic frequency metrics)
  5. *Top 20 Physics* (Ranked high-yield subtopics with rationale)
  6. *Top 20 Chemistry* (Ranked high-yield subtopics with rationale)
  7. *Top 20 Mathematics* (Ranked high-yield subtopics with rationale)
  8. *Paper Coverage* (Complete audit manifest for all 83 shifts)
- **PDF Reports**: Printable high-resolution reports with clean grid tables, headers, and metadata.
- **CSV**: Subject-wise and complete exports for external data analysis.

---

## 3. Statistical Calculation Methodology

1. **Total Question Count**: Exact sum of occurrences across all 83 scanned shifts from 2022 to 2026.
2. **Year-Wise Average**:
   $$\text{Avg}_{\text{year}} = \frac{\text{Questions from topic in year}}{\text{Scanned shifts in year}}$$
   Where denominators are: 12 (2022), 12 (2023), 16 (2024), 16 (2025), and 27 (2026).
3. **Five-Year Pooled Average**:
   $$\text{Avg}_{\text{paper}} = \frac{\text{Total questions across 5 years}}{83}$$
4. **Equal-Year Average**:
   $$\text{Avg}_{\text{equal}} = \frac{\text{Avg}_{2022} + \text{Avg}_{2023} + \text{Avg}_{2024} + \text{Avg}_{2025} + \text{Avg}_{2026}}{5}$$
5. **Paper Coverage %**:
   $$\text{Coverage} = \left(\frac{\text{Shifts in which topic appeared}}{83}\right) \times 100$$
6. **Subject Weightage %**:
   $$\text{Weightage} = \left(\frac{\text{Total topic questions}}{\text{Total questions in subject}}\right) \times 100$$
7. **Priority Scoring Formula (0–100 Scale)**:
   $$\text{Score} = \min\left(100, (\text{Avg}_{\text{paper}} \times 40) + (\text{Coverage} \times 0.45) + \left(\frac{\text{Active Years}}{5} \times 15\right)\right)$$
   - **Very High**: Score $\ge 42$, or $\text{Avg} \ge 0.8$, or $\text{Coverage} \ge 50\%$
   - **High**: Score $\ge 24$, or $\text{Avg} \ge 0.45$, or $\text{Coverage} \ge 30\%$
   - **Moderate**: Score $\ge 12$, or $\text{Avg} \ge 0.2$, or $\text{Coverage} \ge 15\%$
   - **Low**: Score $< 12$

---

## 4. Project Structure

```
├── app/
│   ├── api/
│   │   ├── analytics/route.ts    # Serves precomputed 5-year statistics
│   │   ├── manifest/route.ts     # Serves the 83-paper coverage manifest
│   │   └── questions/route.ts    # Filterable PYQ database query endpoint
│   ├── globals.css               # Tailwind CSS v4 setup
│   ├── layout.tsx                # App root layout with SEO metadata
│   └── page.tsx                  # Primary page assembling all dashboards & views
├── components/
│   ├── AnalyticsVisuals.tsx      # SVG/Tailwind charts for trends & priority
│   ├── ExportModal.tsx           # Export Center for PDF, Excel (8 sheets), CSV
│   ├── HeroBanner.tsx            # Scope credentials & 5-metric KPI strip
│   ├── Navbar.tsx                # Clean single-line Top Bar contract navigation
│   ├── PaperManifestView.tsx     # 83-shift audit table with search & filter
│   ├── QuizModal.tsx             # Interactive topic-wise PYQ Quiz engine
│   ├── SubjectDashboard.tsx      # Chapter accordion & topic frequency tables
│   ├── SubjectOverviewCards.tsx  # PCM subject comparison cards
│   └── Top20Rankings.tsx         # Dedicated Top 20 subtopics per subject
├── data/
│   ├── mht_cet_analytics.json    # Precomputed statistical dataset
│   ├── mht_cet_questions.json    # Complete question repository (12,422 Qs)
│   └── paper_manifest.json       # Manifest of all 83 shifts
├── lib/
│   ├── exportUtils.ts            # Client-side PDF, Excel, and CSV generator
│   └── utils.ts                  # Styling utilities (cn helper)
├── scripts/
│   ├── build_dataset.mjs         # Scraper, classifier & statistical builder
│   ├── get_chapters.mjs          # Chapter discovery script
│   └── get_manifest.mjs          # Manifest generator script
└── metadata.json                 # AI Studio applet metadata
```

---

## 5. How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the Next.js development server**:
   ```bash
   npm run dev
   ```

3. **Open the browser**:
   Navigate to `http://localhost:3000` to interact with the platform.

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 6. How to Add Future Papers (e.g. 2027+)

1. Run `node scripts/get_manifest.mjs` to fetch new shift links from ExamSide.
2. Update the `PAPERS_BY_YEAR` constant in `scripts/build_dataset.mjs` to add the new year and its paper count.
3. Execute `node scripts/build_dataset.mjs`.
4. The dataset files (`data/mht_cet_analytics.json`, `data/mht_cet_questions.json`, `data/paper_manifest.json`) will be updated automatically, and the UI will reflect the new year immediately without changing frontend code.
