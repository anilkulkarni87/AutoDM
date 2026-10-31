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
      name: `Instagram Comment Funnel #${campaigns.length + 1}`,
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
      keywords: ['ACCESS', 'LINK', 'BLUEPRINT'],
      isActive: true,
      steps: [
        {
          id: `step_${Date.now()}_1`,
          type: 'WAIT_FOR_FOLLOW',
          title: 'Verify Follower Status',
          description: 'Durable sleep up to 5m, prompts public reminder if not yet following.',
          timeoutMinutes: 5,
          fallback: 'PUBLIC_REPLY_REMINDER',
        },
        {
          id: `step_${Date.now()}_2`,
          type: 'ASK_FOR_LEAD',
          title: 'Request Work Email in DM',
          template: 'Hey {{username}}! Saw your comment on my reel. What email should I send the exclusive download to?',
          expectedField: 'email',
        },
        {
          id: `step_${Date.now()}_3`,
          type: 'AI_QUALIFY',
          title: 'Groq AI Objection Steering',
          aiPrompt: 'Validate email or handle objections warmly with human empathy without losing lead goal.',
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
          className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
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
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
            Instagram Campaign Workflows
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Edge-native comment-to-DM funnels executing via Inngest step functions and Groq AI Free Tier.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-xl shadow-sm shadow-rose-500/25 transition-all whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign Flow</span>
        </button>
      </div>

      {/* Campaigns Grid / Empty State */}
      {campaigns.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">No campaigns created yet</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
              Create your first automation funnel to start turning comments on your Reels into verified DMs, link clicks, and leads.
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-xl shadow-sm shadow-rose-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Campaign</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-900/60 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-xs hover:shadow-md hover:shadow-stone-900/5"
            >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      camp.isActive ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-stone-400'
                    }`}
                  />
                  <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 uppercase font-semibold">
                    {camp.triggerType.replace('_', ' ')}
                  </span>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-400">
                  {camp.condition === 'AI_ROUTING' ? '✨ Groq AI LPU' : camp.condition}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1">
                {camp.name}
              </h3>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {camp.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] font-mono bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-md font-semibold"
                  >
                    "{kw}"
                  </span>
                ))}
              </div>

              {/* Attached Post preview */}
              {camp.mediaDetails && (
                <div className="mt-3 p-2.5 bg-stone-50 dark:bg-stone-950/70 rounded-xl border border-stone-200/80 dark:border-stone-800/80 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shrink-0 text-white font-mono text-[9px] font-bold shadow-xs">
                    POST
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2 leading-tight">
                    {camp.mediaDetails.caption}
                  </p>
                </div>
              )}

              {/* Workflow Steps Preview */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 text-xs text-stone-500 dark:text-stone-400">
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span>Workflow Steps:</span>
                  <span className="text-stone-800 dark:text-stone-200 font-bold">{camp.steps.length} Steps</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                  {camp.steps.map((st, i) => (
                    <React.Fragment key={st.id}>
                      <span className="px-2 py-1 bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-md font-mono text-stone-700 dark:text-stone-300 whitespace-nowrap font-medium">
                        {st.type === 'WAIT_FOR_FOLLOW' && 'Wait Follow'}
                        {st.type === 'ASK_FOR_LEAD' && 'Ask Email'}
                        {st.type === 'AI_QUALIFY' && 'AI Qualify'}
                        {st.type === 'DELAY_JITTER' && 'Jitter'}
                        {st.type === 'SEND_PRIVATE_DM' && 'Send DM'}
                        {st.type === 'PUBLIC_REPLY' && 'Public Reply'}
                      </span>
                      {i < camp.steps.length - 1 && <span className="text-stone-400">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Performance Stats */}
              {camp.stats && (
                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 text-center">
                  <div>
                    <span className="block text-[10px] text-stone-400 font-medium">Triggers</span>
                    <span className="text-xs font-mono font-bold text-stone-900 dark:text-white tabular-nums">
                      {camp.stats.commentsTriggered}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-medium">DMs Sent</span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {camp.stats.dmsSent}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-medium">Clicks</span>
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 tabular-nums">
                      {camp.stats.linkClicks}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-medium">Leads</span>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                      {camp.stats.leadsCaptured}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Card Actions */}
            <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedCampaignId(camp.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 dark:text-white bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open Canvas</span>
              </button>

              <div className="flex items-center gap-1">
                {onPreviewInPhone && (
                  <button
                    onClick={() => onPreviewInPhone(camp)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                    title="Preview in Mobile View"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onDeleteCampaign(camp.id)}
                  className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                  title="Delete Campaign"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
    </div>
  );
};
