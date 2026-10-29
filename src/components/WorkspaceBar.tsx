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
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Organization & Workspace selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Org:</span>
            <span className="text-xs font-bold text-slate-200">{currentOrg?.name}</span>
            <span className="text-slate-600">/</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={activeWorkspaceId}
                onChange={(e) => onSelectWorkspace(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 text-xs text-slate-200 font-semibold rounded-md pl-7 pr-8 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    @{ws.instagramUsername} ({ws.name})
                  </option>
                ))}
              </select>
              <Instagram className="w-3.5 h-3.5 text-pink-400 absolute left-2 top-2 pointer-events-none" />
              <div className="absolute right-2 top-2 pointer-events-none text-slate-500 text-[10px]">▼</div>
            </div>
          </div>

          {/* Billing state */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span>Plan:</span>
            <span className="text-[11px] font-mono font-medium text-emerald-400 uppercase bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.2 rounded">
              {currentOrg?.billingState} tier
            </span>
          </div>
        </div>

        {/* Right: Serverless Architecture Badges */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="hidden lg:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono text-slate-300">Meta Token: {currentWorkspace?.encryptedTokenMasked}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <Server className="w-3 h-3 text-indigo-400" />
            <span>Turso SQLite + Inngest Workflows</span>
          </div>

          <button
            onClick={onRefresh}
            className={`p-1 text-slate-400 hover:text-slate-200 rounded transition-colors ${
              isRefreshing ? 'animate-spin text-indigo-400' : ''
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
