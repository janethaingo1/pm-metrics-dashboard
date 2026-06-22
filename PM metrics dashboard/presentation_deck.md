# PMMetricsAI Pilot · C-suite Demo Deck
12 slides · 10–12 min presentation + 10–15 min Q&A · Total ~25 min
Owner: Jane Ngo · Date: Jun 2026 · Status: Draft v1 for review
Format: Markdown. Each slide block = one slide. Import into Google Slides via paste-and-restyle, or use as speaker notes for any deck tool.


SLIDE 1 · Title
From metric fragmentation to AI-powered decision intelligence
A 3-day pilot · PMMetricsAI v1.1
Jane Ngo · Senior PM · June 2026

Speaker notes (30 sec): "What I'll show you in the next 10 minutes is a working prototype that consolidates 32 of our key metrics into one AI-powered dashboard, demonstrates how AI can surface cross-domain business signals our current reporting misses, and frames the next-stage funding ask. I built this in 3 days using mock data anchored to published industry benchmarks — to prove the insight layer works before we invest in production."


SLIDE 2 · The problem
We're trapped in metric aggregation, not interpretation
Where PM time goes today:
- 3–5 hours/week pulling data from 6–8 platforms for a single C-suite report
- Lagging indicators only — no leading signals
- No cross-functional correlation: claims, NPS, CLV tracked in silos
- 24–72 hour decision lag from incident to insight

The cost:
- $X/month of senior PM bandwidth on aggregation, not strategy
- Risk events identified after impact, not before
- Cross-domain opportunities invisible (e.g. ops anomalies that drive churn)

Speaker notes (60 sec): "This pattern isn't unique to us. The reason fintechs and insurers invest in this space is that the manual-aggregation model breaks at scale. Lemonade settles claims in 3 seconds because AI does the aggregation. Manulife's MAUDE underwrites in 2 minutes because AI handles the interpretation. We're not asking to leapfrog them — we're asking to start the path they started a decade ago."


SLIDE 3 · Where we are vs the market — 5-stage AI maturity ladder
[Stage 1: Pilot] → [Stage 2: Live Beta] → [Stage 3: Production v1] → [Stage 4: Agentic Ops] → [Stage 5: AI-Native]

  YOU ARE HERE                              ← production threshold     Manulife · Peer Insurers     Lemonade · ZhongAn

  Mock data                                 Multi-flow                  10+ workflows                Full stack

  1 workflow                                MLOps + RAI                 58% auto-decide              3-sec payout

  Today                                     6-9 months                  12-18 months                 3-5 years

Key insight: Manulife's journey from 70 use cases (2016–23) to 200 in 2026 took ~10 years. APAC market is mid-curve — only 20% of HK's 157 licensed insurers actively use AI. The companies moving now define the category.

Speaker notes (60 sec): "Today's pilot is Stage 1. It validates the insight layer. The funding ask is Phase B — moving to Stage 3 over 12–18 months, which positions us comparable to where Manulife was when they launched MAUDE. We're not behind. We're starting where Manulife started, with the benefit of their 10-year roadmap as our playbook."

[Insert maturity ladder visual from chat. If using Google Slides, recreate as 5 horizontal connected boxes with the "you are here" marker on Stage 1.]


SLIDE 4 · What we built — solution architecture
AI dashboard layer · 32 metrics · 4 domains · 1 workflow
Three layers:
- Data layer — 32 metrics unified across Revenue, CX, Operations & Risk, Project Health
- AI layer — Anomaly detection + cross-domain correlation + NLP Q&A
- Defensibility layer — Every value traceable to a published benchmark (Bain, Towers Watson, LIMRA, Vietnam MoF, SBV)

Architecture (vibe-coded in 3 days):
- Codex (backend): Anomaly engine + mock data API + threshold logic + audit log
- Antigravity (frontend): Dashboard UI + tile rendering + tooltip wiring + NLP chat panel
- OpenClaw (glue): Claude Sonnet API integration + sanitization middleware + NLP prompt management

Speaker notes (45 sec): "This is Option A from my original framework — read-only, no process change, AI sits on top. Mock data only, no real customer information. I'll show you three scenarios in the next minute that demonstrate what the AI layer adds beyond a normal BI dashboard."


