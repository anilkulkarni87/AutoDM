import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  Instagram,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Server,
  User,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    email: string;
    name: string;
    avatarUrl: string;
    role: string;
  } | null;
  onLogin: (user: { email: string; name: string; avatarUrl: string; role: string }) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [authMethod, setAuthMethod] = useState<'instagram' | 'email' | 'byoMeta'>('instagram');
  const [emailInput, setEmailInput] = useState(currentUser?.email || 'anil77k@gmail.com');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [byoAppId, setByoAppId] = useState('178414053092');
  const [byoAppSecret, setByoAppSecret] = useState('••••••••••••••••••••••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateLogin = (method: string) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      onLogin({
        email: emailInput || 'anil77k@gmail.com',
        name: emailInput.split('@')[0] || 'Anil K.',
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${emailInput}`,
        role: method === 'byoMeta' ? 'Self-Hosted Admin' : 'Workspace Owner',
      });
      setTimeout(() => {
        setAuthSuccess(false);
        onClose();
      }, 900);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xs">
              ⚡
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {currentUser ? 'Account & Session' : 'Sign in to AutoDM Edge'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If Already Logged In */}
        {currentUser ? (
          <div className="p-6 space-y-5 text-xs">
            <div className="flex items-center gap-3.5 p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-sm text-white">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-white truncate">{currentUser.name}</h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.2 rounded">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-slate-400 font-mono text-[11px] truncate mt-0.5">
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                  <span>Session: Active</span>
                  <span>·</span>
                  <span>Auth: Edge Verified</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Connected Workspace:</span>
                <span className="text-white font-mono font-medium">@acme.growth</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Meta Graph Token:</span>
                <span className="text-emerald-400 font-mono">AES-256-GCM Active</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Multi-Tenant Org:</span>
                <span className="text-slate-300 font-mono">org_acme_growth</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="py-2 px-4 text-xs font-semibold text-red-400 bg-red-950/40 hover:bg-red-900/40 border border-red-900/60 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="p-6 space-y-5 text-xs">
            {/* Method Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setAuthMethod('instagram')}
                className={`py-1.5 rounded-md font-semibold transition-all ${
                  authMethod === 'instagram'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1-Click Meta
              </button>
              <button
                onClick={() => setAuthMethod('email')}
                className={`py-1.5 rounded-md font-semibold transition-all ${
                  authMethod === 'email'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setAuthMethod('byoMeta')}
                className={`py-1.5 rounded-md font-semibold transition-all ${
                  authMethod === 'byoMeta'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Self-Host BYO
              </button>
            </div>

            {/* TAB 1: 1-Click Meta Login (SaaS Pro approved app) */}
            {authMethod === 'instagram' && (
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-pink-950/30 to-purple-950/30 border border-pink-900/40 rounded-xl text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-pink-400 font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Meta App Review Exemption (Managed Cloud)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    Instantly connects your Instagram Professional account using AutoDM's globally approved Meta Developer App. Zero developer setup required.
                  </p>
                </div>

                <button
                  onClick={() => handleSimulateLogin('instagram')}
                  disabled={isAuthenticating}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  <span>
                    {isAuthenticating ? 'Connecting to Meta Graph API...' : 'Continue with Instagram'}
                  </span>
                </button>
              </div>
            )}

            {/* TAB 2: Email Sign In */}
            {authMethod === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <button
                  onClick={() => handleSimulateLogin('email')}
                  disabled={isAuthenticating}
                  className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{isAuthenticating ? 'Signing in...' : 'Sign In with Email'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* TAB 3: Self-Hosted BYO Meta Credentials */}
            {authMethod === 'byoMeta' && (
              <div className="space-y-3">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-200 block mb-0.5">Self-Hosted Community Mode:</span>
                  Provide your custom Meta Developer App credentials from developers.facebook.com to authenticate your local deployment.
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Meta App ID</label>
                  <input
                    type="text"
                    value={byoAppId}
                    onChange={(e) => setByoAppId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Meta App Secret</label>
                  <input
                    type="password"
                    value={byoAppSecret}
                    onChange={(e) => setByoAppSecret(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <button
                  onClick={() => handleSimulateLogin('byoMeta')}
                  disabled={isAuthenticating}
                  className="w-full py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <Server className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isAuthenticating ? 'Verifying credentials...' : 'Authenticate Self-Hosted Instance'}</span>
                </button>
              </div>
            )}

            {authSuccess && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-400 text-xs font-mono text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Authentication verified! Launching workspace...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
