import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Server,
  Layers,
  HardDrive,
  Database,
  CheckCircle2,
  FolderGit2,
  ExternalLink,
  Users,
  Heart,
  MessageCircle,
  Clock,
  Send,
  X,
  Check,
  Wrench,
} from 'lucide-react';
import { DoneForYouModal } from './DoneForYouModal';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenLogin: () => void;
  onOpenSetupWizard?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenLogin,
  onOpenSetupWizard,
}) => {
  const [waitlistEmail, setWaitlistEmail] = useState('anil77k@gmail.com');
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showDoneForYouModal, setShowDoneForYouModal] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [simCommentText, setSimCommentText] = useState('BLUEPRINT please!');
  const [hasTriggeredSim, setHasTriggeredSim] = useState(false);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 dark:bg-[#121115] dark:text-stone-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white transition-colors duration-200">
      {/* Top Banner: Done-For-You Lifetime Setup Offer */}
      <div className="bg-gradient-to-r from-[#72d600]/15 via-emerald-500/15 to-lime-500/15 border-b border-[#72d600]/30 px-4 py-2 text-center text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 font-medium">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#72d600] text-stone-950 uppercase tracking-wider">
            Done-For-You
          </span>
          <span className="text-stone-800 dark:text-stone-200">
            <strong>$20 Lifetime Deal:</strong> Our developers configure your VPS, database, and Meta webhooks for you.
          </span>
          <button
            onClick={() => setShowDoneForYouModal(true)}
            className="ml-2 underline font-bold text-stone-900 dark:text-white hover:text-emerald-600 dark:hover:text-[#72d600] cursor-pointer text-xs"
          >
            Get it set up →
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative pt-12 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 dark:bg-stone-900 border border-rose-200/80 dark:border-rose-900/60 text-stone-800 dark:text-stone-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 inline-block animate-pulse" />
            <span className="font-bold text-rose-600 dark:text-rose-400">Created for Instagram Creators & Brands</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400">Groq AI Free Tier LPU</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white leading-tight">
            Turn Instagram Comments into Warm, Instant DMs & Conversions.
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Stop paying $100+/mo for robotic bot subscriptions that sound fake. Deploy your own lightning-fast, zero-maintenance DM engine powered by free Groq AI LPUs, Vercel Edge, and Inngest serverless workflows.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {onOpenSetupWizard && (
              <button
                onClick={onOpenSetupWizard}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-xl shadow-md shadow-rose-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Non-Tech 1-Click Setup (Free)</span>
              </button>
            )}
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-stone-900 dark:text-white bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-xl transition-all cursor-pointer"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 hover:bg-stone-50 border border-stone-300 dark:border-stone-700 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-purple-500" />
              <span>View GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          </div>
        </div>

        {/* Live Interactive Instagram Split Visualizer */}
        <div className="mt-12 max-w-5xl mx-auto bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 relative overflow-hidden">
          {/* Subtle Warm Background Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            {/* Left: Creator Reel Card */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                      alt="Creator"
                      className="w-full h-full rounded-full object-cover border-2 border-white dark:border-stone-900"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900 dark:text-white">@alexgrowth.co</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">✓</span>
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">Instagram Reel · 142k views</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-md">
                  Active Funnel
                </span>
              </div>

              {/* Reel Preview Card */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-stone-900 flex items-center justify-center text-white">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
                  alt="Reel visual"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                <div className="relative z-10 p-4 text-center space-y-1.5 max-w-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">New Reel</span>
                  <h4 className="text-sm font-bold leading-tight">
                    "Comment BLUEPRINT below to get our complete 2026 SaaS Growth Architecture guide in your DMs!"
                  </h4>
                  <div className="flex items-center justify-center gap-3 text-xs text-stone-300 pt-1">
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> 3,420</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-stone-300" /> 849</span>
                  </div>
                </div>
              </div>

              {/* Interactive Comment Preview */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                  Follower Comment Preview:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simCommentText}
                    onChange={(e) => setSimCommentText(e.target.value)}
                    placeholder="e.g. BLUEPRINT"
                    className="flex-1 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <button
                    onClick={() => setHasTriggeredSim(true)}
                    className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3 h-3" />
                    <span>Test Reply</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                  <span>Try:</span>
                  {['BLUEPRINT', 'Can I get the link?', 'PRICE'].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => {
                        setSimCommentText(kw);
                        setHasTriggeredSim(true);
                      }}
                      className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer font-medium"
                    >
                      "{kw}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Instant DM Arrival Experience */}
            <div className="w-full lg:w-1/2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    DM
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900 dark:text-white">Instagram Direct Message</h5>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">⚡ 180ms response via Groq AI</span>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">Just now</span>
              </div>

              {/* Chat bubbles */}
              <div className="space-y-3 py-2">
                {/* Bot automated greeting */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    A
                  </div>
                  <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl rounded-tl-xs p-3 text-xs text-stone-800 dark:text-stone-200 shadow-xs max-w-[85%] space-y-1.5">
                    <p className="leading-relaxed">
                      Hey Sarah! 👋 Thanks so much for dropping "{simCommentText}" on my latest Reel!
                    </p>
                    <p className="leading-relaxed">
                      Here is the complete blueprint doc you asked for:
                    </p>
                    <div className="p-2 rounded-xl bg-rose-50 dark:bg-stone-800/80 border border-rose-200 dark:border-stone-700 flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-rose-700 dark:text-rose-400 truncate">
                        📄 2026-Architecture-Blueprint.pdf
                      </span>
                      <span className="text-[10px] font-bold text-stone-500">Free</span>
                    </div>
                  </div>
                </div>

                {/* Simulated objection handling */}
                {hasTriggeredSim && (
                  <>
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl rounded-tr-xs p-3 text-xs max-w-[80%] shadow-xs">
                        Does this include the Turso & Inngest setup files too?
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        A
                      </div>
                      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl rounded-tl-xs p-3 text-xs text-stone-800 dark:text-stone-200 shadow-xs max-w-[85%] space-y-1">
                        <p className="leading-relaxed">
                          Yes, 100%! All the edge routes, workflow definitions, and free Groq setup instructions are included right in Chapter 2. Let me know if you run into any questions! 🚀
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Status footer */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Follow verified · No robot delays
                </span>
                <button
                  onClick={() => setHasTriggeredSim(!hasTriggeredSim)}
                  className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer font-medium"
                >
                  {hasTriggeredSim ? 'Reset Preview' : 'Preview Objection →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars Section (Creator-First) */}
      <section id="features" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-stone-200/80 dark:border-stone-800/80 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Why Creators Choose AutoDM
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white mt-1">
            Built Specifically for Instagram Growth & Lead Conversion
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
            Warm, natural conversations that sound like you — without babysitting your phone all day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3.5 shadow-sm shadow-stone-900/5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">Human Voice with Groq AI</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Powered by Groq's lightning-fast LPU engine. Replies sound empathetic, warm, and natural — never robotic or canned.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ 14,400 free daily requests
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3.5 shadow-sm shadow-stone-900/5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">Follow-to-Unlock Protection</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Inngest durable steps gently verify follower status before sending download links. Grow real followers automatically.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ Durable 5-minute wait steps
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3.5 shadow-sm shadow-stone-900/5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">Zero Server Maintenance Costs</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              No continuous background servers eating your money. Runs on edge webhooks and Turso SQLite that scale to zero when idle.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ $0/mo free tier safe
            </div>
          </div>
        </div>
      </section>

      {/* SERVERLESS ARCHITECTURE SECTION (Target of /#architecture) */}
      <section id="architecture" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-stone-200/80 dark:border-stone-800/80 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Edge-Native + Inngest Workflows
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white mt-1">
            Zero-Worker Serverless Architecture
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
            No continuous background workers (`npm run worker`). No $30/mo Redis instances. Scales to zero when idle and handles viral Reels bursts gracefully.
          </p>
        </div>

        {/* 4 Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-stone-400 block uppercase font-bold">Layer 1 · Ingestion</span>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">Vercel Edge Webhook</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Validates Meta Graph API HMAC signatures and returns HTTP 200 in &lt;30ms, queueing events into Inngest without edge timeout risk.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ⚡ ~38ms dispatch time
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-stone-400 block uppercase font-bold">Layer 2 · Execution</span>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">Inngest Step Workflows</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Step-based durable execution. Handles follower verification, sleep timers up to 5 min, retries, and jitter without server fleets.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ 50,000 monthly events free
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-stone-400 block uppercase font-bold">Layer 3 · Intelligence</span>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">Groq AI Free Tier LPU</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Runs Llama 3.3 70B & 3.1 8B inference in &lt;180ms. Extracts intent, fixes typos, and steers DM conversations naturally.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ 14,400 free requests/day
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-stone-400 block uppercase font-bold">Layer 4 · Multi-Tenant State</span>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">Turso LibSQL Database</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Serverless embedded SQLite replicated to edge nodes. Automated nightly cron rolls up logs into DailyStats snapshots.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ 99.8% storage compression
            </div>
          </div>
        </div>

        {/* Visual Workflow Flowchart */}
        <div className="mt-8 bg-stone-900 dark:bg-stone-950 border border-stone-800 rounded-3xl p-6 text-stone-200 font-mono text-xs overflow-x-auto">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800 text-[11px] text-stone-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Event Flow: Meta Graph API → Edge Handler → Inngest Durable Steps → Groq AI → Turso DB
            </span>
            <span className="text-emerald-400 font-bold">Zero Worker Fleets Needed</span>
          </div>
          <pre className="text-[11px] leading-relaxed text-stone-300">
{`  Meta Graph API Webhook  ──►  Vercel Edge Handler (/api/webhooks/instagram)  ──►  Inngest Event Bus
        │                                        │ (Handshake < 30ms HTTP 200)                      │
        ▼                                        ▼                                                  ▼
Follower Comments on Reel                 No Server Daemons                                Durable Step Execution
                                                                                            ├─ Step 1: Wait for Follow
                                                                                            ├─ Step 2: Groq AI Intent Routing
                                                                                            ├─ Step 3: Send Warm DM Link
                                                                                            └─ Step 4: Write Turso DB Row`}
          </pre>
        </div>
      </section>

      {/* 3-Step Setup Section for Non-Tech Folks */}
      <section id="setup" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-stone-200/80 dark:border-stone-800/80 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Self-Host in Under 5 Minutes
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white mt-1">
            Simple 3-Step Setup for Everyone
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
            No terminal commands required. Our visual wizard walks you through every single step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex items-center justify-center font-mono font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">1-Click Vercel Deploy</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Click our deploy button to clone the repository directly into your own free Vercel account in seconds.
              </p>
            </div>
            <a
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fexample%2Fautodm-edge"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Deploy to Vercel</span>
            </a>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">Free Groq AI Key</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Open Groq Console (console.groq.com/keys) and copy your free key. Enjoy 14,400 free requests per day with zero credit card.
              </p>
            </div>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Get Free Groq Key</span>
              <ExternalLink className="w-3 h-3 text-amber-500" />
            </a>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">Copy-Paste Variables</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Our visual assistant formats all variables for one-click copy. Paste them into Vercel and your engine is live!
              </p>
            </div>
            {onOpenSetupWizard && (
              <button
                onClick={onOpenSetupWizard}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Open Setup Assistant</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Pricing / Self-Hosted vs Done-For-You Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-stone-200/80 dark:border-stone-800/80 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-900 dark:text-white">
            Pay once. <span className="font-serif italic text-[#72d600] font-normal">...no hidden fees.</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-lg mx-auto">
            100% open-source to run on your own machine, or get priority done-for-you configuration by our core developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Card 1: Self-Hosted */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-9 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-6">
              {/* Pill badge */}
              <div className="inline-block">
                <span className="px-4 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs">
                  Self-Hosted
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl sm:text-6xl font-black text-stone-900 dark:text-white tracking-tight font-mono">$0</span>
                <span className="text-base font-normal text-stone-500 dark:text-stone-400">/forever</span>
              </div>

              {/* Dotted divider */}
              <div className="border-t border-dashed border-stone-200 dark:border-stone-800" />

              {/* Features list */}
              <ul className="space-y-4 text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-medium">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#72d600] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>100% open source (MIT license)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#72d600] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Self-hosted — your data stays yours</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#72d600] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Unlimited automations & DMs</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#72d600] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Unlimited Instagram accounts</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#72d600] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Community support on GitHub</span>
                </li>
              </ul>

              {/* Dotted divider */}
              <div className="border-t border-dashed border-stone-200 dark:border-stone-800" />

              {/* Deploy it yourself toggle row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Deploy it yourself
                </span>
                {/* Off Toggle */}
                <div className="w-11 h-6 bg-stone-200 dark:bg-stone-700 rounded-full p-1 transition-colors">
                  <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={onOpenSetupWizard || onEnterApp}
              className="w-full py-3.5 px-6 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold text-sm hover:bg-stone-50 dark:hover:bg-stone-750 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FolderGit2 className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>Start self-hosting</span>
            </button>
          </div>

          {/* Card 2: Done-For-You */}
          <div className="bg-white dark:bg-stone-900 border-[2.5px] border-[#72d600] rounded-3xl p-8 sm:p-9 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-6">
              {/* Top Row: Done-For-You pill badge + Lifetime deal indicator */}
              <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 rounded-full bg-[#72d600] text-stone-950 font-bold text-xs">
                  Done-For-You
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-stone-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#72d600] inline-block animate-pulse" />
                  <span>Lifetime deal</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl sm:text-6xl font-black text-stone-900 dark:text-white tracking-tight font-mono">$20</span>
                <span className="text-base font-normal text-stone-500 dark:text-stone-400">/one-time</span>
              </div>

              {/* Dotted divider */}
              <div className="border-t border-dashed border-stone-200 dark:border-stone-800" />

              {/* Features list */}
              <ul className="space-y-4 text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-medium">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#72d600] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="font-bold text-stone-900 dark:text-white">Everything in self-hosted plan, plus:</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#72d600] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Our devs set everything up for you</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#72d600] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Pay once — works for a lifetime</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#72d600] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>VPS, database & worker configured</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#72d600] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Meta app + webhooks connected</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#72d600] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>7-day priority support included</span>
                </li>
              </ul>

              {/* Dotted divider */}
              <div className="border-t border-dashed border-stone-200 dark:border-stone-800" />

              {/* Priority setup included toggle row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-white">
                  Priority setup included
                </span>
                {/* On Toggle (Bright Green) */}
                <div className="w-11 h-6 bg-[#72d600] rounded-full p-1 flex justify-end shadow-xs">
                  <div className="w-4 h-4 bg-stone-950 rounded-full shadow-xs" />
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => setShowDoneForYouModal(true)}
              className="w-full py-4 px-6 rounded-full font-bold text-sm text-stone-950 bg-gradient-to-b from-[#8ce800] to-[#72d600] hover:from-[#96f200] hover:to-[#7be300] shadow-md shadow-[#72d600]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Wrench className="w-4 h-4" />
              <span>Get it set up</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 py-10 px-4 sm:px-6 text-xs text-stone-500 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200">
              <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-[9px]">
                ⚡
              </div>
              <span>AutoDM Edge · Instagram DM Engine</span>
            </div>
            <p className="text-[11px] text-stone-500">
              MIT Open Source. Built for creators and growth teams. Powered by Groq AI Free Tier LPU.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-medium text-stone-600 dark:text-stone-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>GitHub Docs</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
            <button onClick={onEnterApp} className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer">
              App Console
            </button>
            <button onClick={() => setShowWaitlistModal(true)} className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer text-rose-600 dark:text-rose-400">
              Paid Cloud Waitlist
            </button>
            <button onClick={onOpenLogin} className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      </footer>

      {/* Private Beta / Coming Soon Waitlist Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => {
                setShowWaitlistModal(false);
                setWaitlistSubmitted(false);
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 uppercase">
                <Clock className="w-3 h-3" />
                <span>Private Beta Waitlist</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                Managed Cloud is Coming Soon!
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                The paid managed edition is currently finalizing Meta App Review so you can log in with 1-click. In the meantime, the <strong>100% Free Self-Hosted Edition</strong> with Groq AI Free Tier is completely active today!
              </p>
            </div>

            {waitlistSubmitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl space-y-2 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  You're on the priority list!
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  We've registered <strong>{waitlistEmail}</strong> for early beta access. We'll send an invite as soon as billing goes live.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowWaitlistModal(false);
                      onEnterApp();
                    }}
                    className="w-full py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer"
                  >
                    Explore Free Dashboard Now
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Your Email Address:
                  </label>
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    required
                    placeholder="you@creatorbrand.com"
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWaitlistModal(false)}
                    className="flex-1 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-xl transition-all shadow-md shadow-rose-500/25 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Notify Me at Launch</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
