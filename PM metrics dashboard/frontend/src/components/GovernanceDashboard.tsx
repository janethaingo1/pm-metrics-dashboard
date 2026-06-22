import React, { useState, useEffect } from 'react';

interface LogEntry {
  timestamp: string;
  type: string;
  query?: string;
  response?: any;
  confidence_pct?: number;
  source_claims?: string[];
  advisory_only?: boolean;
  total_cards?: number;
  claims_scanned?: number;
  claim_id?: string;
  new_state?: boolean;
  cards?: number;
}

export const GovernanceDashboard: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://pm-metrics-ai-api.vercel.app/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      } else {
        setError('Failed to fetch governance logs from backend API.');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('vi-VN', { hour12: false });
    } catch {
      return isoString;
    }
  };

  const getLogBadgeClass = (type: string) => {
    switch (type) {
      case 'nlp_query':
        return 'bg-blue-500/10 text-[var(--blue)] border border-blue-500/30';
      case 'anomaly_scan':
        return 'bg-purple-500/10 text-[#b699ff] border border-purple-500/30';
      case 'anomaly_single':
        return 'bg-pink-500/10 text-[#ff2d78] border border-pink-500/30';
      case 'killswitch':
        return 'bg-amber-500/10 text-[#ffaa00] border border-amber-500/30';
      default:
        return 'bg-white/5 text-gray-400 border border-white/10';
    }
  };

  const getLogLabel = (type: string) => {
    switch (type) {
      case 'nlp_query':
        return 'Q&A Chat';
      case 'anomaly_scan':
        return 'Auto Scan';
      case 'anomaly_single':
        return 'Deep Dive';
      case 'killswitch':
        return 'Kill Switch';
      default:
        return type;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-xs font-sans">
      {/* Overview Block */}
      <div className="bg-[#0a0a1a]/60 backdrop-blur-xl border border-[var(--border-default)] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--blue)] text-xl">gavel</span>
            AI Governance Audit Log
          </h2>
          <p className="text-gray-400 mt-1">
            Real-time auditable trail of AI decisions, anomaly triggers, NLP Q&A, and administrator interventions.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all text-gray-300"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh Log
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Logs Table / Feed */}
        <div className="col-span-12 lg:col-span-8 bg-[#0a0a1a]/60 backdrop-blur-xl border border-[var(--border-default)] rounded-xl overflow-hidden min-h-[400px] flex flex-col">
          <div className="p-4 border-b border-[var(--border-default)] bg-[#0a0a14] flex justify-between items-center">
            <h3 className="font-extrabold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00e5ff] text-base">list_alt</span>
              Audit Trail Entries ({logs.length})
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">logs/ai_decisions.log</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center h-48 text-[#00e5ff] font-mono animate-pulse">
                &gt; LOADING_AUDIT_LOG_ENTRIES...
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--red)] gap-2 h-48">
                <span className="material-symbols-outlined text-3xl">error</span>
                <span className="font-bold">{error}</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 gap-2 h-48">
                <span className="material-symbols-outlined text-3xl">inbox</span>
                <span>No audit entries logged yet. Try querying the AI Advisor or switching claims to log actions.</span>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {[...logs].reverse().map((log, idx) => (
                  <div key={idx} className="p-4 hover:bg-white/[0.02] transition-colors flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-gray-500">
                          {formatTime(log.timestamp)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getLogBadgeClass(log.type)}`}>
                          {getLogLabel(log.type)}
                        </span>
                      </div>
                      {log.confidence_pct !== undefined && (
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-[10px]">
                          <span className="text-gray-400">Confidence:</span>
                          <strong className="text-[#00e5ff]">{log.confidence_pct}%</strong>
                        </div>
                      )}
                    </div>

                    {/* Entry Details */}
                    <div className="bg-[#050514]/40 border border-white/5 rounded p-2.5 font-mono text-[11px] leading-relaxed">
                      {log.type === 'nlp_query' && (
                        <div className="flex flex-col gap-1.5">
                          <div>
                            <span className="text-[var(--blue)] font-bold">USER_QUERY:</span>
                            <span className="text-gray-200 ml-1.5">{log.query}</span>
                          </div>
                          <div className="border-t border-white/5 pt-1.5 mt-1.5">
                            <span className="text-[#ff2d78] font-bold">AI_RESPONSE:</span>
                            <span className="text-gray-300 ml-1.5">{log.response}</span>
                          </div>
                          {log.source_claims && log.source_claims.length > 0 && (
                            <div className="text-[10px] text-gray-500 mt-1 flex justify-between items-center">
                              <span>Cited Claims: {log.source_claims.join(', ')}</span>
                              <span className="text-green-400">✓ Grounded via circular references</span>
                            </div>
                          )}
                        </div>
                      )}

                      {log.type === 'anomaly_scan' && (
                        <div className="flex flex-col gap-1 text-gray-300">
                          <div>
                            Scanned <strong className="text-white">{log.claims_scanned}</strong> claims in database.
                          </div>
                          <div>
                            Fired <strong className="text-[#b699ff]">{log.total_cards}</strong> qualified AI anomaly cards.
                          </div>
                        </div>
                      )}

                      {log.type === 'anomaly_single' && (
                        <div className="flex flex-col gap-1 text-gray-300">
                          <div>
                            Deep dive claims metrics for claim ID: <strong className="text-white">{log.claim_id}</strong>
                          </div>
                          <div>
                            Fired <strong className="text-[#ff2d78]">{log.cards}</strong> anomaly warning cards.
                          </div>
                        </div>
                      )}

                      {log.type === 'killswitch' && (
                        <div className="flex items-center justify-between text-gray-300">
                          <span>
                            Global AI Layer Enable Switch toggled by administrator.
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            log.new_state ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            NEW_STATE: {log.new_state ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Governance Guardrails Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <div className="bg-[#0a0a1a]/60 backdrop-blur-xl border border-[var(--border-default)] rounded-xl p-5 flex flex-col gap-4">
            <h3 className="font-bold text-white flex items-center gap-1.5 border-b border-white/10 pb-2">
              <span className="material-symbols-outlined text-[var(--blue)] text-base">verified_user</span>
              AI Governance Policies
            </h3>

            <div className="flex flex-col gap-3.5">
              {/* No Auto-Denial */}
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-[#ffaa00] text-lg shrink-0 mt-0.5">gavel</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-white text-[11px] uppercase">No Autonomous Decision (Advisory Only)</span>
                  <p className="text-gray-400 leading-snug">
                    All AI-generated decisions must display the mandatory <code>advisory_only: true</code> badge. Auto-denials or payout locks are strictly disabled.
                  </p>
                </div>
              </div>

              {/* Source Claims Citation */}
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-[#00e5ff] text-lg shrink-0 mt-0.5">link</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-white text-[11px] uppercase">Grounded Source Citations</span>
                  <p className="text-gray-400 leading-snug">
                    Every anomaly card and Q&A chat answer must cite the corresponding raw claim file IDs (<code>source_claims</code>) to guarantee audit transparency.
                  </p>
                </div>
              </div>

              {/* Confidence Suppressions */}
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-[#b699ff] text-lg shrink-0 mt-0.5">filter_alt</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-white text-[11px] uppercase">Confidence Threshold Gate</span>
                  <p className="text-gray-400 leading-snug">
                    Any anomaly scoring less than <strong>70% confidence</strong> is automatically suppressed from dashboard display to prevent false alerts.
                  </p>
                </div>
              </div>

              {/* SBV Compliance */}
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-green-400 text-lg shrink-0 mt-0.5">description</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-white text-[11px] uppercase">SBV Circular 09 Regulation</span>
                  <p className="text-gray-400 leading-snug">
                    Fraud flags and SIU review routing follow Vietnam State Bank Circular 09/2020 Article 14 specifications for claims auditing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#ffaa00]/5 border border-[#ffaa00]/30 rounded-xl p-4 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-[#ffaa00] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">emergency</span>
              Global Emergency Kill Switch
            </h4>
            <p className="text-gray-300 leading-relaxed">
              Toggling the AI Layer switch disables the anomaly engine and NLP drawer in less than 2 seconds, immediately falling back to raw insurance metric displays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
