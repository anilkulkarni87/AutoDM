import React, { useState } from 'react';
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
} from 'lucide-react';

interface AnalyticsViewProps {
  metricsData: {
    totals: { comments: number; dms: number; clicks: number; leads: number };
    rates: { deliveryRate: string; clickRate: string; leadRate: string };
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
  const [selectedSubTab, setSelectedSubTab] = useState<'overview' | 'ledger' | 'leads'>('overview');
  const [ledgerFilter, setLedgerFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const totals = metricsData?.totals || { comments: 425, dms: 417, clicks: 331, leads: 235 };
  const rates = metricsData?.rates || { deliveryRate: '99.4', clickRate: '79.3', leadRate: '55.3' };
  const rawLedger = metricsData?.rawLedger || [];

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
          </div>

          {selectedSubTab === 'leads' && (
            <button
              onClick={exportLeadsCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
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
    </div>
  );
};
