# SiteSentinel 🛡️
> **Evidence-Grounded Visual Inspection Intelligence for Critical Infrastructure & Facilities**  
> *"Every inspection, consistent. Every change, caught. Every finding, backed by evidence."*

---

## 📌 Executive Summary & Hackathon Mission

Organizations responsible for critical infrastructure—bridges, municipal pipelines, commercial building facades, utility substations, and industrial plants—rely heavily on field engineers visually inspecting thousands of photos and video clips by hand. This status quo leads directly to the three central failure modes highlighted in the challenge brief:
1. **Slow Decisions:** Critical defect reports sit in backlogs for weeks awaiting manual review and transcript compilation.
2. **Missed Anomalies:** Subtle structural deterioration (hairline shear cracks, micro-spalling, under-insulation corrosion) is easily overlooked across vast visual datasets.
3. **Inconsistent Outcomes:** Different inspectors grade defects with disparate severity scales, leading to subjective triage and unrepeatable maintenance schedules.

**SiteSentinel** is a full-stack visual intelligence platform engineered to eliminate these bottlenecks through evidence-grounded AI analysis, automated change-aware re-inspection, human-in-the-loop review governance, and verifiable consistency metrics.

---

## 💡 The Three Core Innovations

SiteSentinel avoids the pitfalls of generic image classifiers or ungrounded AI summaries through three structural innovations:

### 1. Change-Aware Re-Inspection
Instead of evaluating single visual snapshots in isolation, SiteSentinel links inspections by **Asset ID** across time. When a new inspection is conducted, the system compares current visual evidence against the asset's prior baseline inspection, classifying each defect into a deterministic lifecycle state:
- `new`: A newly emerged anomaly absent in prior baseline captures.
- `worsened`: An existing defect exhibiting measurable elongation, oxidation spreading, or structural deterioration.
- `unchanged`: A stable condition monitored under routine maintenance.
- `improved` / `resolved`: Defects mitigated through corrective physical repair.

**Deterioration velocity, not static appearance, drives operational urgency.**

### 2. The Evidence Ledger
Every finding in SiteSentinel enforces a strict epistemological separation:
- **Observed Physical Evidence:** What is literally visible in the frame (e.g., *"Diagonal linear discontinuity spanning ~30% of concrete beam web with white efflorescence staining"*).
- **Model Inference:** What the visual pattern may indicate (e.g., *"Indicates potential structural shear cracking due to cyclical load deflection"*).

Nothing is presented as an unquestioned fact:
- **Honest AI-Estimated Localization:** Gemini bounding boxes are strictly labeled **"Approximate region (AI-estimated)"** and subjected to numerical coordinate bounds validation. Only certified detectors (via our pluggable `IDetector` interface) may label bounding boxes as verified.
- **Qualitative Certainty:** The Gemini vision pipeline outputs self-assessed qualitative certainty (`low | medium | high`); numeric probabilities are never hallucinated or shown unless an actual specialized detector supplies them.
- **Explainable Priority Scoring:** Findings are ranked via a deterministic mathematical formula combining severity weight, change status boost (+25 for worsened, +15 for new), model certainty, and asset criticality.

### 3. Inspection Consistency Scoring
To directly conquer the "inconsistent outcomes" challenge, SiteSentinel computes real-time operational agreement metrics:
- **AI–Human Agreement Rate (%):** Tracking how often field engineers confirm, correct, or reject AI triage suggestions.
- **Consistency Index:** Measuring variance and repeatable classification across repeat inspections of the same asset.
- **Auditable Human Sign-Off:** Review decisions (`confirmed`, `rejected`, `corrected`) are persisted to an append-only audit trail with inspector field notes and certified PDF work orders.

---

## 🏛️ System Architecture

SiteSentinel is structured as a modular monorepo with strict architectural separation between frontend, backend, shared schemas, and persistence layers:

