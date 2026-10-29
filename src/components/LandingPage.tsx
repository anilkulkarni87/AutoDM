import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Server,
  Layers,
  HardDrive,
  Database,
  Flame,
  CheckCircle2,
  FolderGit2,
  Play,
  Instagram,
  Terminal,
  ExternalLink,
  Users,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenLogin: () => void;
  onOpenDocs: () => void;
  onOpenSimulator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenLogin,
  onOpenDocs,
  onOpenSimulator,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Landing Top Navigation Bar adhering to §2 Top Bar Contract */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-8 py-4 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
        {/* Zone 1: Wordmark */}
        <a href="#hero" className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-mono text-sm font-black">
            ⚡
          </div>
          <span>AutoDM</span>
          <span className="font-mono text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-1.5 py-0.5 rounded">
            EDGE
          </span>
        </a>

        {/* Zone 2: 4-5 Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Features
          </a>
          <a href="#architecture" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Architecture
          </a>
          <a href="#comparison" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            vs. OpenInstaDM
          </a>
          <a href="#pricing" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Self-Hosted vs. Cloud
          </a>
          <button
            onClick={onOpenDocs}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-slate-400 font-medium"
          >
            GitHub Docs
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenLogin}
            className="hidden sm:inline-flex text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors whitespace-nowrap"
          >
            Sign In
          </button>
          <button
            onClick={onEnterApp}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all whitespace-nowrap shrink-0"
          >
            <span>Launch App Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/60 px-3 py-1 rounded-full">
            <span>⚡ Edge-Native + Inngest Workflows</span>
            <span>·</span>
            <span className="text-emerald-400">Zero Background Workers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
            Autonomous Instagram DM Automation without Continuous Worker Fleets
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Replace legacy $31/mo Redis queues and background daemons with a 100% serverless event-driven architecture. Powered by Vercel Edge, Inngest durable step workflows, Turso SQLite, and Gemini AI agent routing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-pink-400 fill-current" />
              <span>Simulate Webhook</span>
            </button>
            <button
              onClick={onOpenDocs}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-lg transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>GitHub Publishing Guide</span>
            </button>
          </div>
        </div>

        {/* Interactive Live Hero Split Visualizer */}
        <div className="mt-14 max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-slate-400 text-[11px]">
                live-orchestration · Meta Graph Webhook → Inngest Step Workflow
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Edge Latency: 38ms</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Inngest Step Function Pipeline */}
            <div className="md:col-span-7 space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-pink-400 font-bold">01</span>
                  <span className="text-white font-semibold">event: instagram/comment.received</span>
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 200 OK (22ms)
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-indigo-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-indigo-400 font-bold">02</span>
                  <div>
                    <span className="text-indigo-200 font-semibold block">step.run: evaluate-intent-gemini</span>
                    <span className="text-[10px] text-slate-400">Classified 'lnik repo' → Campaign BLUEPRINT (99% conf)</span>
                  </div>
                </div>
                <span className="text-[10px] text-indigo-400">14ms</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-amber-400 font-bold">03</span>
                  <span className="text-white font-semibold">step.sleep: anti-spam-jitter (45s)</span>
                </div>
                <span className="text-[10px] text-slate-500">Zero Redis</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-emerald-400 font-bold">04</span>
                  <div>
                    <span className="text-emerald-200 font-semibold block">step.run: send-private-dm</span>
                    <span className="text-[10px] text-slate-400">Accepted by Meta API Gateway</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400">Accepted</span>
              </div>
            </div>

            {/* Right: Phone DM Simulation Preview */}
            <div className="md:col-span-5 bg-black border border-neutral-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-800 text-[11px]">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center font-bold text-[9px]">
                  AG
                </div>
                <span className="font-bold text-white">acme.growth</span>
                <span className="text-emerald-400 text-[10px] ml-auto">● Active</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-neutral-900 text-neutral-200 rounded-2xl rounded-tl-none text-[11px] leading-relaxed">
                  Hey alex_dev! Where should I email your access key & GitHub repository link?
                </div>
                <div className="p-2.5 bg-indigo-600 text-white rounded-2xl rounded-tr-none text-[11px] leading-relaxed ml-auto max-w-[85%]">
                  why do you need my email instead of dropping it here?
                </div>
                <div className="p-2.5 bg-neutral-900 text-neutral-200 rounded-2xl rounded-tl-none text-[11px] leading-relaxed">
                  Totally understand! Meta filters long URLs in comments, plus we send one-click Vercel credentials. What email works best?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Architectural Pillars Section */}
      <section id="features" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
            Architecture Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Engineered from Day One for Edge-Native Scale
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Eliminating every single failure mode of legacy Python and Node queue workers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Vercel Edge Gateway</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Responds to Meta's webhook challenge handshake in &lt;25ms. Drops payloads into Inngest workflows without running into 15s function timeouts.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Inngest Workflows</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Durable execution with automatic retries, concurrency limits (50 max), and humanized sleep intervals without holding open server connections.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Gemini 3.8 Flash AI Agent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stateless semantic intent parser. Replaces rigid exact keyword matching with contextual understanding, typo recovery, and dynamic objection handling.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Turso Multi-Tenant SQLite</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              LibSQL state layer anchored to organization IDs. Maintained automatically with a 30-day retention cron rolling up 10k rows into 1 DailyStats snapshot.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section id="comparison" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            Architectural Face-Off
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Why Teams Migrate from OpenInstaDM
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Comparing the traditional background worker architecture against AutoDM Edge.
          </p>
        </div>

        <div className="overflow-x-auto max-w-4xl mx-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5 font-bold">Operational Dimension</th>
                <th className="py-3.5 px-5 font-bold text-red-400">🛠️ OpenInstaDM</th>
                <th className="py-3.5 px-5 font-bold text-emerald-400">⚡ AutoDM Edge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr>
                <td className="py-3 px-5 font-semibold text-white">Hosting Requirements</td>
                <td className="py-3 px-5 text-slate-400">
                  Separate Web Node + Background Worker + Native Redis Server
                </td>
                <td className="py-3 px-5 text-emerald-300 font-medium">
                  100% Serverless Vercel Edge + Turso LibSQL Database
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-semibold text-white">Monthly Hosting Cost</td>
                <td className="py-3 px-5 text-red-400 font-mono font-semibold">$7 to $31+ / mo</td>
                <td className="py-3 px-5 text-emerald-400 font-mono font-bold">$0 / mo (Free Tier Safe)</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-semibold text-white">Response Flexibility</td>
                <td className="py-3 px-5 text-slate-400">Rigid exact keyword only; fails on typos</td>
                <td className="py-3 px-5 text-emerald-300 font-medium">Gemini 3.8 Flash semantic intent & objection steering</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-semibold text-white">Scale Pathway</td>
                <td className="py-3 px-5 text-slate-400">Requires complete refactor to support multiple clients</td>
                <td className="py-3 px-5 text-emerald-300 font-medium">Native multi-tenant isolation from day one</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-semibold text-white">Data Maintenance</td>
                <td className="py-3 px-5 text-slate-400">Manual table pruning or eventual storage crash</td>
                <td className="py-3 px-5 text-emerald-300 font-medium">Automated 30-day DailyStats rollups (99.8% savings)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing / Self-Hosted Tiers Section */}
      <section id="pricing" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
            Fair & Transparent Tiers
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Free to Self-Host. Paid for Instant Meta Convenience.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            The open-source engine is fully featured. The managed cloud bypasses Meta App Review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Community Self-Hosted */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">Community Self-Hosted</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  MIT Open Source
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">$0 <span className="text-xs font-normal text-slate-400">/ forever</span></div>
              <p className="text-xs text-slate-300 leading-relaxed">
                For developers, technical agencies, and builders who deploy on their own Vercel, Turso, and Inngest accounts.
              </p>

              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">✓ Full Gemini 3.8 Flash AI Intent Stack</li>
                <li className="flex items-center gap-2">✓ Modular Campaign Inngest Canvas</li>
                <li className="flex items-center gap-2">✓ Multi-Tenant Workspace Architecture</li>
                <li className="flex items-center gap-2">✓ Automated 30-Day Purge & Rollups</li>
                <li className="flex items-center gap-2 text-slate-400">· BYO Meta Developer App & Review</li>
              </ul>
            </div>

            <button
              onClick={onOpenDocs}
              className="w-full py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>View GitHub Readme & Setup</span>
            </button>
          </div>

          {/* Managed SaaS Cloud */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/50 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">AutoDM Managed Cloud</span>
                <span className="text-[11px] font-mono text-white bg-indigo-600 px-2 py-0.5 rounded">
                  Most Popular
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">$29 <span className="text-xs font-normal text-slate-400">/ month</span></div>
              <p className="text-xs text-slate-300 leading-relaxed">
                For creators, brands, and non-technical teams who want instant 1-click Instagram login without Meta Developer review.
              </p>

              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2 text-white font-semibold">★ Meta App Review Exemption (1-Click Login)</li>
                <li className="flex items-center gap-2">★ Fully Managed Serverless Hosting</li>
                <li className="flex items-center gap-2">★ Multi-Seat Team Workspaces & RBAC</li>
                <li className="flex items-center gap-2">★ Multi-Year Data Warehouse Exports</li>
                <li className="flex items-center gap-2">★ Priority Burst Queue Inngest Concurrency</li>
              </ul>
            </div>

            <button
              onClick={onOpenLogin}
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-10 px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
              <span>AutoDM Edge Platform</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Licensed under MIT. Serverless Instagram AI automation for builders.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button onClick={onOpenDocs} className="hover:text-slate-300 transition-colors">
              Documentation
            </button>
            <button onClick={onEnterApp} className="hover:text-slate-300 transition-colors">
              App Console
            </button>
            <button onClick={onOpenLogin} className="hover:text-slate-300 transition-colors">
              Account Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
