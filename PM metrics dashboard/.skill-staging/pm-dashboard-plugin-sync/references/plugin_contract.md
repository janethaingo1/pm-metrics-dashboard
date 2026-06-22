# PM Dashboard Plugin Contract

## Expected Files

```text
project-management/
  master-ai-data.json
  pm-dashboard.js
  pm-dashboard.css
```

## `master-ai-data.json`

Validate:

- Parses as JSON.
- Contains only mock/demo data.
- Does not include common real PII markers such as email addresses, phone numbers, national IDs, addresses, or full customer names.
- Keeps PMMetricsAI guardrail fields where applicable:
  - `advisory_only`
  - `confidence_pct`
  - `source_claims`
  - `claim_type`
  - special schema fields: `reserve_vnd`, `cross_sell_eligible`, `clv_update_pct`

## `pm-dashboard.js`

Validate:

- Does not hard-code real customer/person data.
- Keeps user-facing toggles clickable and keyboard accessible when possible.
- Does not auto-execute claim decisions.
- Keeps AI layer kill switch or advisory-only affordance visible when AI suggestions are shown.
- Handles missing fields with explicit errors or safe fallback display.

## `pm-dashboard.css`

Validate:

- Dashboard remains readable for executive review.
- Tweaks, filters, and AI guardrail UI are not hidden behind overlays.
- Click targets are large enough for UAT.
- Status colors remain distinguishable:
  - RED/escalate
  - AMBER/watch
  - GREEN/on track

## Sync Notes

When behavior changes, update project-local sync docs first:

- `/Users/thaingo/Documents/Prudential/PM metrics dashboard/AGENTS.md`
- any current `UI_LATEST_SYNC.md`, `DEBUG_LOG.md`, or UAT notes if present.

State clearly whether GitHub, Vercel, Claude, OpenClaw, Gemini, or Antigravity were actually updated or only need follow-up.
