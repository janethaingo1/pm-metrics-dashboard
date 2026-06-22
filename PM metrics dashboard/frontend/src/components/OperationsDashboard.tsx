import React, { useState, useEffect, useRef } from 'react';

interface ClaimSummary {
  claim_id: string;
  policy_id: string;
  fnol_date: string;
  cause: string;
  status: string;
  day_of_claim: number;
  sum_at_risk: number;
  policyholder: any;
  claim_type: string;
}

interface OperationsDashboardProps {
  claims: ClaimSummary[];
  selectedClaimId: string;
  onSelectClaimId: (id: string) => void;
  aiLayerEnabled: boolean;
}

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
  reserve_vnd: { row: 'IFRS17', source: 'IFRS 17 Standards', value: 'Contractual service margin (CSM) mapping', ref: 'IFRS 17 Insurance Contracts' }
};

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  claims, selectedClaimId, onSelectClaimId, aiLayerEnabled
}) => {
  const [claimDetail, setClaimDetail] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([{ sender: 'system', text: 'Hello Jane. I am your AI Advisor. Ask me anything about claims metrics.' }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [tooltipMetric, setTooltipMetric] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'RED' | 'AMBER' | 'INFO'>('ALL');
  const [nlpOpen, setNlpOpen] = useState(true);
  const [showResetBanner, setShowResetBanner] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedClaimId) return;
    setLoading(true);
    fetch(`https://prudential-pmm-metrics-api.vercel.app/api/claims/${selectedClaimId}`)
      .then(res => res.json())
      .then(data => { setClaimDetail(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [selectedClaimId]);

  useEffect(() => {
    if (!selectedClaimId) return;
    if (aiLayerEnabled) {
      fetch(`https://prudential-pmm-metrics-api.vercel.app/api/anomalies/${selectedClaimId}`)
        .then(res => res.json())
        .then(data => setAnomalies(data.anomalies || []))
        .catch(() => setAnomalies([]));
    } else {
      setAnomalies([]);
    }
  }, [selectedClaimId, aiLayerEnabled]);

  useEffect(() => {
    if (selectedClaimId) {
      setChatHistory([{ sender: 'system', text: 'Hello Jane. I am your AI Advisor. Ask me anything about claims metrics.' }]);
      setQueryCount(0);
      setShowResetBanner(true);
      const timer = setTimeout(() => setShowResetBanner(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [selectedClaimId]);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory, chatLoading]);

  const formatVND = (v: number | undefined) => v ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v).replace('₫', 'VND') : 'N/A';
  
  const getMetricClass = (_k: string, valObj: any) => {
    if (!aiLayerEnabled || !valObj) return 'border-white/10';
    if (valObj.anomaly === 'RED') return 'border-l-[3px] border-l-[#ff2d78] bg-[#ff2d78]/5 border-white/10';
    if (valObj.anomaly === 'AMBER') return 'border-l-[3px] border-l-[#ffaa00] bg-[#ffaa00]/5 border-white/10';
    return 'border-white/10 hover:border-primary/50 transition-colors';
  };

  const getMetricHeader = (key: string, label: string) => (
    <div className="flex justify-between items-center group relative">
      <span className="text-label-xs text-on-surface-variant uppercase font-semibold">{label}</span>
      <span onClick={() => setTooltipMetric(key)} className="text-[10px] text-[#00e5ff]/70 hover:text-[#00e5ff] cursor-pointer transition-colors font-mono select-none ml-1">
        [ⓘ source]
      </span>
    </div>
  );

  const getMetricValueText = (key: string, valObj: any) => {
    if (!valObj) return 'N/A';
    if (valObj.actual === null) return <span className="text-gray-500 text-xs italic">{valObj.note || 'Not measured'}</span>;
    let valStr = `${valObj.actual}`;
    
    // Fractions (need * 100)
    if (key === 'pct_manual_intervention' || key === 'sla_compliance' || key === 'dropoff_pct' || key === 'exception_rate_stp') {
      valStr = `${(valObj.actual * 100).toFixed(0)}%`;
    } else if (key === 'clv_update_pct' || key === 'exception_rate_pct' || key === 'api_success_pct') {
      valStr = `${valObj.actual > 0 ? '+' : ''}${valObj.actual}%`;
    } else if (key.includes('vnd')) {
      valStr = formatVND(valObj.actual);
    }
    
    return (
      <span className="text-body-lg font-bold text-on-surface mt-1 flex flex-col gap-0.5 font-mono">
        <span>
          {valStr}
          {valObj.target && (
            <span className="text-xs text-gray-400 font-normal ml-2 font-sans">
              (T: {
                (key === 'pct_manual_intervention' || key === 'sla_compliance' || key === 'dropoff_pct' || key === 'exception_rate_stp')
                  ? `${(valObj.target * 100).toFixed(0)}%`
                  : (key === 'clv_update_pct' || key === 'exception_rate_pct' || key === 'api_success_pct')
                  ? `${valObj.target}%`
                  : valObj.target
              })
            </span>
          )}
        </span>
        {key === 'fraud_score' && valObj.actual >= 0.60 && (
          <span className="self-start text-[8px] font-bold bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/30 px-1.5 py-0.5 rounded uppercase tracking-wider mt-1 font-sans">
            SIU Review Queue
          </span>
        )}
      </span>
    );
  };

  const getMetricDisplayValue = (metricKey: string, claim: any): string => {
    if (!claim || !claim.metrics) return 'N/A';
    const m = claim.metrics[metricKey];
    if (!m || m.actual === undefined || m.actual === null) return 'N/A';
    
    if (metricKey === 'csat' || metricKey === 'ces') {
      return `${m.actual.toFixed(1)} / 5.0`;
    }
    
    // Fractions (need * 100)
    if (metricKey === 'pct_manual_intervention' || metricKey === 'sla_compliance' || metricKey === 'dropoff_pct' || metricKey === 'exception_rate_stp') {
      return `${(m.actual * 100).toFixed(0)}%`;
    }
    
    // Percents (do not need * 100)
    if (metricKey === 'clv_update_pct' || metricKey === 'exception_rate_pct' || metricKey === 'api_success_pct') {
      return `${m.actual > 0 ? '+' : ''}${m.actual.toFixed(0)}%`;
    }
    
    if (metricKey.includes('vnd') || metricKey.includes('cost_per_claim_vnd') || metricKey.includes('reserve_vnd')) {
      return formatVND(m.actual);
    }
    if (metricKey === 'tat_days') {
      return `${m.actual.toFixed(1)} days`;
    }
    return `${m.actual}`;
  };

  const getMetricTargetValue = (metricKey: string, claim: any): string => {
    if (!claim || !claim.metrics) return 'N/A';
    const m = claim.metrics[metricKey];
    if (!m || m.target === undefined || m.target === null) return 'N/A';
    
    if (metricKey === 'csat' || metricKey === 'ces') {
      return `${m.target.toFixed(1)}`;
    }
    
    // Fractions (need * 100)
    if (metricKey === 'pct_manual_intervention' || metricKey === 'sla_compliance' || metricKey === 'dropoff_pct' || metricKey === 'exception_rate_stp') {
      return `${(m.target * 100).toFixed(0)}%`;
    }
    
    // Percents (do not need * 100)
    if (metricKey === 'clv_update_pct' || metricKey === 'exception_rate_pct' || metricKey === 'api_success_pct') {
      return `${m.target.toFixed(0)}%`;
    }
    
    if (metricKey.includes('vnd') || metricKey.includes('cost_per_claim_vnd') || metricKey.includes('reserve_vnd')) {
      return formatVND(m.target);
    }
    if (metricKey === 'tat_days') {
      return `${m.target} days`;
    }
    return `${m.target}`;
  };

  const getConfidence = (a: any): number => {
    return a.confidence_pct || 85;
  };

  const renderThreeBandSlider = (key: string, valObj: any, isComplex: boolean) => {
    if (!valObj || valObj.actual === null || valObj.actual === undefined) return null;
    const actual = valObj.actual;
    
    let greenVal = 0;
    let amberVal = 0;
    let higherIsBetter = false;
    let minVal = 0;
    let maxVal = 1;
    
    if (key === 'tat_days') {
      greenVal = isComplex ? 15 : 3;
      amberVal = isComplex ? 30 : 5;
      higherIsBetter = false;
      minVal = 0;
      maxVal = isComplex ? 45 : 8;
    } else if (key === 'pct_manual_intervention') {
      greenVal = 0.25;
      amberVal = 0.30;
      higherIsBetter = false;
      minVal = 0;
      maxVal = 0.50;
    } else if (key === 'sla_compliance') {
      greenVal = 0.95;
      amberVal = 0.90;
      higherIsBetter = true;
      minVal = 0.70;
      maxVal = 1.0;
    } else if (key === 'csat') {
      greenVal = 4.2;
      amberVal = 4.0;
      higherIsBetter = true;
      minVal = 3.0;
      maxVal = 5.0;
    } else if (key === 'ces') {
      greenVal = 4.0;
      amberVal = 3.6;
      higherIsBetter = true;
      minVal = 2.0;
      maxVal = 5.0;
    } else if (key === 'dropoff_pct') {
      greenVal = 0.10;
      amberVal = 0.25;
      higherIsBetter = false;
      minVal = 0;
      maxVal = 0.40;
    } else if (key === 'fraud_score') {
      greenVal = 0.60;
      amberVal = 0.65;
      higherIsBetter = false;
      minVal = 0;
      maxVal = 1.0;
    } else {
      return null;
    }
    
    const clampedActual = Math.max(minVal, Math.min(maxVal, actual));
    const pctPosition = ((clampedActual - minVal) / (maxVal - minVal)) * 100;
    
    let segments = [];
    if (!higherIsBetter) {
      const pGreen = ((greenVal - minVal) / (maxVal - minVal)) * 100;
      const pAmber = ((amberVal - greenVal) / (maxVal - minVal)) * 100;
      const pRed = 100 - pGreen - pAmber;
      segments = [
        { pct: pGreen, bg: 'bg-green-500/30' },
        { pct: pAmber, bg: 'bg-[#ffaa00]/30' },
        { pct: pRed, bg: 'bg-[#ff2d78]/30' },
      ];
    } else {
      const pRed = ((amberVal - minVal) / (maxVal - minVal)) * 100;
      const pAmber = ((greenVal - amberVal) / (maxVal - minVal)) * 100;
      const pGreen = 100 - pRed - pAmber;
      segments = [
        { pct: pRed, bg: 'bg-[#ff2d78]/30' },
        { pct: pAmber, bg: 'bg-[#ffaa00]/30' },
        { pct: pGreen, bg: 'bg-green-500/30' },
      ];
    }
    
    return (
      <div className="mt-2.5 w-full flex flex-col gap-1">
        <div className="h-1.5 w-full rounded-full flex overflow-hidden relative bg-white/5">
          {segments.map((seg, i) => (
            <div key={i} className={`h-full ${seg.bg}`} style={{ width: `${Math.max(0, seg.pct)}%` }} />
          ))}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-[#00e5ff] shadow-[0_0_6px_#00e5ff] -ml-1.5 transition-all duration-300"
            style={{ left: `${pctPosition}%` }}
          />
        </div>
      </div>
    );
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    if (queryCount >= 5) {
      setChatHistory(p => [...p, { sender: 'user', text: chatInput }, { sender: 'system', text: '⚠️ RATE LIMIT WARNING: You have reached the limit of 5 maximum NLP queries (OWASP LLM10).' }]);
      setChatInput(''); return;
    }
    const q = chatInput; setChatHistory(p => [...p, { sender: 'user', text: q }]); setChatInput(''); setChatLoading(true);
    try {
      const res = await fetch('https://prudential-pmm-metrics-api.vercel.app/api/nlp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) });
      const d = await res.json();
      setQueryCount(p => p + 1);
      setChatHistory(p => [...p, aiLayerEnabled ? { sender: 'system', text: d.answer, confidence: d.confidence_pct, citations: d.source_claims } : { sender: 'system', text: 'NLP Engine offline: AI layer disabled.' }]);
    } catch {
      setChatHistory(p => [...p, { sender: 'system', text: 'Connection error to NLP server.' }]);
    } finally { setChatLoading(false); }
  };

  const m = claimDetail?.metrics || {};
  const isComplexClaim = claimDetail?.claim_type === 'complex';

  const filteredAnomalies = anomalies.filter(a => {
    if (severityFilter === 'ALL') return true;
    return a.level === severityFilter;
  });

  return (
    <div className="flex flex-row w-full gap-4 relative items-start text-xs overflow-hidden">
      <div className="flex-grow flex flex-col gap-6 overflow-hidden">
        <div className="bg-[#0a0a1a]/60 backdrop-blur-xl border border-outline-variant rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#00e5ff] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]">Strategic Claim Selector</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Select a UAT scenario to check claims results and AI warnings.</p>
          </div>
          <select value={selectedClaimId} onChange={e => onSelectClaimId(e.target.value)} className="bg-[#0f0f26] border border-[#00e5ff]/30 text-white rounded px-3 py-1.5 focus:outline-none focus:border-[#ff2d78] font-semibold">
            {claims.map(c => (
              <option key={c.claim_id} value={c.claim_id}>
                {c.claim_id === 'CLM-LIFE-2026-001500' ? 'S1: Healthy Control' : c.claim_id === 'CLM-LIFE-2026-001847' ? 'S2: Ops Cluster Anomaly' : c.claim_id === 'CLM-LIFE-2026-001923' ? 'S3: Fraud Route SIU' : 'S4: SLA Breach Complex'} ({c.claim_id})
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="bg-surface border border-outline-variant rounded-xl p-8 flex items-center justify-center h-48 text-[#00e5ff] font-terminal animate-pulse">&gt; FETCHING_CLAIM_DATA...</div>
        ) : claimDetail ? (
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
              <div className="bg-[#0a0a1a]/60 backdrop-blur-xl border border-outline-variant rounded-xl overflow-hidden relative p-4 flex flex-col gap-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">manage_search</span>
                    Claim File: {claimDetail.claim_id}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    Customer: <strong className="text-[#00e5ff]">{claimDetail.policyholder?.initials}</strong> ({claimDetail.policyholder?.age}yo, {claimDetail.policyholder?.city}) · Tier: <span className="text-[#b699ff] font-bold">{claimDetail.policyholder?.tier}</span> · Cause: <span className="text-gray-300">{claimDetail.cause}</span> · Type: <span className="text-gray-300 font-bold font-mono">{claimDetail.claim_type}</span>
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-wider mb-2 border-b border-white/10 pb-1">Operations & Risk (6 metrics)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('tat_days', m.tat_days)}`}>
                      {getMetricHeader('tat_days', 'TAT (Days)')}
                      {getMetricValueText('tat_days', m.tat_days)}
                      {renderThreeBandSlider('tat_days', m.tat_days, isComplexClaim)}
                    </div>
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('pct_manual_intervention', m.pct_manual_intervention)}`}>
                      {getMetricHeader('pct_manual_intervention', '% Manual')}
                      {getMetricValueText('pct_manual_intervention', m.pct_manual_intervention)}
                      {renderThreeBandSlider('pct_manual_intervention', m.pct_manual_intervention, isComplexClaim)}
                    </div>
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('sla_compliance', m.sla_compliance)}`}>
                      {getMetricHeader('sla_compliance', 'SLA Compliance')}
                      {getMetricValueText('sla_compliance', m.sla_compliance)}
                      {renderThreeBandSlider('sla_compliance', m.sla_compliance, isComplexClaim)}
                    </div>
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('fraud_score', m.fraud_score)}`}>
                      {getMetricHeader('fraud_score', 'Fraud detection ratio')}
                      {getMetricValueText('fraud_score', m.fraud_score)}
                      {renderThreeBandSlider('fraud_score', m.fraud_score, isComplexClaim)}
                    </div>
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('exception_rate_pct', m.exception_rate_pct)}`}>
                      {getMetricHeader('exception_rate_pct', 'Exception Rate')}
                      {getMetricValueText('exception_rate_pct', m.exception_rate_pct)}
                    </div>
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('api_success_latency', m.api_success_pct)}`}>
                      {getMetricHeader('api_success_latency', 'API Success/Lat')}
                      <span className="text-body-md font-bold text-on-surface mt-1">
                        {m.api_success_pct?.actual ? `${(m.api_success_pct.actual * 100).toFixed(0)}%` : 'N/A'} / {m.api_latency_ms?.actual ? `${m.api_latency_ms.actual}ms` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-[#b699ff] uppercase tracking-wider mb-2 border-b border-white/10 pb-1">Customer Experience (4 metrics)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('csat', m.csat)}`}>
                      {getMetricHeader('csat', 'CSAT')}
                      {getMetricValueText('csat', m.csat)}
                      {renderThreeBandSlider('csat', m.csat, isComplexClaim)}
                    </div>
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('ces', m.ces)}`}>
                      {getMetricHeader('ces', 'CES')}
                      {getMetricValueText('ces', m.ces)}
                      {renderThreeBandSlider('ces', m.ces, isComplexClaim)}
                    </div>
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('dropoff_pct', m.dropoff_pct)}`}>
                      {getMetricHeader('dropoff_pct', 'Dropoff')}
                      {getMetricValueText('dropoff_pct', m.dropoff_pct)}
                      {renderThreeBandSlider('dropoff_pct', m.dropoff_pct, isComplexClaim)}
                    </div>
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('tickets', m.tickets_volume)}`}>
                      {getMetricHeader('tickets', 'Support Tickets')}
                      <span className="text-body-md font-bold text-on-surface mt-1">
                        {m.tickets_volume?.actual !== undefined ? `${m.tickets_volume.actual} tix` : '0'} / {m.tickets_tat_hours?.actual ? `${m.tickets_tat_hours.actual}h` : '0h'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-[#ff2d78] uppercase tracking-wider mb-2 border-b border-white/10 pb-1">Revenue & Commercial (4 metrics)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('cost_per_claim_vnd', m.cost_per_claim_vnd)}`}>
                      {getMetricHeader('cost_per_claim_vnd', 'Cost/Claim')}
                      {getMetricValueText('cost_per_claim_vnd', m.cost_per_claim_vnd)}
                    </div>
                    <div className="bg-[#050514]/40 border border-white/10 rounded p-2.5 flex flex-col justify-between">
                      {getMetricHeader('cross_sell_eligible', 'Cross-sell')}
                      <span className="text-body-sm font-bold text-[#00e5ff] mt-1 truncate">
                        {m.cross_sell_eligible?.actual ? m.cross_sell_eligible.product : <span className="text-gray-500 font-normal italic">Disabled</span>}
                      </span>
                    </div>
                    <div className={`bg-[#050514]/40 border rounded p-2.5 flex flex-col justify-between ${getMetricClass('clv_update_pct', m.clv_update_pct)}`}>
                      {getMetricHeader('clv_update_pct', 'CLV Lift')}
                      <span className={`text-body-md font-bold mt-1 ${m.clv_update_pct?.actual < 0 ? 'text-[#ff2d78]' : 'text-[#00e5ff]'}`}>
                        {m.clv_update_pct?.actual !== null && m.clv_update_pct?.actual !== undefined ? `${m.clv_update_pct.actual > 0 ? '+' : ''}${m.clv_update_pct.actual}%` : '0%'}
                      </span>
                    </div>
                    <div className="bg-[#0f0f26] border border-[#b699ff]/30 rounded p-2.5 flex flex-col justify-between">
                      {getMetricHeader('reserve_vnd', 'IFRS 17 Reserve')}
                      <span className="text-body-md font-bold text-white mt-1">{formatVND(m.reserve_vnd?.actual)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              <div className="bg-[#0a0a1a]/60 backdrop-blur-xl border border-outline-variant rounded-xl flex flex-col h-[565px] overflow-hidden">
                <div className="p-3 border-b border-outline-variant bg-[#0a0a14] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#ff2d78] rounded-full animate-ping" />
                    <h4 className="font-bold text-white">Fired AI Anomalies ({filteredAnomalies.length})</h4>
                  </div>
                </div>
                
                <div className="flex gap-1.5 p-2 bg-[#05050f] border-b border-outline-variant/30 overflow-x-auto shrink-0 select-none">
                  {(['ALL', 'RED', 'AMBER', 'INFO'] as const).map(sev => (
                    <button
                      key={sev}
                      onClick={() => setSeverityFilter(sev)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                        severityFilter === sev
                          ? sev === 'RED'
                            ? 'bg-[#ff2d78] text-white shadow-[0_0_8px_rgba(255,45,120,0.4)]'
                            : sev === 'AMBER'
                            ? 'bg-[#ffaa00] text-black shadow-[0_0_8px_rgba(255,170,0,0.4)]'
                            : sev === 'INFO'
                            ? 'bg-[#00e5ff] text-black shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                            : 'bg-white text-black shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                  {!aiLayerEnabled ? (
                    <div className="text-center py-8 text-gray-500">AI OVERRIDES OFFLINE. Fallback mode active.</div>
                  ) : filteredAnomalies.length === 0 ? (
                    <div className="text-center py-8 text-[#00e5ff]">NO MATCHING ANOMALIES.</div>
                  ) : filteredAnomalies.map((a, i) => (
                    <div key={i} className={`bg-[#0f0f26] border rounded p-2.5 flex flex-col gap-1.5 border-l-[3px] ${
                      a.level === 'RED' ? 'border-l-[#ff2d78] border-[#ff2d78]/30 bg-[#ff2d78]/5' : a.level === 'INFO' ? 'border-l-[#00e5ff] border-[#00e5ff]/30 bg-[#00e5ff]/5' : 'border-l-[#ffaa00] border-[#ffaa00]/30 bg-[#ffaa00]/5'
                    }`}>
                      {a.level === 'RED' && (
                        <div className="bg-[#ff2d78]/15 border border-[#ff2d78]/30 rounded p-1 text-[8px] text-[#ff2d78] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">gavel</span>
                          <span>Advisory Only — Manual Review Required (No Auto-Denial)</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[#b699ff] font-bold uppercase">{a.metric}</span>
                        <span className="bg-white/5 border border-white/10 px-1 rounded font-bold font-mono">{getConfidence(a)}% Conf</span>
                      </div>
                      <h5 className="font-bold text-white flex items-center gap-1.5">
                        <span className={`material-symbols-outlined text-sm ${a.level === 'RED' ? 'text-[#ff2d78]' : a.level === 'INFO' ? 'text-[#00e5ff]' : 'text-[#ffaa00]'}`}>
                          {a.level === 'RED' ? 'error' : a.level === 'INFO' ? 'info' : 'warning'}
                        </span>
                        {a.title}
                      </h5>
                      {a.composite && (
                        <div className="text-[9px] text-[#ffaa00] font-semibold border border-[#ffaa00]/20 bg-[#ffaa00]/10 px-1.5 py-0.5 rounded mt-0.5">
                          Composite Alert (Correlated: {a.correlated_metrics?.join(', ')})
                        </div>
                      )}
                      <p className="text-[11px] text-gray-400"><strong className="text-gray-300">Cause:</strong> {a.root_cause}</p>
                      
                      <div className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] my-1 flex justify-between items-center font-mono">
                        <span>Actual: <strong className="text-white">{getMetricDisplayValue(a.metric, claimDetail)}</strong></span>
                        <span>Target: <span className="text-gray-400">{getMetricTargetValue(a.metric, claimDetail)}</span></span>
                      </div>

                      <p className="text-[11px] text-[#00e5ff]"><strong className="text-gray-300">Rec:</strong> {a.recommendation}</p>
                      {a.regulatory_note && <p className="text-[10px] text-[#ffaa00] font-semibold leading-tight mt-1 border-t border-[#ffaa00]/20 pt-1">⚠️ SBV compliance: {a.regulatory_note}</p>}
                      {a.manual_intervention_context && (
                        <div className="mt-1 bg-[#ffaa00]/5 border border-[#ffaa00]/20 p-1.5 rounded text-[10px] text-gray-400 font-mono">
                          <strong>Manual Context:</strong> {(a.manual_intervention_context.actual * 100).toFixed(0)}% vs target {(a.manual_intervention_context.target * 100).toFixed(0)}% ({a.manual_intervention_context.note})
                        </div>
                      )}
                      <div className="text-[9px] font-mono text-gray-500 mt-1 flex justify-between items-center">
                        <span>Cites: {a.source_claims?.join(', ')}</span>
                        <span className="bg-[#ff2d78]/10 text-[#ff2d78] px-1.5 py-0.5 rounded font-bold text-[8px] uppercase tracking-wider scale-95 origin-right">AI insight — review before action</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {claimDetail?.fraud_flags?.length > 0 && (
          <div className="bg-[#ffaa00]/5 border border-[#ffaa00]/30 rounded-xl p-4 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-[#ffaa00] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span> Active Fraud Red Flags ({claimDetail.fraud_flags.length})
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {claimDetail.fraud_flags.map((f: string, i: number) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}

        {!loading && claimDetail?.highlights_and_actions && (
          <div className="bg-[#0a0a1a]/80 border border-[#b699ff]/30 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-sm font-bold text-[#b699ff] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">assignment_turned_in</span>
                Highlights & Recommended Actions
              </h4>
              <span className="text-[9px] font-mono text-gray-500">SCENARIO: {claimDetail.claim_id}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-gray-400">Key Highlights</span>
                <ul className="list-none space-y-1.5">
                  {claimDetail.highlights_and_actions.key_highlights?.map((hl: string, idx: number) => (
                    <li key={idx} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                      <span className="text-[#b699ff] mt-0.5">•</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-gray-400">Follow-up Actions</span>
                <div className="flex flex-col gap-2">
                  {claimDetail.highlights_and_actions.follow_up_actions?.map((act: any, idx: number) => (
                    <div key={idx} className="bg-[#0f0f26] border border-white/5 rounded p-2 flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-medium text-white">{act.action}</span>
                        <div className="flex gap-2 text-[9px] text-gray-500 font-mono">
                          <span>OWNER: {act.owner}</span>
                          <span>DUE: {act.due}</span>
                        </div>
                      </div>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        act.impact === 'HIGH' 
                          ? 'bg-[#ff2d78]/10 text-[#ff2d78] border border-[#ff2d78]/20' 
                          : act.impact === 'MEDIUM'
                          ? 'bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {act.impact || 'LOW'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div 
        className={`transition-all duration-300 border border-outline-variant bg-[#0a0a1a]/90 backdrop-blur-xl rounded-xl flex flex-col h-[565px] overflow-hidden shrink-0 relative ${
          nlpOpen ? 'w-[320px]' : 'w-[48px]'
        }`}
      >
        {nlpOpen ? (
          <>
            <div className="p-3 border-b border-outline-variant bg-[#0a0a14] flex justify-between items-center">
              <span className="font-bold text-white flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">psychology</span> AI Advisor</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-[#00e5ff] font-mono">Limit: {queryCount}/5</span>
                <button 
                  onClick={() => setNlpOpen(false)}
                  className="text-gray-500 hover:text-white p-0.5 rounded hover:bg-white/5"
                  title="Collapse Drawer"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-3 flex flex-col gap-2 bg-[#05050a]/40">
              {showResetBanner && (
                <div className="bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] p-2 rounded text-[10px] font-mono mb-2 animate-fade-in flex items-center gap-1.5 shrink-0 select-none">
                  <span className="material-symbols-outlined text-sm">cached</span>
                  <span>SCENARIO_SWITCHED: Chat session reset</span>
                </div>
              )}

              {chatHistory.map((c, i) => (
                <div key={i} className={`rounded p-2 max-w-[90%] leading-relaxed ${c.sender === 'user' ? 'self-end bg-[#00e5ff]/10 text-white border border-[#00e5ff]/20' : 'self-start bg-[#ff2d78]/5 text-gray-300 border border-[#ff2d78]/10'}`}>
                  {c.text}
                  {c.confidence !== undefined && (
                    <div className="mt-1.5 pt-1 border-t border-white/5 flex justify-between items-center text-[9px] text-gray-500 font-mono">
                      <span>Conf: {c.confidence}%</span>
                      <span>Citations: {c.citations?.join(', ')}</span>
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && <div className="text-[#ff2d78] animate-pulse font-mono">DEEPSEEK COMPILING ANSWER...</div>}
              <div ref={chatBottomRef} />
            </div>
            
            <div className="p-2 border-t border-outline-variant bg-[#0a0a14] flex items-center gap-2">
              <input type="text" value={chatInput} disabled={chatLoading} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat()} placeholder="Ask AI Advisor..." className="flex-1 bg-[#05050f] border border-outline-variant rounded px-2.5 py-1.5 text-xs text-white" />
              <button onClick={handleSendChat} disabled={chatLoading || !chatInput.trim()} className="bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40 px-3 py-1.5 rounded font-bold hover:bg-[#00e5ff] hover:text-black transition-colors">SEND</button>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-between py-3">
            <button 
              onClick={() => setNlpOpen(true)}
              className="p-1 hover:bg-[#00e5ff]/10 text-gray-400 hover:text-[#00e5ff] rounded"
              title="Expand AI Advisor Drawer"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <div 
              className="flex-1 flex flex-col items-center justify-center gap-6 py-6 text-gray-500 font-mono select-none"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              <span className="material-symbols-outlined text-xl text-[#00e5ff] animate-pulse my-2" style={{ writingMode: 'horizontal-tb' }}>psychology</span>
              <span className="text-[10px] uppercase tracking-widest text-[#00e5ff]/60 font-bold">AI ADVISOR</span>
            </div>
            <div className="h-4" />
          </div>
        )}
      </div>

      {tooltipMetric && ASSUMPTIONS[tooltipMetric] && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a1a] border border-[#00e5ff]/40 rounded-xl p-5 max-w-md w-full shadow-[0_0_20px_rgba(0,229,255,0.2)] flex flex-col gap-4">
            <div className="flex justify-between items-start border-b border-white/10 pb-2">
              <div>
                <span className="text-[10px] bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Row: {ASSUMPTIONS[tooltipMetric].row}</span>
                <h4 className="text-sm font-bold text-white mt-1">Assumption Citation Details</h4>
              </div>
              <button onClick={() => setTooltipMetric(null)} className="text-gray-500 hover:text-white font-bold text-base">&times;</button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Source System / Benchmark</span>
                <p className="text-xs font-bold text-[#b699ff] mt-0.5">{ASSUMPTIONS[tooltipMetric].source}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Rule / Expected Value</span>
                <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{ASSUMPTIONS[tooltipMetric].value}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Study / Reference Document</span>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{ASSUMPTIONS[tooltipMetric].ref}</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[10px] text-gray-500">
              <span>Appendix: assumptions_appendix.md</span>
              <button onClick={() => setTooltipMetric(null)} className="bg-white/5 border border-white/10 px-3 py-1 rounded hover:bg-white hover:text-black font-bold transition-all">CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
