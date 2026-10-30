import React from 'react';
import {
  Layers,
  HardDrive,
  User,
  Globe,
  LayoutDashboard,
  Zap,
  Sun,
  Moon,
  Sparkles,
  Terminal,
  ExternalLink,
  FolderGit2,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLanding: () => void;
  onOpenAuth: () => void;
  onOpenSetupWizard?: () => void;
  viewMode: 'landing' | 'app';
  setViewMode: (mode: 'landing' | 'app') => void;
  currentUser: {
    email: string;
    name: string;
    avatarUrl: string;
    role: string;
  } | null;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLanding,
  onOpenAuth,
  onOpenSetupWizard,
  viewMode,
  setViewMode,
  currentUser,
  theme = 'light',
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 sm:px-8 py-3 bg-[#FAF7F2]/90 dark:bg-[#151413]/90 backdrop-blur-md border-b border-[#E9E4DC] dark:border-stone-800/80 transition-colors duration-200">
      {/* Zone 1: Brand Wordmark + Mode Switcher */}
      <div className="flex items-center gap-3.5 shrink-0">
        <button
          onClick={onOpenLanding}
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-stone-900 dark:text-white whitespace-nowrap hover:opacity-90 transition-opacity cursor-pointer text-left"
        >
          <span className="font-serif text-2xl font-normal text-[#1E1C1A] dark:text-[#F4F1EA]">
            Ahoy
          </span>
          <span className="text-[10px] font-semibold text-[#1B382B] dark:text-emerald-400 bg-[#E2EFE7] dark:bg-emerald-950/60 border border-[#C5DEC9] dark:border-emerald-800/60 px-1.5 py-0.5 rounded-full font-mono">
            AutoDM
          </span>
        </button>

        {/* View Switcher: Landing vs Console */}
        <div className="hidden lg:flex items-center bg-[#EFECE6] dark:bg-stone-900/90 border border-[#E9E4DC] dark:border-stone-800 p-0.5 rounded-full text-xs">
          <button
            onClick={() => setViewMode('landing')}
            className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer font-medium ${
              viewMode === 'landing'
                ? 'bg-white dark:bg-stone-800 text-[#1E1C1A] dark:text-white shadow-xs font-semibold'
                : 'text-[#6B655B] dark:text-stone-400 hover:text-black dark:hover:text-stone-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setViewMode('app')}
            className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer font-medium ${
              viewMode === 'app'
                ? 'bg-white dark:bg-stone-800 text-[#1E1C1A] dark:text-white shadow-xs font-semibold'
                : 'text-[#6B655B] dark:text-stone-400 hover:text-black dark:hover:text-stone-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#1B382B] dark:text-emerald-400" />
            <span>App Console</span>
          </button>
        </div>
      </div>

      {/* Zone 2: Navigation Links (When in App Console) */}
      {viewMode === 'app' ? (
        <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-stone-600 dark:text-stone-400">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-rose-50 dark:bg-stone-800 text-rose-700 dark:text-stone-100 font-bold shadow-xs'
                : 'hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('agent')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'agent'
                ? 'bg-rose-50 dark:bg-stone-800 text-rose-700 dark:text-stone-100 font-bold shadow-xs'
                : 'hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            AI Agent
          </button>
          <button
            onClick={() => setActiveTab('inngest')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'inngest'
                ? 'bg-rose-50 dark:bg-stone-800 text-rose-700 dark:text-stone-100 font-bold shadow-xs'
                : 'hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            Inngest Traces
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-rose-50 dark:bg-stone-800 text-rose-700 dark:text-stone-100 font-bold shadow-xs'
                : 'hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900'
            }`}
          >
            Conversations & Stats
          </button>
          <button
            onClick={() => setActiveTab('webhook')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'webhook'
                ? 'bg-rose-50 dark:bg-stone-800 text-rose-700 dark:text-stone-100 font-bold shadow-xs'
                : 'hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-500" />
            Webhook Tester
          </button>
          <button
            onClick={() => setActiveTab('engine')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'engine'
                ? 'bg-rose-50 dark:bg-stone-800 text-rose-700 dark:text-stone-100 font-bold shadow-xs'
                : 'hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-purple-500" />
            Self-Host Engine
          </button>
        </nav>
      ) : (
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#5A554D] dark:text-stone-400">
          <a
            href="#how-it-works"
            className="hover:text-[#1E1C1A] dark:hover:text-white transition-colors cursor-pointer"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="hover:text-[#1E1C1A] dark:hover:text-white transition-colors cursor-pointer"
          >
            Pricing
          </a>
          <a
            href="#questions"
            className="hover:text-[#1E1C1A] dark:hover:text-white transition-colors cursor-pointer"
          >
            Questions
          </a>
          <a
            href="https://github.com/anil77k/autodm-edge"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1E1C1A] dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>GitHub</span>
            <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
          </a>
        </nav>
      )}

      {/* Zone 3: Primary Actions, Theme Toggle & User Auth */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Light / Dark Mode Toggle */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100/90 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            title={theme === 'dark' ? 'Switch to Warm Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                <span className="hidden sm:inline text-[11px] font-semibold">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-purple-600 fill-purple-600/20" />
                <span className="hidden sm:inline text-[11px] font-semibold">Dark</span>
              </>
            )}
          </button>
        )}

        {onOpenSetupWizard && (
          <button
            onClick={onOpenSetupWizard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            title="1-Click Self-Host Wizard (Groq AI Free Tier + Vercel)"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">1-Click Self-Host</span>
            <span className="sm:hidden">Self-Host</span>
          </button>
        )}

        {/* User Account / Login Button */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 pl-2 pr-2.5 py-1 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-lg text-xs transition-colors cursor-pointer"
          title={currentUser ? `Signed in as ${currentUser.email}` : 'Sign in / Switch Account'}
        >
          {currentUser ? (
            <>
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full border border-rose-300 dark:border-rose-500/40 bg-stone-200 dark:bg-stone-800 object-cover"
              />
              <span className="hidden sm:inline font-semibold text-stone-800 dark:text-stone-200 max-w-[100px] truncate">
                {currentUser.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </>
          ) : (
            <>
              <User className="w-4 h-4 text-stone-500" />
              <span className="text-stone-800 dark:text-stone-200 font-semibold">Sign In</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
