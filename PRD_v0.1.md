# PRD v0.1 — PMMetricsAI Pilot · AI Anomaly Dashboard

**Version**: 0.1 | **Date**: 17 Jun 2026 | **Owner**: Jane Ngo | **Status**: Draft | **Sprint**: 3-day pilot (Jun 17–19, 2026)

## 1. Executive summary

Pilot of Option A (Quick Win AI Dashboard) consolidating 30 metrics across 4 domains (Revenue & Commercial, Customer Experience, Operations & Risk, Project Health) for the Life Claims workflow. AI layer flags anomalies, correlates root causes, and answers NLP queries. Mock data only. Demo to C-suite on Day 3 EOD.

## 2. Problem

PM spends 3–5 hours/week aggregating Life Claims metrics from 6–8 platforms. C-suite decisions lag 24–72h. No cross-domain correlation. No leading indicators. Manual reporting error rate compounds at every step.

## 3. Solution scope

| In scope | Out of scope |
|---|---|
| Single dashboard rendering 12 per-claim tiles + 18 platform metrics | Live production data integration |
| AI anomaly layer with 10 trigger thresholds | Auto-execution of claim decisions |
| NLP Q&A interface for plain-language metric queries | Multi-user permissioning |
| Mock dataset of 4 Life Claim scenarios | Real customer PII |
| Kill switch + audit log for AI outputs | Mobile responsive layout |

## 4. Functional requirements

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-01 | Render per-claim dashboard view | All 12 tiles show actual + target + variance |
| FR-02 | Trigger anomaly alerts on threshold breach | 10 thresholds from validation_rules.md fire correctly |
| FR-03 | Surface anomaly card with insight | Title + root cause + recommendation + confidence + source IDs |
| FR-04 | NLP Q&A returns cited answers | Answers all 5 test queries with `source_claims` field populated |
| FR-05 | Kill switch disables AI layer | `AI_LAYER_ENABLED=false` falls back to raw metric display in ≤2s |

## 5. Non-functional requirements

- **Performance**: dashboard load <2s with 50-claim mock dataset
- **Security**: no real PII in pilot; all names initialed; agent-governance guardrails enforced
- **Auditability**: every AI output appended to `ai_decisions.log`
- **Compliance**: SBV Circular 09 + IFRS 17 reserve format honored in mock data
- **Accessibility**: light + dark mode parity

## 6. Success metrics (Day 3 demo)

| Metric | Baseline | Pilot target |
|---|---|---|
| Time to surface anomaly | Manual / 24–48h | Auto / <5s |
| C-suite NLP queries answered without PM | 0 | 5 of 5 test queries |
| Cross-domain correlation surfaced | 0 | ≥1 per scenario |
| UAT scenarios passing all DOD | n/a | 4 of 4 |

## 7. Dependencies

| Dependency | Owner | Status |
|---|---|---|
| Mock claim dataset (4 scenarios) | Claude | Ready Day 1 EOD |
| Validation rules + thresholds | Claude | Ready Day 1 EOD |
| AGENTS.md master | Claude | Ready Day 1 EOD |
| Anthropic API access for NLP layer | OpenClaw config | Day 1 PM |
| Wireframe sketch | Jane | Day 1 PM |

## 8. Risks & assumptions

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| 3-day timeline too aggressive | Medium | High | Mock data + scoped UAT; no live integration |
| AI anomaly false-positive rate | Medium | Medium | Confidence threshold ≥0.7 to display; advisory-only flag |
| NLP hallucination | Low | High | Mandatory `source_claims` citation; agent-governance LLM04 rule |
| Tool sync drift (Codex / Antigravity / OpenClaw) | Low | Medium | Single AGENTS.md propagated via sync-ai pattern |

`[ASSUMPTION: SBV — claims data classified as customer financial data, mock-only suffices for pilot]`
`[ASSUMPTION: pilot scope excludes Product Operations metrics per user direction]`

## 9. Out of scope (explicit)

- Real-time API integration with core systems
- Multi-tenancy / role-based access
- Mobile UI
- Production deployment hardening (this is a demo asset)

## 10. Next iteration (post-pilot)

If C-suite approves: move to Option B (Agentic AI Ops) with 6–12 month phased rollout per source framework.

---
*References: fintech-ba-toolkit §4 Insurance metrics · pm-skill §5 PRD template · agent-governance OWASP Agentic Top 10*