SLIDE 5 · Live demo · S2 — operational anomaly cluster + commercial opportunity
Claim CLM-LIFE-2026-001847 · critical illness · 500M VND
What the dashboard shows:
- 3 AMBER anomalies: Manual Intervention 38%, SLA 92%, CES 3.6
- 1 INFO cross-domain card: CLV +8% commercial opportunity ≈ 4–6M VND lifetime value lift per affected customer

What AI detected that BI would miss:
- All three operational ambers share one root cause: SOP-2026-04 documentation friction
- Customer recovers → Health bundle cross-sell eligible
- Recommendation: auto-route hospital discharge documents with ICD-10 C00-C97 to STP

Confidence 87% · Source claims cited · Anchored to Bain claim experience study

Speaker notes (90 sec): "[Switch to S2 in dashboard] Watch the dashboard surface 3 ambers — and importantly, the INFO card linking them to commercial impact. This is the cross-domain signal: operational friction creating a $4–6M VND per customer opportunity if we recover the customer with a Health bundle offer. The recommendation is specific: route discharge documents to STP path. This isn't a BI dashboard — it's a P&L instrument."


SLIDE 6 · Live demo · S3 — fraud detection
Claim CLM-LIFE-2026-001923 · accidental death · 2B VND
5 fraud flags AI surfaces in <1 day:
- Policy issued 45 days before claim
- Beneficiary changed 30 days before claim
- Accident scene report inconsistent with police filing
- Sum insured 3× prior policy
- Off-hours filing (22:08)

Fraud score 0.78 · RED · auto-routed to Special Investigation Unit
- Regulatory hook fires: SBV Circular 09 Article 14 reporting flagged. Reinsurance treaty 4.2 notification queued.
- Time to flag: <1 day. Traditional manual review: 3–5 days.

Speaker notes (60 sec): "[Switch to S3] Same dashboard, different scenario. AI composites 5 fraud signals into one score in under a day. The regulatory hook fires automatically — SBV reporting is teed up before SIU completes investigation. Compare to today's manual process: a senior adjuster reviews these cases over 3–5 days. AI compresses the detection window by 80%. That's not a metric improvement; that's a capability shift."


SLIDE 7 · Live demo · S4 — cross-domain commercial erosion
Claim CLM-LIFE-2026-001755 · complex critical illness · 1.5B VND
Day 32 of investigation · SLA breached · Customer churn risk

What the dashboard shows:
- 2 RED: TAT 32d (>30d threshold), SLA 88%
- 2 AMBER: CSAT 3.2, Manual 45%
- 1 INFO cross-domain card: CLV −15% ≈ 8–12M VND lifetime revenue at risk per affected customer

AI's recommendation chain:
- Senior adjuster escalation (immediate)
- Hospital records direct call (within 4h)
- Customer-recovery protocol with dedicated case manager (24h)
- Future prevention: alert at day 25 of complex claims (next sprint)

Speaker notes (60 sec): "[Switch to S4] This is the most expensive scenario AI catches. SLA breach is visible in any BI tool. The 15% CLV erosion translating to 8–12M VND per customer at risk — that's the cross-domain signal only AI sees. Across 40 complex CI claims per year, that's 320–480M VND annual lifetime revenue at risk. The action plan AI surfaces — senior adjuster, hospital call, case manager — is what we'd want done anyway. AI just makes it visible the moment the signal fires, not 7 days after the breach."


SLIDE 8 · Defensibility — anchored mock methodology
Every dashboard value traces to a published benchmark in 30 seconds
Three-layer trust model:

| Layer | What | Example |
|---|---|---|
| L1 · Industry anchor | Published benchmark with citation | Bain claim-experience study: satisfied claims renew 50% vs dissatisfied 33% |
| L2 · Portfolio assumption | Our position within industry range | Premium-tier CLV baseline 50–80M VND |
| L3 · Claim-level variance | Realistic noise within portfolio | S2 +8% recovery, S4 −15% churn — both traceable to L1 17pp Bain delta |

Anchor sources used: Bain NPS Prism, Bain US P&C Loyalty, Towers Watson CLV formula, LIMRA Claims Ops, Vietnam MoF Annual Report 2023, Vietnam IAV/NSO, SBV Circular 09, DORA, PMI, Forrester CX, Google SRE, AWS Well-Architected FSI.

Defensibility script: "All values illustrative, anchored to public benchmarks. Methodology in appendix. Click any tile's source icon to verify."

