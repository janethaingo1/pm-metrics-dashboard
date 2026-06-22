import React, { useState } from 'react';

const ASSUMPTIONS: Record<string, { row: string; source: string; value: string; ref: string }> = {
  tat_days: { row: 'O1/O2', source: 'LIMRA Claims Benchmark 2024', value: 'Simple: <3d green, 3-5d amber, >5d red | Complex: <15d green, 15-30d amber, >30d red', ref: 'LIMRA Claims Benchmark 2024' },
  pct_manual_intervention: { row: 'O3', source: 'STP Target', value: '<25% green, >30% red (Inverse of STP target >70%)', ref: 'Industry Standard' },
  sla_compliance: { row: 'O4', source: 'Internal System', value: '>95% green, <90% red', ref: 'Standard SLA 2025' },
  fraud_score: { row: 'O5', source: 'Risk System + SBV', value: '>65% green (precision), <60% red', ref: 'SBV Circular 09/2020 Art.14' },
  exception_rate_pct: { row: 'O3', source: 'STP Target / LIMRA', value: '<5% target exception rate', ref: 'LIMRA Claims Benchmark 2024' },
  api_success_latency: { row: 'A1/C1', source: 'Bain NPS Prism + MoF', value: 'API Success >97% | Latency <200ms', ref: 'Bain NPS Prism 2025 / Vietnam MoF Circular 50/2024' },
  csat: { row: 'X1', source: 'Forrester CX Index 2025', value: '>4.2 green, <4.0 red', ref: 'Forrester CX Index, Insurance 2025' },
  ces: { row: 'X2', source: 'Forrester CX Index 2025', value: '>4.0 green, <3.6 red', ref: 'Forrester CES, Insurance 2025' },
  dropoff_pct: { row: 'X3', source: 'UX Best Practice', value: '<10% green, >25% red', ref: 'Nielsen Norman Group, Form Usability 2024' },
  tickets: { row: 'O4', source: 'Internal System', value: 'Ticket TAT target <4h', ref: 'Standard SLA 2025' },
  cost_per_claim_vnd: { row: 'C1', source: 'Vietnam MoF + LIMRA 2024', value: 'Avg 1.2M VND simple, 2.8M VND complex', ref: 'Ministry of Finance Vietnam Circular 50/2024' },
  cross_sell_eligible: { row: 'R1', source: 'Bain APAC Insurance 2025', value: '>1.5 green, <1.2 red ratio', ref: 'Bain & Company, APAC Insurance Distribution 2025' },
  clv_update_pct: { row: 'C3/R2', source: 'TW + Bain 2025', value: 'Avg CLV 15M VND per premium customer (8yr horizon) | ±15% per claim', ref: 'Towers Watson + Bain CLV Model' },
  reserve_vnd: { row: 'IFRS17', source: 'IFRS 17 Standards', value: 'Contractual service margin (CSM) mapping', ref: 'IFRS 17 Insurance Contracts' },
  adoption_nps: { row: 'A1', source: 'Bain NPS Prism 2025', value: 'VN life insurance avg NPS +38 | claims segment target +35', ref: 'Bain & Company, NPS Prism Insurance Report 2025' }
};

interface LogRow {
  status: 'PROC' | 'FAIL' | 'ANOM' | 'WAIT';
  id: string;
  policy: string;
  timestamp: string;
  cause: string;
  value: string;
  errorDetail?: string;
}

