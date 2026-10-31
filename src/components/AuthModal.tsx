import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
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
  const [emailInput, setEmailInput] = useState(currentUser?.email || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const trimmedPassword = passwordInput.trim();
    if (!trimmedPassword) {
      setErrorMessage('Please enter your admin password to continue.');
      return;
    }

    setIsAuthenticating(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: trimmedPassword,
          email: emailInput,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Incorrect admin password.');
        setIsAuthenticating(false);
        return;
      }

      setAuthSuccess(true);
      setTimeout(() => {
        onLogin(data.user);
        setAuthSuccess(false);
        setPasswordInput('');
        setErrorMessage(null);
        onClose();
      }, 500);
    } catch {
      setErrorMessage('Could not connect to authentication service. Please check your connection.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E9E4DC] dark:border-stone-800 bg-white dark:bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1B382B] text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#1E1C1A] dark:text-white font-normal leading-tight">
                {currentUser ? 'Admin Session' : 'Admin Console Access'}
              </h3>
              <p className="text-[11px] text-[#6B655B] dark:text-stone-400">
                {currentUser ? 'Currently active workspace' : 'Enter your password to open the dashboard'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If Already Logged In */}
        {currentUser ? (
          <div className="p-6 space-y-5 text-xs bg-white dark:bg-stone-900">
            <div className="flex items-center gap-3.5 p-4 bg-[#FAF7F2] dark:bg-stone-950 border border-[#E9E4DC] dark:border-stone-800 rounded-2xl">
              <div className="w-11 h-11 rounded-full bg-[#1B382B] text-white flex items-center justify-center font-serif text-base shrink-0">
                {currentUser.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-semibold text-[#1E1C1A] dark:text-white truncate text-sm">{currentUser.name}</h4>
                  <span className="text-[10px] font-mono text-[#1B382B] dark:text-emerald-400 bg-[#E2EFE7] dark:bg-emerald-950/60 border border-[#C5DEC9] dark:border-emerald-800/60 px-1.5 py-0.2 rounded-md font-semibold">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-stone-500 font-mono text-[11px] truncate mt-0.5">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#E9E4DC] dark:border-stone-800 text-[11px] text-[#5A554D] dark:text-stone-400">
              <div className="flex items-center justify-between">
                <span>Instance Mode:</span>
                <span className="text-[#1E1C1A] dark:text-white font-medium">Self-Hosted</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Security Status:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Authenticated</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-medium text-white bg-[#1B382B] hover:bg-[#142C21] rounded-full transition-colors cursor-pointer text-center"
              >
                Go to Console
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="py-2.5 px-4 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs bg-white dark:bg-stone-900">
            <div>
              <label className="block text-xs font-medium text-[#1E1C1A] dark:text-stone-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-950 border border-[#E9E4DC] dark:border-stone-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B382B]/20 font-mono transition-colors"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E1C1A] dark:text-stone-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-950 border border-[#E9E4DC] dark:border-stone-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B382B]/20 font-mono transition-colors"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="leading-snug">{errorMessage}</div>
              </div>
            )}

            <p className="text-[11px] text-[#6B655B] dark:text-stone-400 leading-relaxed pt-1">
              Protected by <code className="bg-[#EFECE6] dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-[10px]">ADMIN_PASSWORD</code> in your environment variables.
            </p>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 text-xs font-medium text-white bg-[#1B382B] hover:bg-[#142C21] rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span>{isAuthenticating ? 'Verifying Password...' : 'Sign in to Admin Console'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {authSuccess && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-mono text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Password verified! Opening console...</span>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
