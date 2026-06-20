# PRD v1.1 — PMMetricsAI Pilot

This file records the v1.1 conformance baseline used by the Day 3 demo checklist.

## Scope Delta From v1.0

- Per-claim view uses 14 visible elements: TAT, %Manual, SLA, Fraud, Exception Rate, API Success + Latency, CSAT, CES, Dropoff, Tickets Volume + TAT, Cost/Claim, Cross-sell trigger, CLV update, and Reserve / IFRS 17.
- Shared backend/mock schema still carries 18 per-claim metrics for cross-agent validation.
- Every metric must expose `actual`, `target`, `variance_pct`, `trend_7d`, and `source_ref` or an explicit null/note.
- Platform strip must expose 18 aggregate metrics, including adoption NPS for claims.
- AI cards must show title, root cause, recommendation, confidence, source claims, and advisory-only language.
- NLP responses must include `source_claims`, `confidence_pct`, and `advisory_only`.

## Open Design Note

If two fixes in a row break the same checklist area, escalate here before further implementation.
