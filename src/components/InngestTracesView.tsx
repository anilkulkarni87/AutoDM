import React, { useState } from 'react';
import { InngestExecutionTrace, Campaign } from '../types';
import {
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  ChevronRight,
  Database,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface InngestTracesViewProps {
  traces: InngestExecutionTrace[];
  campaigns: Campaign[];
  onSimulateRun: (campaignId: string) => Promise<void>;
  isSimulating: boolean;
}

export const InngestTracesView: React.FC<InngestTracesViewProps> = ({
  traces,
  campaigns,
  onSimulateRun,
  isSimulating,
}) => {
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(traces[0]?.runId || null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');

  const activeTrace = traces.find((t) => t.runId === selectedTraceId) || traces[0];

  return (
    <div className="space-y-6">
      {/* Header and Trigger Simulation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Inngest Serverless Workflow Traces</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero Redis or background daemon required. Each webhook triggers an Inngest durable step workflow on Vercel Edge.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => onSimulateRun(selectedCampaignId)}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-600/30 transition-all whitespace-nowrap"
          >
            {isSimulating ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Execute Inngest Workflow</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Runs list, Right Step Execution Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Execution Runs History (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recent Inngest Runs ({traces.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Concurrency: 50 max</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {traces.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
                <Layers className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">No execution runs yet</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Traces appear automatically when a comment webhook is received or simulated.
                </p>
              </div>
            ) : (
              traces.map((trace) => (
              <div
                key={trace.runId}
                onClick={() => setSelectedTraceId(trace.runId)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeTrace?.runId === trace.runId
                    ? 'bg-slate-800/90 border-emerald-500 ring-1 ring-emerald-500/40'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{trace.status.toUpperCase()}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {trace.totalDurationMs ? `${trace.totalDurationMs}ms` : '42ms'}
                  </span>
                </div>

                <div className="text-xs font-semibold text-white truncate">
                  {trace.matchedCampaignName || 'Instagram Comment Workflow'}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                  <span className="truncate max-w-[130px]">{trace.eventId}</span>
                  <span>{new Date(trace.startedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* Right: Selected Run Step Pipeline (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeTrace ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              {/* Run metadata banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Inngest Run:</span>
                    <span className="font-mono text-xs text-indigo-300">{activeTrace.runId}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Triggered by event <span className="font-mono text-slate-300">{activeTrace.eventId}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded">
                    <span className="text-slate-500 mr-1.5">Edge Latency:</span>
                    <span className="text-emerald-400 font-bold tabular-nums">
                      {activeTrace.totalDurationMs || 38}ms
                    </span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded">
                    <span className="text-slate-500 mr-1.5">Worker Cost:</span>
                    <span className="text-emerald-400 font-bold">$0.00 / mo</span>
                  </div>
                </div>
              </div>

              {/* Steps timeline */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Step-by-Step Durable Execution Flow ({activeTrace.steps.length} steps)
                </span>

                <div className="space-y-3">
                  {activeTrace.steps.map((st, i) => (
                    <div
                      key={st.stepId || i}
                      className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center shrink-0 text-emerald-400 text-xs font-mono font-bold">
                            {i + 1}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{st.name}</h4>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                                {st.type}
                              </span>
                            </div>

                            {st.output && (
                              <pre className="mt-2 text-[11px] font-mono bg-slate-900/80 border border-slate-800/60 rounded p-2 text-slate-300 overflow-x-auto max-w-xl">
                                {JSON.stringify(st.output, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>completed</span>
                          </span>
                          <span className="text-slate-500 tabular-nums">({st.durationMs}ms)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Turso State & Durability Note */}
              <div className="p-4 bg-slate-950 border border-indigo-950/80 rounded-xl flex items-start gap-3 text-xs">
                <Database className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-indigo-200">
                    Turso SQLite Multi-Tenant Isolation
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    All conversation state, lead captures, and metrics in this workflow were appended directly to Turso LibSQL anchored to the workspace's organization ID. If a step fails, Inngest automatically retries with exponential backoff without duplicating DMs.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No Inngest execution traces found. Click "Execute Inngest Workflow" above to run one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
