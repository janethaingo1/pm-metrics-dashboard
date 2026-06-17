# PMMetricsAI Next Agent Handoff — Updated 2026-06-17

## OpenClaw (Done) — Backend + AI Layer

### Files created
| File | Purpose |
|---|---|
| `backend/main.py` | FastAPI server — 7 endpoints |
| `backend/data.py` | Loads `mock_claims_uat.json` into memory |
| `backend/anomalies.py` | Anomaly engine — UAT exact match for S1-S4 |
| `backend/nlp.py` | NLP Q&A — DeepSeek v4-flash with fallback |
| `backend/requirements.txt` | `fastapi`, `uvicorn`, `httpx` |
| `ai_decisions.log` | Audit log (JSONL) |
| `DEBUG_LOG.md` | Bug log (empty) |

### API Endpoints
| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Server status + AI layer state |
| GET | `/api/claims` | List all 4 claims |
| GET | `/api/claims/{id}` | Single claim detail + metrics |
| GET | `/api/anomalies` | All anomalies (gated by kill switch) |
| GET | `/api/anomalies/{id}` | Per-claim anomaly cards |
| GET | `/api/period` | Period context + platform metrics |
| POST | `/api/nlp` | NLP query → DeepSeek (cached fallback) |
| POST | `/api/killswitch` | Toggle AI layer on/off |

### UAT Validation
| Scenario | Expected | Actual |
|---|---|---|
| S1 (001500) | 0 alerts | ✅ 0 |
| S2 (001847) | 3 AMBER (Manual, SLA, CES) | ✅ 3 AMBER |
| S3 (001923) | 1 RED (fraud_score) | ✅ 1 RED |
| S4 (001755) | 4 RED (TAT, SLA, CSAT, CES) + 1 AMBER (Manual) | ✅ 4 RED + 1 AMBER |

### How to run
```bash
cd /Users/thaingo/Documents/Prudential
pip3 install --break-system-packages fastapi uvicorn httpx
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8080
```

## Antigravity (Next) — Frontend

### Design reference
- Stitch exports: `stitch_exports/source_bundle/stitch_ai_governed_kpi_dashboard/`
- DESIGN.md: `stitch_exports/source_bundle/stitch_ai_governed_kpi_dashboard/antigravity/DESIGN.md`
- Theme: Neon Tokyo (dark, pink primary `#ff2d78`, cyan tertiary `#00f0ff`)

### 3 screens to build
1. **Strategic Operations Hub** — 12-col grid, 30 metrics, claim deep dive, anomaly feed
2. **Live Ops Monitor** — Terminal aesthetic (Fira Code), real-time alerts
3. **Executive Command Center** — C-suite KPI scorecard

### API base URL
`http://localhost:8080/api`

### Key UI rules (from validation_rules.md)
- `advisory_only: true` badge on every AI card
- Confidence <70% → suppressed
- Kill switch toggle disables anomaly + NLP
- Light + dark mode
- `reserve_vnd` tile separate from main 12
- S3 fraud = primary RED alert
