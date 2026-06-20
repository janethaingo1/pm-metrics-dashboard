import React, { useState, useEffect } from 'react';

const ASSUMPTIONS: Record<string, { row: string; source: string; value: string; ref: string }> = {
  tat_days: { row: 'O1/O2', source: 'LIMRA Claims Benchmark 2024', value: 'Simple: <3d green, 3-5d amber, >5d red | Complex: <15d green, 15-30d amber, >30d red', ref: 'LIMRA Claims Benchmark 2024' },
  pct_manual_intervention: { row: 'O3', source: 'STP Target', value: '<25% green, >30% red (Inverse of STP target >70%)', ref: 'Industry Standard' },
  sla_compliance: { row: 'O4', source: 'Prudential Internal', value: '>95% green, <90% red', ref: 'Prudential Vietnam SLA 2025' },
  fraud_score: { row: 'O5', source: 'Prudential Risk + SBV', value: '>65% green (precision), <60% red', ref: 'SBV Circular 09/2020 Art.14' },
  exception_rate_pct: { row: 'O3', source: 'STP Target / LIMRA', value: '<5% target exception rate', ref: 'LIMRA Claims Benchmark 2024' },
  api_success_latency: { row: 'A1/C1', source: 'Bain NPS Prism + MoF', value: 'API Success >97% | Latency <200ms', ref: 'Bain NPS Prism 2025 / Vietnam MoF Circular 50/2024' },
  csat: { row: 'X1', source: 'Forrester CX Index 2025', value: '>4.2 green, <4.0 red', ref: 'Forrester CX Index, Insurance 2025' },
  ces: { row: 'X2', source: 'Forrester CX Index 2025', value: '>4.0 green, <3.6 red', ref: 'Forrester CES, Insurance 2025' },
  dropoff_pct: { row: 'X3', source: 'UX Best Practice', value: '<10% green, >25% red', ref: 'Nielsen Norman Group, Form Usability 2024' },
  tickets: { row: 'O4', source: 'Prudential Internal', value: 'Ticket TAT target <4h', ref: 'Prudential Vietnam SLA 2025' },
  cost_per_claim_vnd: { row: 'C1', source: 'Vietnam MoF + LIMRA 2024', value: 'Avg 1.2M VND simple, 2.8M VND complex', ref: 'Ministry of Finance Vietnam Circular 50/2024' },
  cross_sell_eligible: { row: 'R1', source: 'Bain APAC Insurance 2025', value: '>1.5 green, <1.2 red ratio', ref: 'Bain & Company, APAC Insurance Distribution 2025' },
  clv_update_pct: { row: 'C3/R2', source: 'TW + Bain 2025', value: 'Avg CLV 15M VND per premium customer (8yr horizon) | ±15% per claim', ref: 'Towers Watson + Bain CLV Model' },
  reserve_vnd: { row: 'IFRS17', source: 'IFRS 17 Standards', value: 'Contractual service margin (CSM) mapping', ref: 'IFRS 17 Insurance Contracts' },
  adoption_nps: { row: 'A1', source: 'Bain NPS Prism 2025', value: 'VN life insurance avg NPS +38 | claims segment target +35', ref: 'Bain & Company, NPS Prism Insurance Report 2025' },
  velocity: { row: 'V1', source: 'Bain APAC / Agile Benchmark 2025', value: 'Target: 30 SP per sprint | capacity metric', ref: 'Bain APAC Agile Delivery Study 2025' }
};

const METRIC_TO_ASSUMPTION_KEY: Record<string, string> = {
  'Adoption NPS': 'adoption_nps',
  'Cost/Trans': 'cost_per_claim_vnd',
  'Cross-sell': 'cross_sell_eligible',
  'CLV': 'clv_update_pct',
  'CSAT': 'csat',
  'CES': 'ces',
  'Dropoff': 'dropoff_pct',
  'TAT': 'tat_days',
  '%Manual': 'pct_manual_intervention',
  'SLA': 'sla_compliance',
  'Fraud Precision': 'fraud_score',
  'Fraud detection ratio': 'fraud_score',
  'Compliance': 'reserve_vnd',
  'Velocity': 'velocity',
  'Deploy': 'api_success_latency',
  'CFR': 'api_success_latency',
  'Lead Time': 'tat_days',
  'Avg TAT': 'tat_days',
  'Manual Interv.': 'pct_manual_intervention',
  'SLA Compliance': 'sla_compliance',
};

