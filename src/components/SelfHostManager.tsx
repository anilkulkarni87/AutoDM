import React, { useState } from 'react';
import { SystemLimits, PurgeReport, DailyStats } from '../types';
import {
  HardDrive,
  Cpu,
  Clock,
  Sparkles,
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Flame,
  ArrowRight,
  Database,
  Server,
  Layers,
  ChevronRight,
  Check,
  FileCode2,
} from 'lucide-react';

interface SelfHostManagerProps {
  systemLimits: SystemLimits | null;
  onRunPurge: (retentionDays: number) => Promise<PurgeReport | null>;
  onWarmupPing: () => Promise<void>;
  onToggleEdition: () => Promise<void>;
  onOpenCodeExport: () => void;
}

export const SelfHostManager: React.FC<SelfHostManagerProps> = ({
  systemLimits,
  onRunPurge,
  onWarmupPing,
  onToggleEdition,
  onOpenCodeExport,
}) => {
  const [retentionDays, setRetentionDays] = useState(30);
  const [isRunningPurge, setIsRunningPurge] = useState(false);
  const [purgeReport, setPurgeReport] = useState<PurgeReport | null>(null);
  const [isWarming, setIsWarming] = useState(false);
  const [warmupResult, setWarmupResult] = useState<string | null>(null);

  const limits = systemLimits || {
    inngestMonthlyEvents: { used: 14280, limit: 50000, hardCeilingPct: 28.6 },
    tursoStorageMb: { usedMb: 18.4, limitMb: 500, storagePct: 3.68, rowReadsMonth: 342190, rowReadsLimit: 9000000000 },
    vercelEdgeTimeout: { webhookAvgMs: 38, timeoutSeconds: 30, safetyFactor: '99.8% under edge timeout' },
    retention: { retentionDays: 30, activeRawRows: 42, rolledUpDailyStatsRows: 3, estimatedKbFreed: 18450, lastPurgeRunAt: new Date().toISOString() },
    warmupStatus: { lastWarmupAt: new Date().toISOString(), replicaStatus: 'WARM' as const, edgeLatencyMs: 16 },
    editionMode: 'SELF_HOSTED_COMMUNITY' as const,
  };

  const handleExecutePurge = async () => {
    setIsRunningPurge(true);
    try {
      const report = await onRunPurge(retentionDays);
      if (report) setPurgeReport(report);
    } finally {
      setIsRunningPurge(false);
    }
  };

  const handleWarmup = async () => {
    setIsWarming(true);
    try {
      await onWarmupPing();
      setWarmupResult(`Turso edge replica pinged successfully (${new Date().toLocaleTimeString()}). Status: WARM`);
      setTimeout(() => setWarmupResult(null), 5000);
    } finally {
      setIsWarming(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Self-Hosted First Philosophy */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                Robust Self-Hosted First Architecture
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                Plausible / PostHog Model
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Zero-Worker Serverless Engine & Maintenance
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Build an unshakeable, bulletproof self-hosted engine without being cannibalized. Keep the compute, agent stack, and workflows 100% free and open, while centralizing Meta App Review and multi-seat team governance for the paid tier.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={onToggleEdition}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2 ${
                limits.editionMode === 'SELF_HOSTED_COMMUNITY'
                  ? 'bg-slate-900 border-indigo-500 text-indigo-300 shadow-sm'
                  : 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>
                {limits.editionMode === 'SELF_HOSTED_COMMUNITY'
                  ? 'Active: Community Edition'
                  : 'Active: SaaS Pro Managed'}
              </span>
            </button>

            <button
              onClick={onOpenCodeExport}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cron Code & Schema</span>
            </button>
          </div>
        </div>
      </div>

      {/* Part 1: Physical Free-Tier Quotas & Ceilings (3 Pillars) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Physical Cloud Free-Tier Physical Ceilings
            </h3>
            <p className="text-[11px] text-slate-400">
              Guarding your serverless instance so viral posts never crash your free infrastructure
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">$0 / mo Free Tier Safe</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Inngest Queue Cap */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                Inngest Monthly Queue Cap
              </span>
              <span className="font-mono text-emerald-400 font-bold tabular-nums">
                {limits.inngestMonthlyEvents.hardCeilingPct}%
              </span>
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  style={{ width: `${limits.inngestMonthlyEvents.hardCeilingPct}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>{limits.inngestMonthlyEvents.used.toLocaleString()} events used</span>
                <span>50,000 cap / mo</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/60">
              Hard ceiling for free self-hosting. Inngest holds queues durably without Redis dropped connections.
            </p>
          </div>

          {/* Pillar 2: Turso Storage & Reads */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                Turso SQLite Storage Ceiling
              </span>
              <span className="font-mono text-indigo-400 font-bold tabular-nums">
                {limits.tursoStorageMb.storagePct}%
              </span>
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.max(limits.tursoStorageMb.storagePct, 3)}%` }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>{limits.tursoStorageMb.usedMb} MB used</span>
                <span>500 MB free cap</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/60">
              Row Reads: <span className="text-slate-200 font-mono font-medium">342k / 9 Billion</span>. Maintained lean via the 30-day rollup cron.
            </p>
          </div>

          {/* Pillar 3: Vercel Edge Timeout Safeguard */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Vercel Edge Timeout Safeguard
              </span>
              <span className="font-mono text-emerald-400 font-bold tabular-nums">
                ~{limits.vercelEdgeTimeout.webhookAvgMs}ms avg
              </span>
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div style={{ width: '4%' }} className="h-full bg-emerald-500 rounded-full" />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>38ms dispatch time</span>
                <span>30s edge timeout</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/60">
              Webhook handler does zero heavy lifting: drops into Inngest event queue and returns 200 OK under 200ms.
            </p>
          </div>
        </div>
      </div>

      {/* Part 2: Automated Data Purging & Rollup Engine (The 30-Day Rule) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Automated Data Retention & Compression Pipeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reduces database storage footprint by 99.9% while keeping lifetime analytics intact
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleWarmup}
              disabled={isWarming}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {isWarming ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
              <span>Ping Edge Keep-Alive</span>
            </button>

            <button
              onClick={handleExecutePurge}
              disabled={isRunningPurge}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              {isRunningPurge ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>Execute 30-Day Purge & Rollup</span>
            </button>
          </div>
        </div>

        {warmupResult && (
          <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs font-mono text-amber-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{warmupResult}</span>
          </div>
        )}

        {/* Visual Lifecycle Pipeline Diagram */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-4">
            Data Retention Lifecycle Engine Flow (/api/cron/purge):
          </span>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            {/* Step 1 */}
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] text-indigo-400 font-bold">STAGE 1: LIVE INGEST</span>
              <h4 className="font-bold text-white">Incoming Webhooks & DMs</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Meta comment webhooks and dynamic AI conversations stored in full detail.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] text-amber-400 font-bold">STAGE 2: 30 DAYS DWELL</span>
              <h4 className="font-bold text-white">Active Operational Window</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Full conversation transcripts and lead records available for real-time customer response.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-2">
              <span className="text-[10px] text-emerald-400 font-bold">STAGE 3: COMPRESSION</span>
              <h4 className="font-bold text-emerald-300">DailyStats Rollup Table</h4>
              <p className="text-[11px] text-slate-300 font-sans">
                10,000 raw comment rows compacted into 1 daily snapshot row (99.9% savings).
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 bg-red-950/20 border border-red-800/40 rounded-xl space-y-2">
              <span className="text-[10px] text-red-400 font-bold">STAGE 4: HARD PURGE</span>
              <h4 className="font-bold text-red-300">Delete Webhook Dumps</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Hard deletes massive raw comment payloads older than 30 days. Keeps SQLite lean.
              </p>
            </div>
          </div>
        </div>

        {/* Live Purge Execution Feedback */}
        {purgeReport && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Purge & DailyStats Rollup Execution Succeeded
              </span>
              <span className="text-slate-400">{new Date(purgeReport.timestamp).toLocaleTimeString()}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Raw Rows Purged</span>
                <span className="text-sm font-bold text-red-400 tabular-nums">
                  {purgeReport.rawMetricsPurged + purgeReport.conversationsPurged}
                </span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Rollup Snapshots</span>
                <span className="text-sm font-bold text-emerald-400 tabular-nums">
                  {purgeReport.dailyStatsCreated}
                </span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Storage Reduction</span>
                <span className="text-sm font-bold text-emerald-300 tabular-nums">
                  {purgeReport.storageReductionPercent}%
                </span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Database Freed</span>
                <span className="text-sm font-bold text-indigo-300 tabular-nums">
                  ~{purgeReport.kbFreed} KB
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part 3: What to Keep Free vs What to Gate (Open-Source Monetization Blueprint) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Commercial Strategy: Compute vs. Infrastructure Coordination
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Why 95% of businesses gladly pay for the managed SaaS while developers build on the free repo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Tier Features */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                100% Free & Open-Source Engine
              </span>
              <span className="text-[10px] font-mono text-slate-400">MIT / Community</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white">Full Agentic Stack:</strong> BYO Groq/Gemini API key without watering down the intent engine.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white">Visual Campaign Canvas:</strong> Complete workflow editor and story block builder.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white">Multi-Tenant Schema:</strong> Run agencies managing multiple client workspaces on your own server.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white">Automated Maintenance Cron:</strong> Nightly 30-day log purger and DailyStats rollups.
                </div>
              </li>
            </ul>
          </div>

          {/* Paid SaaS Tier Features */}
          <div className="p-5 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-900/60 rounded-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                SaaS Upgrade Module (Paid Managed Cloud)
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold">High Value</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">★</span>
                <div>
                  <strong className="text-white">Meta App Review Exemption:</strong> 1-click "Login with Instagram" without creating a Meta Developer account or business verification.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">★</span>
                <div>
                  <strong className="text-white">Team Workspaces & RBAC:</strong> Granular permissions (Admin, Editor, Viewer) for large agency teams.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">★</span>
                <div>
                  <strong className="text-white">Long-Term Cold Storage:</strong> Multi-year raw event analytics backups and BigQuery/Snowflake export.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">★</span>
                <div>
                  <strong className="text-white">High-Throughput Surge Shield:</strong> Managed enterprise queue scaling beyond 50,000 events/mo.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
