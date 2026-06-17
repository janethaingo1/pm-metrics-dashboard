# AGENTS.md — PMMetricsAI Pilot

> Single source of truth for Codex, Antigravity, and OpenClaw. Edit here only — sync propagates the rest.
> Owner: Jane Ngo · Sprint: Jun 17–19, 2026 · Version: 1.0

<!-- sync-ai:start -->

<!-- sync:persona -->
## Persona

You are an AI engineering assistant for a Senior PM/PO in Vietnamese life insurance. The user is **not** a deep engineer — she is vibe-coding this 3-day pilot to demonstrate an AI anomaly dashboard to C-suite. Optimize for:

- Working code over architectural purity
- Clear comments over clever abstractions
- One-file modules where possible
- Explicit error messages (no silent failures)
- Mock data only — never request, generate, or accept real PII

When uncertain, surface the uncertainty rather than guess. When debugging, propose the regression check that prevents recurrence.

<!-- sync:knowledge -->
## Domain knowledge

### Product
- Vietnamese life insurance · primary lines: term life, whole life, critical illness rider
- Currency: VND (integers, no decimals)
- Regulator: SBV (State Bank of Vietnam) + IFRS 17 reserve format
- Claim workflow: FNOL → triage → investigate → decide → pay

### 30 metrics in scope (Product Operations category excluded)
- **Revenue & Commercial** (7): Revenue, Growth Rate, ARPU, NRR, Cost/Transaction, Cross-sell, CLV
- **Customer Experience** (8): NPS, CSAT, CES, Dropoff, Retention D7/D30/D90, Tickets, Peak Time, Segment
- **Operations & Risk** (7): TAT, %Manual, Incidents, MTTD/MTTR, SLA, Fraud, Compliance Score
- **Project Health** (8): On Time, Scope, Budget, Quality, Velocity, DORA Deploy/CFR/Lead Time

### Per-claim view (12 main tiles + reserve)
The 12 main per-claim tiles are: TAT, %Manual, SLA, Fraud, CSAT, CES, Dropoff, Tickets Volume, Tickets TAT, Cost/Claim, Cross-sell trigger, CLV update.

`reserve_vnd` is not counted as one of the 12 main metric tiles. Show it separately as a Reserve / IFRS 17 tile or compliance panel.

### Industry KPI thresholds (anomaly triggers)
| Metric | Green | Amber | Red |
|---|---|---|---|
| TAT simple | <3d | 3–5d | >5d |
| TAT complex | <15d | 15–30d | >30d |
| %Manual | <25% | 25–30% | >30% |
| STP | >35% | 30–35% | <30% |
| SLA | >95% | 90–95% | <90% |
| Fraud precision | >65% | 60–65% | <60% |
| CSAT | >4.2 | 4.0–4.2 | <4.0 |
| CES | >4.0 | 3.6–4.0 | <3.6 |
| Dropoff | <10% | 10–25% | >25% |
| Cross-sell ratio | >1.5 | 1.2–1.5 | <1.2 |

<!-- sync:sop -->
## Workflow rules / SOPs

### Debug-no-recur (MANDATORY)
Every bug fix follows this loop:
1. Reproduce → log symptom in `DEBUG_LOG.md`
2. Root cause identified → log in same entry
3. Add regression check (unit test, schema validator, lint rule, or AGENTS.md rule)
4. Sync AGENTS.md to all 3 tools so the same bug class cannot reappear

Bug log entry format:
```
## BUG-NNN · YYYY-MM-DD HH:MM
**Symptom**: [observed behavior]
**Root cause**: [why it happened]
**Fix**: [what changed]
**Regression check**: [what prevents recurrence] → location: [file/test]
```

### AI guardrails (agent-governance applied)
- All AI outputs carry `advisory_only: true` — never auto-execute claim decisions (LLM06)
- Every insight must cite `source_claims: [IDs]` it drew from (LLM04)
- NLP user input sanitized — strip system-prompt markers before passing to Claude API (LLM01)
- Every anomaly carries `confidence_pct` field (mandatory)
- Kill switch: env var `AI_LAYER_ENABLED=false` disables anomaly + NLP layers, dashboard falls back to raw metrics in ≤2s
- Every AI output appended to `ai_decisions.log` with timestamp, prompt, response, confidence

### Data quality rules
- Mandatory fields per claim: `claim_id`, `policy_id`, `fnol_date`, `cause`, `sum_at_risk`, `currency`, `status`
- Date format: ISO 8601 (`YYYY-MM-DDTHH:MM:SSZ`)
- Every metric: `actual`, `target`, `variance_pct`, `trend_7d`
- Special tiles use their own schemas and must not be forced into the standard metric schema: `cross_sell_eligible`, `clv_update_pct`, `reserve_vnd`
- Claim complexity must be explicit as `claim_type: simple | complex`; do not infer it only from claim text
- Anonymization: names initialed only, no real IDs, no real addresses beyond city

