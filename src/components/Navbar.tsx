import React from 'react';
import {
  Play,
  Sparkles,
  Terminal,
  FileCode2,
  Layers,
  HardDrive,
  BookOpen,
  User,
  Globe,
  LayoutDashboard,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSimulator: () => void;
  onOpenCodeExport: () => void;
  onOpenLanding: () => void;
  onOpenAuth: () => void;
  viewMode: 'landing' | 'app';
  setViewMode: (mode: 'landing' | 'app') => void;
  currentUser: {
    email: string;
    name: string;
    avatarUrl: string;
    role: string;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSimulator,
  onOpenCodeExport,
  onOpenLanding,
  onOpenAuth,
  viewMode,
  setViewMode,
  currentUser,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Brand Wordmark + Mode Switcher */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={onOpenLanding}
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white whitespace-nowrap hover:opacity-90 transition-opacity cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-mono text-sm font-black">
            ⚡
          </div>
          <span className="text-slate-100">AutoDM</span>
          <span className="font-mono text-[10px] font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-1.5 py-0.5 rounded">
            EDGE
          </span>
        </button>

        {/* View Switcher: Landing vs Console */}
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setViewMode('landing')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'landing'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>
          <button
            onClick={() => setViewMode('app')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'app'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>App Console</span>
          </button>
        </div>
      </div>

      {/* Zone 2: Navigation Links (When in App Console) */}
      {viewMode === 'app' ? (
        <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('agent')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'agent'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI Agent
          </button>
          <button
            onClick={() => setActiveTab('inngest')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'inngest'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Inngest Traces
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Ledger & Stats
          </button>
          <button
            onClick={() => setActiveTab('webhook')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'webhook'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            Webhook Tester
          </button>
          <button
            onClick={() => setActiveTab('engine')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'engine'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            Engine Limits
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'docs'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            GitHub Docs
          </button>
        </nav>
      ) : (
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => {
              setViewMode('app');
              setActiveTab('campaigns');
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Campaign Workflows
          </button>
          <button
            onClick={() => {
              setViewMode('app');
              setActiveTab('inngest');
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Inngest Serverless
          </button>
          <button
            onClick={() => {
              setViewMode('app');
              setActiveTab('docs');
            }}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span>GitHub Documentation</span>
          </button>
        </nav>
      )}

      {/* Zone 3: Primary Actions & User Auth */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenCodeExport}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="Export production Next.js Edge route and Inngest workflows"
        >
          <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Export Code</span>
        </button>

        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Simulate</span>
        </button>

        {/* User Account / Login Button */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 pl-2 pr-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
          title={currentUser ? `Signed in as ${currentUser.email}` : 'Sign in / Switch Account'}
        >
          {currentUser ? (
            <>
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full border border-indigo-500/40 bg-slate-800 object-cover"
              />
              <span className="hidden sm:inline font-medium text-slate-200 max-w-[100px] truncate">
                {currentUser.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </>
          ) : (
            <>
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-200 font-semibold">Sign In</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
