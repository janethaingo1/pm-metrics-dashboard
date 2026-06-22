import { useState, useEffect } from 'react';
import './App.css';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { OperationsDashboard } from './components/OperationsDashboard';
import { LiveMonitorDashboard } from './components/LiveMonitorDashboard';
import { GovernanceDashboard } from './components/GovernanceDashboard';

function App() {
  const [currentTab, setCurrentTab] = useState<'overview' | 'deepdive' | 'live' | 'governance'>('overview');
  const [aiLayerEnabled, setAiLayerEnabled] = useState(true);
  const [claims, setClaims] = useState<any[]>([]);
  const [selectedClaimId, setSelectedClaimId] = useState('');
  const [periodData, setPeriodData] = useState<any>({ platform_metrics: {}, period_context: {} });
  const [loading, setLoading] = useState(true);
  const [killSwitchLoading, setKillSwitchLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const [apiOnline, setApiOnline] = useState(true);
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('');

  // Initial Data Fetching
  useEffect(() => {
    const initFetch = async () => {
      try {
        // Fetch health for AI state
        const healthRes = await fetch('https://pm-metrics-ai-api.vercel.app/api/health');
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setAiLayerEnabled(healthData.ai_layer_enabled);
          setApiOnline(true);
        } else {
          setApiOnline(false);
        }

        // Fetch claims
        const claimsRes = await fetch('https://pm-metrics-ai-api.vercel.app/api/claims');
        const claimsData = await claimsRes.json();
        const claimsList = claimsData.claims || [];
        setClaims(claimsList);
        if (claimsList.length > 0) {
          setSelectedClaimId(claimsList[0].claim_id);
        }

        // Fetch period & platform metrics
        const periodRes = await fetch('https://pm-metrics-ai-api.vercel.app/api/period');
        const periodDataJson = await periodRes.json();
        setPeriodData(periodDataJson);
      } catch (err) {
        console.error('Error initializing data:', err);
        setApiOnline(false);
      } finally {
        setLoading(false);
        setLastCheckedTime(new Date().toLocaleTimeString());
      }
    };

    initFetch();
  }, []);

  // 10s Health Polling Interval
  useEffect(() => {
    const pollHealth = async () => {
      try {
        const res = await fetch('https://pm-metrics-ai-api.vercel.app/api/health');
        if (res.ok) {
          const data = await res.json();
          setApiOnline(true);
          setAiLayerEnabled(data.ai_layer_enabled);
        } else {
          setApiOnline(false);
        }
      } catch (err) {
        setApiOnline(false);
      } finally {
        setLastCheckedTime(new Date().toLocaleTimeString());
      }
    };

    const interval = setInterval(pollHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleKillSwitch = async (targetState?: boolean) => {
    setKillSwitchLoading(true);
    const nextState = targetState !== undefined ? targetState : !aiLayerEnabled;

    try {
      const res = await fetch('https://pm-metrics-ai-api.vercel.app/api/killswitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState }),
      });
      const data = await res.json();
      setAiLayerEnabled(data.ai_layer_enabled);
    } catch (err) {
      console.error('Error toggling AI layer kill switch:', err);
    } finally {
      setKillSwitchLoading(false);
    }
  };

  useEffect(() => {
    // Run Lucide icon creation after render/tab changes
    const timer = setTimeout(() => {
      if ((window as any).lucide) {
        (window as any).lucide.createIcons();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [currentTab, aiLayerEnabled, loading]);

  const activeClaim = claims.find((c) => c.claim_id === selectedClaimId);

  return (
    <div className="h-screen w-screen overflow-hidden flex font-sans antialiased bg-[var(--bg)] text-[var(--text-body)]" data-theme={theme}>
      {/* SideNavBar (Shared) */}
      <aside className="w-64 shrink-0 flex flex-col bg-[var(--surface)] border-r border-[var(--line)] z-40">
        {/* Header with SVG Logo */}
        <div className="p-4 border-b border-[var(--line-soft)] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 252 48" className="h-9 w-auto text-[var(--ink)]" fill="currentColor">
            <rect width="48" height="48" rx="11" fill="var(--blue)"></rect>
            <g fill="#ffffff">
              <rect x="12" y="26" width="5.4" height="10" rx="1.6"></rect>
              <rect x="21.3" y="20.5" width="5.4" height="15.5" rx="1.6"></rect>
              <rect x="30.6" y="13.5" width="5.4" height="22.5" rx="1.6"></rect>
            </g>
            <path d="M13 23 L24 18 L33 11.5" fill="none" stroke="var(--blue)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'brightness(1.5)' }}></path>
            <circle cx="33" cy="11.5" r="2.3" fill="#ffffff"></circle>
            <text x="62" y="20" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="800" letterSpacing="-0.2" fill="var(--ink)">PMMetricsAI</text>
            <text x="62" y="37" fontFamily="Inter, sans-serif" fontSize="11.5" fontWeight="600" fill="var(--muted)">Personal KPI Control</text>
          </svg>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
          {/* Executive Scorecard */}
          <div
            onClick={() => setCurrentTab('overview')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] font-semibold text-[13.5px] cursor-pointer transition-all ${
              currentTab === 'overview'
                ? 'bg-[var(--active-bg)] text-[var(--blue)]'
                : 'text-[var(--muted)] hover:bg-[var(--line-soft)] hover:text-[var(--ink)]'
            }`}
          >
            <i data-lucide="layout-dashboard" className="w-[18px] h-[18px]"></i>
            <span>Executive Scorecard</span>
          </div>

          {/* Strategic Ops */}
          <div
            onClick={() => setCurrentTab('deepdive')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] font-semibold text-[13.5px] cursor-pointer transition-all ${
              currentTab === 'deepdive'
                ? 'bg-[var(--active-bg)] text-[var(--blue)]'
                : 'text-[var(--muted)] hover:bg-[var(--line-soft)] hover:text-[var(--ink)]'
            }`}
          >
            <i data-lucide="git-compare-arrows" className="w-[18px] h-[18px]"></i>
            <span>Strategic Ops</span>
          </div>

          {/* Live Monitor */}
          <div
            onClick={() => setCurrentTab('live')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] font-semibold text-[13.5px] cursor-pointer transition-all ${
              currentTab === 'live'
                ? 'bg-[var(--active-bg)] text-[var(--blue)]'
                : 'text-[var(--muted)] hover:bg-[var(--line-soft)] hover:text-[var(--ink)]'
            }`}
          >
            <i data-lucide="radio" className="w-[18px] h-[18px]"></i>
            <span>Live Ops Monitor</span>
          </div>

          {/* Governance Log */}
          <div
            onClick={() => setCurrentTab('governance')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] font-semibold text-[13.5px] cursor-pointer transition-all ${
              currentTab === 'governance'
                ? 'bg-[var(--active-bg)] text-[var(--blue)]'
                : 'text-[var(--muted)] hover:bg-[var(--line-soft)] hover:text-[var(--ink)]'
            }`}
          >
            <i data-lucide="shield-check" className="w-[18px] h-[18px]"></i>
            <span>Governance Log</span>
          </div>
        </nav>

        {/* AI Layer Toggle Box */}
        <div className="p-3 border-t border-[var(--line-soft)]">
          <div className="bg-[var(--surface-alt)] border border-[var(--line)] rounded-[var(--radius)] p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-[var(--muted)] uppercase inline-flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${aiLayerEnabled ? 'bg-[var(--green)]' : 'bg-[var(--muted)]'}`}></span>
                AI Layer
              </span>
              <button
                disabled={killSwitchLoading}
                onClick={() => handleToggleKillSwitch()}
                aria-label="Toggle AI layer"
                style={{
                  width: '38px',
                  height: '22px',
                  borderRadius: '11px',
                  background: aiLayerEnabled ? 'var(--green)' : 'var(--muted)',
                  position: 'relative',
                  cursor: 'pointer',
                  border: 'none',
                  flexShrink: 0,
                  transition: 'background 0.2s'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: aiLayerEnabled ? '18px' : '2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 1px 2px rgba(0,0,0,.2)',
                    transition: 'left 0.2s'
                  }}
                ></span>
              </button>
            </div>
            <div className="text-[10px] text-[var(--muted)] leading-normal">
              Advisory-only · human-in-the-loop. Kill switch disables all AI suggestions in &lt;2s.
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[var(--line-soft)] font-mono text-[9px] text-[var(--muted)] flex flex-col gap-0.5">
          <div>VERSION: v1.2.0 (UAT_REDESIGN)</div>
          <div className="flex items-center gap-1">
            <span>API_STATUS:</span>
            <span className={apiOnline ? 'text-[var(--green)] font-bold' : 'text-[var(--red)] font-bold animate-pulse'}>
              {apiOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopAppBar */}
        <header className="h-[60px] flex justify-between items-center px-6 bg-[var(--surface)] border-b border-[var(--line)] shrink-0">
          <div>
            <h1 className="text-[18px] font-extrabold text-[var(--ink)] leading-none">
              {currentTab === 'overview' && 'Executive Scorecard'}
              {currentTab === 'deepdive' && 'Strategic Operations Hub'}
              {currentTab === 'live' && 'Operations Monitoring Hub'}
              {currentTab === 'governance' && 'Governance Audit Center'}
            </h1>
            <div className="text-[11.5px] text-[var(--muted)] font-medium mt-1">
              {currentTab === 'overview' && `Week 24 · 16–22 Jun 2026 · ${periodData.period_context?.total_claims_this_week || 47} claims processed`}
              {currentTab === 'deepdive' && `Strategic Deep Dive into Claim Rules and Exceptions — Active initials: ${activeClaim?.policyholder?.initials || 'None'}`}
              {currentTab === 'live' && 'Real-time Claims Ingestion & Triage Queue Stream'}
              {currentTab === 'governance' && 'Compliance Guardrails, Admin Actions, and Audit Trail Logs'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-alt)] hover:bg-[var(--line-soft)] text-[var(--muted)] hover:text-[var(--ink)] transition-all flex items-center justify-center"
              title="Toggle Light/Dark Mode"
            >
              <span className="material-symbols-outlined text-[18px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* API Status & AI Status indicator */}
            <div className="flex items-center gap-2 bg-[var(--surface-alt)] border border-[var(--line)] px-3 py-1.5 rounded-full relative group">
              <div 
                className={`w-2 h-2 rounded-full ${
                  apiOnline ? 'bg-[var(--green)]' : 'bg-[var(--red)]'
                } transition-all duration-300`}
                title={`API Status: ${apiOnline ? 'ONLINE' : 'OFFLINE'} (Last checked: ${lastCheckedTime || 'never'})`}
              />
              <span className={`text-[10px] font-mono font-bold tracking-wider text-[var(--ink)]`}>
                AI_LAYER: {aiLayerEnabled ? 'ACTIVE' : 'OFFLINE'}
              </span>
            </div>

            {/* Action buttons (Overview tab shows Status label) */}
            {currentTab === 'overview' && (
              <span className="text-[11.5px] font-bold px-3 py-1.5 rounded-md bg-[var(--info-bg)] text-[var(--blue)] border border-[var(--neutral-border)]">
                AI Advisory
              </span>
            )}

            {/* Global Kill Switch Button */}
            <button
              onClick={() => handleToggleKillSwitch()}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                aiLayerEnabled
                  ? 'bg-[var(--risk-bg)] text-[var(--red)] border-[var(--line)] hover:bg-[var(--red)] hover:text-white'
                  : 'bg-[var(--good-bg)] text-[var(--green)] border-[var(--line)] hover:bg-[var(--green)] hover:text-white'
              }`}
            >
              <i data-lucide="power" className="w-3.5 h-3.5"></i>
              <span>{aiLayerEnabled ? 'Disable AI Layer' : 'Enable AI Layer'}</span>
            </button>
          </div>
        </header>

        {/* Scrollable View Canvas */}
        <main className="flex-grow p-6 overflow-y-auto bg-[var(--bg)]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-[var(--blue)] animate-spin">sync</span>
                <span className="text-sm font-mono text-[var(--blue)]">&gt; INITIALIZING_COMMAND_CENTER...</span>
              </div>
            </div>
          ) : (
            <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
              {currentTab === 'overview' && (
                <ExecutiveDashboard
                  platformMetrics={periodData.platform_metrics}
                  periodContext={periodData.period_context}
                  aiLayerEnabled={aiLayerEnabled}
                />
              )}
              {currentTab === 'deepdive' && (
                <OperationsDashboard
                  claims={claims}
                  selectedClaimId={selectedClaimId}
                  onSelectClaimId={setSelectedClaimId}
                  aiLayerEnabled={aiLayerEnabled}
                />
              )}
              {currentTab === 'live' && <LiveMonitorDashboard />}
              {currentTab === 'governance' && <GovernanceDashboard />}
            </div>
          )}
        </main>

        {/* Global Platform Metrics Strip at Bottom (Shared across Overview/Live) */}
        {currentTab !== 'deepdive' && currentTab !== 'governance' && !loading && (
          <footer className="h-10 bg-[var(--surface)] border-t border-[var(--line)] flex items-center px-4 overflow-x-auto select-none shrink-0 font-mono text-[9px] text-[var(--muted)] gap-5 whitespace-nowrap scrollbar-none">
            {/* Revenue */}
            <div className="flex items-center gap-3 border-r border-[var(--line)] pr-3">
              <span className="text-[var(--blue)] font-bold">REVENUE:</span>
              <span><strong>REV:</strong> $4.2M</span>
              <span><strong>GROWTH:</strong> 12%</span>
              <span><strong>ARPU:</strong> $1,250</span>
              <span><strong>NRR:</strong> 110%</span>
            </div>
            
            {/* CX */}
            <div className="flex items-center gap-3 border-r border-[var(--line)] pr-3">
              <span className="text-[var(--green)] font-bold">CX:</span>
              <span><strong>ADOPTION_NPS:</strong> {periodData.platform_metrics?.adoption_nps_claims_segment || 42}</span>
              <span><strong>RET_D30/90:</strong> {periodData.platform_metrics?.retention_d30_pct || 88}%/{periodData.platform_metrics?.retention_d90_pct || 82}%</span>
              <span><strong>PEAK:</strong> {periodData.platform_metrics?.user_peak_window || '10:00-12:00'}</span>
              <span><strong>SEGMENT:</strong> {periodData.platform_metrics?.user_segment_top ? 'Premium' : 'Standard'}</span>
            </div>
            
            {/* Ops */}
            <div className="flex items-center gap-3 border-r border-[var(--line)] pr-3">
              <span className="text-[var(--purple)] font-bold">OPS:</span>
              <span><strong>INCIDENTS:</strong> P1:0 | P2:2 | P3:7</span>
              <span><strong>MTTD/R:</strong> {periodData.platform_metrics?.mttd_minutes || 8}m / {periodData.platform_metrics?.mttr_minutes || 32}m</span>
              <span><strong>COMPLIANCE:</strong> {periodData.platform_metrics?.regulatory_compliance_score || 94}%</span>
              <span><strong>FRAUD_PREC:</strong> {periodData.period_context?.fraud_precision_this_month ? `${(periodData.period_context.fraud_precision_this_month * 100).toFixed(0)}%` : '68%'}</span>
            </div>
            
            {/* Project Health */}
            <div className="flex items-center gap-3">
              <span className="text-[var(--amber)] font-bold">HEALTH:</span>
              <span><strong>VELOCITY:</strong> {periodData.platform_metrics?.sprint_velocity_sp || 32} SP</span>
              <span><strong>DEPLOY:</strong> {periodData.platform_metrics?.dora_deploy_per_week || 4}/wk</span>
              <span><strong>CFR:</strong> {periodData.platform_metrics?.change_failure_rate_pct || 8}%</span>
              <span><strong>LEAD_TIME:</strong> {periodData.platform_metrics?.lead_time_hours || 12}h</span>
              <span><strong>ON_TIME:</strong> {periodData.platform_metrics?.project_on_time_pct || 94}%</span>
              <span><strong>QUALITY:</strong> 99%</span>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;
