# SiteSentinel — 3-Minute Live Hackathon Demo Walkthrough

> **Goal:** Showcase the three core innovations answering the challenge brief (Change-Aware Re-Inspection, Evidence Ledger, and Verifiable Consistency Scoring) in an intuitive 3-minute presentation.

---

## ⏱️ Minute 0:00 – 0:45: The Problem & The Solution
1. **Open Landing Page (`http://localhost:5173/`):**
   - Point out the tagline: *"Every inspection, consistent. Every change, caught. Every finding, backed by evidence."*
   - Explain the operational dilemma: Field inspectors capture thousands of structural photos/videos. Manual review causes **slow decisions**, **missed hairline deterioration**, and **inconsistent outcomes across different inspectors**.
   - Point out the **Live Operational Intelligence Metrics** banner showing actual computed telemetry: total inspections, agreement rate (92%), and review hours saved.

---

## ⏱️ Minute 0:45 – 1:45: The Core Innovation — Change-Aware Re-Inspection
1. **Navigate to Analyze (`/analyze?demo=true`):**
   - Show that judges can evaluate the system immediately with zero setup, zero network dependencies, and zero API keys using the **Offline Demo Evaluation Suite**.
   - Highlight the **Before/After Change Pair**:
     - Baseline: `BR-401` Bridge Span 4 Pier Stem (Initial routine inspection).
     - Re-Inspection: `BR-401` Bridge Span 4 Re-Inspection (6 months later).
   - Click **"Test Case"** on `demo-bridge-reinspection`.

2. **Inspect the Result (`/results/:id`):**
   - Switch to the **Change-Aware Re-Inspection Matrix** tab:
     - Show the side-by-side view comparing previous baseline photo with current re-inspection.
     - Show the automated change progression:
       - The primary diagonal shear crack is classified as **`worsened`** (crack propagated 18cm downward and widened).
       - The new concrete spall with exposed rebar at the base is classified as **`new`**.
       - The efflorescence staining is classified as **`unchanged`**.
   - **Key takeaway for judges:** *"A standard image classifier sees a crack. SiteSentinel sees that the crack grew by 18cm since the last inspection, and elevates its priority automatically."*

---

## ⏱️ Minute 1:45 – 2:30: The Evidence Ledger & Human Review Workflow
1. **Switch to "Visual Findings & Evidence Ledger" Tab:**
   - Click on Finding #1 (`Propagated Diagonal Shear Crack`).
   - Notice the **Image Viewer with Overlays**:
     - Point out the bounding box labeled *"Approximate region (AI-estimated)"*.
     - Explain our honesty constraint: We do not claim fabricated pixel-perfect detector boxes or fake 99.8% accuracies. Gemini provides model-estimated bounding boxes which we validate numerically.
   - Look at the **Evidence Ledger Separation**:
     - Left box: **Observed Physical Evidence** (literally visible fissure shape and chipped margins).
     - Right box: **Model Inference** (possible live-load stress mechanism).
   - Look at the **Deterministic Priority Score (90/100)**:
     - Click **"Explain Math"** to reveal the formula: `(Base 75 + Worsened Change 15) × Certainty 1.0 × Criticality 1.0 = 90/100`.
   - **Audit Sign-Off:**
     - Click **"Confirm Finding"** or **"Correct Finding"**.
     - Notice the status immediately changes to `CONFIRMED`.

---

## ⏱️ Minute 2:30 – 3:00: Work-Order Reports & Dashboard Intelligence
1. **Generate Certified PDF Report:**
   - Click **"Download PDF Report"** in the top header.
   - Display the generated PDF containing:
     - Asset classification, inspection timestamps, simulated badge.
     - Executive condition summary.
     - Observed visual evidence ledger for each finding.
     - Professional advisory disclaimer & certified inspector sign-off line.
2. **Open Operational Dashboard (`/dashboard`):**
   - Show how the inspector's confirmation updated the **AI-Human Agreement Rate** and **Consistency Metric**.
   - Show the **Unresolved High-Risk Triage Queue** highlighting pending issues requiring immediate human attention.
   - Click **"View Computation Formula"** on the Hours Saved card to show judges the transparent, realistic math behind the operational ROI.

---

## 💡 Quick Tips for Judges
- Run real AI inspection: Add your `GEMINI_API_KEY` to `.env` and upload any photo or short MP4 video.
- Test offline reliability: Disconnect WiFi — all 6 demo cases, reporting, dashboard analytics, and reviews continue working 100% offline.
