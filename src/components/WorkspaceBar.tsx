import React from 'react';
import { Workspace, Organization } from '../types';
import { ShieldCheck, Server, RefreshCw, Instagram } from 'lucide-react';

interface WorkspaceBarProps {
  organizations: Organization[];
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const WorkspaceBar: React.FC<WorkspaceBarProps> = ({
  organizations,
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onRefresh,
  isRefreshing,
}) => {
  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const currentOrg = organizations.find((o) => o.id === currentWorkspace?.organizationId) || organizations[0];

  return (
    <div className="bg-white/70 dark:bg-stone-900/70 border-b border-stone-200/80 dark:border-stone-800/80 px-4 sm:px-6 py-2 transition-colors duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Organization & Workspace selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Account:</span>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{currentOrg?.name}</span>
            <span className="text-stone-300 dark:text-stone-700">/</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={activeWorkspaceId}
                onChange={(e) => onSelectWorkspace(e.target.value)}
                className="bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 font-semibold rounded-lg pl-7 pr-8 py-1 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer appearance-none shadow-xs"
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    @{ws.instagramUsername} ({ws.name})
                  </option>
                ))}
              </select>
              <Instagram className="w-3.5 h-3.5 text-rose-500 absolute left-2 top-1.5 pointer-events-none" />
              <div className="absolute right-2 top-1.5 pointer-events-none text-stone-400 text-[10px]">▼</div>
            </div>
          </div>

          {/* Billing state */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <span>Edition:</span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-1.5 py-0.2 rounded-md">
              {currentOrg?.billingState === 'free' ? 'Free Self-Host' : currentOrg?.billingState}
            </span>
          </div>
        </div>

        {/* Right: Serverless Architecture Badges */}
        <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="hidden lg:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-mono text-stone-600 dark:text-stone-300">
              Meta Token: {currentWorkspace?.encryptedTokenMasked}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-600 dark:text-stone-400">
            <Server className="w-3 h-3 text-rose-500" />
            <span>Groq AI + Turso + Inngest</span>
          </div>

          <button
            onClick={onRefresh}
            className={`p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded-md transition-colors cursor-pointer ${
              isRefreshing ? 'animate-spin text-rose-500' : ''
            }`}
            title="Refresh workspace state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