interface MetricRow {
  name: string;
  actual: string | number;
  target: string | number;
  variance: string;
  trend: 'trending-up' | 'trending-down' | 'minus';
  status: 'good' | 'watch' | 'escalate' | 'info' | 'neutral';
}

interface ExecutiveDashboardProps {
  platformMetrics: any;
  periodContext: any;
  aiLayerEnabled: boolean;
}

// -------------------------------------------------------------
// Sub-components matching the design system components
// -------------------------------------------------------------

interface MetricCardProps {
  label: string;
  value: string | number;
  target?: string;
  variance?: string;
  trend?: 'up' | 'down' | 'flat';
  status?: 'good' | 'watch' | 'escalate' | 'info' | 'neutral';
  iconName?: string;
  onIconClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  target,
  variance,
  trend = 'flat',
  status = 'neutral',
  iconName,
  onIconClick
}) => {
  const flag = status === 'watch' || status === 'escalate';
  const accent = status === 'escalate' ? 'var(--red)' : status === 'watch' ? 'var(--amber)' : 'transparent';
  const varColor = trend === 'flat' ? 'var(--muted)' : status === 'escalate' ? 'var(--red)' : status === 'watch' ? 'var(--amber)' : 'var(--green)';
  const arrow = trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'minus';

  return (
    <div
      className="relative overflow-hidden bg-[var(--surface-card)] border border-[var(--border-default)] rounded-[11px] p-[14px] shadow-[var(--shadow-card)] font-sans flex flex-col justify-between"
      style={{ minHeight: '118px' }}
    >
      {flag && (
        <span
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: accent }}
        />
      )}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[var(--muted)] flex items-center gap-1 select-none">
          {label}
          {onIconClick && (
            <span
              onClick={(e) => { e.stopPropagation(); onIconClick(); }}
              className="text-[10px] text-[var(--blue)] hover:underline cursor-pointer ml-0.5"
              title="Click to view rule reference documentation"
            >
              [ⓘ]
            </span>
          )}
        </span>
        {iconName && (
          <span className="w-[26px] h-[26px] rounded-[7px] bg-[var(--surface-alt)] text-[var(--blue)] flex items-center justify-center">
            <i data-lucide={iconName} className="w-[14px] h-[14px]"></i>
          </span>
        )}
      </div>
      <div className="text-[25px] font-extrabold tracking-tight mt-[9px] mb-[3px] text-[var(--ink)] font-mono leading-none">
        {value}
      </div>
      <div className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 font-mono">
        {target && <span>{target}</span>}
        {variance && (
          <span className="inline-flex items-center gap-0.5 font-bold" style={{ color: varColor }}>
            <i data-lucide={arrow} className="w-[13px] h-[13px]"></i>
            {variance}
          </span>
        )}
      </div>
    </div>
  );
};

interface StatusPillProps {
  status?: 'good' | 'watch' | 'escalate' | 'info' | 'neutral';
  children?: React.ReactNode;
  dot?: boolean;
}

const StatusPill: React.FC<StatusPillProps> = ({
  status = 'good',
  children,
  dot = true
}) => {
  const map = {
    good: { bg: 'var(--good-bg)', fg: 'var(--green)', bd: 'var(--good-border)', label: 'On track' },
    watch: { bg: 'var(--watch-bg)', fg: 'var(--amber)', bd: 'var(--watch-border)', label: 'Watch' },
    escalate: { bg: 'var(--risk-bg)', fg: 'var(--red)', bd: 'rgba(197,37,45,.25)', label: 'Escalate' },
    info: { bg: 'var(--neutral-bg)', fg: 'var(--blue)', bd: 'var(--neutral-border)', label: 'Advisory' },
    neutral: { bg: 'var(--surface-alt)', fg: 'var(--muted)', bd: 'var(--line)', label: 'Pending' }
  };
  const s = map[status] || map.neutral;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11.5px] font-bold border whitespace-nowrap"
      style={{ background: s.bg, color: s.fg, borderColor: s.bd }}
    >
      {dot && <span className="w-[7px] h-[7px] rounded-full" style={{ background: s.fg }} />}
      {children || s.label}
    </span>
  );
};