Speaker notes (45 sec): "This matters for two reasons. One: when you ask 'where did 1.2M VND come from?' the answer is one click away. Two: when Phase B replaces mock data with live production data, the same anchor framework remains — the L1 anchors stay, L2 and L3 become real. This isn't throwaway — it's the methodological foundation for production."


SLIDE 9 · Phase A complete · Phase B funding ask
Phase A: insight layer · proven · 3 days
Phase B: decision layer · ask · 6–9 months

Phase A delivered:
- 32-metric dashboard with anomaly detection + cross-domain correlation + NLP
- 4 scenarios validated in UAT
- Anchored mock methodology, ready for live data swap
- Agent governance posture: OWASP LLM01-10 addressed, no real PII, kill switch, audit log

Phase B scope (ask):
- Live data integration (claim platform + warehouse)
- Classic ML model layer (fraud, severity, dropout prediction)
- MLOps platform (versioning, drift, retraining)
- Human-in-the-loop workflows for RED anomalies
- Responsible AI framework formalized
- Embedded in claims handler workspace (not standalone)

Investment: TBD (proposed: roughly equivalent to 2 FTE engineers + 1 PM for 6 months + cloud infra)
Expected return: Begin capturing the $X annual CLV erosion + $Y operational time savings within 9 months

Speaker notes (60 sec): "Phase A proves the insight layer works. Phase B builds the decision layer on top. The investment moves us from Stage 1 to Stage 3 on the maturity ladder — where Manulife reached MAUDE-grade auto-underwriting. The phased ask de-risks the spend: we measure Phase A's insight quality first, then commit to Phase B's decision investment."


SLIDE 10 · Phase B scope detail · what production-grade looks like
7 production upgrades · 12–18 months · Enterprise-grade

| # | Upgrade | Why now |
|---|---|---|
| 1 | Live data integration | Cannot test against real claim shapes without it |
| 2 | Classic ML model layer (fraud + severity + dropout) | LLM-only fragile for regulated decisions |
| 3 | MLOps platform | Model updates become safe and auditable |
| 4 | Responsible AI framework | SBV Circular 09 + regulatory readiness |
| 5 | Human-in-the-loop workflows | Captures real ROI vs advisory-only |
| 6 | Embedded in claims-handler workspace | Manulife's key insight: AI in workflow, not offline tool |
| 7 | Audit + data sovereignty (VN residency) | Workplace-isolation + regulator-ready |

Benchmark reference:
- Manulife (Stage 4): MAUDE auto-approves 58% of cases in 2 min, $1B+ projected value by 2027
- Lapse prediction ML (top peers): dropped lapse rates 35% in affected segments
- Lemonade (Stage 5): 30% of claims auto-settle in 3 seconds, 40% no human

Speaker notes (45 sec): "These seven items aren't optional — each addresses a real production constraint. The order I've prioritized them mirrors Manulife's published roadmap. By month 12 we'd be at the maturity stage Manulife reached around 2023. By month 18, MAUDE-comparable for our claims workflow."


SLIDE 11 · 12-month roadmap
Q3 2026 → Q3 2027

Q3 2026 (Phase B kick-off)
- Live data integration begins
- Model team hired (1 senior MLE + 1 data engineer)
- Phase A dashboard upgraded for live data feed
- First production deployment in shadow mode

Q4 2026
- Fraud detection ML model live (replaces LLM scoring)
- Embedded in claims-handler workspace UI
- MLOps platform foundation
- First measurable ops cost savings

Q1 2027
- Severity prediction ML model live
- Human-in-the-loop workflow for RED anomalies
- Responsible AI framework formalized
- First measurable CLV recovery from S4-pattern intervention

Q2 2027
- Auto-decide low-risk simple claims (Stage 4 capability begins)
- Cross-product expansion (motor, health alongside life)
- Regulator briefing
- Phase C scoping begins

Q3 2027
- Phase C: Agentic AI Ops (Manulife-grade) operating model
- Phase B value capture validated: estimated $X annual

Speaker notes (60 sec): "Roadmap mirrors published industry pattern. The 18-month horizon assumes we move at the pace of competent execution, not heroic execution. Quarterly value checkpoints — we can pause/redirect at each gate."


