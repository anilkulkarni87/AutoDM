import React, { useState } from 'react';
import {
  ExternalLink,
  ChevronDown,
  Check,
  FolderGit2,
  CheckCircle2,
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
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistMsg, setWaitlistMsg] = useState('');
  const [showDoneForYouModal, setShowDoneForYouModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) return;
    setWaitlistLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail, source: 'landing_hosted_cloud' }),
      });
      const data = await res.json();
      setWaitlistSubmitted(true);
      setWaitlistMsg(data.message || "You're on the list! We'll email you first.");
    } catch {
      setWaitlistSubmitted(true);
      setWaitlistMsg("You're on the priority waitlist! We'll notify you first.");
    } finally {
      setWaitlistLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      q: 'Do I need to be technical?',
      a: "Not if you choose the done-for-you setup. If you'd rather do it yourself, the guide is written for beginners, and the built-in check tells you what to fix.",
    },
    {
      q: 'What do I need to get started?',
      a: "An Instagram Business or Creator account, and a free Meta developer app. Personal accounts can't use Instagram's messaging tools.",
    },
    {
      q: 'Is it safe for my account?',
      a: "It only uses Instagram's official tools, and never your password. Meta sets the rules and can change them, so we can't promise your account is immune from any action. We explain the policies clearly so you can stay well within them.",
    },
    {
      q: 'What does the setup service include?',
      a: "We create and connect everything on your accounts, build and test your first campaign with you, and support you for seven days. It's a one-time payment, and ongoing maintenance is a separate option.",
    },
    {
      q: 'When will the hosted cloud be ready?',
      a: "It depends on Meta's approval process, so we won't guess a date. Joining the waitlist is the best way to hear first.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1C1A] dark:bg-[#151413] dark:text-[#F4F1EA] flex flex-col font-sans transition-colors duration-200">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Intro */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#6B655B] dark:text-stone-400 uppercase font-mono block">
              Free and open source
            </span>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[68px] font-normal tracking-tight text-[#1E1C1A] dark:text-[#F4F1EA] leading-[1.08]">
              When someone asks <br />
              for your link, <em className="italic font-normal">they get <br />it.</em>
            </h1>

            <p className="text-base sm:text-lg text-[#5A554D] dark:text-stone-300 max-w-xl leading-relaxed">
              Ahoy sends a friendly direct message the moment someone comments your keyword on a post or reel. Use it free on your own, or let us set it up for you.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#pricing"
                className="px-6 py-3 rounded-full text-sm font-medium text-white bg-[#1B382B] hover:bg-[#234737] dark:bg-[#284E3D] dark:hover:bg-[#32614C] transition-all shadow-xs"
              >
                See the two ways to start
              </a>
              <a
                href="#how-it-works"
                className="px-6 py-3 rounded-full text-sm font-medium text-[#1E1C1A] dark:text-stone-200 bg-[#EFECE6] hover:bg-[#E7E3DC] dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Right Column: Dialogue Preview Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-4">
              {/* Top Bubble: The Comment */}
              <div className="bg-white dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-2xl p-4 shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E2EFE7] dark:bg-emerald-950/60 text-[#2D5A3E] dark:text-emerald-300 font-bold text-sm flex items-center justify-center shrink-0">
                  M
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-[#7A746B] dark:text-stone-400 block font-normal">
                    maya.reads on your post
                  </span>
                  <p className="text-sm font-medium text-[#1E1C1A] dark:text-white">
                    Link please!
                  </p>
                </div>
              </div>

              {/* Center Divider: A moment later */}
              <div className="text-center">
                <span className="text-xs italic text-[#8C867B] dark:text-stone-500 font-serif">
                  A moment later
                </span>
              </div>

              {/* Bottom Bubble: The Automated DM */}
              <div className="bg-[#1B382B] dark:bg-[#1E3A2F] text-white rounded-2xl p-5 shadow-md space-y-3">
                <p className="text-sm leading-relaxed text-stone-100 font-normal">
                  Ahoy, Maya! Thanks so much for asking. Here's the reading guide you wanted:{' '}
                  <span className="underline underline-offset-2 font-medium">yourname.com/guide</span>
                </p>
                <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A6C5B2]">
                  <span>Sent automatically, from your account</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Three Small Steps */}
      <section id="how-it-works" className="py-20 px-6 sm:px-12 bg-[#F3EFE8] dark:bg-[#191817] border-y border-[#E9E4DC] dark:border-stone-800/80 scroll-mt-12 transition-colors">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1E1C1A] dark:text-[#F4F1EA] font-normal tracking-tight">
              Three small steps, and then you can step away.
            </h2>
            <p className="text-sm sm:text-base text-[#6B655B] dark:text-stone-400">
              You don't need to know how any of it works. This is the whole thing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-2xl p-7 space-y-4 shadow-2xs">
              <span className="font-serif text-3xl text-[#1E1C1A] dark:text-stone-100 font-normal block">
                1
              </span>
              <h3 className="text-base font-semibold text-[#1E1C1A] dark:text-white">
                Connect your account
              </h3>
              <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed">
                Link your Instagram professional account once. We never ask for your password.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-2xl p-7 space-y-4 shadow-2xs">
              <span className="font-serif text-3xl text-[#1E1C1A] dark:text-stone-100 font-normal block">
                2
              </span>
              <h3 className="text-base font-semibold text-[#1E1C1A] dark:text-white">
                Choose your words
              </h3>
              <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed">
                Pick a post, the word people will comment, and write the message you'd like them to receive.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-2xl p-7 space-y-4 shadow-2xs">
              <span className="font-serif text-3xl text-[#1E1C1A] dark:text-stone-100 font-normal block">
                3
              </span>
              <h3 className="text-base font-semibold text-[#1E1C1A] dark:text-white">
                Let it run
              </h3>
              <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed">
                Every comment is answered, and you can see exactly what was sent, skipped, or needs a second look.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Principles / Human Feel */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full space-y-12">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1E1C1A] dark:text-[#F4F1EA] font-normal tracking-tight">
          Made to feel like you, not like a robot.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
          {/* Point 1 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#1E1C1A] dark:text-white">
              Your voice
            </h3>
            <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed">
              Write every message yourself, with the person's name added so it reads personally.
            </p>
          </div>

          {/* Point 2 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#1E1C1A] dark:text-white">
              Links you can measure
            </h3>
            <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed">
              See which posts bring real clicks, without counting link-preview bots.
            </p>
          </div>

          {/* Point 3 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#1E1C1A] dark:text-white">
              A clear record
            </h3>
            <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed">
              Nothing disappears. Every message shows its status and the reason behind it.
            </p>
          </div>

          {/* Point 4 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#1E1C1A] dark:text-white">
              Respect for your audience
            </h3>
            <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed">
              People can opt out, and they're never messaged again.
            </p>
          </div>

          {/* Point 5 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#1E1C1A] dark:text-white">
              Your data stays yours
            </h3>
            <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed">
              It runs in your own accounts. Access tokens are encrypted, and we don't hold them.
            </p>
          </div>

          {/* Point 6 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#1E1C1A] dark:text-white">
              Honest about the rules
            </h3>
            <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed">
              It uses Instagram's official tools, and we explain Meta's policies in plain language.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Two ways to begin / Pricing */}
      <section id="pricing" className="py-20 px-6 sm:px-12 bg-[#FAF7F2] dark:bg-[#151413] border-t border-[#E9E4DC] dark:border-stone-800 scroll-mt-12 transition-colors">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header left-aligned matching the uploaded design */}
          <div className="space-y-2 text-left">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-[#1E1C1A] dark:text-[#F4F1EA] font-normal tracking-tight">
              Two ways to begin. Both are welcome.
            </h2>
            <p className="text-xs sm:text-sm text-[#5A554D] dark:text-stone-400">
              The free version is the complete product. The setup service just saves you the technical part.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: Self-hosted */}
            <div className="bg-white dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-3xl p-8 sm:p-9 flex flex-col justify-between space-y-8 shadow-xs">
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-[#7A746B] dark:text-stone-400 font-medium block">
                    Self-hosted
                  </span>
                  <div className="font-serif text-5xl text-[#1E1C1A] dark:text-white font-normal mt-2">
                    $0
                  </div>
                  <p className="text-xs text-[#6B655B] dark:text-stone-400 mt-1">
                    Free, with nothing held back.
                  </p>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-[#4A453E] dark:text-stone-300">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1E1C1A] dark:text-white mt-0.5">•</span>
                    <span>The full open-source engine</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1E1C1A] dark:text-white mt-0.5">•</span>
                    <span>Unlimited campaigns and messages</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1E1C1A] dark:text-white mt-0.5">•</span>
                    <span>Step-by-step guide with screenshots</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1E1C1A] dark:text-white mt-0.5">•</span>
                    <span>A built-in check that tells you what's wrong</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1E1C1A] dark:text-white mt-0.5">•</span>
                    <span>Friendly community help on GitHub</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenSetupWizard || onEnterApp}
                  className="w-full py-3.5 px-6 rounded-full border border-[#234234] dark:border-stone-700 bg-white dark:bg-stone-800 text-[#234234] dark:text-white font-medium text-xs sm:text-sm hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors cursor-pointer text-center"
                >
                  Start on your own
                </button>
              </div>
            </div>

            {/* Card 2: Done-for-you setup */}
            <div className="bg-[#234234] dark:bg-[#1E3A2F] text-white rounded-3xl p-8 sm:p-9 flex flex-col justify-between space-y-8 shadow-sm">
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-[#A6C5B2] font-medium block">
                    Done-for-you setup
                  </span>
                  <div className="font-serif text-5xl text-white font-normal mt-2">
                    $20
                  </div>
                  <p className="text-xs text-[#A6C5B2] mt-1">
                    Paid once. No subscription.
                  </p>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-stone-100">
                  <li className="flex items-start gap-2.5">
                    <span className="text-white mt-0.5">•</span>
                    <span>Everything in the free version</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-white mt-0.5">•</span>
                    <span>We set up your Meta app and connections</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-white mt-0.5">•</span>
                    <span>Installed on your own accounts, so you own it all</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-white mt-0.5">•</span>
                    <span>Your first campaign built and tested with you</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-white mt-0.5">•</span>
                    <span>A walkthrough and seven days of support</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowDoneForYouModal(true)}
                  className="w-full py-3.5 px-6 rounded-full bg-white text-[#234234] font-semibold text-xs sm:text-sm hover:bg-stone-100 transition-colors shadow-xs cursor-pointer text-center"
                >
                  Book my setup
                </button>
              </div>
            </div>
          </div>

          {/* Hosted Cloud Waitlist Bar (Only shown if VITE_ENABLE_WAITLIST=true is set; hidden by default for clones) */}
          {import.meta.env.VITE_ENABLE_WAITLIST === 'true' && (
            <div className="bg-white dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-2xl p-6 sm:p-7 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-6 shadow-2xs">
              <div className="space-y-1 max-w-md">
                <span className="text-xs font-semibold text-[#1E1C1A] dark:text-white block">
                  Hosted cloud, coming soon
                </span>
                <p className="text-xs text-[#6B655B] dark:text-stone-400 leading-relaxed">
                  Prefer one login button and nothing to host? We're building managed cloud accounts. Leave your email and we'll invite you first.
                </p>
              </div>

              <div className="w-full sm:w-auto">
                {waitlistSubmitted ? (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-[#E2EFE7] dark:bg-emerald-950/50 border border-[#C5DEC9] dark:border-emerald-800 px-4 py-2.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{waitlistMsg || "You're on the list! We'll email you first."}</span>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="flex items-center gap-2">
                    <input
                      type="email"
                      required
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-[#FAF7F2] dark:bg-stone-950 border border-[#DCD6CA] dark:border-stone-700 rounded-full px-4 py-2.5 text-xs text-[#1E1C1A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1B382B] w-48 sm:w-56"
                    />
                    <button
                      type="submit"
                      disabled={waitlistLoading}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#1B382B] hover:bg-[#234737] dark:bg-[#284E3D] dark:hover:bg-[#32614C] whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {waitlistLoading ? 'Adding...' : 'Join the waitlist'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 5: FAQ Accordion ("Questions people ask first") */}
      <section id="questions" className="py-20 px-6 sm:px-12 max-w-4xl mx-auto w-full space-y-10 scroll-mt-12">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1E1C1A] dark:text-[#F4F1EA] font-normal tracking-tight">
          Questions people ask first
        </h2>

        <div className="divide-y divide-[#E9E4DC] dark:divide-stone-800 border-y border-[#E9E4DC] dark:border-stone-800">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left flex items-center justify-between gap-4 text-base font-semibold text-[#1E1C1A] dark:text-white hover:text-[#1B382B] dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">▸</span>
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pt-3 pl-5 pr-2 text-xs sm:text-sm text-[#5A554D] dark:text-stone-300 leading-relaxed animate-in fade-in duration-150">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 6: Footer */}
      <footer className="mt-auto border-t border-[#E9E4DC] dark:border-stone-800 bg-[#F3EFE8] dark:bg-[#121115] py-8 px-6 sm:px-12 text-xs text-[#7A746B] dark:text-stone-400 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-base text-[#1E1C1A] dark:text-stone-200 font-medium">
              Ahoy.
            </span>
            <span>Open source, built with care.</span>
          </div>

          <div className="flex items-center gap-5 font-medium text-[#4A453E] dark:text-stone-300">
            <a
              href="https://github.com/anilkulkarni87/AutoDM/blob/main/docs/CAMPAIGNS_AND_WORKFLOWS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/anilkulkarni87/AutoDM"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
            </a>
          </div>
        </div>
      </footer>

      {/* Done-For-You Modal ($20 Setup) */}
      <DoneForYouModal
        isOpen={showDoneForYouModal}
        onClose={() => setShowDoneForYouModal(false)}
        defaultEmail="anil77k@gmail.com"
      />
    </div>
  );
};
