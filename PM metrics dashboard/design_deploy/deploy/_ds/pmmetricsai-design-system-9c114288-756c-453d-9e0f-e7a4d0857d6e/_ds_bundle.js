/* @ds-bundle: {"format":3,"namespace":"PMMetricsAIDesignSystem_9c1142","components":[{"name":"AnomalyCard","sourcePath":"components/ai/AnomalyCard.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"StatusPill","sourcePath":"components/core/StatusPill.jsx"},{"name":"MetricCard","sourcePath":"components/data-display/MetricCard.jsx"}],"sourceHashes":{"components/ai/AnomalyCard.jsx":"70953a481bef","components/core/Button.jsx":"c7ff3c918d5c","components/core/StatusPill.jsx":"9b0993897711","components/data-display/MetricCard.jsx":"cdad0f7309d7","ui_kits/pmmetricsai/ops-data.js":"5badf8ccd5c7","ui_kits/pmmetricsai/ops-render.js":"e6bd55844336"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PMMetricsAIDesignSystem_9c1142 = window.PMMetricsAIDesignSystem_9c1142 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/ai/AnomalyCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PMMetricsAI AnomalyCard — a governed AI insight. Advisory-only by design:
 * Why → Action → Sources, with confidence and a "review before action" badge.
 * RED level shows the manual-review guardrail banner (no auto-denial).
 */
function AnomalyCard({
  level = 'AMBER',
  metric,
  title,
  confidence,
  why,
  action,
  actual,
  target,
  sources = [],
  regulatory,
  style = {},
  ...rest
}) {
  const map = {
    RED: {
      fg: 'var(--red)',
      bg: 'var(--risk-bg)',
      icon: 'octagon-alert'
    },
    AMBER: {
      fg: 'var(--amber)',
      bg: 'var(--amber-bg)',
      icon: 'triangle-alert'
    },
    INFO: {
      fg: 'var(--blue)',
      bg: 'var(--info-bg)',
      icon: 'info'
    }
  };
  const s = map[level] || map.AMBER;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: s.bg,
      border: '1px solid var(--border-default)',
      borderRadius: 10,
      padding: '12px 13px 12px 15px',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: s.fg
    }
  }), level === 'RED' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      marginBottom: 9,
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      color: 'var(--red)',
      background: 'rgba(197,37,45,.12)',
      border: '1px solid rgba(197,37,45,.25)',
      borderRadius: 5,
      padding: '4px 7px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "gavel",
    style: {
      width: 11,
      height: 11
    }
  }), " Advisory only \u2014 manual review required (no auto-denial)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      color: 'var(--muted)'
    }
  }, metric), confidence != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: 'var(--ink)',
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 5,
      padding: '2px 7px',
      fontVariantNumeric: 'tabular-nums'
    }
  }, confidence, "% conf")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: 'var(--ink)',
      margin: '6px 0 8px',
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": s.icon,
    style: {
      width: 15,
      height: 15,
      color: s.fg
    }
  }), " ", title), why && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11.5,
      lineHeight: 1.5,
      color: 'var(--text-body)',
      margin: '0 0 6px'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--ink)'
    }
  }, "Why:"), " ", why), (actual != null || target != null) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 10.5,
      margin: '7px 0',
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 6,
      padding: '5px 9px',
      color: 'var(--muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Actual ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--ink)'
    }
  }, actual)), /*#__PURE__*/React.createElement("span", null, "Target ", target)), action && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11.5,
      lineHeight: 1.5,
      color: 'var(--text-body)',
      margin: '0 0 6px'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--ink)'
    }
  }, "Action:"), " ", action), regulatory && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10.5,
      lineHeight: 1.45,
      color: 'var(--amber)',
      fontWeight: 600,
      borderTop: '1px solid rgba(183,93,0,.2)',
      paddingTop: 7,
      marginTop: 7
    }
  }, "\u26A0 ", regulatory), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      fontSize: 9.5,
      color: 'var(--muted)',
      marginTop: 8,
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement("span", null, sources.length ? `Cites: ${sources.join(', ')}` : ''), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 8.5,
      fontWeight: 800,
      letterSpacing: '.03em',
      textTransform: 'uppercase',
      color: 'var(--blue)',
      background: 'var(--neutral-bg)',
      borderRadius: 5,
      padding: '3px 7px'
    }
  }, "Review before action")));
}
Object.assign(__ds_scope, { AnomalyCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AnomalyCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PMMetricsAI primary action button. Three variants tuned for the light
 * enterprise UI: solid brand `primary`, outlined `secondary`, and `ghost`.
 */
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  leadingIcon = null,
  trailingIcon = null,
  onClick,
  type = 'button',
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '7px 12px',
      fontSize: 13,
      minHeight: 32
    },
    md: {
      padding: '10px 16px',
      fontSize: 14,
      minHeight: 40
    },
    lg: {
      padding: '12px 20px',
      fontSize: 15,
      minHeight: 46
    }
  };
  const variants = {
    primary: {
      background: 'var(--blue)',
      color: 'var(--on-accent)',
      border: '1px solid var(--blue)'
    },
    secondary: {
      background: 'var(--surface)',
      color: 'var(--blue)',
      border: '1px solid var(--active-border)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--muted)',
      border: '1px solid transparent'
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 'var(--radius)',
    fontWeight: 800,
    fontFamily: 'var(--font-sans)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    transition: 'filter var(--dur-fast) var(--ease-standard), background var(--dur-fast)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: base,
    onMouseDown: e => !disabled && (e.currentTarget.style.transform = 'translateY(1px)'),
    onMouseUp: e => e.currentTarget.style.transform = 'translateY(0)',
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.filter = 'none';
    },
    onMouseEnter: e => !disabled && (e.currentTarget.style.filter = 'brightness(0.96)')
  }, rest), leadingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, leadingIcon), children, trailingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, trailingIcon));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PMMetricsAI status pill — the canonical way to show an indicator's state.
 * Uses the 3-stop status system (good / watch / escalate) plus neutral & info,
 * each with its soft surface tint. Word set is fixed: On track · Watch · Escalate.
 */
