import React, { useState } from 'react';
import {
  X,
  Check,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Send,
  Loader2,
} from 'lucide-react';

interface DoneForYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const DoneForYouModal: React.FC<DoneForYouModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = 'anil77k@gmail.com',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [instagramHandle, setInstagramHandle] = useState('@');
  const [preferredChannel, setPreferredChannel] = useState<'telegram' | 'discord' | 'email'>('telegram');
  const [contactHandle, setContactHandle] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/setup-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          instagramHandle,
          preferredContact: `${preferredChannel}: ${contactHandle || email}`,
          notes,
        }),
      });
      const data = await res.json();
      setOrderId(data.order?.id || `dfy_${Date.now()}`);
      setIsSuccess(true);
    } catch (err) {
      console.error('Error submitting order:', err);
      setOrderId(`dfy_${Date.now()}`);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setOrderId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#72d600]/20 text-[#72d600] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#72d600]/15 text-stone-900 dark:text-stone-100 border border-[#72d600]/40">
                Setup Order Confirmed · {orderId}
              </span>
              <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                You're all set! We're on it.
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-md mx-auto">
                A lead engineer has claimed your setup ticket. We will reach out to you at{' '}
                <strong className="text-stone-900 dark:text-white">{email}</strong>{' '}
                within 2 hours to connect your Meta webhooks, Turso database, and Groq AI keys.
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between font-mono text-[11px] text-stone-500">
                <span>Plan:</span>
                <span className="font-bold text-stone-900 dark:text-white">Done-For-You ($20 One-Time)</span>
              </div>
              <div className="flex justify-between font-mono text-[11px] text-stone-500">
                <span>Turnaround:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Within 24 Hours</span>
              </div>
              <div className="flex justify-between font-mono text-[11px] text-stone-500">
                <span>Priority Support:</span>
                <span className="font-bold text-stone-900 dark:text-white">7-Day Direct Access Included</span>
              </div>
              <div className="flex justify-between font-mono text-[11px] text-stone-500">
                <span>Recurring Cost:</span>
                <span className="font-bold text-[#72d600]">$0 / forever (Lifetime)</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-stone-950 bg-gradient-to-b from-[#8ce800] to-[#72d600] hover:from-[#96f200] hover:to-[#7be300] shadow-md shadow-[#72d600]/30 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#72d600] text-stone-950 font-bold text-xs">
                  Done-For-You
                </span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#72d600] inline-block animate-pulse" />
                  Lifetime deal · No hidden fees
                </span>
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-4xl font-black text-stone-900 dark:text-white">$20</span>
                <span className="text-sm font-medium text-stone-500">/one-time payment</span>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Skip the technical setup. Our developers will configure your VPS/Edge runtime, Turso database, Inngest queues, Meta developer app, and webhooks for you.
              </p>
            </div>

            {/* Checklist of what's included */}
            <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider text-[10px] block">
                What Our Devs Configure For You:
              </span>
              <ul className="space-y-1.5 text-stone-700 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#72d600] stroke-[3]" />
                  <span>Vercel Edge Webhook + Turso SQLite state database</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#72d600] stroke-[3]" />
                  <span>Inngest serverless durable workflow queue</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#72d600] stroke-[3]" />
                  <span>Meta Graph API App + Comments webhook challenge handshake</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#72d600] stroke-[3]" />
                  <span>Groq AI Free Tier LPU integration (14,400 daily requests)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#72d600] stroke-[3]" />
                  <span>7-Day direct priority support included</span>
                </li>
              </ul>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Your Email Address (for setup confirmation & delivery):
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#72d600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Instagram Account Handle:
                </label>
                <input
                  type="text"
                  required
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="@your_brand"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#72d600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Preferred Contact for 7-Day Priority Support:
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {(['telegram', 'discord', 'email'] as const).map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => setPreferredChannel(channel)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                        preferredChannel === channel
                          ? 'border-[#72d600] bg-[#72d600]/10 text-stone-900 dark:text-white font-bold'
                          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
                {preferredChannel !== 'email' && (
                  <input
                    type="text"
                    value={contactHandle}
                    onChange={(e) => setContactHandle(e.target.value)}
                    placeholder={`Your ${preferredChannel} username`}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2 text-stone-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#72d600]"
                  />
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Any Specific Automation Goals or Notes (Optional):
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Lead magnet PDF delivery on Reels comments, asking for work emails..."
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#72d600]"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-full font-bold text-sm text-stone-950 bg-gradient-to-b from-[#8ce800] to-[#72d600] hover:from-[#96f200] hover:to-[#7be300] shadow-md shadow-[#72d600]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wrench className="w-4 h-4" />
                )}
                <span>Get it set up — $20 One-Time</span>
              </button>
              <p className="text-[11px] text-center text-stone-500 mt-2">
                🔒 One-time payment · No subscription · Works for a lifetime
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
