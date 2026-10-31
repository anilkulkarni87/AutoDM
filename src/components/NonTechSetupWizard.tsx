import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Instagram,
  ArrowRight,
  RefreshCw,
  Server,
  KeyRound,
  FileCode2,
} from 'lucide-react';

interface NonTechSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchConsole?: () => void;
}

export const NonTechSetupWizard: React.FC<NonTechSetupWizardProps> = ({
  isOpen,
  onClose,
  onLaunchConsole,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // GitHub repository to deploy (defaults to user's linked repo)
  const [githubRepoUrl, setGithubRepoUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('autodm_github_repo') || 'https://github.com/anilkulkarni87/AutoDM';
    }
    return 'https://github.com/anilkulkarni87/AutoDM';
  });

  // Form states
  const [groqKey, setGroqKey] = useState('');
  const [groqModel, setGroqModel] = useState('llama-3.3-70b-versatile');
  const [isTestingGroq, setIsTestingGroq] = useState(false);
  const [groqTestResult, setGroqTestResult] = useState<{
    valid?: boolean;
    message?: string;
    error?: string;
    latencyMs?: number;
  } | null>(null);

  const [metaVerifyToken, setMetaVerifyToken] = useState('autodm_edge_secret_verify_token_2026');
  const [metaAppSecret, setMetaAppSecret] = useState('');
  const [vercelProjectUrl, setVercelProjectUrl] = useState('');
  const [useSimulationMode, setUseSimulationMode] = useState(false);

  const [copiedEnv, setCopiedEnv] = useState(false);

  // Update localStorage when repo URL changes
  const handleUpdateRepoUrl = (newUrl: string) => {
    setGithubRepoUrl(newUrl);
    if (typeof window !== 'undefined') {
      localStorage.setItem('autodm_github_repo', newUrl);
    }
  };

  // Fetch current groq status on open
  useEffect(() => {
    if (isOpen) {
      fetch('/api/groq/status')
        .then((r) => r.json())
        .then((data) => {
          if (data.configured && !groqKey) {
            setGroqTestResult({
              valid: true,
              message: `Active Groq Key configured (${data.maskedKey || 'free-tier'})`,
            });
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestGroqKey = async () => {
    if (!groqKey.trim()) {
      setGroqTestResult({
        valid: false,
        error: 'Please paste your Groq API key (starts with gsk_...)',
      });
      return;
    }

    setIsTestingGroq(true);
    setGroqTestResult(null);

    try {
      const res = await fetch('/api/groq/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: groqKey.trim(),
          model: groqModel,
        }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setGroqTestResult({
          valid: true,
          message: data.message || `Connected in ${data.latencyMs}ms!`,
          latencyMs: data.latencyMs,
        });
      } else {
        setGroqTestResult({
          valid: false,
          error: data.error || 'Failed to connect with this Groq key.',
        });
      }
    } catch (err: any) {
      setGroqTestResult({
        valid: false,
        error: `Could not reach Groq: ${err.message}`,
      });
    } finally {
      setIsTestingGroq(false);
    }
  };

  const generatedEnvText = `# AutoDM Edge - Generated Vercel Environment Variables
# Copy and paste these into your Vercel Project Settings > Environment Variables

GROQ_API_KEY="${groqKey.trim() || 'gsk_YOUR_FREE_GROQ_KEY_FROM_CONSOLE_GROQ_COM'}"
GROQ_MODEL="${groqModel}"
META_VERIFY_TOKEN="${metaVerifyToken || 'autodm_edge_secret_verify_token_2026'}"
META_APP_SECRET="${metaAppSecret.trim() || 'your_meta_app_secret'}"
APP_URL="${vercelProjectUrl.trim() || 'https://your-app-name.vercel.app'}"
DATABASE_URL="libsql://your-db.turso.io"
DATABASE_AUTH_TOKEN="your_turso_db_token"
`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(generatedEnvText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                Non-Technical Friendly
              </span>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded">
                100% Free Tiers
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>1-Click Self-Host Launchpad</span>
              <Sparkles className="w-4 h-4 text-pink-400" />
            </h2>
            <p className="text-xs text-slate-400">
              Host your own Instagram AI automation on Vercel without terminal commands or background servers.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Stepper Header */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/50 text-xs">
          {[
            { num: 1, title: 'Deploy to Vercel' },
            { num: 2, title: 'Free Groq AI' },
            { num: 3, title: 'Instagram Token' },
            { num: 4, title: 'Copy Settings' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num as any)}
              className={`p-3 text-center border-r last:border-r-0 border-slate-800 transition-colors flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                currentStep === s.num
                  ? 'bg-slate-900 text-white font-semibold border-b-2 border-b-indigo-500'
                  : currentStep > s.num
                  ? 'text-emerald-400 bg-slate-950'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                  currentStep === s.num
                    ? 'bg-indigo-600 text-white'
                    : currentStep > s.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {currentStep > s.num ? '✓' : s.num}
              </span>
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-6">
          {/* STEP 1: Vercel Deploy */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-400" />
                    <span>Step 1: Deploy YOUR Linked GitHub Repository to Vercel</span>
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400">$0 / month forever</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Vercel runs your Instagram automation engine completely serverless. Vercel will build directly from <strong>your linked GitHub repository</strong>, ensuring all your custom code and changes are deployed.
                </p>

                {/* Linked Repository Input Box */}
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      <span>Your Linked GitHub Repository:</span>
                    </label>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">Connected</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={githubRepoUrl}
                      onChange={(e) => handleUpdateRepoUrl(e.target.value)}
                      placeholder="https://github.com/your-username/your-repo"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateRepoUrl('https://github.com/anilkulkarni87/AutoDM')}
                      className="px-2.5 py-2 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                      title="Reset to default linked repository"
                    >
                      Reset Default
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Your Vercel deployment buttons below are dynamically bound to this exact repository.
                  </p>
                </div>

                {/* 2 Deployment Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option 1: Import Existing Linked Repo */}
                  <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Option A: Import Linked Repo</span>
                        <span className="text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-1.5 py-0.5 rounded">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        If this repository already exists on your GitHub, click to import directly into Vercel.
                      </p>
                    </div>

                    <a
                      href={`https://vercel.com/new/import?s=${encodeURIComponent(githubRepoUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all text-center"
                    >
                      <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 1155 1000">
                        <path d="m577.3 0 577.4 1000H0z" />
                      </svg>
                      <span>Import on Vercel</span>
                      <ExternalLink className="w-3 h-3 text-indigo-200" />
                    </a>
                  </div>

                  {/* Option 2: Clone from Your Repo */}
                  <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Option B: 1-Click Deploy Button</span>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">1-Click</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Clones <em>your repository</em> into a new Vercel project automatically.
                      </p>
                    </div>

                    <a
                      href={`https://vercel.com/new/clone?repository-url=${encodeURIComponent(githubRepoUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-black hover:bg-slate-800 border border-slate-600 rounded-lg shadow-md transition-all text-center"
                    >
                      <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 1155 1000">
                        <path d="m577.3 0 577.4 1000H0z" />
                      </svg>
                      <span>Deploy from Your Repo</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">1. Your Own Repo</span>
                  <p className="text-slate-300 text-[11px]">Deploys directly from your personal GitHub, preserving your code.</p>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">2. Continuous Sync</span>
                  <p className="text-slate-300 text-[11px]">Every git push to your repo will auto-deploy to Vercel instantly.</p>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">3. Zero Servers</span>
                  <p className="text-slate-300 text-[11px]">Runs 100% serverless on Vercel's global Edge network.</p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Next: Connect Free Groq AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Free Groq AI */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Step 2: Get Your Free Groq AI Key (30 Seconds)
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400">14,400 Free DMs / Day</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Groq powers the AI brain that catches typos (like "lnik" or "send code"), handles language variations, and manages DM replies. Groq offers a completely free tier with no credit card required.
                </p>

                <div className="pt-1 flex flex-wrap gap-2 items-center">
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-200 bg-amber-950/50 hover:bg-amber-900/50 border border-amber-800/60 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>Open Groq Console (console.groq.com/keys)</span>
                  </a>
                  <span className="text-[11px] text-slate-400">
                    Click "Create API Key", copy it, and paste it below:
                  </span>
                </div>
              </div>

              {/* Paste Groq Key */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-200">
                  Paste your Groq API Key:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    placeholder="gsk_..."
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleTestGroqKey}
                    disabled={isTestingGroq || !groqKey.trim()}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
                  >
                    {isTestingGroq ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    <span>Test My Key</span>
                  </button>
                </div>

                {/* Groq Model Selector */}
                <div className="pt-2 flex items-center gap-3 text-xs">
                  <span className="text-slate-400 font-medium">Free Model:</span>
                  <select
                    value={groqModel}
                    onChange={(e) => setGroqModel(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1 focus:outline-none font-mono"
                  >
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended Flagship)</option>
                    <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Sub-100ms Ultra-Fast LPU)</option>
                    <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (Long Context)</option>
                  </select>
                </div>

                {/* Test Feedback */}
                {groqTestResult && (
                  <div
                    className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                      groqTestResult.valid
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : 'bg-red-950/40 border-red-800 text-red-300'
                    }`}
                  >
                    {groqTestResult.valid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{groqTestResult.message || groqTestResult.error}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Next: Connect Instagram</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Instagram Token */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    Step 3: Connect Your Instagram Account
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Meta Graph API</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To listen for comments on your reels/posts and reply in DMs, AutoDM connects to Meta's official Instagram Webhook.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => setUseSimulationMode(!useSimulationMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 cursor-pointer ${
                      useSimulationMode
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${useSimulationMode ? 'text-white' : 'text-slate-500'}`} />
                    <span>I want to test in Simulation Mode first (No Meta App Needed)</span>
                  </button>
                </div>
              </div>

              {!useSimulationMode ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Meta Webhook Verification Token (Secret phrase):
                    </label>
                    <input
                      type="text"
                      value={metaVerifyToken}
                      onChange={(e) => setMetaVerifyToken(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Paste this into your Meta Developer App Dashboard under Webhooks → Verify Token.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Meta App Secret (Optional for verification):
                    </label>
                    <input
                      type="password"
                      placeholder="e.g. 7f8b9..."
                      value={metaAppSecret}
                      onChange={(e) => setMetaAppSecret(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-indigo-950/30 border border-indigo-800/50 rounded-xl text-xs text-indigo-300 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Sandbox Simulation Active
                  </span>
                  <p className="text-[11px] text-slate-300">
                    You can test comment triggers, typo corrections, and DM replies directly in the dashboard simulator without needing a Meta Developer App!
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Next: Generate Vercel Settings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Copy Settings */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-emerald-400" />
                    Step 4: Copy Your Vercel Environment Variables
                  </h3>
                  <button
                    onClick={handleCopyEnv}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedEnv ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEnv ? 'Copied to Clipboard!' : 'Copy All for Vercel'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In your Vercel Dashboard, go to <strong>Project Settings → Environment Variables</strong>. Paste these values in one click:
                </p>
              </div>

              {/* Code display */}
              <div className="relative">
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-48">
                  {generatedEnvText}
                </pre>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Your Webhook URL for Meta:
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value="https://your-app.vercel.app/api/webhooks/instagram"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-indigo-300 font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://your-app.vercel.app/api/webhooks/instagram');
                      setCopiedEnv(true);
                      setTimeout(() => setCopiedEnv(false), 2500);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded border border-slate-700 cursor-pointer"
                  >
                    {copiedEnv ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Close Setup
                  </button>
                  {onLaunchConsole && (
                    <button
                      onClick={() => {
                        onClose();
                        onLaunchConsole();
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Open App Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
