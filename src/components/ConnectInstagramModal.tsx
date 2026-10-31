import React, { useState, useEffect } from 'react';
import {
  X,
  Instagram,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Radio,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Workspace } from '../types';

interface ConnectInstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWorkspace?: Workspace | null;
  onAccountConnected: (workspace: Workspace) => void;
}

export const ConnectInstagramModal: React.FC<ConnectInstagramModalProps> = ({
  isOpen,
  onClose,
  currentWorkspace,
  onAccountConnected,
}) => {
  const [accessToken, setAccessToken] = useState('');
  const [instagramAccountId, setInstagramAccountId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean;
    instagramUsername: string;
    instagramAccountId: string;
    name: string;
    avatarUrl: string;
    followersCount: number;
    webhookUrl: string;
    verifyToken: string;
    maskedToken: string | null;
  } | null>(null);

  // Load connection status on open
  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    setStatusLoading(true);
    try {
      const res = await fetch('/api/instagram/connection-status');
      if (res.ok) {
        const data = await res.json();
        setConnectionStatus(data);
        if (data.instagramAccountId) {
          setInstagramAccountId(data.instagramAccountId);
        }
      }
    } catch {
      // Fallback
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!accessToken.trim()) {
      setError('Please enter your Meta Page Access Token.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/instagram/connect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: accessToken.trim(),
          instagramAccountId: instagramAccountId.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to connect Instagram account. Check your token and permissions.');
        return;
      }

      setSuccessMessage(data.message || 'Instagram account connected successfully!');
      onAccountConnected(data.workspace);
      setAccessToken('');
      await loadStatus();

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError('Network error connecting to Meta Graph API. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/instagram/disconnect', { method: 'POST' });
      if (res.ok) {
        await loadStatus();
        setSuccessMessage('Disconnected real account. Restored sandbox demo.');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isLive = connectionStatus?.isConnected;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E9E4DC] dark:border-stone-800 bg-white dark:bg-stone-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#1E1C1A] dark:text-white font-medium leading-tight">
                Connect Real Instagram Account
              </h3>
              <p className="text-[11px] text-[#6B655B] dark:text-stone-400">
                Meta Graph API credentials & real-time webhook setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Status Badge Banner */}
          <div
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              isLive
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isLive ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                }`}
              >
                {isLive ? <CheckCircle2 className="w-5 h-5" /> : <Radio className="w-5 h-5 animate-pulse" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {isLive ? `Live Connected: @${connectionStatus?.instagramUsername}` : 'Sandbox Demo Mode Active'}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                      isLive
                        ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {isLive ? 'Live Graph API' : 'Sample Feed'}
                  </span>
                </div>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {isLive
                    ? `Meta Graph API is verified. Real Reels, posts, and DMs are synchronized.`
                    : 'Currently previewing with sample posts. Connect your Meta Page Access Token below to sync your real Instagram feed.'}
                </p>
              </div>
            </div>

            {isLive && (
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={isLoading}
                className="px-3 py-1.5 text-[11px] font-medium text-red-600 dark:text-red-400 bg-white dark:bg-stone-900 hover:bg-red-50 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Disconnect
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleConnect} className="space-y-4 bg-white dark:bg-stone-950 p-5 rounded-2xl border border-[#E9E4DC] dark:border-stone-800">
            <div className="flex items-center justify-between pb-1">
              <span className="font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-stone-500" />
                <span>Meta Graph API Credentials</span>
              </span>
              <a
                href="https://developers.facebook.com/tools/explorer/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Get Token from Graph API Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#1E1C1A] dark:text-stone-300 mb-1">
                Meta Page Access Token (User or Page Token) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                rows={3}
                placeholder="EAAO... (Starts with EAA, generated from developers.facebook.com)"
                className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white font-mono placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B382B]/20"
              />
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                Required permissions on Meta App: <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">instagram_basic</code>, <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">instagram_manage_messages</code>, <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">instagram_manage_comments</code>.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#1E1C1A] dark:text-stone-300 mb-1">
                Instagram Business Account ID (Optional)
              </label>
              <input
                type="text"
                value={instagramAccountId}
                onChange={(e) => setInstagramAccountId(e.target.value)}
                placeholder="e.g. 17841405309281729 (Leave blank to auto-detect from token)"
                className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white font-mono placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B382B]/20"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#1B382B] hover:bg-[#142C21] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Token & Fetching Real Feed...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verify Token & Sync Real Instagram Posts</span>
                </>
              )}
            </button>
          </form>

          {/* Webhook Configuration Details */}
          <div className="space-y-3 bg-white dark:bg-stone-950 p-5 rounded-2xl border border-[#E9E4DC] dark:border-stone-800">
            <div className="flex items-center justify-between pb-1">
              <span className="font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                <span>Meta Webhook Configuration</span>
              </span>
              <span className="text-[10px] font-mono text-stone-500">developers.facebook.com</span>
            </div>

            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
              In your Meta for Developers dashboard under <strong>Instagram &gt; Webhooks</strong>, paste these parameters so Meta dispatches comments to your app:
            </p>

            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-[10px] font-medium text-stone-600 dark:text-stone-400 mb-0.5">
                  <span>Callback URL</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(connectionStatus?.webhookUrl || '', 'webhook')}
                    className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {copiedField === 'webhook' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2 bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-lg font-mono text-[11px] text-stone-800 dark:text-stone-200 select-all break-all">
                  {connectionStatus?.webhookUrl || 'https://your-domain.vercel.app/api/webhooks/instagram'}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-medium text-stone-600 dark:text-stone-400 mb-0.5">
                  <span>Verify Token</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(connectionStatus?.verifyToken || '', 'token')}
                    className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {copiedField === 'token' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Token</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2 bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-lg font-mono text-[11px] text-stone-800 dark:text-stone-200 select-all">
                  {connectionStatus?.verifyToken || 'autodm_edge_secret_verify_token_2026'}
                </div>
              </div>

              <div className="p-2.5 bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl text-[10px] text-stone-600 dark:text-stone-400">
                <span className="font-semibold text-stone-800 dark:text-stone-200 block mb-0.5">Subscribed Webhook Fields:</span>
                Subscribe to <code className="bg-white dark:bg-stone-800 px-1 py-0.5 rounded font-mono">comments</code> and <code className="bg-white dark:bg-stone-800 px-1 py-0.5 rounded font-mono">messages</code>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