export const LiveMonitorDashboard: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('CLM-LIFE-2026-001999');
  const [tooltipMetric, setTooltipMetric] = useState<string | null>(null);

  const logs: LogRow[] = [
    {
      status: 'PROC',
      id: 'CLM-LIFE-2026-001500',
      policy: 'POL-2018-TL-449',
      timestamp: '2026-06-17T17:15:00Z',
      cause: 'Natural death',
      value: '800,000,000 VND',
    },
    {
      status: 'ANOM',
      id: 'CLM-LIFE-2026-001847',
      policy: 'POL-2021-CI-887',
      timestamp: '2026-06-17T17:22:15Z',
      cause: 'Critical illness (cancer)',
      value: '500,000,000 VND',
    },
    {
      status: 'FAIL',
      id: 'CLM-LIFE-2026-001999',
      policy: 'POL-2026-TL-232',
      timestamp: '2026-06-17T17:24:30Z',
      cause: 'Accidental death',
      value: '1,200,000,000 VND',
      errorDetail: '> Exception: PII Anonymization rule violated (Circular 09).\n> diacritics detected in policyholder name: "Nguyễn Văn A".\n> Expected: initials only (e.g. Mr. N.V.A.) to comply with mock-only pilot guardrails.',
    },
    {
      status: 'PROC',
      id: 'CLM-LIFE-2026-001923',
      policy: 'POL-2026-TL-991',
      timestamp: '2026-06-17T17:25:00Z',
      cause: 'Vehicle collision',
      value: '2,000,000,000 VND',
    },
    {
      status: 'ANOM',
      id: 'CLM-LIFE-2026-001755',
      policy: 'POL-2015-CI-223',
      timestamp: '2026-06-17T17:28:10Z',
      cause: 'Heart disease',
      value: '1,500,000,000 VND',
    },
    {
      status: 'WAIT',
      id: 'CLM-LIFE-2026-002011',
      policy: 'POL-2019-TL-401',
      timestamp: '2026-06-17T17:28:45Z',
      cause: 'Natural death',
      value: '600,000,000 VND',
    },
  ];

  const handleRowClick = (id: string, errorDetail?: string) => {
    if (!errorDetail) return;
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-gridGutter">
      {/* Top Horizontal KPI Ribbon */}
      <div className="flex gap-componentGap overflow-x-auto pb-3 snap-x scrollbar-thin">
        {/* KPI 1 */}
        <div className="min-w-[170px] bg-[#0a0a1a]/80 border border-outline-variant rounded p-3 flex flex-col snap-start hover:border-[#00e5ff] transition-colors">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-terminal">Open Claims</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-lg font-bold text-white glow-text-blue font-terminal">47</span>
            <span className="bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 text-[9px] font-semibold px-1 rounded flex items-center gap-0.5 font-terminal">
              <span className="material-symbols-outlined text-[10px]">arrow_downward</span> 2.4%
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="min-w-[170px] bg-[#0a0a1a]/80 border border-outline-variant rounded p-3 flex flex-col snap-start hover:border-[#00e5ff] transition-colors group relative">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-terminal flex items-center gap-1">
            Avg Settlement
            <span onClick={() => setTooltipMetric('tat_days')} className="text-[10px] text-[#00e5ff] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-mono select-none">[ⓘ]</span>
          </span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-lg font-bold text-white glow-text-blue font-terminal">2.4d</span>
            <span className="bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 text-[9px] font-semibold px-1 rounded flex items-center gap-0.5 font-terminal">
              <span className="material-symbols-outlined text-[10px]">arrow_downward</span> 0.3d
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="min-w-[170px] bg-[#0a0a1a]/80 border border-[#ff2d78]/50 rounded p-3 flex flex-col snap-start relative overflow-hidden glow-border-pink">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff2d78] pulse-error" />
          <span className="text-[10px] text-[#ff2d78] uppercase tracking-wider font-terminal font-bold">Active Anomalies</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-lg font-bold text-[#ff2d78] glow-text-pink font-terminal">12</span>
            <span className="bg-[#ff2d78]/10 text-[#ff2d78] border border-[#ff2d78]/30 text-[9px] font-semibold px-1 rounded flex items-center gap-0.5 font-terminal">
              <span className="material-symbols-outlined text-[10px]">arrow_upward</span> +3
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="min-w-[170px] bg-[#0a0a1a]/80 border border-outline-variant rounded p-3 flex flex-col snap-start hover:border-[#00e5ff] transition-colors">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-terminal">Sum At Risk</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-lg font-bold text-white glow-text-blue font-terminal">4.8B VND</span>
            <span className="bg-outline-variant/20 text-gray-400 border border-outline-variant/50 text-[9px] font-semibold px-1 rounded flex items-center gap-0.5 font-terminal">
              <span className="material-symbols-outlined text-[10px]">horizontal_rule</span> 0%
            </span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="min-w-[170px] bg-[#0a0a1a]/80 border border-outline-variant rounded p-3 flex flex-col snap-start hover:border-[#00e5ff] transition-colors group relative">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-terminal flex items-center gap-1">
            STP / Auto-Adjud.
            <span onClick={() => setTooltipMetric('pct_manual_intervention')} className="text-[10px] text-[#00e5ff] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-mono select-none">[ⓘ]</span>
          </span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-lg font-bold text-white glow-text-blue font-terminal">42%</span>
            <span className="bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 text-[9px] font-semibold px-1 rounded flex items-center gap-0.5 font-terminal">
              <span className="material-symbols-outlined text-[10px]">arrow_upward</span> 4%
            </span>
          </div>
        </div>

        {/* KPI 6 */}
        <div className="min-w-[170px] bg-[#0a0a1a]/80 border border-outline-variant rounded p-3 flex flex-col snap-start hover:border-[#00e5ff] transition-colors group relative">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-terminal flex items-center gap-1">
            Data Quality Errors
            <span onClick={() => setTooltipMetric('fraud_score')} className="text-[10px] text-[#00e5ff] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-mono select-none">[ⓘ]</span>
          </span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-lg font-bold text-white glow-text-blue font-terminal">1</span>
            <span className="bg-[#ff2d78]/10 text-[#ff2d78] border border-[#ff2d78]/30 text-[9px] font-semibold px-1 rounded flex items-center gap-0.5 font-terminal">
              <span className="material-symbols-outlined text-[10px]">arrow_upward</span> +1
            </span>
          </div>
        </div>
      </div>

      {/* Main Stream Grid */}
      <div className="grid grid-cols-12 gap-gridGutter items-start">
        {/* Log Table (Col Span 9) */}
        <div className="col-span-12 xl:col-span-9 bg-[#050a14] border border-[#00e5ff]/30 rounded flex flex-col overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.05)]">
          <div className="flex items-center justify-between p-inlinePadding border-b border-[#00e5ff]/30 bg-[#10232e]/50">
            <h3 className="text-label-sm font-bold text-[#00e5ff] uppercase tracking-widest font-terminal flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              DATA_STREAM :: CLAIM_JOURNEYS
            </h3>
            <span className="text-[10px] text-[#00e5ff] font-terminal animate-pulse">STREAMING // SECURE_MODE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-terminal text-xs">
              <thead className="bg-[#0a0a1a] border-b border-[#00e5ff]/30">
                <tr>
                  <th className="p-tableCellPadding text-[9px] text-[#00e5ff]/70 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="p-tableCellPadding text-[9px] text-[#00e5ff]/70 uppercase tracking-widest whitespace-nowrap">ID</th>
                  <th className="p-tableCellPadding text-[9px] text-[#00e5ff]/70 uppercase tracking-widest whitespace-nowrap">Policy</th>
                  <th className="p-tableCellPadding text-[9px] text-[#00e5ff]/70 uppercase tracking-widest whitespace-nowrap">Timestamp</th>
                  <th className="p-tableCellPadding text-[9px] text-[#00e5ff]/70 uppercase tracking-widest whitespace-nowrap">Cause</th>
                  <th className="p-tableCellPadding text-[9px] text-[#00e5ff]/70 uppercase tracking-widest whitespace-nowrap">Value</th>
                  <th className="p-tableCellPadding text-[9px] text-[#00e5ff]/70 uppercase tracking-widest whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 divide-y divide-[#1e293b]/30">
                {logs.map((log) => {
                  const isFail = log.status === 'FAIL';
                  const isAnom = log.status === 'ANOM';
                  const isExpanded = expandedId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr 
                        onClick={() => handleRowClick(log.id, log.errorDetail)}
                        className={`transition-colors cursor-pointer ${
                          isFail ? 'bg-[#ff2d78]/5 hover:bg-[#ff2d78]/10 border-l-2 border-l-[#ff2d78]' 
                          : isAnom ? 'bg-[#ffaa00]/5 hover:bg-[#ffaa00]/10 border-l-2 border-l-[#ffaa00]' 
                          : 'hover:bg-[#00e5ff]/5'
                        }`}
                      >
                        <td className="p-tableCellPadding">
                          <div className="flex items-center gap-1.5 font-bold">
                            <div className={`w-2 h-2 rounded-full ${
                              isFail ? 'bg-[#ff2d78] pulse-error shadow-[0_0_8px_#ff2d78]' 
                              : isAnom ? 'bg-[#ffaa00] pulse-dot shadow-[0_0_8px_#ffaa00]'
                              : log.status === 'PROC' ? 'bg-[#39ff14] shadow-[0_0_5px_#39ff14]'
                              : 'bg-gray-500'
                            }`} />
                            <span className={isFail ? 'text-[#ff2d78]' : isAnom ? 'text-[#ffaa00]' : log.status === 'PROC' ? 'text-[#39ff14]' : 'text-gray-500'}>
                              {log.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-tableCellPadding font-semibold">{log.id}</td>
                        <td className="p-tableCellPadding text-gray-400">{log.policy}</td>
                        <td className="p-tableCellPadding text-[10px] text-gray-500 font-mono">{log.timestamp}</td>
                        <td className="p-tableCellPadding">{log.cause}</td>
                        <td className="p-tableCellPadding text-[#39ff14] font-semibold">{log.value}</td>
                        <td className="p-tableCellPadding">
                          {log.errorDetail && (
                            <button className={`text-xs px-2 py-0.5 rounded border border-transparent font-bold ${isFail ? 'bg-[#ff2d78]/20 text-[#ff2d78] hover:border-[#ff2d78]' : 'bg-[#ffaa00]/20 text-[#ffaa00] hover:border-[#ffaa00]'}`}>
                              {isExpanded ? 'CLOSE' : 'DEBUG'}
                            </button>
                          )}
                        </td>
                      </tr>
                      {isExpanded && log.errorDetail && (
                        <tr className="bg-[#1a0a14] border-l-2 border-l-[#ff2d78]">
                          <td className="p-0 border-t-0" colSpan={7}>
                            <pre className="px-inlinePadding py-3 text-[11px] text-[#ff2d78] font-terminal whitespace-pre-wrap leading-relaxed select-text">
                              {log.errorDetail}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Alerts Column (Col Span 3) */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-componentGap">
          <div className="bg-[#0a0a1a]/80 border border-outline-variant rounded p-4 shadow-[0_0_15px_rgba(255,45,120,0.05)]">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3 flex items-center gap-2 font-terminal">
              <span className="material-symbols-outlined text-[16px] text-primary">psychology</span>
              SYSTEM_MONITOR :: EVENTS
            </h3>
            
            <div className="flex flex-col gap-3">
              {/* Event 1 */}
              <div className="bg-[#050514] border border-[#ffaa00]/30 rounded p-3 flex flex-col gap-1.5 group relative">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-[#ffaa00] font-mono font-bold uppercase">&gt; THRESHOLD_WARN</span>
                  <span onClick={() => setTooltipMetric('pct_manual_intervention')} className="text-[10px] text-gray-500 hover:text-[#00e5ff] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-mono select-none">[ⓘ]</span>
                </div>
                <p className="text-xs text-white leading-snug">
                  Manual intervention rate is <strong className="text-[#ff2d78]">38%</strong> on Critical Illness rider claims (target &lt;30%).
                </p>
                <span className="text-[9px] text-gray-500 font-mono mt-1">Ref: CLM-LIFE-2026-001847</span>
              </div>

              {/* Event 2 */}
              <div className="bg-[#050514] border border-[#ff2d78]/30 rounded p-3 flex flex-col gap-1.5 group relative">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-[#ff2d78] font-mono font-bold uppercase">&gt; CRITICAL_SLA</span>
                  <span onClick={() => setTooltipMetric('tat_days')} className="text-[10px] text-gray-500 hover:text-[#00e5ff] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-mono select-none">[ⓘ]</span>
                </div>
                <p className="text-xs text-white leading-snug">
                  Mrs. P.T.H. claim (CLM-LIFE-2026-001755) exceeded <strong className="text-[#ff2d78]">32d</strong> duration without settlement.
                </p>
                <span className="text-[9px] text-gray-500 font-mono mt-1">Ref: CLM-LIFE-2026-001755</span>
              </div>

              {/* Event 3 */}
              <div className="bg-[#050514] border border-white/5 rounded p-3 flex flex-col gap-1.5 opacity-60">
                <span className="text-[9px] text-gray-400 font-mono uppercase">&gt; INFO_STP</span>
                <p className="text-xs text-gray-300 leading-snug">
                  Mr. T.V.B. claim (CLM-LIFE-2026-001500) successfully auto-adjudicated in 1.8d.
                </p>
                <span className="text-[9px] text-gray-600 font-mono mt-1">Ref: CLM-LIFE-2026-001500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip Assumptions Appendix Modal */}
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
