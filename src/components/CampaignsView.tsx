import React, { useState } from 'react';
import { Campaign, PostMedia } from '../types';
import { WorkflowCanvas } from './WorkflowCanvas';
import {
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Instagram,
  Edit3,
  Copy,
  Trash2,
} from 'lucide-react';

interface CampaignsViewProps {
  campaigns: Campaign[];
  posts: PostMedia[];
  onUpdateCampaign: (id: string, updates: Partial<Campaign>) => void;
  onCreateCampaign: (newCamp: Partial<Campaign>) => void;
  onDeleteCampaign: (id: string) => void;
  onPreviewInPhone?: (campaign: Campaign) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  posts,
  onUpdateCampaign,
  onCreateCampaign,
  onDeleteCampaign,
  onPreviewInPhone,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

  const handleCreateNew = () => {
    const newCamp: Partial<Campaign> = {
      workspaceId: campaigns[0]?.workspaceId || 'ws_growth_scale',
      name: `New Instagram Inngest Funnel #${campaigns.length + 1}`,
      triggerType: 'SPECIFIC_POST',
      mediaId: posts[0]?.id,
      mediaDetails: posts[0]
        ? {
            caption: posts[0].caption,
            thumbnailUrl: posts[0].thumbnailUrl,
            permalink: posts[0].permalink,
          }
        : undefined,
      condition: 'AI_ROUTING',
      keywords: ['ACCESS', 'LINK', 'CODE'],
      isActive: true,
      steps: [
        {
          id: `step_${Date.now()}_1`,
          type: 'WAIT_FOR_FOLLOW',
          title: 'Verify Account Follower Status',
          description: 'Durable sleep up to 5m, prompts public reminder if needed.',
          timeoutMinutes: 5,
          fallback: 'PUBLIC_REPLY_REMINDER',
        },
        {
          id: `step_${Date.now()}_2`,
          type: 'ASK_FOR_LEAD',
          title: 'Request Work Email in DM',
          template: 'Hey {{username}}! Saw your comment. What email should I send the exclusive download to?',
          expectedField: 'email',
        },
        {
          id: `step_${Date.now()}_3`,
          type: 'AI_QUALIFY',
          title: 'Gemini Agent Objection Steering',
          aiPrompt: 'Validate email or handle objections warmly without losing the lead goal.',
        },
        {
          id: `step_${Date.now()}_4`,
          type: 'SEND_PRIVATE_DM',
          title: 'Deliver Asset Link',
          template: 'Awesome! Here is your download link: https://autodm.edge/r/new?u={{username}}',
        },
      ],
    };
    onCreateCampaign(newCamp);
  };

  if (selectedCampaign) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedCampaignId(null)}
          className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <span>← Back to All Campaigns</span>
        </button>
        <WorkflowCanvas
          campaign={selectedCampaign}
          posts={posts}
          onSave={(updates) => onUpdateCampaign(selectedCampaign.id, updates)}
          onPreviewInPhone={() => onPreviewInPhone && onPreviewInPhone(selectedCampaign)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Campaign Workflows</h2>
          <p className="text-xs text-slate-400 mt-1">
            Edge-native comment-to-DM funnels executing via Inngest step functions and Turso SQLite state.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign Flow</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all shadow-sm hover:shadow-md hover:shadow-slate-950/50"
          >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      camp.isActive ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    {camp.triggerType.replace('_', ' ')}
                  </span>
                </div>

                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                  {camp.condition === 'AI_ROUTING' ? '🤖 Gemini Agent' : camp.condition}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                {camp.name}
              </h3>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {camp.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] font-mono bg-slate-950/80 border border-slate-800 text-indigo-300 px-1.5 py-0.5 rounded"
                  >
                    "{kw}"
                  </span>
                ))}
              </div>

              {/* Attached Post preview */}
              {camp.mediaDetails && (
                <div className="mt-3 p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded bg-indigo-900/40 border border-indigo-700/40 flex items-center justify-center shrink-0 text-white font-mono text-[9px]">
                    POST
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                    {camp.mediaDetails.caption}
                  </p>
                </div>
              )}

              {/* Workflow Steps Preview */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span>Workflow Steps:</span>
                  <span className="text-slate-300 font-bold">{camp.steps.length} Steps</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                  {camp.steps.map((st, i) => (
                    <React.Fragment key={st.id}>
                      <span className="px-2 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-slate-300 whitespace-nowrap">
                        {st.type === 'WAIT_FOR_FOLLOW' && 'Wait Follow'}
                        {st.type === 'ASK_FOR_LEAD' && 'Ask Email'}
                        {st.type === 'AI_QUALIFY' && 'AI Qualify'}
                        {st.type === 'DELAY_JITTER' && 'Jitter'}
                        {st.type === 'SEND_PRIVATE_DM' && 'Send DM'}
                        {st.type === 'PUBLIC_REPLY' && 'Public Reply'}
                      </span>
                      {i < camp.steps.length - 1 && <span className="text-slate-600">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Performance Stats */}
              {camp.stats && (
                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/60 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-medium">Triggers</span>
                    <span className="text-xs font-mono font-bold text-white tabular-nums">
                      {camp.stats.commentsTriggered}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-medium">DMs Sent</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                      {camp.stats.dmsSent}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-medium">Clicks</span>
                    <span className="text-xs font-mono font-bold text-indigo-400 tabular-nums">
                      {camp.stats.linkClicks}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-medium">Leads</span>
                    <span className="text-xs font-mono font-bold text-pink-400 tabular-nums">
                      {camp.stats.leadsCaptured}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Card Actions */}
            <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedCampaignId(camp.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-indigo-600 rounded-md transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open Canvas</span>
              </button>

              <div className="flex items-center gap-1">
                {onPreviewInPhone && (
                  <button
                    onClick={() => onPreviewInPhone(camp)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                    title="Preview in Mobile View"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onDeleteCampaign(camp.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                  title="Delete Campaign"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