SLIDE 12 · Risks + governance · the responsible AI question
5 risks we've addressed in Phase A · 3 we'll address in Phase B

Addressed in Phase A (live in pilot today):
- Prompt injection (LLM01): Sanitization middleware rejects injection probes — UAT validated
- Hallucination (LLM04): Every AI insight cites source_claims — mandatory schema field
- Over-reliance (LLM06): All AI output advisory_only: true. No autonomous claim decisions.
- Misinformation (LLM09): Confidence <70% suppressed from display
- Unbounded consumption (LLM10): Rate limiter — 5 NLP queries/session

Addressed in Phase B:
- 6. Model bias testing — formal RAI framework with fairness checks
- 7. Data sovereignty — VN residency, SBV-ready audit lineage
- 8. Regulator engagement — proactive briefings on AI use in claims

Industry posture context: Manulife's AI investments are "underpinned by a robust governance framework to ensure responsible, secure and compliant implementation." Our Phase B governance scope matches.

Speaker notes (45 sec): "Closing slide. The governance question is the one that often kills these initiatives in regulated industries. Phase A's pilot already addressed the 5 most common AI risks. Phase B's 3 additional items align us with both internal compliance and the regulator's likely position when they formalize AI guidance for the sector. We're not racing toward AI; we're moving deliberately, with the controls in place at each step."


SPEAKER NOTES — END-OF-DECK CHEAT SHEET
Total timing:
- Slide 1: 30s
- Slide 2: 60s
- Slide 3: 60s
- Slide 4: 45s
- Slide 5: 90s (live demo)
- Slide 6: 60s (live demo)
- Slide 7: 60s (live demo)
- Slide 8: 45s
- Slide 9: 60s
- Slide 10: 45s
- Slide 11: 60s
- Slide 12: 45s
- Total: ~11 minutes

Expected Q&A topics (and your prepared answers):
* **"What did Phase A actually cost?"**
  "Three days of my time + free Claude API credits + 3 vibe-coding tools I already had access to. Real cost: my time at PM rate. Total OOP: ~zero."
* **"How sure are you the VND numbers are right?"**
  "Illustrative, not predictive. Anchored to published benchmarks — Bain renewal correlation, Towers Watson CLV formula. The methodology is defensible; the specific Phase B numbers will be calibrated against our actual portfolio in month 1."
* **"Why not buy this from a vendor?"**
  "Two reasons. One, the vendor solutions in this space are designed for Western markets and don't carry Vietnam-specific benchmarks like SBV Circular 09 hooks or VN MoF claims-ratio context. Two, the build cost is lower than annual vendor licensing for a 3-product portfolio."
* **"What if Claude/OpenAI changes API pricing?"**
  "Phase B includes a model-abstraction layer — we can swap providers without rebuilding the application logic. Cost of switching ≈ 2 weeks of engineering, not months."
* **"How does this affect our claims handlers' jobs?"**
  "Stage 1 doesn't change anyone's workflow — it's an executive dashboard. Stage 3 embeds AI in their workspace as an assistant, not a replacement. The Manulife data point: 70% of their workforce uses AI tools regularly; headcount has grown not shrunk."
* **"What about SBV's position on AI in claims?"**
  "SBV hasn't formalized AI guidance yet — early-mover advantage if we engage proactively. Phase B includes regulator briefings starting Q1 2027. We want to help shape the guidance, not react to it."
* **"What if the Phase A pilot has a bug we don't see?"**
  "Honest answer: probably yes — we caught 20 in UAT this week alone. That's why Phase A is illustrative-only, mock-data-only. We'll fail safer in production because Phase B includes shadow mode for the first 90 days."

If asked for the dashboard live mid-presentation:
- Have S2 pre-loaded as the demo state
- Have the URL bookmarked
- If anything looks off in live demo, deflect: "For this presentation I've pre-staged the scenarios. Happy to schedule a working session for anyone who wants to walk through the full UAT scenarios with me."

One-line elevator pitch (for the hallway after):
"We built a 32-metric AI dashboard in 3 days that proves AI can quantify cross-domain commercial impact our current reporting misses. Phase B turns it into the decision layer Manulife already operates at."

Built from: PRD_v1.1.md · mock_claims_uat.json v1.2.1 · assumptions_appendix.md · agent_conformance_checklist.md · UAT findings 1-20 · 5-stage maturity ladder analysis
