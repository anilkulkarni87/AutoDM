import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WorkspaceBar } from './components/WorkspaceBar';
import { CampaignsView } from './components/CampaignsView';
import { AIAgentStudio } from './components/AIAgentStudio';
import { InngestTracesView } from './components/InngestTracesView';
import { AnalyticsView } from './components/AnalyticsView';
import { WebhookConsole } from './components/WebhookConsole';
import { InstagramPhonePreview } from './components/InstagramPhonePreview';
import { SelfHostManager } from './components/SelfHostManager';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { NonTechSetupWizard } from './components/NonTechSetupWizard';
import { ConnectInstagramModal } from './components/ConnectInstagramModal';
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
import { RefreshCw, CheckCircle2, ExternalLink } from 'lucide-react';

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
  const [showPhonePreview, setShowPhonePreview] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showConnectInstagram, setShowConnectInstagram] = useState(false);
  const [selectedPreviewCampaign, setSelectedPreviewCampaign] = useState<Campaign | undefined>(undefined);

  // Authentication state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name: string;
    avatarUrl: string;
    role: string;
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('autodm_admin_session');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse admin session', e);
        }
      }
    }
    return null;
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme state: defaults to 'light' (warm, human creator aesthetic)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('autodm_theme') : null;
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('autodm_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

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
    <div className={`min-h-screen bg-[#FAF7F2] text-[#1E1C1A] dark:bg-[#151413] dark:text-[#F4F1EA] flex flex-col font-sans selection:bg-[#1B382B] selection:text-white transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLanding={() => setViewMode('landing')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSetupWizard={() => setShowSetupWizard(true)}
        onOpenConnectInstagram={() => setShowConnectInstagram(true)}
        activeWorkspace={workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0]}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Conditional: Landing Page vs App Console */}
      {viewMode === 'landing' ? (
        <LandingPage
          onEnterApp={() => setViewMode('app')}
          onOpenLogin={() => setIsAuthOpen(true)}
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
              <div className="flex flex-col items-center justify-center py-24 text-stone-500 dark:text-stone-400">
                <RefreshCw className="w-8 h-8 animate-spin text-rose-500 mb-3" />
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
                  />
                )}
              </>
            )}
          </main>

          {/* Console Footer */}
          <footer className="mt-auto border-t border-stone-200 dark:border-stone-800/80 bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm px-6 py-4 text-center text-xs text-stone-500 dark:text-stone-400 transition-colors">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="font-bold bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">AutoDM Edge</span>
                <span>·</span>
                <span>Instagram Creator DM Engine</span>
                <span>·</span>
                <span>Groq AI Free Tier LPU + Inngest Serverless</span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <button
                  onClick={() => handleOpenPhonePreview()}
                  className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Instagram Mobile Preview
                </button>
                <a
                  href="https://github.com/anilkulkarni87/AutoDM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>GitHub Repo & Docs</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </div>
            </div>
          </footer>
        </>
      )}

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
          if (typeof window !== 'undefined') {
            localStorage.setItem('autodm_admin_session', JSON.stringify(user));
          }
          setViewMode('app');
          showToast(`Welcome, ${user.name}! Admin console unlocked.`);
        }}
        onLogout={() => {
          setCurrentUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('autodm_admin_session');
          }
          setViewMode('landing');
          showToast('Signed out of admin console');
        }}
      />

      {/* Connect Real Instagram Account Modal */}
      <ConnectInstagramModal
        isOpen={showConnectInstagram}
        onClose={() => setShowConnectInstagram(false)}
        currentWorkspace={workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0]}
        onAccountConnected={(ws) => {
          loadAllData(ws.id);
          showToast(`Connected @${ws.instagramUsername}! Real posts synced from Meta Graph API.`);
        }}
      />

      {/* Non-Technical 1-Click Setup Wizard */}
      <NonTechSetupWizard
        isOpen={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
        onLaunchConsole={() => setViewMode('app')}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-stone-900 border border-emerald-500 text-stone-900 dark:text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