```
├── frontend/                   # Frontend (React 18 + Vite + TypeScript + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Field-instrument UI components, Recharts, overlays
│   │   ├── pages/              # Landing, Dashboard, Analyze, Results, Assets, Reports
│   │   ├── hooks/              # Data fetching, auth, and camera hooks
│   │   └── services/           # Typed API clients
├── backend/                    # Backend API & Analysis Engine (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── ai/                 # Gemini SDK v2 client, pluggable detectors, structured prompts
│   │   ├── analysis/           # Pipeline runner, priority engine, advisory rules, change detector
│   │   ├── routes/             # REST endpoints (/health, /analyze, /analyses, /dashboard, etc.)
│   │   ├── middleware/         # Auth, magic-byte media verification, rate limiting, error handling
│   │   ├── services/           # Dual repositories (Local JSON / Supabase) & Storage providers
│   │   └── reports/            # Server-side PDFKit report generator
├── shared/                     # Shared Zod Schemas & TypeScript Contracts
│   └── src/schemas/            # Taxonomy, Analysis, Review, Query, and API schemas
├── demo/                       # Bundled offline demo cases, synthetic imagery & attribution
├── supabase/migrations/        # Production PostgreSQL schema, RLS policies, and private bucket
├── tests/                      # Unit tests, API integration tests, security tests, and E2E smoke tests
└── scripts/                    # Demo database seeding and retention cleanup utilities
```

---

## ⚡ Quickstart: Zero-Config Local Mode

SiteSentinel is designed to run **out of the box with zero external dependencies**. No Supabase account, cloud credentials, or Gemini API keys are required to explore the platform.

### Prerequisites
- Node.js `v20.x` or `v22.x` (or newer)
- npm `v10.x` or newer

### 1. Clone & Install
```bash
git clone https://github.com/organization/sitesentinel.git
cd sitesentinel
npm install
```

### 2. Launch Local Environment
```bash
# Starts both Express backend (:5000) and Vite frontend (:5173) concurrently
npm run dev
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API & Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Explore Demo Mode
1. Click **"Try a Demo Case"** on the landing page or navigate to `/analyze`.
2. Select any of the **6 bundled demo inspections**, such as:
   - **Bridge Span 4 Re-Inspection (Change-Aware Pair):** Demonstrates automatic defect worsening detection and side-by-side baseline comparison on asset `BR-401`.
   - **Industrial Gas Pipeline:** Severe localized pitting corrosion with ultrasonic survey advisory.
   - **Commercial Facade:** Multi-story masonry shear fracture.
3. Review the findings, toggle AI-estimated bounding box overlays, test human review decisions (`Confirm`, `Reject`, `Correct`), and download the certified PDF inspection report.

---

## 🤖 Real AI Configuration (Google Gemini Vision)

To enable live AI visual analysis on your own photos and videos:

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Create or edit `.env` in the root directory:
   ```env
   DATA_MODE=local
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
3. Restart the dev server (`npm run dev`).
4. The application banner will confirm `Live Gemini AI connected`. Real uploads will now be processed via the official `@google/genai` SDK using structured JSON schema output and automated repair retries.

---

## 🗄️ Production Mode (Supabase PostgreSQL + RLS)

For multi-tenant team deployment with enterprise Row Level Security and private media storage:

