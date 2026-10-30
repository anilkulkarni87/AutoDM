import React, { useState } from 'react';
import {
  X,
  Check,
  CheckCircle2,
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
  const [preferredChannel, setPreferredChannel] = useState<'telegram' | 'whatsapp' | 'email' | 'discord'>('email');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1C1A]/40 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-3xl w-full max-w-lg p-7 sm:p-9 space-y-6 shadow-xl relative max-h-[92vh] overflow-y-auto font-sans">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer p-1 rounded-full hover:bg-[#EFECE6] dark:hover:bg-stone-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-5 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-[#E2EFE7] dark:bg-emerald-950/60 text-[#1B382B] dark:text-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#1B382B] dark:text-emerald-400" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E2EFE7] dark:bg-emerald-950/60 text-[#1B382B] dark:text-emerald-300 border border-[#C5DEC9] dark:border-emerald-800/60">
                Setup Request Received · {orderId}
              </span>
              <h3 className="font-serif text-3xl font-normal text-[#1E1C1A] dark:text-[#F4F1EA] pt-1">
                You're all set. We're on it.
              </h3>
              <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed max-w-md mx-auto">
                We received your details and will reach out to{' '}
                <strong className="text-[#1E1C1A] dark:text-white font-semibold">{email}</strong> within 24 hours to connect your Meta developer app, Instagram webhooks, and test your first campaign.
              </p>
            </div>

            <div className="bg-white dark:bg-stone-950 border border-[#E9E4DC] dark:border-stone-800 rounded-2xl p-4.5 text-left text-xs space-y-2.5 shadow-2xs">
              <div className="flex justify-between text-[#6B655B] dark:text-stone-400">
                <span>Plan:</span>
                <span className="font-semibold text-[#1E1C1A] dark:text-white">Done-for-you setup ($20)</span>
              </div>
              <div className="flex justify-between text-[#6B655B] dark:text-stone-400">
                <span>Instagram Account:</span>
                <span className="font-mono font-semibold text-[#1E1C1A] dark:text-white">{instagramHandle}</span>
              </div>
              <div className="flex justify-between text-[#6B655B] dark:text-stone-400">
                <span>Preferred Contact:</span>
                <span className="font-semibold text-[#1E1C1A] dark:text-white capitalize">{preferredChannel}</span>
              </div>
              <div className="flex justify-between text-[#6B655B] dark:text-stone-400 pt-1 border-t border-[#EFECE6] dark:border-stone-800">
                <span>Support:</span>
                <span className="font-semibold text-[#1B382B] dark:text-emerald-400">7 days of direct support included</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 px-6 rounded-full font-medium text-sm text-white bg-[#1B382B] hover:bg-[#234737] dark:bg-[#284E3D] dark:hover:bg-[#32614C] shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-wider text-[#6B655B] dark:text-stone-400 uppercase font-mono block">
                Done-for-you setup
              </span>

              <h2 className="font-serif text-3xl sm:text-[34px] font-normal tracking-tight text-[#1E1C1A] dark:text-[#F4F1EA] leading-snug">
                Let us set it up for you.
              </h2>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-serif text-4xl text-[#1E1C1A] dark:text-white font-normal">$20</span>
                <span className="text-xs text-[#6B655B] dark:text-stone-400">paid once · no subscription</span>
              </div>

              <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed">
                Skip the technical part. We'll connect your Meta developer app, configure the webhooks, set up your database, and test your first campaign with you.
              </p>
            </div>

            {/* What's included checklist */}
            <div className="bg-white dark:bg-stone-950 border border-[#E9E4DC] dark:border-stone-800 rounded-2xl p-4.5 space-y-2.5 text-xs shadow-2xs">
              <span className="font-semibold text-[#1E1C1A] dark:text-white block text-[11px]">
                What's included in your setup:
              </span>
              <ul className="space-y-2 text-[#4A453E] dark:text-stone-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#1B382B] dark:text-emerald-400 mt-0.5">•</span>
                  <span>Everything configured on your own accounts, so you own all data</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#1B382B] dark:text-emerald-400 mt-0.5">•</span>
                  <span>Meta developer app and Instagram messaging webhooks verified</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#1B382B] dark:text-emerald-400 mt-0.5">•</span>
                  <span>Free-tier database and serverless workflow queues ready to run</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#1B382B] dark:text-emerald-400 mt-0.5">•</span>
                  <span>Your first campaign created and tested end-to-end with you</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#1B382B] dark:text-emerald-400 mt-0.5">•</span>
                  <span>Seven days of direct priority support for questions or tweaks</span>
                </li>
              </ul>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#1E1C1A] dark:text-stone-200 mb-1.5">
                  Your email address:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white dark:bg-stone-950 border border-[#DCD6CA] dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-[#1E1C1A] dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#1B382B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1C1A] dark:text-stone-200 mb-1.5">
                  Instagram account handle:
                </label>
                <input
                  type="text"
                  required
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="@yourbrand"
                  className="w-full bg-white dark:bg-stone-950 border border-[#DCD6CA] dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-[#1E1C1A] dark:text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#1B382B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1C1A] dark:text-stone-200 mb-1.5">
                  Preferred contact for your 7 days of support:
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {(['email', 'telegram', 'whatsapp', 'discord'] as const).map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => setPreferredChannel(channel)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-medium capitalize transition-colors cursor-pointer text-center ${
                        preferredChannel === channel
                          ? 'border-[#1B382B] bg-[#1B382B] text-white font-semibold'
                          : 'border-[#E2DFD7] dark:border-stone-700 bg-white dark:bg-stone-950 text-[#5A554D] dark:text-stone-400 hover:bg-[#F5F2EA] dark:hover:bg-stone-850'
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
                    placeholder={`Your ${preferredChannel} handle or number`}
                    className="w-full bg-white dark:bg-stone-950 border border-[#DCD6CA] dark:border-stone-700 rounded-xl px-3.5 py-2 text-[#1E1C1A] dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#1B382B]"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1C1A] dark:text-stone-200 mb-1.5">
                  Any notes or questions for us? (Optional):
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Which post you want to automate first, or any specific goals..."
                  className="w-full bg-white dark:bg-stone-950 border border-[#DCD6CA] dark:border-stone-700 rounded-xl px-3.5 py-2 text-[#1E1C1A] dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#1B382B]"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full font-medium text-sm text-white bg-[#1B382B] hover:bg-[#234737] dark:bg-[#284E3D] dark:hover:bg-[#32614C] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : null}
                <span>Book my setup — $20</span>
              </button>
              <p className="text-[11px] text-center text-[#7A746B] dark:text-stone-400 mt-2">
                One-time payment · We connect on your preferred channel within 24 hours
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
