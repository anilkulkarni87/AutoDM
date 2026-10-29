import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WorkspaceBar } from './components/WorkspaceBar';
import { CampaignsView } from './components/CampaignsView';
import { AIAgentStudio } from './components/AIAgentStudio';
import { InngestTracesView } from './components/InngestTracesView';
import { AnalyticsView } from './components/AnalyticsView';
import { WebhookConsole } from './components/WebhookConsole';
import { CodeExportModal } from './components/CodeExportModal';
import { InstagramPhonePreview } from './components/InstagramPhonePreview';
import { SelfHostManager } from './components/SelfHostManager';
import { LandingPage } from './components/LandingPage';
import { DocsView } from './components/DocsView';
import { AuthModal } from './components/AuthModal';
import { NonTechSetupWizard } from './components/NonTechSetupWizard';
import {
  Organization,
  Workspace,
  Campaign,
  PostMedia,
  Conversation,
  InngestExecutionTrace,
  SystemLimits,
  PurgeReport,
} from './types';
import { RefreshCw, Play, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<string>('campaigns');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [posts, setPosts] = useState<PostMedia[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [inngestTraces, setInngestTraces] = useState<InngestExecutionTrace[]>([]);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [systemLimits, setSystemLimits] = useState<SystemLimits | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCodeExport, setShowCodeExport] = useState(false);
  const [showPhonePreview, setShowPhonePreview] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [selectedPreviewCampaign, setSelectedPreviewCampaign] = useState<Campaign | undefined>(undefined);

  // Authentication state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name: string;
    avatarUrl: string;
    role: string;
  } | null>({
    email: 'anil77k@gmail.com',
    name: 'Anil K.',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=anil77k',
    role: 'Workspace Owner',
  });

  // Quick simulate modal
  const [showQuickSimulate, setShowQuickSimulate] = useState(false);
  const [simComment, setSimComment] = useState('BLUEPRINT please!');
  const [simUser, setSimUser] = useState('dev_sarah_m');
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial data
  const loadAllData = async (wsId?: string) => {
    try {
      const [wsRes, postsRes, traceRes, limitsRes] = await Promise.all([
        fetch('/api/workspaces').then((r) => r.json()),
        fetch('/api/posts').then((r) => r.json()),
        fetch('/api/inngest/traces').then((r) => r.json()),
        fetch('/api/system/limits').then((r) => r.json()),
      ]);

      setOrganizations(wsRes.organizations || []);
      setWorkspaces(wsRes.workspaces || []);
      setPosts(postsRes || []);
      setInngestTraces(traceRes || []);
      setSystemLimits(limitsRes || null);

      const targetWsId = wsId || activeWorkspaceId || wsRes.workspaces?.[0]?.id || 'ws_growth_scale';
      setActiveWorkspaceId(targetWsId);

      const [campsRes, convsRes, metricsRes] = await Promise.all([
        fetch(`/api/campaigns?workspaceId=${targetWsId}`).then((r) => r.json()),
        fetch(`/api/conversations?workspaceId=${targetWsId}`).then((r) => r.json()),
        fetch(`/api/metrics?workspaceId=${targetWsId}`).then((r) => r.json()),
      ]);

      setCampaigns(campsRes || []);
      setConversations(convsRes || []);
      setMetricsData(metricsRes || null);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
    setIsRefreshing(true);
    loadAllData(id);
    showToast(`Switched workspace to ${id}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAllData(activeWorkspaceId);
    showToast('Refreshed edge state from Turso SQLite');
  };

  // Campaign Handlers
  const handleUpdateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      setCampaigns((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showToast('Workflow deployed to Vercel Edge & Turso database');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCampaign = async (newCamp: Partial<Campaign>) => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCamp),
      });
      const created = await res.json();
      setCampaigns((prev) => [created, ...prev]);
      showToast('Created new Inngest campaign workflow');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      showToast('Campaign deleted');
    } catch (err) {
      console.error(err);
    }
  };

  // Inngest Simulation Handler
  const handleSimulateInngestRun = async (campaignId: string) => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/workflows/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          commenterUsername: 'dev_sarah_m',
          commentText: 'BLUEPRINT please!',
        }),
      });
      const trace = await res.json();
      setInngestTraces((prev) => [trace, ...prev]);
      showToast(`Inngest workflow run completed in ${trace.totalDurationMs}ms`);
      loadAllData(activeWorkspaceId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Quick Webhook Comment Dispatch
  const handleQuickDispatch = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/webhooks/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentText: simComment,
          username: simUser,
          mediaId: posts[0]?.id || 'post_reel_9921',
        }),
      });
      const data = await res.json();
      setShowQuickSimulate(false);
      showToast(`Webhook event received: ${data.matchedCampaign?.name || 'Classified'}`);
      loadAllData(activeWorkspaceId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRunPurge = async (retentionDays: number) => {
    try {
      const res = await fetch('/api/cron/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retentionDays }),
      });
      const data = await res.json();
      showToast(`Purge & Rollup complete: ${data.report.storageReductionPercent}% storage reduction!`);
      loadAllData(activeWorkspaceId);
      return data.report;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleWarmupPing = async () => {
    try {
      const res = await fetch('/api/cron/warmup');
      const data = await res.json();
      showToast(`Keep-alive ping sent to ${data.edgeReplicaNode} (${data.latencyMs}ms)`);
      loadAllData(activeWorkspaceId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleEdition = async () => {
    try {
      const res = await fetch('/api/system/toggle-edition', { method: 'POST' });
      const data = await res.json();
      showToast(`Switched active mode to: ${data.editionMode}`);
      loadAllData(activeWorkspaceId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenPhonePreview = (camp?: Campaign) => {
    setSelectedPreviewCampaign(camp || campaigns[0]);
    setShowPhonePreview(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulator={() => setShowQuickSimulate(true)}
        onOpenCodeExport={() => setShowCodeExport(true)}
        onOpenLanding={() => setViewMode('landing')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSetupWizard={() => setShowSetupWizard(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentUser={currentUser}
      />

      {/* Conditional: Landing Page vs App Console */}
      {viewMode === 'landing' ? (
        <LandingPage
          onEnterApp={() => setViewMode('app')}
          onOpenLogin={() => setIsAuthOpen(true)}
          onOpenDocs={() => {
            setViewMode('app');
            setActiveTab('docs');
          }}
          onOpenSimulator={() => setShowQuickSimulate(true)}
          onOpenSetupWizard={() => setShowSetupWizard(true)}
        />
      ) : (
        <>
          {/* Multi-Tenant Workspace Bar */}
          <WorkspaceBar
            organizations={organizations}
            workspaces={workspaces}
            activeWorkspaceId={activeWorkspaceId}
            onSelectWorkspace={handleSelectWorkspace}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {/* Main Content Viewport */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
                <p className="text-xs font-mono">Initializing Turso SQLite & Inngest Edge Engine...</p>
              </div>
            ) : (
              <>
                {activeTab === 'campaigns' && (
                  <CampaignsView
                    campaigns={campaigns}
                    posts={posts}
                    onUpdateCampaign={handleUpdateCampaign}
                    onCreateCampaign={handleCreateCampaign}
                    onDeleteCampaign={handleDeleteCampaign}
                    onPreviewInPhone={handleOpenPhonePreview}
                  />
                )}

                {activeTab === 'agent' && <AIAgentStudio campaigns={campaigns} />}

                {activeTab === 'inngest' && (
                  <InngestTracesView
                    traces={inngestTraces}
                    campaigns={campaigns}
                    onSimulateRun={handleSimulateInngestRun}
                    isSimulating={isSimulating}
                  />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsView
                    metricsData={metricsData}
                    conversations={conversations}
                    onOpenConversation={(conv) => {
                      handleOpenPhonePreview(campaigns.find((c) => c.id === conv.campaignId));
                    }}
                  />
                )}

                {activeTab === 'webhook' && (
                  <WebhookConsole
                    posts={posts}
                    onWebhookDispatched={() => loadAllData(activeWorkspaceId)}
                  />
                )}

                {activeTab === 'engine' && (
                  <SelfHostManager
                    systemLimits={systemLimits}
                    onRunPurge={handleRunPurge}
                    onWarmupPing={handleWarmupPing}
                    onToggleEdition={handleToggleEdition}
                    onOpenCodeExport={() => setShowCodeExport(true)}
                  />
                )}

                {activeTab === 'docs' && <DocsView />}
              </>
            )}
          </main>

          {/* Console Footer */}
          <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-indigo-400 font-bold">AutoDM Edge</span>
                <span>·</span>
                <span>Edge-Native + Inngest Workflows</span>
                <span>·</span>
                <span>Turso LibSQL Multi-Tenant</span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <button
                  onClick={() => setShowCodeExport(true)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Next.js Edge & Inngest Code
                </button>
                <button
                  onClick={() => handleOpenPhonePreview()}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Instagram Mobile Preview
                </button>
                <button
                  onClick={() => setActiveTab('docs')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  GitHub Documentation
                </button>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Code Export Modal */}
      <CodeExportModal
        isOpen={showCodeExport}
        onClose={() => setShowCodeExport(false)}
      />

      {/* Instagram Phone Preview Modal */}
      <InstagramPhonePreview
        isOpen={showPhonePreview}
        onClose={() => setShowPhonePreview(false)}
        campaign={selectedPreviewCampaign}
        posts={posts}
        conversations={conversations}
        onSendMessage={async (convId, text) => {
          await fetch(`/api/conversations/${convId}/reply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userMessage: text }),
          });
          loadAllData(activeWorkspaceId);
        }}
      />

      {/* Auth Modal (Login / Account Switcher) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          showToast(`Logged in as ${user.email}`);
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out successfully');
        }}
      />

      {/* Non-Technical 1-Click Setup Wizard */}
      <NonTechSetupWizard
        isOpen={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
        onLaunchConsole={() => setViewMode('app')}
      />

      {/* Quick Simulate Comment Modal */}
      {showQuickSimulate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-indigo-400 fill-current" />
                <span>Simulate Instagram Comment Webhook</span>
              </h3>
              <button
                onClick={() => setShowQuickSimulate(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Commenter Handle:
                </label>
                <input
                  type="text"
                  value={simUser}
                  onChange={(e) => setSimUser(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Comment Text:
                </label>
                <input
                  type="text"
                  value={simComment}
                  onChange={(e) => setSimComment(e.target.value)}
                  placeholder="e.g. BLUEPRINT or can i get the code?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowQuickSimulate(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuickDispatch}
                  disabled={isSimulating}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>Dispatch Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/60 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
