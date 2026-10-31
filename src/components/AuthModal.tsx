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
  Clock,
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
  const [authMethod, setAuthMethod] = useState<'email' | 'byoMeta' | 'instagram'>('email');
  const [emailInput, setEmailInput] = useState(currentUser?.email || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [byoAppId, setByoAppId] = useState('');
  const [byoAppSecret, setByoAppSecret] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateLogin = (method: string) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      const email = emailInput.trim() || 'admin@selfhosted.local';
      const name = email.includes('@') ? email.split('@')[0] : 'Admin';
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      onLogin({
        email,
        name: capitalizedName,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
        role: method === 'byoMeta' ? 'Self-Hosted Owner' : 'Instance Admin',
      });
      setTimeout(() => {
        setAuthSuccess(false);
        onClose();
      }, 700);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              ⚡
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white tracking-tight">
              {currentUser ? 'Account & Session' : 'Sign In to AutoDM'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If Already Logged In */}
        {currentUser ? (
          <div className="p-6 space-y-5 text-xs">
            <div className="flex items-center gap-3.5 p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shrink-0">
                <div className="w-full h-full bg-white dark:bg-stone-950 rounded-full flex items-center justify-center font-bold text-sm text-stone-900 dark:text-white">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-stone-900 dark:text-white truncate">{currentUser.name}</h4>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-1.5 py-0.2 rounded-md font-bold">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-stone-500 font-mono text-[11px] truncate mt-0.5">
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-400 font-mono">
                  <span>Session: Active</span>
                  <span>·</span>
                  <span>Auth: Verified</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                <span>Connected Workspace:</span>
                <span className="text-stone-900 dark:text-white font-mono font-bold">@alexgrowth.co</span>
              </div>
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                <span>Meta Graph Token:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Active & Secured</span>
              </div>
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                <span>AI Intent Model:</span>
                <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">Groq AI Free Tier LPU</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="py-2 px-4 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/60 rounded-xl transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="p-6 space-y-5 text-xs">
            {/* Method Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 text-[11px]">
              <button
                onClick={() => setAuthMethod('email')}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  authMethod === 'email'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setAuthMethod('byoMeta')}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  authMethod === 'byoMeta'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                Self-Host BYO
              </button>
              <button
                onClick={() => setAuthMethod('instagram')}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  authMethod === 'instagram'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                1-Click Meta
              </button>
            </div>

            {/* TAB 1: Admin Sign In */}
            {authMethod === 'email' && (
              <div className="space-y-3.5">
                <div className="p-3 bg-[#FAF7F2] dark:bg-stone-950 border border-[#E9E4DC] dark:border-stone-800 rounded-xl text-[11px] text-[#5A554D] dark:text-stone-400">
                  <span className="font-semibold text-[#1E1C1A] dark:text-white block mb-0.5">Self-Host Owner Access</span>
                  Logging in unlocks the administrative console to manage campaigns, Meta tokens, and AI rules on your deployment.
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">Admin Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="admin@yourdomain.com"
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl pl-8 pr-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B382B]/20 font-mono"
                    />
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">Admin Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl pl-8 pr-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B382B]/20 font-mono"
                    />
                    <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <button
                  onClick={() => handleSimulateLogin('email')}
                  disabled={isAuthenticating}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#1B382B] hover:bg-[#142C21] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{isAuthenticating ? 'Unlocking Console...' : 'Unlock Admin Console'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* TAB 2: Self-Hosted BYO Meta Credentials */}
            {authMethod === 'byoMeta' && (
              <div className="space-y-3">
                <div className="p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-600 dark:text-stone-400 text-[11px]">
                  <span className="font-bold text-stone-900 dark:text-stone-200 block mb-0.5">Self-Hosted Community Mode:</span>
                  Provide your Meta Developer App credentials from developers.facebook.com to authenticate your self-hosted instance.
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">Meta App ID</label>
                  <input
                    type="text"
                    value={byoAppId}
                    onChange={(e) => setByoAppId(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">Meta App Secret</label>
                  <input
                    type="password"
                    value={byoAppSecret}
                    onChange={(e) => setByoAppSecret(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-900 dark:text-white font-mono"
                  />
                </div>

                <button
                  onClick={() => handleSimulateLogin('byoMeta')}
                  disabled={isAuthenticating}
                  className="w-full py-2.5 text-xs font-bold text-stone-900 dark:text-white bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Server className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isAuthenticating ? 'Verifying credentials...' : 'Authenticate Self-Hosted Instance'}</span>
                </button>
              </div>
            )}

            {/* TAB 3: 1-Click Meta Login (Paid Cloud - Coming Soon) */}
            {authMethod === 'instagram' && (
              <div className="space-y-4">
                <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-stone-700 dark:text-stone-300 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                      <span>Managed Cloud Exemption</span>
                    </span>
                    <span className="text-[9px] font-mono font-black text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-full uppercase">
                      Coming Soon · Beta
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400">
                    Connects directly without setting up Meta App Review. This paid feature is currently finalizing review. You can log in via <strong>Email</strong> or <strong>Self-Host BYO</strong> today!
                  </p>
                </div>

                <button
                  onClick={() => handleSimulateLogin('instagram')}
                  disabled={isAuthenticating}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Instagram className="w-4 h-4" />
                  <span>
                    {isAuthenticating ? 'Connecting to Meta Graph API...' : 'Preview 1-Click Instagram Login'}
                  </span>
                </button>
              </div>
            )}

            {authSuccess && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-mono text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Authentication verified! Launching workspace...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