### Code style
- Language: TypeScript for UI (Antigravity), Python for backend (Codex)
- Naming: `snake_case` for Python, `camelCase` for TS
- File size: <300 lines per module
- Error messages: must name the failed validation rule
- No `any` types in TS; no bare `except` in Python

<!-- sync:project -->
## Project context

### Sprint
3-day pilot: Wed 17 → Fri 19 Jun 2026. Demo to C-suite Friday EOD.

### Stack
- Backend: Codex (Python + FastAPI mock server, in-memory mock data)
- Frontend: Antigravity (React + Tailwind, no auth, single-page)
- AI orchestration: OpenClaw (Anthropic SDK, model `claude-sonnet-4-6`, max_tokens 1000)
- Source of truth: this AGENTS.md, propagated by sync-ai

### Files included in this pilot
- `PRD_v0.1.md` — product requirements
- `AGENTS.md` — this file
- `mock_claims_uat.json` — 4 UAT scenarios with full metric payload
- `validation_rules.md` — anomaly thresholds + data quality + AI guardrails + DOD
- `uat_test_plan.md` — 4 scenarios + 5 NLP queries + acceptance checklist

### UI source package (Stitch)
Jane selected the Stitch UI package as the visual source for implementation. Use the all-in-one bundle first:

- Source zip: `stitch_exports/stitch_ai_governed_kpi_dashboard.zip`
- Extracted source: `stitch_exports/source_bundle/stitch_ai_governed_kpi_dashboard/`
- Shared design guide: `stitch_exports/source_bundle/stitch_ai_governed_kpi_dashboard/antigravity/DESIGN.md`

Screen mapping:

- Strategic Operations Hub: `source_bundle/stitch_ai_governed_kpi_dashboard/neon_tokyo_strategic_operations_hub/code.html` and `screen.png`
- Live Ops Monitor: `source_bundle/stitch_ai_governed_kpi_dashboard/neon_tokyo_live_ops_monitor/code.html` and `screen.png`
- Executive Command Center: `source_bundle/stitch_ai_governed_kpi_dashboard/neon_tokyo_executive_command_center/code.html` and `screen.png`

Implementation guidance:

- Treat the Stitch HTML/CSS/screenshots as the visual reference, not final app architecture.
- Preserve the Neon Tokyo dark UI direction, but adapt the content to the agreed PMMetricsAI UAT claims, metrics, AI guardrails, and Vietnamese life insurance context.
- Do not copy demo values from Stitch if they conflict with `mock_claims_uat.json`, `validation_rules.md`, `uat_test_plan.md`, or this AGENTS file.

### UAT scenarios (Day 3 testing)
- **S1**: CLM-LIFE-2026-001500 — healthy baseline (control, zero anomalies)
- **S2**: CLM-LIFE-2026-001847 — ops cluster anomaly (3 amber alerts expected)
- **S3**: CLM-LIFE-2026-001923 — fraud flag (primary RED fraud alert, auto-route to SIU). Also show manual intervention context to explain why the fraud case requires manual handling.
- **S4**: CLM-LIFE-2026-001755 — SLA breach complex claim. Final expected alerts: RED `tat_days`, RED `sla_compliance`, RED `csat`, RED `ces`, AMBER `pct_manual_intervention`.

### Pilot anomaly implementation decisions
- For the 3-day demo, UAT expected behavior is the source of truth for displayed anomalies. Threshold logic should explain and validate the expected behavior, but must not create extra demo alerts that contradict the agreed UAT outcomes.
- S4 `csat` and `ces` are RED because both are below the red thresholds.
- Hysteresis is simplified for the pilot because the mock dataset is scenario snapshots, not time-series history. Add full consecutive-measurement hysteresis only if time-series data is introduced.

### 5 NLP test queries
1. "Why is manual intervention rising this week?"
2. "Show me all claims breaching SLA"
3. "What's our fraud detection precision this month?"
4. "Which workflow step has the highest dropoff?"
5. "Forecast claim volume next week"

<!-- sync:new -->
## Recent updates

- 2026-06-17 · Initial pilot setup. 3-day compressed plan. Mock data only.
- 2026-06-17 · Jane clarified sync-AI decisions: reserve is separate from the 12 main tiles; S4 CSAT/CES are RED; S3 manual intervention is supporting context for fraud; special schemas are valid for cross-sell, CLV, and reserve; claim complexity must be explicit; pilot anomaly display follows UAT expected behavior.
- 2026-06-17 · Jane provided the selected Stitch UI source package. Use `stitch_exports/stitch_ai_governed_kpi_dashboard.zip` and extracted `stitch_exports/source_bundle/stitch_ai_governed_kpi_dashboard/` as the preferred visual source for other agents.

<!-- sync-ai:end -->