interface AnomalyCardProps {
  level?: 'RED' | 'AMBER' | 'INFO';
  metric: string;
  title: string;
  confidence: number;
  why?: string;
  action?: string;
  actual?: string;
  target?: string;
  sources?: string[];
  regulatory?: string;
}

const AnomalyCard: React.FC<AnomalyCardProps> = ({
  level = 'AMBER',
  metric,
  title,
  confidence,
  why,
  action,
  actual,
  target,
  sources = [],
  regulatory
}) => {
  const map = {
    RED: { fg: 'var(--red)', bg: 'var(--risk-bg)', icon: 'octagon-alert' },
    AMBER: { fg: 'var(--amber)', bg: 'var(--amber-bg)', icon: 'triangle-alert' },
    INFO: { fg: 'var(--blue)', bg: 'var(--info-bg)', icon: 'info' }
  };
  const s = map[level] || map.AMBER;

  return (
    <div
      className="relative overflow-hidden border border-[var(--border-default)] rounded-[10px] p-[12px_13px_12px_15px] font-sans flex flex-col gap-1.5 shadow-[var(--shadow-card)]"
      style={{ background: s.bg, minHeight: '320px' }}
    >
      <span
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: s.fg }}
      />
      {level === 'RED' && (
        <div className="flex items-center gap-1.5 text-[9.5px] font-extrabold tracking-wider text-[var(--red)] uppercase bg-[rgba(197,37,45,.12)] border border-[rgba(197,37,45,.25)] rounded-[5px] p-[4px_7px] leading-tight">
          <i data-lucide="gavel" className="w-[11px] h-[11px]" />
          <span>Advisory only — manual review required (no auto-denial)</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold tracking-wider text-[var(--muted)] uppercase">{metric}</span>
        {confidence != null && (
          <span className="text-[10px] font-bold text-[var(--ink)] bg-[var(--surface)] border border-[var(--line)] rounded-[5px] p-[2px_7px] font-mono">
            {confidence}% conf
          </span>
        )}
      </div>
      <div className="text-[13.5px] font-extrabold text-[var(--ink)] mt-1 mb-1.5 flex items-center gap-1.5">
        <i data-lucide={s.icon} className="w-[15px] h-[15px]" style={{ color: s.fg }} />
        <span>{title}</span>
      </div>
      {why && (
        <p className="text-[11.5px] leading-relaxed text-[var(--text-body)]">
          <b className="text-[var(--ink)]">Why:</b> {why}
        </p>
      )}
      {(actual != null || target != null) && (
        <div className="flex justify-between text-[10.5px] my-1 bg-[var(--surface)] border border-[var(--line)] rounded-[6px] p-[5px_9px] text-[var(--muted)] font-mono">
          <span>Actual <b className="text-[var(--ink)]">{actual}</b></span>
          <span>Target {target}</span>
        </div>
      )}
      {action && (
        <p className="text-[11.5px] leading-relaxed text-[var(--text-body)]">
          <b className="text-[var(--ink)]">Action:</b> {action}
        </p>
      )}
      {regulatory && (
        <p className="text-[10.5px] leading-relaxed text-[var(--amber)] font-semibold border-t border-[rgba(183,93,0,.2)] pt-1.5 mt-1">
          ⚠ {regulatory}
        </p>
      )}
      <div className="flex justify-between items-center gap-2 text-[9.5px] text-[var(--muted)] mt-auto pt-2 font-mono">
        <span>{sources.length > 0 ? `Cites: ${sources.join(', ')}` : ''}</span>
        <span className="text-[8.5px] font-extrabold tracking-wider text-[var(--blue)] bg-[var(--neutral-bg)] rounded-[5px] p-[3px_7px] uppercase">
          Review before action
        </span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// ExecutiveDashboard Component
// -------------------------------------------------------------

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  platformMetrics,
  periodContext,
  aiLayerEnabled,
}) => {
  const [tooltipMetric, setTooltipMetric] = useState<string | null>(null);
  
  // UAT Tweaks panel states
  const [exceptionsOnly, setExceptionsOnly] = useState<boolean>(false);
  const [showAiInsight, setShowAiInsight] = useState<boolean>(true);
  const [tweaksPanelVisible, setTweaksPanelVisible] = useState<boolean>(true);

  // Paint Lucide icons whenever state updates change elements
  useEffect(() => {
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, [exceptionsOnly, showAiInsight, tweaksPanelVisible]);

  // Format metric values from props
  const claimsVolume = periodContext.total_claims_this_week || 47;
  const manualRate = periodContext.manual_intervention_rate_this_week 
    ? `${(periodContext.manual_intervention_rate_this_week * 100).toFixed(0)}%` 
    : '34%';
  const slaCompliance = periodContext.sla_compliance_this_week
    ? `${(periodContext.sla_compliance_this_week * 100).toFixed(1)}%`
    : '92.0%';
  const fraudPrecision = periodContext.fraud_precision_this_month
    ? `${(periodContext.fraud_precision_this_month * 100).toFixed(0)}%`
    : '68%';

  // 30 Core Scorecard Metrics list with thresholds
  const revenueMetrics: MetricRow[] = [
    { name: 'Revenue', actual: '$4.2M', target: '$4.0M', variance: '+5.0%', trend: 'trending-up', status: 'good' },
    { name: 'Growth Rate', actual: '12%', target: '10%', variance: '+2.0%', trend: 'trending-up', status: 'good' },
    { name: 'ARPU', actual: '$1,250', target: '$1,200', variance: '+4.1%', trend: 'trending-up', status: 'good' },
    { name: 'Net Revenue Retention', actual: '110%', target: '105%', variance: '+4.7%', trend: 'trending-up', status: 'good' },
    { name: 'Cost/Trans', actual: '$15.20', target: '$16.00', variance: '-5.0%', trend: 'trending-down', status: 'good' },
    { name: 'Cross-sell', actual: '18%', target: '15%', variance: '+20.0%', trend: 'trending-up', status: 'good' },
    { name: 'CLV', actual: '$14.5k', target: '$14.0k', variance: '+3.5%', trend: 'trending-up', status: 'good' },
  ];

  const cxMetrics: MetricRow[] = [
    { name: 'Adoption NPS', actual: platformMetrics.adoption_nps_claims_segment || 42, target: '35', variance: '+20.0%', trend: 'trending-up', status: 'good' },
    { name: 'CSAT', actual: '92%', target: '90%', variance: '+2.2%', trend: 'trending-up', status: 'good' },
    { name: 'Customer Effort (CES)', actual: '4.2', target: '4.5', variance: '-6.6%', trend: 'trending-down', status: 'watch' },
    { name: 'Customer Dropoff', actual: '14%', target: '12%', variance: '+16.6%', trend: 'trending-up', status: 'watch' },
    { name: 'Retention', actual: platformMetrics.retention_d30_pct ? `${platformMetrics.retention_d30_pct}%` : '88%', target: '85%', variance: '+3.5%', trend: 'trending-up', status: 'good' },
    { name: 'Tickets', actual: '342', target: '300', variance: '+14.0%', trend: 'trending-up', status: 'watch' },
    { name: 'Peak Time', actual: platformMetrics.user_peak_window || '10:00-12:00', target: 'n/a', variance: '0.0%', trend: 'minus', status: 'good' },
    { name: 'Segment', actual: platformMetrics.user_segment_top ? 'Premium' : 'Standard', target: 'Standard', variance: '0.0%', trend: 'minus', status: 'good' },
  ];

  const opsMetrics: MetricRow[] = [
    { name: 'Avg TAT', actual: '2.4d', target: '3.0d', variance: '-20.0%', trend: 'trending-down', status: 'good' },
    { name: '% Manual Intervention', actual: manualRate, target: '30%', variance: '+13.3%', trend: 'trending-up', status: 'watch' },
    { name: 'Security Incidents', actual: (platformMetrics.incidents_p1_this_week || 0) + (platformMetrics.incidents_p2_this_week || 2), target: '5', variance: '-40.0%', trend: 'trending-down', status: 'good' },
    { name: 'MTTD/R', actual: `${platformMetrics.mttr_minutes || 32}m`, target: '60m', variance: '-46.6%', trend: 'trending-down', status: 'good' },
    { name: 'SLA Compliance', actual: slaCompliance, target: '95%', variance: '-3.1%', trend: 'trending-down', status: 'escalate' },
    { name: 'Fraud Precision', actual: fraudPrecision, target: '60%', variance: '+13.3%', trend: 'trending-up', status: 'good' },
    { name: 'Compliance', actual: `${platformMetrics.regulatory_compliance_score || 94}%`, target: '95%', variance: '-1.0%', trend: 'trending-down', status: 'watch' },
  ];

  const projectMetrics: MetricRow[] = [
    { name: 'On-Time Delivery', actual: `${platformMetrics.project_on_time_pct || 94}%`, target: '90%', variance: '+4.4%', trend: 'trending-up', status: 'good' },
    { name: 'Scope', actual: `${platformMetrics.project_on_scope_pct || 91}%`, target: '95%', variance: '-4.2%', trend: 'trending-down', status: 'watch' },
    { name: 'Budget', actual: `${platformMetrics.project_on_budget_pct || 102}%`, target: '100%', variance: '+2.0%', trend: 'trending-up', status: 'watch' },
    { name: 'Code Quality', actual: '99%', target: '95%', variance: '+4.2%', trend: 'trending-up', status: 'good' },
    { name: 'Velocity', actual: platformMetrics.sprint_velocity_sp || 32, target: '30', variance: '+6.6%', trend: 'trending-up', status: 'good' },
    { name: 'Deploy Frequency', actual: `${platformMetrics.dora_deploy_per_week || 4}/wk`, target: '5/wk', variance: '-20.0%', trend: 'trending-down', status: 'watch' },
    { name: 'Change Failure Rate', actual: `${platformMetrics.change_failure_rate_pct || 8}%`, target: '<5%', variance: '+60.0%', trend: 'trending-up', status: 'escalate' },
    { name: 'Lead Time', actual: `${platformMetrics.lead_time_hours || 12}h`, target: '24h', variance: '-50.0%', trend: 'trending-down', status: 'good' },
  ];

  // Helper filter function for exceptionsOnly toggle
  const filterRows = (rows: MetricRow[]) => {
    return exceptionsOnly ? rows.filter(r => r.status !== 'good') : rows;
  };

  const renderMetricListRows = (rows: MetricRow[]) => {
    const filtered = filterRows(rows);
    if (filtered.length === 0) {
      return (
        <div className="py-4 text-center text-xs text-[var(--muted)] font-medium italic">
          No exceptions in this category
        </div>
      );
    }

    return filtered.map((r, idx) => {
      const key = METRIC_TO_ASSUMPTION_KEY[r.name];
      return (
        <div
          key={idx}
          className="grid grid-template-columns-[1fr_auto] grid-cols-[1fr_auto] items-center gap-2 py-2 px-4 border-t border-[var(--line-soft)] hover:bg-[var(--bg)] transition-colors group"
        >
          <span className="text-[12.5px] font-medium text-[var(--text-body)] flex items-center gap-1 truncate">
            {r.name}
            {key && (
              <span
                onClick={() => setTooltipMetric(key)}
                className="text-[10.5px] text-[var(--blue)] opacity-0 group-hover:opacity-100 hover:underline cursor-pointer select-none ml-1 transition-opacity"
                title="Click to view rule reference"
              >
                [ⓘ]
              </span>
            )}
          </span>
          <span className="flex items-center gap-2.5 font-mono text-right">
            <span className="text-[13px] font-extrabold text-[var(--ink)]">{r.actual}</span>
            <span className="text-[11px] font-semibold text-[var(--text-body)] inline-flex items-center gap-0.5 min-w-[62px] justify-end">
              <i data-lucide={r.trend} className="w-3.5 h-3.5"></i>
              {r.variance}
            </span>
            <StatusPill status={r.status} />
          </span>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* 6 Key Highlight Metric Cards */}
      <section>
        <div className="text-[11px] font-extrabold tracking-widest text-[var(--muted)] uppercase mb-3">
          Key Highlights
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <MetricCard
            label="Claims Volume"
            value={claimsVolume}
            target="Target 40"
            variance="+17.5%"
            trend="up"
            status="watch"
            iconName="receipt"
          />
          <MetricCard
            label="Avg TAT"
            value="2.4d"
            target="Target 3.0d"
            variance="-20.0%"
            trend="down"
            status="good"
            iconName="timer"
            onIconClick={() => setTooltipMetric('tat_days')}
          />
          <MetricCard
            label="% Manual"
            value={manualRate}
            target="Target 30%"
            variance="+13.3%"
            trend="up"
            status="watch"
            iconName="users"
            onIconClick={() => setTooltipMetric('pct_manual_intervention')}
          />
          <MetricCard
            label="SLA Compliance"
            value={slaCompliance}
            target="Target 95%"
            variance="-3.1%"
            trend="down"
            status="escalate"
            iconName="award"
            onIconClick={() => setTooltipMetric('sla_compliance')}
          />
          <MetricCard
            label="Loss Ratio"
            value="68.4%"
            target="Target 65%"
            variance="+3.4%"
            trend="up"
            status="watch"
            iconName="trending-up"
          />
          <MetricCard
            label="Fraud Precision"
            value={fraudPrecision}
            target="Target 60%"
            variance="+13.3%"
            trend="up"
            status="good"
            iconName="shield-alert"
            onIconClick={() => setTooltipMetric('fraud_score')}
          />
        </div>
      </section>

      {/* Core Scorecard Grid (30 Indicators) */}
      <section>
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-[11px] font-extrabold tracking-widest text-[var(--muted)] uppercase">
            Core Scorecard · 30 Indicators
          </span>
          <span className="text-[11px] font-extrabold tracking-widest text-[var(--muted)] uppercase font-mono">
            Exception-First View
          </span>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Revenue & Commercial */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl py-3 shadow-[var(--shadow-card)]">
            <h3 className="text-[12.5px] font-extrabold tracking-wide uppercase text-[var(--ink)] px-4 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[var(--blue)]"></span>
              Revenue &amp; Commercial
            </h3>
            <div className="flex flex-col">
              {renderMetricListRows(revenueMetrics)}
            </div>
          </div>

          {/* Customer Experience */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl py-3 shadow-[var(--shadow-card)]">
            <h3 className="text-[12.5px] font-extrabold tracking-wide uppercase text-[var(--ink)] px-4 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[var(--green)]"></span>
              Customer Experience
            </h3>
            <div className="flex flex-col">
              {renderMetricListRows(cxMetrics)}
            </div>
          </div>

          {/* Operations & Risk */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl py-3 shadow-[var(--shadow-card)]">
            <h3 className="text-[12.5px] font-extrabold tracking-wide uppercase text-[var(--ink)] px-4 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[var(--purple)]"></span>
              Operations &amp; Risk
            </h3>
            <div className="flex flex-col">
              {renderMetricListRows(opsMetrics)}
            </div>
          </div>

          {/* Project Health */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl py-3 shadow-[var(--shadow-card)]">
            <h3 className="text-[12.5px] font-extrabold tracking-wide uppercase text-[var(--ink)] px-4 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[var(--amber)]"></span>
              Project Health
            </h3>
            <div className="flex flex-col">
              {renderMetricListRows(projectMetrics)}
            </div>
          </div>
        </div>
      </section>

      {/* AI Insight Cards (Hidden if AI Kill-switch active or toggled off) */}
      {aiLayerEnabled && showAiInsight && (
        <section className="transition-all duration-300">
          <div className="text-[11px] font-extrabold tracking-widest text-[var(--muted)] uppercase mb-3">
            AI Insights — Review Before Action
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* SLA Anomaly - RED */}
            <AnomalyCard
              level="RED"
              metric="sla_compliance"
              title="SLA compliance below floor"
              confidence={82}
              why="SLA fell to 92.0% (−3.1% vs 95% target), driven by complex life-claim TAT breaches concentrated in 3 adjusters during the 16–22 Jun window."
              action="Rebalance complex-claim load and pre-stage IFRS 17 reserve review for the 2 oldest open claims. Confirm fraud holds are not blocking SLA on legitimate claims."
              actual={slaCompliance}
              target="95%"
              sources={['CLM-LIFE-2026-001755', 'CLM-LIFE-2026-001702', 'SBV Circular 09 · Art.14']}
              regulatory="SBV reporting required if fraud confirmed — Circular 09, Article 14."
            />
            {/* Manual Intervention Anomaly - AMBER */}
            <AnomalyCard
              level="AMBER"
              metric="pct_manual_intervention"
              title="Manual intervention trending up"
              confidence={76}
              why="STP slipping to 34% manual (+13.3% vs 30% target). 4 claim types account for 71% of manual touches this week."
              action="Flag the 4 high-touch claim types for an automation candidate review. No SLA impact yet — monitor before escalating."
              actual={manualRate}
              target="30%"
              sources={['CLM-LIFE-2026-001847', 'LIMRA-CLAIMS-OPS']}
            />
          </div>
        </section>
      )}

      {/* Floating UAT Tweaks Panel */}
      {tweaksPanelVisible && (
        <aside
          id="uat-tweaks-panel"
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            width: '310px',
            zIndex: 99,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '18px',
            boxShadow: 'var(--shadow-pop)',
            padding: '20px 24px 22px',
            color: 'var(--ink)',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <span className="font-extrabold text-[16px] tracking-tight">Tweaks</span>
            <button
              onClick={() => setTweaksPanelVisible(false)}
              className="text-[var(--muted)] hover:text-[var(--ink)] font-bold text-[20px] leading-none"
              title="Hide panel"
            >
              &times;
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {/* Toggle 1: exceptionsOnly */}
            <div
              onClick={() => setExceptionsOnly(prev => !prev)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <span className="text-[12.5px] font-semibold text-[var(--muted)]">exceptionsOnly</span>
              <button
                className="relative w-11 h-6 rounded-full transition-colors duration-150"
                style={{
                  background: exceptionsOnly ? 'var(--blue)' : 'var(--line)',
                  border: '1px solid var(--line)'
                }}
              >
                <span
                  className="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-150"
                  style={{
                    transform: exceptionsOnly ? 'translateX(20px)' : 'translateX(0)'
                  }}
                />
              </button>
            </div>
            
            {/* Toggle 2: showAiInsight */}
            <div
              onClick={() => setShowAiInsight(prev => !prev)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <span className="text-[12.5px] font-semibold text-[var(--muted)]">showAiInsight</span>
              <button
                className="relative w-11 h-6 rounded-full transition-colors duration-150"
                style={{
                  background: showAiInsight ? 'var(--blue)' : 'var(--line)',
                  border: '1px solid var(--line)'
                }}
              >
                <span
                  className="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-150"
                  style={{
                    transform: showAiInsight ? 'translateX(20px)' : 'translateX(0)'
                  }}
                />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Re-open Tweaks trigger (if hidden) */}
      {!tweaksPanelVisible && (
        <button
          onClick={() => setTweaksPanelVisible(true)}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-[var(--blue)] text-white shadow-[var(--shadow-pop)] flex items-center justify-center hover:opacity-90 transition-opacity z-50"
          title="Open Tweaks Panel"
        >
          <i data-lucide="sliders" className="w-5 h-5"></i>
        </button>
      )}

      {/* Citational Tooltip Assumptions Modal */}
      {tooltipMetric && ASSUMPTIONS[tooltipMetric] && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 max-w-md w-full shadow-[var(--shadow-pop)] flex flex-col gap-4 font-sans text-[var(--text-body)]">
            <div className="flex justify-between items-start border-b border-[var(--line-soft)] pb-2.5">
              <div>
                <span className="text-[10px] bg-[var(--info-bg)] text-[var(--blue)] border border-[var(--neutral-border)] px-2 py-0.5 rounded font-mono font-bold uppercase">
                  Row: {ASSUMPTIONS[tooltipMetric].row}
                </span>
                <h4 className="text-sm font-extrabold text-[var(--ink)] mt-1.5">Assumption Citation Details</h4>
              </div>
              <button onClick={() => setTooltipMetric(null)} className="text-[var(--muted)] hover:text-[var(--ink)] font-bold text-lg leading-none">&times;</button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-wider">Source System / Benchmark</span>
                <p className="text-[12px] font-bold text-[var(--purple)] mt-0.5">{ASSUMPTIONS[tooltipMetric].source}</p>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-wider">Rule / Expected Value</span>
                <p className="text-[12px] text-[var(--ink)] mt-0.5 leading-relaxed">{ASSUMPTIONS[tooltipMetric].value}</p>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-wider">Study / Reference Document</span>
                <p className="text-[12px] text-[var(--muted)] mt-0.5 leading-relaxed">{ASSUMPTIONS[tooltipMetric].ref}</p>
              </div>
            </div>
            <div className="border-t border-[var(--line-soft)] pt-3.5 flex justify-between items-center text-[10px] text-[var(--muted)]">
              <span>Appendix: assumptions_appendix.md</span>
              <button
                onClick={() => setTooltipMetric(null)}
                className="bg-[var(--surface-alt)] border border-[var(--line)] px-3 py-1.5 rounded hover:bg-[var(--line-soft)] text-[var(--ink)] font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
