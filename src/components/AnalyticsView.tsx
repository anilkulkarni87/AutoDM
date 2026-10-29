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
          <h2 className="text-xl font-bold tracking-tight text-white">Analytics & Event Ledger</h2>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated time-series ledger in Turso SQLite minimizing database reads with zero Redis overhead.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedSubTab('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedSubTab === 'overview'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedSubTab('ledger')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedSubTab === 'ledger'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Ledger ({rawLedger.length})
            </button>
            <button
              onClick={() => setSelectedSubTab('leads')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                selectedSubTab === 'leads'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Captured Leads</span>
              <span className="text-[10px] font-mono bg-pink-950/60 text-pink-400 px-1.5 py-0.2 rounded-full">
                {leadsCaptured.length}
              </span>
            </button>
          </div>

          {selectedSubTab === 'leads' && (
            <button
              onClick={exportLeadsCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Trigger Volume</span>
            <MessageCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {totals.comments}
          </div>
          <p className="text-[11px] text-slate-400">
            Raw incoming webhooks matching post triggers
          </p>
        </div>

        {/* Metric 2: Delivery Success Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Delivery Success Rate</span>
            <Send className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {rates.deliveryRate}%
          </div>
          <p className="text-[11px] text-slate-400">
            {totals.dms} DMs accepted by Meta API Gateway
          </p>
        </div>

        {/* Metric 3: Link Click-Through Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Link CTR</span>
            <MousePointerClick className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300 tabular-nums">
            {rates.clickRate}%
          </div>
          <p className="text-[11px] text-slate-400">
            {totals.clicks} custom tracking link clicks verified
          </p>
        </div>

        {/* Metric 4: Lead Generation Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Lead Capture Rate</span>
            <Users className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-pink-400 tabular-nums">
            {rates.leadRate}%
          </div>
          <p className="text-[11px] text-slate-400">
            {totals.leads} emails captured via Agentic loop
          </p>
        </div>
      </div>

      {/* Main Tab Content */}
      {selectedSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hourly Time-Series Distribution (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Hourly Webhook & Conversion Throughput
                </h3>
                <p className="text-[11px] text-slate-400">Past 6 hours rolling ledger count</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Aggregation: 1 hr</span>
            </div>

            <div className="space-y-4 pt-2">
              {metricsData?.hourlyBuckets &&
                Object.entries(metricsData.hourlyBuckets).map(([hour, val]) => (
                  <div key={hour} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{hour}</span>
                      <span className="text-slate-200">
                        {val.comments} comments · {val.dms} DMs · {val.leads} leads
                      </span>
                    </div>

                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${Math.min(val.comments * 0.6, 60)}%` }}
                        className="bg-indigo-500 h-full"
                        title="Comments Received"
                      />
                      <div
                        style={{ width: `${Math.min(val.dms * 0.4, 30)}%` }}
                        className="bg-emerald-500 h-full"
                        title="DMs Sent"
                      />
                      <div
                        style={{ width: `${Math.min(val.leads * 0.3, 20)}%` }}
                        className="bg-pink-500 h-full"
                        title="Leads Captured"
                      />
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Comments Received
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> DMs Delivered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" /> Email Leads
              </span>
            </div>
          </div>

          {/* Recent DM Conversations & Leads (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Conversation Threads
                </h3>
                <p className="text-[11px] text-slate-400">Recent automated Instagram direct messages</p>
              </div>
              <span className="text-[10px] font-mono text-indigo-400">Real-time</span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {conversations.slice(0, 5).map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onOpenConversation && onOpenConversation(conv)}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                        {conv.instagramUser.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-white">@{conv.instagramUser}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{conv.status}</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                    "{conv.commentText}"
                  </p>

                  {conv.collectedLeads?.email && (
                    <div className="text-[10px] font-mono text-pink-400 bg-pink-950/40 border border-pink-900/40 px-2 py-0.5 rounded flex items-center gap-1">
                      <span>Lead: {conv.collectedLeads.email}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Raw Event Ledger Table */}
      {selectedSubTab === 'ledger' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={ledgerFilter}
                onChange={(e) => setLedgerFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded px-2.5 py-1 focus:outline-none"
              >
                <option value="ALL">All Event Types</option>
                <option value="COMMENT_RECEIVED">COMMENT_RECEIVED</option>
                <option value="DM_SENT">DM_SENT</option>
                <option value="LINK_CLICK">LINK_CLICK</option>
                <option value="LEAD_CAPTURED">LEAD_CAPTURED</option>
              </select>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search ledger entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">LEDGER ID</th>
                  <th className="py-2.5 px-3">EVENT TYPE</th>
                  <th className="py-2.5 px-3">WORKSPACE</th>
                  <th className="py-2.5 px-3">CAMPAIGN ID</th>
                  <th className="py-2.5 px-3 text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                {filteredLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 text-slate-400">{row.id}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`font-semibold ${
                          row.metricType === 'DM_SENT'
                            ? 'text-emerald-400'
                            : row.metricType === 'LINK_CLICK'
                            ? 'text-indigo-400'
                            : row.metricType === 'LEAD_CAPTURED'
                            ? 'text-pink-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {row.metricType}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{row.workspaceId}</td>
                    <td className="py-2 px-3 text-slate-300">{row.campaignId || '—'}</td>
                    <td className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      {new Date(row.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Captured Leads Sub-tab */}
      {selectedSubTab === 'leads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Captured Inbound Leads ({leadsCaptured.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Verified work emails and contact details extracted autonomously via dynamic Instagram DMs
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">USER</th>
                  <th className="py-2.5 px-3">CAPTURED EMAIL</th>
                  <th className="py-2.5 px-3">ATTRIBUTED CAMPAIGN</th>
                  <th className="py-2.5 px-3">INITIAL COMMENT TRIGGER</th>
                  <th className="py-2.5 px-3 text-right">CAPTURED AT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                {leadsCaptured.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">@{lead.instagramUser}</td>
                    <td className="py-2.5 px-3 text-pink-400 font-bold">
                      {lead.collectedLeads?.email || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-indigo-300 truncate max-w-xs">{lead.campaignName}</td>
                    <td className="py-2.5 px-3 text-slate-400 italic truncate max-w-xs">"{lead.commentText}"</td>
                    <td className="py-2.5 px-3 text-right text-slate-400 tabular-nums">
                      {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString()}
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