function StatusPill({
  status = 'good',
  children,
  dot = true,
  style = {},
  ...rest
}) {
  const map = {
    good: {
      bg: 'var(--good-bg)',
      fg: 'var(--green)',
      bd: 'var(--good-border)',
      label: 'On track'
    },
    watch: {
      bg: 'var(--watch-bg)',
      fg: 'var(--amber)',
      bd: 'var(--watch-border)',
      label: 'Watch'
    },
    escalate: {
      bg: 'var(--risk-bg)',
      fg: 'var(--red)',
      bd: 'rgba(197,37,45,.25)',
      label: 'Escalate'
    },
    info: {
      bg: 'var(--neutral-bg)',
      fg: 'var(--blue)',
      bd: 'var(--neutral-border)',
      label: 'Advisory'
    },
    neutral: {
      bg: 'var(--surface-alt)',
      fg: 'var(--muted)',
      bd: 'var(--line)',
      label: 'Pending'
    }
  };
  const s = map[status] || map.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-sans)',
      fontSize: 11.5,
      fontWeight: 800,
      letterSpacing: '.02em',
      background: s.bg,
      color: s.fg,
      border: `1px solid ${s.bd}`,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: s.fg
    }
  }), children || s.label);
}
Object.assign(__ds_scope, { StatusPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusPill.jsx", error: String((e && e.message) || e) }); }

// components/data-display/MetricCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PMMetricsAI MetricCard — a hero KPI tile. Big tabular value, target, and a
 * signed variance with a trend arrow. Only alerting tiles carry a colored left
 * accent bar (status="watch"|"escalate"); the green baseline stays calm.
 */
function MetricCard({
  label,
  value,
  target,
  variance,
  trend = 'flat',
  status = 'neutral',
  icon = null,
  style = {},
  ...rest
}) {
  const flag = status === 'watch' || status === 'escalate';
  const accent = status === 'escalate' ? 'var(--red)' : status === 'watch' ? 'var(--amber)' : 'transparent';
  const varColor = trend === 'flat' ? 'var(--muted)' : status === 'escalate' ? 'var(--red)' : status === 'watch' ? 'var(--amber)' : 'var(--green)';
  const arrow = trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'minus';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 11,
      padding: 14,
      boxShadow: 'var(--shadow-card)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), flag && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: accent
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--muted)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 7,
      display: 'grid',
      placeItems: 'center',
      background: 'var(--surface-alt)',
      color: 'var(--blue)'
    }
  }, icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 25,
      fontWeight: 800,
      letterSpacing: '-.02em',
      margin: '9px 0 3px',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--ink)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontVariantNumeric: 'tabular-nums'
    }
  }, target != null && /*#__PURE__*/React.createElement("span", null, target), variance != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      fontWeight: 700,
      color: varColor
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": arrow,
    style: {
      width: 13,
      height: 13
    }
  }), variance)));
}
Object.assign(__ds_scope, { MetricCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/MetricCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pmmetricsai/ops-data.js
try { (() => {
// PMMetricsAI — Strategic Ops sample data (authentic UAT scenarios)
window.OPS_ASSUMPTIONS = {
  tat_days: {
    row: 'O1/O2',
    source: 'LIMRA Claims Benchmark 2024',
    value: 'Simple: <3d green · 3–5d amber · >5d red. Complex: <15d green · 15–30d amber · >30d red.',
    ref: 'LIMRA Claims Benchmark 2024'
  },
  pct_manual: {
    row: 'O3',
    source: 'STP Target',
    value: '<25% green · >30% red (inverse of STP target >70%).',
    ref: 'Industry Standard'
  },
  sla: {
    row: 'O4',
    source: 'Prudential Vietnam SLA 2025',
    value: '>95% green · <90% red.',
    ref: 'Prudential Internal'
  },
  fraud: {
    row: 'O5',
    source: 'Prudential Risk + SBV',
    value: '>65% precision green · <60% red.',
    ref: 'SBV Circular 09/2020 Art.14'
  },
  exception: {
    row: 'O3',
    source: 'STP Target / LIMRA',
    value: '<5% target exception rate.',
    ref: 'LIMRA Claims Benchmark 2024'
  },
  api: {
    row: 'A1/C1',
    source: 'Bain NPS Prism + MoF',
    value: 'API success >97% · latency <200ms target band.',
    ref: 'Google SRE / MoF Circular 50/2024'
  },
  csat: {
    row: 'X1',
    source: 'Forrester CX Index 2025',
    value: '>4.2 green · <4.0 red.',
    ref: 'Hansa CUES / Forrester 2026'
  },
  ces: {
    row: 'X2',
    source: 'Forrester CX Index 2025',
    value: '>4.0 green · <3.6 red.',
    ref: 'Forrester CES, Insurance 2025'
  },
  dropoff: {
    row: 'X3',
    source: 'UX Best Practice',
    value: '<10% green · >25% red.',
    ref: 'Nielsen Norman Group 2024'
  },
  tickets: {
    row: 'O4',
    source: 'Prudential Vietnam SLA 2025',
    value: 'Ticket TAT target <4h.',
    ref: 'Prudential Internal'
  },
  cost: {
    row: 'C1',
    source: 'Vietnam MoF + LIMRA 2024',
    value: 'Avg 1.2M VND simple · 2.8M VND complex.',
    ref: 'MoF Vietnam Circular 50/2024'
  },
  crosssell: {
    row: 'R1',
    source: 'Bain APAC Insurance 2025',
    value: 'Eligibility gated on satisfaction-recovery risk.',
    ref: 'Bain & Company APAC 2025'
  },
  clv: {
    row: 'C3/R2',
    source: 'Towers Watson + Bain 2025',
    value: 'Avg CLV 15M VND / premium customer (8yr) · ±15% per claim.',
    ref: 'Bain Renewal + TW CLV Model'
  },
  reserve: {
    row: 'IFRS17',
    source: 'IFRS 17 Insurance Contracts',
    value: 'Contractual Service Margin (CSM) mapping; band ±~7% of mid.',
    ref: 'IFRS 17 / CSM'
  }
};

// band config: dir 'lower' (lower is better) or 'higher'; min,max,green,amber thresholds
const BANDS = {
  tat_days: {
    dir: 'lower',
    min: 0,
    max: 45,
    green: 15,
    amber: 30
  },
  pct_manual: {
    dir: 'lower',
    min: 0,
    max: 0.5,
    green: 0.25,
    amber: 0.30
  },
  sla: {
    dir: 'higher',
    min: 0.70,
    max: 1.0,
    green: 0.95,
    amber: 0.90
  },
  fraud: {
    dir: 'lower',
    min: 0,
    max: 1.0,
    green: 0.60,
    amber: 0.65
  },
  csat: {
    dir: 'higher',
    min: 3.0,
    max: 5.0,
    green: 4.2,
    amber: 4.0
  },
  ces: {
    dir: 'higher',
    min: 2.0,
    max: 5.0,
    green: 4.0,
    amber: 3.6
  },
  dropoff: {
    dir: 'lower',
    min: 0,
    max: 0.40,
    green: 0.10,
    amber: 0.25
  }
};
window.OPS_BANDS = BANDS;
window.OPS_SCENARIOS = {
  S4: {
    sub: 'Scenario S4 · 16–22 Jun 2026 · Critical-illness complex claim · Day 32',
    crit: true,
    claim: {
      id: 'CLM-LIFE-2026-001755',
      who: 'Mrs. P.T.H.',
      age: 58,
      city: 'Da Nang',
      tier: 'Premium',
      cause: 'Critical illness (heart disease + comorbidity)',
      type: 'Complex',
      status: 'Under investigation'
    },
    groups: [{
      name: 'Operations & Risk',
      sw: 'var(--purple)',
      tiles: [{
        k: 'tat_days',
        lab: 'TAT',
        val: '32d',
        tgt: '30d',
        sev: 'red',
        flag: 'Breach',
        band: 32
      }, {
        k: 'pct_manual',
        lab: '% Manual',
        val: '45%',
        tgt: '30%',
        sev: 'amber',
        band: 0.45
      }, {
        k: 'sla',
        lab: 'SLA Compliance',
        val: '88%',
        tgt: '95%',
        sev: 'red',
        flag: 'Breach',
        band: 0.88
      }, {
        k: 'fraud',
        lab: 'Fraud Score',
        val: '22%',
        tgt: '<30%',
        sev: '',
        band: 0.22
      }, {
        k: 'exception',
        lab: 'Exception Rate',
        val: '32%',
        tgt: '20%',
        sev: 'red',
        band: null
      }, {
        k: 'api',
        lab: 'API / Latency',
        val: '99.6% <small>/ 420ms</small>',
        tgt: '99.5% / 500ms',
        sev: '',
        band: null
      }]
    }, {
      name: 'Customer Experience',
      sw: 'var(--green)',
      tiles: [{
        k: 'csat',
        lab: 'CSAT',
        val: '3.2<small>/5</small>',
        tgt: '4.0',
        sev: 'amber',
        band: 3.2
      }, {
        k: 'ces',
        lab: 'CES',
        val: '2.8<small>/5</small>',
        tgt: '4.0',
        sev: 'amber',
        band: 2.8
      }, {
        k: 'dropoff',
        lab: 'Dropoff',
        val: '18%',
        tgt: '10%',
        sev: 'amber',
        band: 0.18
      }, {
        k: 'tickets',
        lab: 'Support Tickets',
        val: '4 <small>/ 8h TAT</small>',
        tgt: '2 / 4h',
        sev: 'amber',
        band: null
      }]
    }, {
      name: 'Revenue & Commercial',
      sw: 'var(--blue)',
      tiles: [{
        k: 'cost',
        lab: 'Cost / Claim',
        val: '2,800,000 <small>VND</small>',
        tgt: '1,000,000',
        sev: 'amber',
        band: null
      }, {
        k: 'crosssell',
        lab: 'Cross-sell',
        val: 'Disabled',
        tgt: '—',
        sev: '',
        band: null,
        muted: true
      }, {
        k: 'clv',
        lab: 'CLV Lift',
        val: '−15%',
        tgt: 'baseline',
        sev: 'red',
        flag: 'At risk',
        band: null
      }, {
        k: 'reserve',
        lab: 'IFRS 17 Reserve',
        val: '1.50B <small>VND</small>',
        tgt: 'band 1.4–1.6B',
        sev: '',
        band: null
      }]
    }],
    anomalies: [{
      sev: 'RED',
      metric: 'tat_days',
      conf: 96,
      title: 'TAT breach on complex claim',
      review: true,
      cause: 'Day 32 of investigation, exceeds 30d complex threshold. Bottleneck: 3 medical-record requests pending from 2 hospitals.',
      rec: 'Escalate to senior adjuster. Direct call to hospital records department. Customer recovery call within 24h.',
      actual: '32 days',
      target: '30 days',
      cites: 'CLM-LIFE-2026-001755 · LIMRA-CLAIMS-OPS'
    }, {
      sev: 'RED',
      metric: 'sla_compliance',
      conf: 99,
      title: 'SLA breach',
      cause: 'Direct consequence of the TAT breach above.',
      rec: 'Resolving the TAT root cause resolves this — no separate action.',
      actual: '88%',
      target: '95%',
      cites: 'CLM-LIFE-2026-001755 · LIMRA-OPS'
    }, {
      sev: 'RED',
      metric: 'clv_update_pct',
      conf: 84,
      title: 'Commercial signal · CLV erosion −15%',
      cause: 'Per Bain renewal study, a dissatisfied claim experience drops renewal probability 17pp. CLV −15% ≈ 10.5M VND lifetime revenue at risk per customer in this profile.',
      rec: 'Customer recovery protocol immediately. Partial recovery (CSAT 3.2→3.8) reclaims ~50% of CLV erosion per Bain delta.',
      actual: '−15% · 10.5M VND',
      target: 'baseline',
      cites: 'CLM-LIFE-2026-001755 · BAIN-RENEWAL · TW-CLV'
    }, {
      sev: 'AMBER',
      metric: 'csat',
      conf: 88,
      title: 'CSAT below threshold',
      cause: '4 support tickets raised by claimant, avg 8h TAT. Frustration with documentation back-and-forth.',
      rec: 'Assign a dedicated case manager. Proactive daily status updates to the claimant.',
      actual: '3.2 / 5',
      target: '4.0',
      cites: 'CLM-LIFE-2026-001755 · HANSA-CUES-2026'
    }, {
      sev: 'AMBER',
      metric: 'pct_manual_intervention',
      conf: 79,
      title: 'Manual intervention high',
      cause: 'Complex case + comorbidity requires specialist review at multiple steps.',
      rec: 'Acceptable for case complexity. Monitor but no action.',
      actual: '45%',
      target: '30%',
      cites: 'CLM-LIFE-2026-001755 · LIMRA-OPS'
    }],
    highlights: ['TAT 32 days breaches the 30-day complex threshold — clear RED.', 'Cross-domain signal: ops breach → CLV −15% → 8–12M VND lifetime revenue at risk per customer.', 'CSAT 3.2 (vs 4.0 target) — customer-recovery window is closing.'],
    watchouts: ['If churn-after-payout holds across 40+ complex CI claims/year, that is 320–480M VND annual CLV erosion.', 'Cost/claim 2.8M VND is 2.8× portfolio mean — escalation overhead drives this.', 'Platform quality 91% on this release coincides with the case being mishandled — investigate correlation.'],
    actions: [{
      owner: 'Ops senior',
      action: 'Direct call to hospital records dept',
      due: 'within 4h',
      impact: 'Unblock docs · est. −7 days TAT',
      imp: 'HIGH'
    }, {
      owner: 'Customer Recovery',
      action: 'Dedicated case manager + daily updates',
      due: 'started',
      impact: 'Recover ~30% of CLV erosion',
      imp: 'HIGH'
    }, {
      owner: 'Product',
      action: 'Alert that fires at day 25 of complex claims',
      due: 'next sprint',
      impact: 'Prevent breach in 4/4 future cases',
      imp: 'MEDIUM'
    }],
    chat: [{
      s: 'sys',
      t: 'Chào Jane. I am the AI Advisor. Ask about this claim\u2019s metrics — answers are advisory and cite source claims.'
    }, {
      s: 'user',
      t: 'Why did SLA breach on this claim?'
    }, {
      s: 'sys',
      t: 'SLA fell to 88% as a direct consequence of the TAT breach (Day 32 vs 30-day complex threshold). Root bottleneck: 3 pending medical-record requests. Resolving TAT resolves SLA.',
      conf: 99,
      cites: 'CLM-LIFE-2026-001755'
    }]
  },
  S1: {
    sub: 'Scenario S1 · 16–22 Jun 2026 · Standard claim · Healthy control',
    crit: false,
    claim: {
      id: 'CLM-LIFE-2026-001500',
      who: 'Mr. T.V.B.',
      age: 41,
      city: 'HCMC',
      tier: 'Standard',
      cause: 'Accidental injury (standard processing)',
      type: 'Simple',
      status: 'Approved'
    },
    groups: [{
      name: 'Operations & Risk',
      sw: 'var(--purple)',
      tiles: [{
        k: 'tat_days',
        lab: 'TAT',
        val: '2.1d',
        tgt: '3.0d',
        sev: '',
        band: 2.1
      }, {
        k: 'pct_manual',
        lab: '% Manual',
        val: '22%',
        tgt: '30%',
        sev: '',
        band: 0.22
      }, {
        k: 'sla',
        lab: 'SLA Compliance',
        val: '97%',
        tgt: '95%',
        sev: '',
        band: 0.97
      }, {
        k: 'fraud',
        lab: 'Fraud Score',
        val: '15%',
        tgt: '<30%',
        sev: '',
        band: 0.15
      }, {
        k: 'exception',
        lab: 'Exception Rate',
        val: '4%',
        tgt: '20%',
        sev: '',
        band: null
      }, {
        k: 'api',
        lab: 'API / Latency',
        val: '99.8% <small>/ 180ms</small>',
        tgt: '99.5% / 500ms',
        sev: '',
        band: null
      }]
    }, {
      name: 'Customer Experience',
      sw: 'var(--green)',
      tiles: [{
        k: 'csat',
        lab: 'CSAT',
        val: '4.5<small>/5</small>',
        tgt: '4.0',
        sev: '',
        band: 4.5
      }, {
        k: 'ces',
        lab: 'CES',
        val: '4.3<small>/5</small>',
        tgt: '4.0',
        sev: '',
        band: 4.3
      }, {
        k: 'dropoff',
        lab: 'Dropoff',
        val: '8%',
        tgt: '10%',
        sev: '',
        band: 0.08
      }, {
        k: 'tickets',
        lab: 'Support Tickets',
        val: '1 <small>/ 3h TAT</small>',
        tgt: '2 / 4h',
        sev: '',
        band: null
      }]
    }, {
      name: 'Revenue & Commercial',
      sw: 'var(--blue)',
      tiles: [{
        k: 'cost',
        lab: 'Cost / Claim',
        val: '1,000,000 <small>VND</small>',
        tgt: '1,200,000',
        sev: '',
        band: null
      }, {
        k: 'crosssell',
        lab: 'Cross-sell',
        val: 'Health + Wellness',
        tgt: 'eligible',
        sev: '',
        band: null
      }, {
        k: 'clv',
        lab: 'CLV Lift',
        val: '+6%',
        tgt: 'baseline',
        sev: '',
        band: null
      }, {
        k: 'reserve',
        lab: 'IFRS 17 Reserve',
        val: '0.80B <small>VND</small>',
        tgt: 'band 0.75–0.85B',
        sev: '',
        band: null
      }]
    }],
    anomalies: [],
    highlights: ['All 14 indicators inside target band — no anomalies fired.', 'STP path clean: 22% manual intervention, 4% exception rate.', 'Health + Wellness cross-sell eligible — CLV +6% on a satisfied claim.'],
    watchouts: ['Control scenario: use as the baseline when comparing alerting claims.', 'Reserve sits at band mid — no IFRS 17 CSM pressure.'],
    actions: [{
      owner: 'None',
      action: 'Standard processing — no intervention required',
      due: '—',
      impact: 'Auto-close on payout',
      imp: 'LOW'
    }],
    chat: [{
      s: 'sys',
      t: 'Chào Jane. I am the AI Advisor. This is the healthy-control scenario — ask anything to compare against alerting claims.'
    }, {
      s: 'user',
      t: 'Any anomalies on this claim?'
    }, {
      s: 'sys',
      t: 'None. All 14 metrics are inside target band; the AI layer fired 0 anomalies. This claim is the clean baseline.',
      conf: 95,
      cites: 'CLM-LIFE-2026-001500'
    }]
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pmmetricsai/ops-data.js", error: String((e && e.message) || e) }); }

// ui_kits/pmmetricsai/ops-render.js
try { (() => {
// PMMetricsAI — Strategic Ops renderer
(function () {
  const T = n => `<i data-lucide="${n}"></i>`;
  const A = window.OPS_ASSUMPTIONS,
    BANDS = window.OPS_BANDS,
    SC = window.OPS_SCENARIOS;
  let sev = 'ALL',
    current = 'S4',
    aiOn = true;
  function bandHTML(k, v) {
    const c = BANDS[k];
    if (!c || v == null) return '';
    const span = c.max - c.min;
    const pos = Math.max(0, Math.min(100, (Math.max(c.min, Math.min(c.max, v)) - c.min) / span * 100));
    let segs;
    if (c.dir === 'lower') {
      const pg = (c.green - c.min) / span * 100,
        pa = (c.amber - c.green) / span * 100;
      segs = [['g', pg], ['a', pa], ['r', 100 - pg - pa]];
    } else {
      const pr = (c.amber - c.min) / span * 100,
        pa = (c.green - c.amber) / span * 100;
      segs = [['r', pr], ['a', pa], ['g', 100 - pr - pa]];
    }
    return `<div class="band"><div class="band-bar">
      ${segs.map(s => `<span class="seg-${s[0]}" style="width:${Math.max(0, s[1])}%"></span>`).join('')}
      <span class="band-mark" style="left:${pos}%"></span>
    </div></div>`;
  }
  function tileHTML(t) {
    const a = A[t.k];
    return `<div class="mt ${t.sev}">
      <div class="mt-h">
        <span class="mt-lab">${t.lab}</span>
        ${a ? `<span class="mt-info" data-k="${t.k}" title="${a.source}">${T('info')}</span>` : ''}
      </div>
      <div class="mt-val" ${t.muted ? 'style="color:var(--muted);font-weight:600;font-size:14px"' : ''}>${t.val} <small>· ${t.tgt}</small></div>
      ${t.flag ? `<span class="mt-flag ${t.sev}">${t.flag}</span>` : ''}
      ${bandHTML(t.k, t.band)}
    </div>`;
  }
  function anHTML(a) {
    return `<div class="an ${a.sev}">
      ${a.review ? `<div class="an-rev">${T('gavel')} Advisory only — manual review required (no auto-denial)</div>` : ''}
      <div class="an-top">
        <span class="an-metric">${a.metric.replace(/_/g, ' ')}</span>
        <span class="an-conf">${a.conf}% conf</span>
      </div>
      <div class="an-title ${a.sev}">${T(a.sev === 'RED' ? 'octagon-alert' : a.sev === 'INFO' ? 'info' : 'triangle-alert')} ${a.title}</div>
      <p class="an-line"><b>Why:</b> ${a.cause}</p>
      <div class="an-av"><span>Actual <b>${a.actual}</b></span><span>Target ${a.target}</span></div>
      <p class="an-line"><b>Action:</b> ${a.rec}</p>
      <div class="an-cite"><span>Cites: ${a.cites}</span><span class="an-badge">Review before action</span></div>
    </div>`;
  }
  function render() {
    const s = SC[current];
    document.getElementById('subline').textContent = s.sub;
    document.getElementById('critflag').style.display = s.crit ? 'inline-flex' : 'none';
    const c = s.claim;
    const anoms = aiOn ? s.anomalies.filter(a => sev === 'ALL' || a.sev === sev) : [];
    document.getElementById('grid').innerHTML = `
      <div class="col">
        <div class="card file">
          <div class="file-top">
            <span class="ic">${T('folder-search')}</span>
            <h2>Claim File · ${c.id}</h2>
          </div>
          <div class="file-meta">
            <span class="tagk"><b>${c.who}</b> · ${c.age}, ${c.city}</span>
            <span class="tagk tier">${c.tier}</span>
            <span class="tagk">Cause: <b>${c.cause}</b></span>
            <span class="tagk">Type: <b>${c.type}</b></span>
            <span class="tagk">Status: <b>${c.status}</b></span>
          </div>
        </div>
        ${s.groups.map(g => `
          <div class="card mgrp">
            <h3 class="mgrp-h"><span class="sw" style="background:${g.sw}"></span> ${g.name} <span style="color:var(--muted);font-weight:600">(${g.tiles.length})</span></h3>
            <div class="mtiles">${g.tiles.map(tileHTML).join('')}</div>
          </div>`).join('')}
        <div class="card ha">
          <div class="ha-h">${T('clipboard-check')}<h3>Highlights & recommended actions</h3></div>
          <div class="ha-cols">
            <div>
              <span class="eyebrow">Key highlights</span>
              <ul class="hl-list">${s.highlights.map(h => `<li>${T('dot')}${h}</li>`).join('')}</ul>
              <span class="eyebrow" style="display:block;margin:16px 0 9px">Watch-outs</span>
              <ul class="hl-list">${s.watchouts.map(h => `<li>${T('eye')}${h}</li>`).join('')}</ul>
            </div>
            <div>
              <span class="eyebrow">Follow-up actions</span>
              <div class="act">${s.actions.map(a => `
                <div class="act-i">
                  <div><div class="a-main">${a.action}</div><div class="a-meta"><span>Owner: ${a.owner}</span><span>Due: ${a.due}</span></div>
                  <div class="a-meta" style="margin-top:5px;color:var(--text-body)">${a.impact}</div></div>
                  <span class="imp ${a.imp}">${a.imp}</span>
                </div>`).join('')}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card apanel">
          <div class="apanel-h">
            <span class="t">${aiOn ? '<span class="pulse"></span>' : ''} Fired AI anomalies <span style="color:var(--muted)">(${anoms.length})</span></span>
          </div>
          <div class="filters">
            ${['ALL', 'RED', 'AMBER', 'INFO'].map(x => `<button class="fbtn ${sev === x ? 'active' : ''}" data-sev="${x}">${x}</button>`).join('')}
          </div>
          <div class="alist">
            ${!aiOn ? `<div style="text-align:center;padding:28px 8px;color:var(--muted);font-size:12px">${T('power-off')}<div style="margin-top:8px">AI layer offline · fallback mode active</div></div>` : anoms.length === 0 ? `<div style="text-align:center;padding:28px 8px;color:var(--green);font-size:12px">${T('circle-check')}<div style="margin-top:8px">No anomalies match this filter</div></div>` : anoms.map(anHTML).join('')}
          </div>
        </div>
        <div class="card nlp">
          <div class="nlp-h"><span class="t">${T('sparkles')} AI Advisor</span><span class="lim" id="lim">Limit 1 / 5</span></div>
          <div class="nlp-body" id="chat">
            <div class="reset">${T('refresh-cw')} Scenario switched · chat session reset</div>
            ${s.chat.map(msgHTML).join('')}
          </div>
          <div class="nlp-in">
            <input id="chatInput" placeholder="Ask the AI Advisor…">
            <button id="chatSend">Send</button>
          </div>
        </div>
      </div>`;
    bind();
    if (window.lucide) lucide.createIcons();
  }
  function msgHTML(m) {
    return `<div class="msg ${m.s}">${m.t}${m.conf !== undefined ? `<div class="msg-cite"><span>Conf ${m.conf}%</span><span>Cites: ${m.cites}</span></div>` : ''}</div>`;
  }
  function bind() {
    document.querySelectorAll('.fbtn').forEach(b => b.onclick = () => {
      sev = b.dataset.sev;
      render();
    });
    document.querySelectorAll('.mt-info').forEach(el => el.onclick = () => openModal(el.dataset.k));
    const send = document.getElementById('chatSend'),
      input = document.getElementById('chatInput'),
      chat = document.getElementById('chat');
    let count = 1;
    function fire() {
      const q = input.value.trim();
      if (!q) return;
      chat.insertAdjacentHTML('beforeend', msgHTML({
        s: 'user',
        t: q
      }));
      input.value = '';
      const reply = aiOn ? {
        s: 'sys',
        t: 'Advisory: routing your question against this claim\u2019s metrics and the benchmark table. In the live build this calls the governed NLP endpoint (max 5 queries · OWASP LLM10).',
        conf: 82,
        cites: SC[current].claim.id
      } : {
        s: 'sys',
        t: 'NLP engine offline — AI layer is disabled by the kill switch.'
      };
      setTimeout(() => {
        chat.insertAdjacentHTML('beforeend', msgHTML(reply));
        chat.scrollTop = chat.scrollHeight;
        if (window.lucide) lucide.createIcons();
      }, 350);
      count = Math.min(5, count + 1);
      document.getElementById('lim').textContent = `Limit ${count} / 5`;
      chat.scrollTop = chat.scrollHeight;
    }
    send.onclick = fire;
    input.onkeydown = e => {
      if (e.key === 'Enter') fire();
    };
  }
  function openModal(k) {
    const a = A[k];
    if (!a) return;
    document.getElementById('modalCard').innerHTML = `
      <div class="mc-h">
        <div><span class="row-tag">Row ${a.row}</span><h4>Assumption & citation</h4></div>
        <button class="x" id="modalX">${T('x')}</button>
      </div>
      <div class="mc-field"><div class="k">Source system / benchmark</div><div class="v src">${a.source}</div></div>
      <div class="mc-field"><div class="k">Rule / expected value</div><div class="v">${a.value}</div></div>
      <div class="mc-field"><div class="k">Study / reference document</div><div class="v">${a.ref}</div></div>
      <div style="border-top:1px solid var(--line-soft);padding-top:11px;font-size:11px;color:var(--muted)">Appendix · assumptions_appendix.md</div>`;
    document.getElementById('modal').classList.add('open');
    if (window.lucide) lucide.createIcons();
    document.getElementById('modalX').onclick = closeModal;
  }
  function closeModal() {
    document.getElementById('modal').classList.remove('open');
  }
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target.id === 'modal') closeModal();
  });
  document.getElementById('scenario').addEventListener('change', e => {
    current = e.target.value;
    sev = 'ALL';
    render();
  });
  document.getElementById('killswitch').addEventListener('click', e => {
    e.currentTarget.classList.toggle('off');
    aiOn = !e.currentTarget.classList.contains('off');
    render();
  });
  render();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pmmetricsai/ops-render.js", error: String((e && e.message) || e) }); }

__ds_ns.AnomalyCard = __ds_scope.AnomalyCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.StatusPill = __ds_scope.StatusPill;

__ds_ns.MetricCard = __ds_scope.MetricCard;

})();