1. Provision a new project on [Supabase](https://supabase.com).
2. Execute the migrations in `supabase/migrations/` in sequence using the Supabase SQL Editor:
   - `0001_init.sql` — Enums, tables (`profiles`, `assets`, `analyses`, `findings`, `reviews`, `reports`), indexes, and triggers.
   - `0002_rls.sql` — Multi-tenant Row Level Security policies tied to `auth.uid()`.
   - `0003_storage.sql` — Private `inspection-media` bucket with owner-only access policies.
3. Configure your production environment variables:
   ```env
   DATA_MODE=supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Build and deploy using the provided `Dockerfile` or run `npm run build && npm start`.

---

## 🧪 Testing & Verification

SiteSentinel includes a comprehensive test suite across unit, integration, security, and end-to-end smoke tests:

```bash
# Run full Vitest suite (33 tests across 7 test suites)
npm test

# Run unit tests only (schemas, priority engine, advisory rules, change detection, security)
npm run test:unit

# Run API integration tests (Supertest on Express endpoints)
npm run test:api
```

### Test Coverage Highlights
- **Priority Calculation:** Validates deterministic score capping, factor contributions, and change-status boosting.
- **Engineering Advisory Rules:** Ensures appropriate structural engineering recommendations and urgency thresholds map correctly to defect categories.
- **Change Detection:** Verifies lifecycle status assignment (`worsened`, `unchanged`, `new`) between baseline and re-inspection captures.
- **Security Secret Isolation:** An automated Vitest test searches compiled production client bundles (`client/dist`) to guarantee server secrets (e.g., `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`) are never leaked to the client.
- **End-to-End User Flow:** Simulates the complete lifecycle: health check → demo case execution → result detail retrieval → inspector review confirmation → dashboard consistency metric update → PDF & JSON report generation.

---

## 🔒 Security & Data Integrity

- **Media Verification via Magic Bytes:** Uploaded files are verified by inspecting file header bytes (JPEG `FF D8 FF`, PNG `89 50 4E 47`, WebP `RIFF...WEBP`, MP4 `ftyp`), rejecting forged extensions.
- **Private Media Serving:** In local mode, media files are served via short-lived HMAC signed tokens (`/api/media?key=...&token=...`); in Supabase mode, private 5-minute signed storage URLs are generated.
- **Prompt Injection Defense:** Context notes and image text are strictly isolated inside `<notes>` tags and classified as untrusted visual data in the model system prompt.
- **EXIF Sanitization:** Sensitive GPS coordinates and device metadata are stripped during preprocessing unless explicitly retained.
- **Rate Limiting & Headers:** Express endpoints are protected via `express-rate-limit` (10 analyses/min) and `helmet` security headers.

---

## 📋 Domain Defect Taxonomy & Urgency Scale

| Finding Category | Description | Primary Advisory Template |
|---|---|---|
| `crack` | Surface fissures, shear cracks, masonry fractures | Qualified structural engineer physical inspection & crack gauge monitoring |
| `corrosion_rust` | Oxidation, surface scale, pitting on metallic components | Ultrasonic thickness gauging & protective recoating |
| `water_damage_leak` | Moisture ingress, active seepage, efflorescence | Water barrier integrity test & drainage mitigation |
| `spalling_delamination` | Concrete surface detachment, exposed rebar | Sounding hammer survey & structural patch repair |
| `deformation_misalignment` | Bending, sagging, joint displacement | Laser alignment survey & structural load redistribution |
| `missing_or_damaged_component` | Missing bolts, failed fasteners, sheared brackets | Immediate hardware replacement & torque verification |
| `vegetation_or_debris` | Root intrusion, blocked drainage scuppers | Immediate debris removal & biological growth treatment |
| `coating_paint_failure` | Blistering, chalking, peeling protective layers | Surface abrasive blasting & industrial recoating |
| `thermal_or_discoloration_anomaly` | Heat damage, electrical hotspots, chemical staining | Thermal imaging survey & circuit load analysis |
| `safety_hazard` | Missing guardrails, loose overhead cladding | Immediate perimeter isolation & priority emergency repair |

### Standing Advisory Disclaimer
> *SiteSentinel outputs are algorithmic triage suggestions intended to prioritize visual reviews. They do NOT constitute certified engineering sign-offs, building code certifications, or structural guarantees. All high-priority actions must be reviewed and validated by a qualified professional engineer.*

---

## 🚢 Docker & Container Deployment

To launch SiteSentinel in a containerized environment:

```bash
# Build and run containerized instance
docker compose up -d --build

# Verify container logs
docker compose logs -f
```
The application will be accessible at [http://localhost:5000](http://localhost:5000).

---

## 📖 Supporting Documentation

- **[DEMO_SCRIPT.md](DEMO_SCRIPT.md):** 3-minute structured walkthrough script for hackathon presentations and judge evaluations.
- **[PITCH.md](PITCH.md):** Comprehensive pitch document featuring problem-solution fit, Mermaid architecture diagrams, technical trade-offs, and judge Q&A cheat sheet.
- **[PROGRESS.md](PROGRESS.md):** Detailed engineering milestone checklist tracking the implementation across all 9 phases.
- **[demo/ATTRIBUTION.md](demo/ATTRIBUTION.md):** Complete attribution and provenance log for bundled synthetic inspection assets.

---

## ⚖️ License
MIT License. Built with pride for the Google Antigravity Hackathon Challenge.
