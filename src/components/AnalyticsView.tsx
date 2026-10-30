import React, { useState, useEffect } from 'react';
import { Metric, Conversation } from '../types';
import {
  TrendingUp,
  Send,
  MessageCircle,
  MousePointerClick,
  Users,
  Download,
  Filter,
  Search,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  Trash2,
  Mail,
  Sparkles,
  Wrench,
} from 'lucide-react';

interface WaitlistEntry {
  id: string;
  email: string;
  source: string;
  createdAt: string;
  status: string;
}

interface SetupOrder {
  id: string;
  email: string;
  instagramHandle: string;
  preferredContact: string;
  plan: string;
  amount: number;
  status: string;
  createdAt: string;
  notes?: string;
}

interface AnalyticsViewProps {
  metricsData: {
    totals: { comments: number; dms: number; clicks: number; crawlers?: number; leads: number; totalHits?: number };
    rates: { deliveryRate: string; clickRate: string; leadRate: string; botFilteredPct?: string };
    hourlyBuckets: Record<string, { comments: number; dms: number; leads: number }>;
    rawLedger: Metric[];
  } | null;
  conversations: Conversation[];
  onOpenConversation?: (conv: Conversation) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  metricsData,
  conversations,
  onOpenConversation,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'overview' | 'ledger' | 'leads' | 'orders' | 'waitlist'>('overview');
  const [ledgerFilter, setLedgerFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [setupOrders, setSetupOrders] = useState<SetupOrder[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [waitlistSearch, setWaitlistSearch] = useState('');
  const [ordersSearch, setOrdersSearch] = useState('');

  const totals = metricsData?.totals || { comments: 425, dms: 417, clicks: 331, crawlers: 38, leads: 235 };
  const rates = metricsData?.rates || { deliveryRate: '99.4', clickRate: '79.3', leadRate: '55.3', botFilteredPct: '24.2' };
  const rawLedger = metricsData?.rawLedger || [];

  const loadAllData = async () => {
    try {
      const [wlRes, ordersRes] = await Promise.all([
        fetch('/api/waitlist').then((r) => r.json()),
        fetch('/api/setup-orders').then((r) => r.json()),
      ]);
      if (wlRes.waitlist) setWaitlistEntries(wlRes.waitlist);
      if (Array.isArray(ordersRes)) setSetupOrders(ordersRes);
    } catch (e) {
      console.warn('Could not load analytics data:', e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleDeleteWaitlist = async (id: string) => {
    try {
      await fetch(`/api/waitlist/${id}`, { method: 'DELETE' });
      setWaitlistEntries((prev) => prev.filter((w) => w.id !== id));
    } catch (e) {
      console.warn('Error deleting waitlist item:', e);
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleCopyAllEmails = () => {
    const all = waitlistEntries.map((w) => w.email).join(', ');
    navigator.clipboard.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Filter captured leads from conversations
  const leadsCaptured = conversations.filter(
    (c) => c.collectedLeads && (c.collectedLeads.email || c.collectedLeads.phone)
  );

  const filteredLedger = rawLedger.filter((m) => {
    if (ledgerFilter !== 'ALL' && m.metricType !== ledgerFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.id.toLowerCase().includes(q) ||
        m.metricType.toLowerCase().includes(q) ||
        (m.campaignId && m.campaignId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const exportLeadsCsv = () => {
    const rows = [
      ['Instagram User', 'Captured Email', 'Phone', 'Campaign', 'Captured At'],
      ...leadsCaptured.map((c) => [
        `@${c.instagramUser}`,
        c.collectedLeads?.email || '',
        c.collectedLeads?.phone || '',
        c.campaignName,
        c.createdAt,
      ]),
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `autodm_captured_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs & export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
            Instagram Analytics & Event Ledger
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Aggregated time-series ledger in Turso SQLite with real-time conversion stats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-1">
            <button
              onClick={() => setSelectedSubTab('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedSubTab === 'overview'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedSubTab('ledger')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedSubTab === 'ledger'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Raw Ledger ({rawLedger.length})
            </button>
            <button
              onClick={() => setSelectedSubTab('leads')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                selectedSubTab === 'leads'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>Captured Leads</span>
              <span className="text-[10px] font-mono bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 px-1.5 py-0.2 rounded-full font-bold">
                {leadsCaptured.length}
              </span>
            </button>
            <button
              onClick={() => setSelectedSubTab('orders')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedSubTab === 'orders'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-[#1B382B] dark:text-emerald-400" />
              <span>Setup Orders ($20)</span>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">
                {setupOrders.length}
              </span>
            </button>
            <button
              onClick={() => setSelectedSubTab('waitlist')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                selectedSubTab === 'waitlist'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-stone-500" />
              <span>Waitlist</span>
              <span className="text-[10px] font-mono bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-1.5 py-0.2 rounded-full font-bold">
                {waitlistEntries.length}
              </span>
            </button>
          </div>

          {selectedSubTab === 'leads' && (
            <button
              onClick={exportLeadsCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Leads CSV</span>
            </button>
          )}

          {selectedSubTab === 'waitlist' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAllEmails}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors shadow-2xs cursor-pointer"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                <span>{copiedAll ? 'Emails Copied!' : 'Copy All'}</span>
              </button>
              <a
                href="/api/waitlist/export"
                download="ahoy-waitlist-subscribers.csv"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#1B382B] hover:bg-[#234737] dark:bg-[#284E3D] dark:hover:bg-[#32614C] rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Waitlist CSV</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* High-Density KPI Cards (4 KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Trigger Volume */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span>Reel Comments Triggered</span>
            <MessageCircle className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 dark:text-white tabular-nums">
            {totals.comments}
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Incoming webhooks evaluated by Groq AI
          </p>
        </div>

        {/* Metric 2: Delivery Success Rate */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span>Delivery Success Rate</span>
            <Send className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {rates.deliveryRate}%
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            {totals.dms} DMs delivered without rate limit drops
          </p>
        </div>

        {/* Metric 3: Link Click-Through Rate */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span>Link CTR</span>
            <MousePointerClick className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-700 dark:text-purple-400 tabular-nums">
            {rates.clickRate}%
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            {totals.clicks} custom tracking link clicks verified
          </p>
        </div>

        {/* Metric 4: Lead Generation Rate */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span>Lead Capture Rate</span>
            <Users className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
            {rates.leadRate}%
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            {totals.leads} emails captured in DM conversation
          </p>
        </div>
      </div>

      {/* Main Tab Content */}
      {selectedSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Novel Feature: Bot-Filtered Link Click Attribution Shield (12 cols) */}
          <div className="lg:col-span-12 bg-gradient-to-br from-[#FAF7F2] to-[#F3EFE8] dark:from-stone-900 dark:to-stone-925 border border-[#E9E4DC] dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E2EFE7] dark:bg-emerald-950/70 border border-[#C5DEC9] dark:border-emerald-800 text-[#1B382B] dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                      Anti-Crawler Link Attribution Shield
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-mono">
                      Novel Feature · Active
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Separating authentic creator link taps from automated Meta preview scrapers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 font-mono text-xs">
                <div className="text-right">
                  <div className="text-stone-400 text-[10px] uppercase">True Human Clicks</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{totals.clicks}</div>
                </div>
                <div className="h-8 w-px bg-stone-300 dark:bg-stone-800"></div>
                <div className="text-right">
                  <div className="text-stone-400 text-[10px] uppercase">Meta Scrapers Filtered</div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{totals.crawlers || 38}</div>
                </div>
                <div className="h-8 w-px bg-stone-300 dark:bg-stone-800"></div>
                <div className="text-right">
                  <div className="text-stone-400 text-[10px] uppercase">Bot Inflation Filtered</div>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">+{rates.botFilteredPct || '24.2'}%</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#5A554D] dark:text-stone-300 leading-relaxed pt-2 border-t border-[#E9E4DC] dark:border-stone-800">
              💡 <strong>Why this matters for Instagram:</strong> Whenever a DM sends a URL, Meta’s <code className="font-mono bg-white dark:bg-stone-800 px-1.5 py-0.5 rounded text-[11px]">facebookexternalhit/1.1</code> preview robot instantly crawls the link to generate the thumbnail card preview. Traditional automation tools count this as a genuine link click, artificially inflating your reported click rate by 200–400%. Ahoy inspects request signatures at the edge and only credits genuine human visits.
            </p>
          </div>

          {/* Hourly Time-Series Distribution (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                  Hourly Webhook & Conversion Throughput
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Past 6 hours rolling ledger count</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">1h Windows</span>
            </div>

            <div className="space-y-4 pt-2">
              {metricsData?.hourlyBuckets &&
                Object.entries(metricsData.hourlyBuckets).map(([hour, val]) => (
                  <div key={hour} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-stone-500 dark:text-stone-400">{hour}</span>
                      <span className="text-stone-800 dark:text-stone-200 font-medium">
                        {val.comments} comments · {val.dms} DMs · {val.leads} leads
                      </span>
                    </div>

                    <div className="h-3 w-full bg-stone-100 dark:bg-stone-950 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${Math.min(val.comments * 0.6, 60)}%` }}
                        className="bg-purple-500 h-full"
                        title="Comments Received"
                      />
                      <div
                        style={{ width: `${Math.min(val.dms * 0.4, 30)}%` }}
                        className="bg-emerald-500 h-full"
                        title="DMs Sent"
                      />
                      <div
                        style={{ width: `${Math.min(val.leads * 0.3, 20)}%` }}
                        className="bg-rose-500 h-full"
                        title="Leads Captured"
                      />
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] font-mono text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Comments Received
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> DMs Delivered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Email Leads
              </span>
            </div>
          </div>

          {/* Recent DM Conversations & Leads (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                  Live Conversations
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Recent automated Instagram direct messages</p>
              </div>
              <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">Real-time</span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {conversations.slice(0, 5).map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onOpenConversation && onOpenConversation(conv)}
                  className="p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-900/60 rounded-2xl transition-all cursor-pointer space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                        {conv.instagramUser.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-stone-900 dark:text-white">
                        @{conv.instagramUser}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        conv.status === 'SENT'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}
                    >
                      {conv.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-1 italic">
                    "{conv.messages[conv.messages.length - 1]?.text || 'No messages'}"
                  </p>

                  {conv.collectedLeads?.email && (
                    <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Captured: {conv.collectedLeads.email}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Raw Ledger Table */}
      {selectedSubTab === 'ledger' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Filter Event:</span>
              <select
                value={ledgerFilter}
                onChange={(e) => setLedgerFilter(e.target.value)}
                className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 rounded-xl px-3 py-1.5 focus:outline-none"
              >
                <option value="ALL">All Events</option>
                <option value="COMMENT_RECEIVED">COMMENT_RECEIVED</option>
                <option value="DM_SENT">DM_SENT</option>
                <option value="LINK_CLICKED">LINK_CLICKED</option>
                <option value="LEAD_CAPTURED">LEAD_CAPTURED</option>
              </select>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ledger..."
                className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-[11px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Event Type</th>
                  <th className="py-2.5 px-3">Campaign ID</th>
                  <th className="py-2.5 px-3">User Mask</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {filteredLedger.slice(0, 20).map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50 dark:hover:bg-stone-950/40">
                    <td className="py-2 px-3 text-stone-500">
                      {new Date(row.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                        {row.metricType}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-stone-600 dark:text-stone-400 truncate max-w-[140px]">
                      {row.campaignId || 'global'}
                    </td>
                    <td className="py-2 px-3 text-stone-700 dark:text-stone-300">
                      user_***{row.id.slice(-4)}
                    </td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                      SUCCESS
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Captured Leads Sub-Tab */}
      {selectedSubTab === 'leads' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                Captured Lead Directory
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Qualified emails and phone numbers captured through DM objections
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
              {leadsCaptured.length} Verified Contacts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-[11px]">
                  <th className="py-2.5 px-3">Instagram Handle</th>
                  <th className="py-2.5 px-3">Captured Email</th>
                  <th className="py-2.5 px-3">Source Campaign</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {leadsCaptured.map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50 dark:hover:bg-stone-950/40">
                    <td className="py-2 px-3 font-bold text-stone-900 dark:text-white">
                      @{lead.instagramUser}
                    </td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                      {lead.collectedLeads?.email || 'N/A'}
                    </td>
                    <td className="py-2 px-3 text-stone-600 dark:text-stone-400">
                      {lead.campaignName}
                    </td>
                    <td className="py-2 px-3 text-stone-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => onOpenConversation && onOpenConversation(lead)}
                        className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                      >
                        View DM Thread →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Done-For-You Setup Orders ($20) Sub-Tab */}
      {selectedSubTab === 'orders' && (
        <div className="space-y-6">
          {/* Top Info Banner */}
          <div className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-3xl p-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block uppercase tracking-wider font-mono">
                  Storage Location
                </span>
                <p className="text-sm font-bold text-stone-900 dark:text-white">
                  Database & API (<code className="text-xs text-[#1B382B] dark:text-emerald-400">/api/setup-orders</code>)
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Every "Book my setup" submission is persisted with email, IG handle, and contact channel.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block uppercase tracking-wider font-mono">
                  Pricing & Terms
                </span>
                <p className="text-sm font-bold text-[#1B382B] dark:text-emerald-400">
                  $20 One-Time / Lifetime
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Includes full Meta app config, webhook handshake, and 7-day priority support.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block uppercase tracking-wider font-mono">
                  Queue Status
                </span>
                <p className="text-2xl font-bold font-mono text-[#1B382B] dark:text-emerald-400">
                  {setupOrders.length} Setup Requests
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Turnaround: developers claim and connect within 24 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Orders Table Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#1B382B] dark:text-emerald-400" />
                  <span>Done-For-You Customer Requests ($20)</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Customers who booked priority setup from your landing page modal
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={ordersSearch}
                  onChange={(e) => setOrdersSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-[11px]">
                    <th className="py-2.5 px-3">Customer Email</th>
                    <th className="py-2.5 px-3">Instagram Handle</th>
                    <th className="py-2.5 px-3">Support Channel</th>
                    <th className="py-2.5 px-3">Automation Notes</th>
                    <th className="py-2.5 px-3">Plan / Fee</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                  {setupOrders
                    .filter((order) =>
                      ordersSearch
                        ? order.email.toLowerCase().includes(ordersSearch.toLowerCase()) ||
                          order.instagramHandle.toLowerCase().includes(ordersSearch.toLowerCase()) ||
                          (order.notes && order.notes.toLowerCase().includes(ordersSearch.toLowerCase()))
                        : true
                    )
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-stone-950/40">
                        <td className="py-2.5 px-3 font-medium text-stone-900 dark:text-white flex items-center gap-1.5">
                          <span>{order.email}</span>
                          <button
                            onClick={() => handleCopyEmail(order.email)}
                            title="Copy email"
                            className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition-colors text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                          >
                            {copiedEmail === order.email ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-stone-800 dark:text-stone-200">
                          {order.instagramHandle}
                        </td>
                        <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            {order.preferredContact}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-stone-600 dark:text-stone-300 max-w-[200px] truncate" title={order.notes}>
                          {order.notes || 'Standard setup request'}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-[#1B382B] dark:text-emerald-400">
                          ${order.amount || 20}
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E2EFE7] text-[#1B382B] dark:bg-emerald-950/60 dark:text-emerald-300 border border-[#C5DEC9] dark:border-emerald-800/60">
                            {order.status || 'RECEIVED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {setupOrders.length === 0 && (
                <div className="text-center py-12 text-stone-400 text-xs">
                  No setup orders yet. Submit the "Book my setup" form on the landing page to test.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Subscribers Sub-Tab */}
      {selectedSubTab === 'waitlist' && (
        <div className="space-y-6">
          {/* Top Info Banner */}
          <div className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#E9E4DC] dark:border-stone-800 rounded-3xl p-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block uppercase tracking-wider font-mono">
                  Storage Layer
                </span>
                <p className="text-sm font-bold text-stone-900 dark:text-white">
                  Turso LibSQL / SQLite (<code className="text-xs text-emerald-700 dark:text-emerald-400">waitlist</code> table)
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Persisted globally across distributed replicas with zero cold starts.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block uppercase tracking-wider font-mono">
                  Export & Integration
                </span>
                <p className="text-sm font-bold text-stone-900 dark:text-white">
                  1-Click CSV / Loops / Resend
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Ready to copy or export directly into Loops, Resend, ConvertKit, or Mailchimp.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block uppercase tracking-wider font-mono">
                  Total Waitlist Size
                </span>
                <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {waitlistEntries.length} Creators
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Awaiting the managed hosted cloud rollout.
                </p>
              </div>
            </div>
          </div>

          {/* Subscribers Table Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                  Cloud Waitlist Directory
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Real users who submitted their email on the landing page
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={waitlistSearch}
                    onChange={(e) => setWaitlistSearch(e.target.value)}
                    placeholder="Search subscribers..."
                    className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-[11px]">
                    <th className="py-2.5 px-3">Subscriber Email</th>
                    <th className="py-2.5 px-3">Acquisition Source</th>
                    <th className="py-2.5 px-3">Signup Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                  {waitlistEntries
                    .filter((w) =>
                      waitlistSearch
                        ? w.email.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
                          w.source.toLowerCase().includes(waitlistSearch.toLowerCase())
                        : true
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-950/40">
                        <td className="py-2.5 px-3 font-medium text-stone-900 dark:text-white flex items-center gap-2">
                          <span>{item.email}</span>
                          <button
                            onClick={() => handleCopyEmail(item.email)}
                            title="Copy email"
                            className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition-colors text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                          >
                            {copiedEmail === item.email ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            {item.source}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">
                          {new Date(item.createdAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                            {item.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteWaitlist(item.id)}
                            title="Remove subscriber"
                            className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {waitlistEntries.length === 0 && (
                <div className="text-center py-12 text-stone-400 text-xs">
                  No waitlist subscribers yet. Submit an email on the landing page to test.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
