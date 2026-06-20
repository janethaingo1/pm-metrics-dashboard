# UI Latest Sync — PMMetricsAI

Updated: 2026-06-18

## Current UI Decision

Jane's latest selected UI direction is the Stitch **Luminous Clarity** revision because it is easier to read and more executive-friendly than the earlier Neon Tokyo dashboard.

Live Stitch project:
`https://stitch.withgoogle.com/projects/6325402822248126490`

## Required Screens

1. **Luminous Clarity: Executive Command Center**
   - C-suite KPI scorecard
   - 30 metrics grouped by Revenue & Commercial, Customer Experience, Operations & Risk, and Project Health
   - Clean, light enterprise layout with high readability

2. **Luminous Clarity: Strategic Operations Hub**
   - Claim deep dive
   - 14 visible per-claim elements
   - API Success + Latency combined into one tile
   - Tickets Volume + TAT combined into one tile
   - Reserve / IFRS 17 shown as the 14th commercial/compliance element
   - AI anomaly cards with citations, confidence, and advisory-only language

3. **Luminous Clarity: Live Ops Monitor**
   - Live ingestion / operations stream
   - Status badges and action-oriented anomalies
   - Source claims and confidence shown clearly

## Local Implementation Status

- Updated implementation now lives under:
  `/Users/thaingo/Documents/Prudential/PM metrics dashboard/frontend/`
- `http://localhost:5173/` was previously showing the stale Desktop-only Vite app from:
  `/Users/thaingo/Desktop/PM/Prudential/frontend`
- That stale server was stopped and the synced-folder frontend was started on port `5173`.
- Current synced app title is **PMMetricsAI — Luminous Clarity KPI Dashboard**.
- Existing local exports under `stitch_exports/` are older Neon Tokyo exports and should be treated as archived visual references.
- 2026-06-18 local blank-screen fix: removed accidental nested duplicate dependencies under
  `frontend/node_modules/node_modules/`. The duplicate React copy caused `Invalid hook call`
  and a blank dark screen. After removal, clear `frontend/node_modules/.vite` and restart Vite
  with `npm run dev -- --host 0.0.0.0 --port 5173 --force`.
- 2026-06-18 Codex v1.1 self-check complete:
  - Frontend verified at `http://localhost:5173/`.
  - Backend verified at `http://localhost:8080/api/health`.
  - UI screenshot verified with backend online.
  - `python3 backend/uat_regression_check.py` passed.
  - `npm run build` passed.
  - NLP commercial-impact smoke test returned `source_claims`, `confidence_pct`, and `advisory_only: true`.
- 2026-06-18 Codex v1.2 UAT fixes complete:
  - Metric display and anomaly confidence are separated by helpers.
  - S2 returns 3 AMBER + 1 INFO anomaly cards.
  - Manual threshold ordering is inclusive and red-first.
  - Executive tiles and platform metrics have source chips/modal.
  - Strategic Ops has severity filters, band indicators, action panel, RED human-review banner, NLP drawer, and scenario-reset banner.
  - `/health` returns status, uptime, and AI-layer state.
  - Hypothetical NLP questions now return structured answers.

## Integration Rules

- Do not copy Stitch demo values if they conflict with `mock_claims_uat.json`.
- Preserve UAT scenario truth:
  - S1: zero anomalies
  - S2: 3 AMBER alerts
  - S3: 1 RED fraud alert, with manual intervention as supporting context
  - S4: RED `tat_days`, RED `sla_compliance`, RED `clv_update_pct`, AMBER `csat`, AMBER `pct_manual_intervention`
- Keep the UI at 14 visible per-claim elements: TAT, %Manual, SLA, Fraud, Exception Rate, API Success + Latency, CSAT, CES, Dropoff, Tickets Volume + TAT, Cost/Claim, Cross-sell trigger, CLV update, Reserve / IFRS 17.
- Keep shared data schema at 18 per-claim metrics in `data/mock_claims.json` and `backend.data.PER_CLAIM_METRIC_KEYS`.
- Keep visible AI governance: `advisory_only`, `source_claims`, `confidence_pct`, kill switch, and auditability.
- Every scenario view must show key insights/actions from `highlights_and_actions`.
- Do not display anomaly `confidence_pct` as a metric actual.
- Frontend source must be synced under this same folder before other agents continue:
  `/Users/thaingo/Documents/Prudential/PM metrics dashboard/`

## Next Agent Checklist

- [x] Recreate Luminous Clarity source under this folder.
- [x] Replace/realign the current Neon Tokyo localhost UI with Luminous Clarity.
- [x] Verify S1-S4 logic through backend regression.
- [x] Verify NLP smoke query for commercial impact.
- [x] Verify AI layer env/killswitch behavior through backend regression.
- [x] Run frontend build: `npm run build`.
- [x] Fix local blank screen caused by duplicate React dependency copy.
- [x] Run backend regression: `python3 backend/uat_regression_check.py`.
- [x] Run v1.2 UAT regression and frontend build after feedback fixes.
