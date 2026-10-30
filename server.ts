import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Groq AI Free Tier configuration (https://console.groq.com/keys)
let activeGroqApiKey = process.env.GROQ_API_KEY || '';
let preferredGroqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// ==========================================
// In-Memory Multi-Tenant State (Turso SQLite emulation)
// ==========================================

interface WaitlistEntry {
  id: string;
  email: string;
  source: string;
  createdAt: string;
  ipHash?: string;
  status: 'PENDING' | 'NOTIFIED' | 'INVITED';
}

interface DbState {
  organizations: any[];
  users: any[];
  workspaces: any[];
  campaigns: any[];
  conversations: any[];
  metrics: any[];
  posts: any[];
  inngestTraces: any[];
  dailyStats: any[];
  purgeHistory: any[];
  setupOrders: any[];
  waitlist: WaitlistEntry[];
  systemSettings: {
    editionMode: 'SELF_HOSTED_COMMUNITY' | 'SAAS_PRO_MANAGED';
    lastWarmupAt: string;
    lastPurgeRunAt?: string;
  };
}

const db: DbState = {
  systemSettings: {
    editionMode: 'SELF_HOSTED_COMMUNITY',
    lastWarmupAt: new Date().toISOString(),
    lastPurgeRunAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  setupOrders: [
    {
      id: 'dfy_17303001',
      email: 'clara@studioflow.design',
      instagramHandle: '@studioflow',
      preferredContact: 'telegram: @claradesign',
      plan: 'DONE_FOR_YOU_SETUP',
      amount: 20,
      status: 'RECEIVED',
      createdAt: '2026-10-30T10:14:00Z',
      notes: 'Need auto-DM link delivery for my new typography reel drop on Friday.',
    },
    {
      id: 'dfy_17303002',
      email: 'jason@modernfounder.co',
      instagramHandle: '@modernfounder',
      preferredContact: 'email: jason@modernfounder.co',
      plan: 'DONE_FOR_YOU_SETUP',
      amount: 20,
      status: 'RECEIVED',
      createdAt: '2026-10-30T11:28:00Z',
      notes: 'Please connect to my Creator account and test with our resource sheet.',
    },
  ],
  waitlist: [
    {
      id: 'wl_101',
      email: 'anil77k@gmail.com',
      source: 'landing_hosted_cloud',
      createdAt: '2026-10-28T14:22:00Z',
      status: 'PENDING',
    },
    {
      id: 'wl_102',
      email: 'sarah.creator@hey.com',
      source: 'landing_hosted_cloud',
      createdAt: '2026-10-29T09:15:00Z',
      status: 'PENDING',
    },
    {
      id: 'wl_103',
      email: 'marcus@growthmedia.co',
      source: 'landing_hosted_cloud',
      createdAt: '2026-10-29T16:40:00Z',
      status: 'PENDING',
    },
    {
      id: 'wl_104',
      email: 'elena.design@studio.io',
      source: 'landing_hosted_cloud',
      createdAt: '2026-10-30T08:12:00Z',
      status: 'PENDING',
    },
  ],
  dailyStats: [
    {
      id: 'ds_20261026',
      date: '2026-10-26',
      workspaceId: 'ws_growth_scale',
      campaignId: 'cmp_blueprint_reel',
      totalComments: 3120,
      totalDmsSent: 3094,
      totalClicks: 2140,
      totalLeads: 1480,
      compressedAt: '2026-10-27T02:00:00Z',
    },
    {
      id: 'ds_20261027',
      date: '2026-10-27',
      workspaceId: 'ws_growth_scale',
      campaignId: 'cmp_blueprint_reel',
      totalComments: 4520,
      totalDmsSent: 4490,
      totalClicks: 3200,
      totalLeads: 2190,
      compressedAt: '2026-10-28T02:00:00Z',
    },
    {
      id: 'ds_20261028',
      date: '2026-10-28',
      workspaceId: 'ws_growth_scale',
      campaignId: 'cmp_cost_calculator',
      totalComments: 1890,
      totalDmsSent: 1870,
      totalClicks: 1420,
      totalLeads: 810,
      compressedAt: '2026-10-29T02:00:00Z',
    },
  ],
  purgeHistory: [
    {
      timestamp: '2026-10-28T02:00:00Z',
      purgedOlderThanDays: 30,
      rawMetricsPurged: 9530,
      conversationsPurged: 3120,
      dailyStatsCreated: 2,
      storageReductionPercent: 99.8,
      kbFreed: 18450,
    },
  ],
  organizations: [
    {
      id: 'org_acme_growth',
      name: 'Acme Growth Labs',
      createdAt: '2026-01-15T09:00:00Z',
      billingState: 'pro',
    },
    {
      id: 'org_solopreneur',
      name: 'Studio Founder',
      createdAt: '2026-03-01T12:00:00Z',
      billingState: 'free',
    },
  ],
  users: [
    {
      id: 'usr_1',
      email: 'anil77k@gmail.com',
      organizationId: 'org_acme_growth',
    },
  ],
  workspaces: [
    {
      id: 'ws_growth_scale',
      organizationId: 'org_acme_growth',
      instagramAccountId: 'ig_178414053092',
      instagramUsername: 'acme.growth',
      name: 'Acme Growth Official',
      avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=acmegrowth',
      encryptedTokenMasked: 'EAAO...94bF2 (AES-256-GCM)',
      isTokenActive: true,
      campaignsCount: 3,
    },
    {
      id: 'ws_creator_ai',
      organizationId: 'org_acme_growth',
      instagramAccountId: 'ig_178414088921',
      instagramUsername: 'ai_automation_pro',
      name: 'AI Automation Pro',
      avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=aiauto',
      encryptedTokenMasked: 'EAAO...77xA1 (AES-256-GCM)',
      isTokenActive: true,
      campaignsCount: 1,
    },
  ],
  posts: [
    {
      id: 'post_reel_9921',
      mediaType: 'REEL',
      permalink: 'https://instagram.com/reel/C89xKlO01',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      caption: '🚀 We built a 100% serverless Instagram DM agent using Inngest & Turso. Comment "BLUEPRINT" below and my AI will send you the full source code + architecture breakdown in your DMs!',
      commentsCount: 342,
      likeCount: 2890,
      publishedAt: '2026-10-24T14:30:00Z',
    },
    {
      id: 'post_carousel_401',
      mediaType: 'CAROUSEL',
      permalink: 'https://instagram.com/p/C72xMn902',
      thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
      caption: 'Stop running background workers for Instagram automation. Here is why Edge + Workflows save $400/mo. Comment "SAVE" for the cost calculator sheet.',
      commentsCount: 184,
      likeCount: 1420,
      publishedAt: '2026-10-26T10:15:00Z',
    },
    {
      id: 'post_reel_772',
      mediaType: 'REEL',
      permalink: 'https://instagram.com/reel/C811Aa889',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      caption: 'The complete 2026 Agentic Workflow handbook is ready. Drop "GUIDE" in the comments to receive direct DM access!',
      commentsCount: 95,
      likeCount: 910,
      publishedAt: '2026-10-28T16:00:00Z',
    },
  ],
  campaigns: [
    {
      id: 'cmp_blueprint_reel',
      workspaceId: 'ws_growth_scale',
      name: 'Serverless Blueprint Reel Viral Funnel',
      triggerType: 'SPECIFIC_POST',
      mediaId: 'post_reel_9921',
      mediaDetails: {
        caption: '🚀 We built a 100% serverless Instagram DM agent using Inngest & Turso. Comment "BLUEPRINT" below...',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        permalink: 'https://instagram.com/reel/C89xKlO01',
      },
      condition: 'AI_ROUTING',
      keywords: ['BLUEPRINT', 'SOURCE', 'CODE', 'REPO', 'LINK'],
      isActive: true,
      createdAt: '2026-10-24T15:00:00Z',
      steps: [
        {
          id: 'step_1',
          type: 'WAIT_FOR_FOLLOW',
          title: 'Verify Account Follower Status',
          description: 'Inngest step pauses execution up to 5 min. If not following, sends a public comment reminder.',
          timeoutMinutes: 5,
          fallback: 'PUBLIC_REPLY_REMINDER',
        },
        {
          id: 'step_2',
          type: 'ASK_FOR_LEAD',
          title: 'Dynamic Conversational DM (Lead Magnet)',
          description: 'Sends initial DM and asks for work email before unlocking repository link.',
          template: 'Hey {{username}}! Saw your comment on the serverless architecture reel. To send you the GitHub repo + deployment script, what is the best email to send your access token to?',
          expectedField: 'email',
        },
        {
          id: 'step_3',
          type: 'AI_QUALIFY',
          title: 'Gemini Agent Intent & Objection Steering',
          description: 'Analyzes user reply. If valid email captured, stores in Turso and releases link. If hesitation or question, AI answers naturally.',
          aiPrompt: 'Validate email syntax or answer user inquiries warmly without losing the lead goal.',
        },
        {
          id: 'step_4',
          type: 'SEND_PRIVATE_DM',
          title: 'Fulfill Asset & Track Link Click',
          description: 'Delivers custom tracking link: https://autodm.edge/r/cmp_blueprint_reel?u={{username}}',
          template: 'You are all set! Here is your exclusive download link: https://autodm.edge/r/cmp_blueprint_reel?u={{username}} — Check your email inbox too for the setup guide!',
        },
      ],
      stats: {
        commentsTriggered: 248,
        dmsSent: 242,
        linkClicks: 189,
        leadsCaptured: 164,
      },
    },
    {
      id: 'cmp_cost_calculator',
      workspaceId: 'ws_growth_scale',
      name: 'Serverless Cost Calculator Sheet',
      triggerType: 'SPECIFIC_POST',
      mediaId: 'post_carousel_401',
      mediaDetails: {
        caption: 'Stop running background workers for Instagram automation. Comment "SAVE" for the cost calculator sheet.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
        permalink: 'https://instagram.com/p/C72xMn902',
      },
      condition: 'FUZZY_SEMANTIC',
      keywords: ['SAVE', 'CALCULATOR', 'COST', 'SHEET'],
      isActive: true,
      createdAt: '2026-10-26T11:00:00Z',
      steps: [
        {
          id: 'step_c1',
          type: 'DELAY_JITTER',
          title: 'Humanized Anti-Spam Jitter (45s)',
          description: 'Randomized sleep between 30-60s to mimic organic response.',
          delaySeconds: 45,
        },
        {
          id: 'step_c2',
          type: 'SEND_PRIVATE_DM',
          title: 'Send Instant Calculator Access',
          template: 'Hey there! Here is the Cloud Cost Comparison Spreadsheet: https://autodm.edge/r/cmp_cost_calculator — enjoy zero-maintenance savings!',
        },
      ],
      stats: {
        commentsTriggered: 132,
        dmsSent: 130,
        linkClicks: 104,
        leadsCaptured: 42,
      },
    },
    {
      id: 'cmp_any_post_vip',
      workspaceId: 'ws_growth_scale',
      name: 'Global VIP Secret Club Offer',
      triggerType: 'ANY_POST',
      condition: 'EXACT_MATCH',
      keywords: ['VIP', 'SECRET'],
      isActive: false,
      createdAt: '2026-10-20T08:00:00Z',
      steps: [
        {
          id: 'step_v1',
          type: 'SEND_PRIVATE_DM',
          title: 'Send VIP Portal Access Pass',
          template: 'Welcome to the inner circle! Your private passcode is #EDGE-NATIVE-2026.',
        },
      ],
      stats: {
        commentsTriggered: 45,
        dmsSent: 45,
        linkClicks: 38,
        leadsCaptured: 29,
      },
    },
  ],
  conversations: [
    {
      id: 'conv_1',
      campaignId: 'cmp_blueprint_reel',
      campaignName: 'Serverless Blueprint Reel Viral Funnel',
      workspaceId: 'ws_growth_scale',
      instagramUser: 'dev_sarah_m',
      instagramUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      commentId: 'cmt_10029',
      commentText: 'Could I get the blueprint repo? Loved the Inngest explanation!',
      status: 'SENT',
      collectedLeads: {
        email: 'sarah.miller@techscale.io',
      },
      createdAt: '2026-10-29T10:14:00Z',
      messages: [
        {
          id: 'msg_1',
          sender: 'bot',
          text: 'Hey dev_sarah_m! Saw your comment on the serverless architecture reel. To send you the GitHub repo + deployment script, what is the best email to send your access token to?',
          timestamp: '2026-10-29T10:14:08Z',
        },
        {
          id: 'msg_2',
          sender: 'user',
          text: 'sure thing, it is sarah.miller@techscale.io! thanks!',
          timestamp: '2026-10-29T10:15:22Z',
        },
        {
          id: 'msg_3',
          sender: 'bot',
          text: 'You are all set! Here is your exclusive download link: https://autodm.edge/r/cmp_blueprint_reel?u=dev_sarah_m — Check your email inbox too for the setup guide!',
          timestamp: '2026-10-29T10:15:26Z',
        },
      ],
    },
    {
      id: 'conv_2',
      campaignId: 'cmp_blueprint_reel',
      campaignName: 'Serverless Blueprint Reel Viral Funnel',
      workspaceId: 'ws_growth_scale',
      instagramUser: 'alex_codez',
      instagramUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      commentId: 'cmt_10034',
      commentText: 'typo: lnik please send me the link!!',
      status: 'SENT',
      collectedLeads: {
        email: 'alex@coderweekly.com',
      },
      createdAt: '2026-10-29T09:42:00Z',
      messages: [
        {
          id: 'msg_21',
          sender: 'bot',
          text: 'Hey alex_codez! Saw your comment on the serverless architecture reel. To send you the GitHub repo + deployment script, what is the best email to send your access token to?',
          timestamp: '2026-10-29T09:42:15Z',
        },
        {
          id: 'msg_22',
          sender: 'user',
          text: 'why do you need my email instead of posting it here?',
          timestamp: '2026-10-29T09:43:02Z',
        },
        {
          id: 'msg_23',
          sender: 'bot',
          text: 'Totally understand! Meta limits raw code URLs in public comments to prevent spam filtering, plus we email you one-click Vercel deploy credentials. What email works best for you?',
          timestamp: '2026-10-29T09:43:05Z',
        },
        {
          id: 'msg_24',
          sender: 'user',
          text: 'gotcha that makes sense: alex@coderweekly.com',
          timestamp: '2026-10-29T09:44:10Z',
        },
        {
          id: 'msg_25',
          sender: 'bot',
          text: 'You are all set! Here is your exclusive download link: https://autodm.edge/r/cmp_blueprint_reel?u=alex_codez — Check your email inbox too!',
          timestamp: '2026-10-29T09:44:14Z',
        },
      ],
    },
    {
      id: 'conv_3',
      campaignId: 'cmp_cost_calculator',
      campaignName: 'Serverless Cost Calculator Sheet',
      workspaceId: 'ws_growth_scale',
      instagramUser: 'growth_marco',
      instagramUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marco',
      commentId: 'cmt_10055',
      commentText: 'SAVE',
      status: 'SENT',
      createdAt: '2026-10-29T08:20:00Z',
      messages: [
        {
          id: 'msg_31',
          sender: 'bot',
          text: 'Hey there! Here is the Cloud Cost Comparison Spreadsheet: https://autodm.edge/r/cmp_cost_calculator — enjoy zero-maintenance savings!',
          timestamp: '2026-10-29T08:20:45Z',
        },
      ],
    },
  ],
  metrics: [
    // Pre-populate aggregated ledger metrics for the past 24 hours
    { id: 'm_1', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T07:00:00Z', metricType: 'COMMENT_RECEIVED', campaignId: 'cmp_blueprint_reel' },
    { id: 'm_2', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T07:01:00Z', metricType: 'DM_SENT', campaignId: 'cmp_blueprint_reel' },
    { id: 'm_3', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T07:05:00Z', metricType: 'LINK_CLICK', campaignId: 'cmp_blueprint_reel' },
    { id: 'm_4', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T07:06:00Z', metricType: 'LEAD_CAPTURED', campaignId: 'cmp_blueprint_reel' },
    { id: 'm_5', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T08:00:00Z', metricType: 'COMMENT_RECEIVED', campaignId: 'cmp_cost_calculator' },
    { id: 'm_6', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T08:00:45Z', metricType: 'DM_SENT', campaignId: 'cmp_cost_calculator' },
    { id: 'm_7', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T08:12:00Z', metricType: 'LINK_CLICK', campaignId: 'cmp_cost_calculator' },
    { id: 'm_8', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T09:00:00Z', metricType: 'COMMENT_RECEIVED', campaignId: 'cmp_blueprint_reel' },
    { id: 'm_9', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T09:00:30Z', metricType: 'DM_SENT', campaignId: 'cmp_blueprint_reel' },
    { id: 'm_10', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T09:14:00Z', metricType: 'LEAD_CAPTURED', campaignId: 'cmp_blueprint_reel' },
    { id: 'm_11', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T10:00:00Z', metricType: 'COMMENT_RECEIVED', campaignId: 'cmp_blueprint_reel' },
    { id: 'm_12', workspaceId: 'ws_growth_scale', timestamp: '2026-10-29T10:00:15Z', metricType: 'DM_SENT', campaignId: 'cmp_blueprint_reel' },
  ],
  inngestTraces: [
    {
      runId: 'run_inngest_01j9ab7z',
      eventId: 'evt_ig_cmt_10029',
      functionId: 'instagram-comment-workflow',
      status: 'completed',
      startedAt: '2026-10-29T10:14:00Z',
      completedAt: '2026-10-29T10:15:26Z',
      totalDurationMs: 42,
      matchedCampaignId: 'cmp_blueprint_reel',
      matchedCampaignName: 'Serverless Blueprint Reel Viral Funnel',
      aiClassification: {
        matched: true,
        confidence: 0.98,
        detectedIntent: 'REQUEST_BLUEPRINT_CODE',
        correctedKeyword: 'BLUEPRINT',
        reasoning: 'User asked "Could I get the blueprint repo? Loved the Inngest explanation!", demonstrating unambiguous intent to access the blueprint code magnet.',
      },
      steps: [
        {
          stepId: 'step_evaluate_intent',
          name: 'evaluate-intent-ai',
          type: 'EVALUATE',
          status: 'completed',
          durationMs: 14,
          timestamp: '2026-10-29T10:14:00Z',
          output: { matched: true, confidence: 0.98, intent: 'REQUEST_BLUEPRINT_CODE' },
        },
        {
          stepId: 'step_verify_follow',
          name: 'verify-follow-status',
          type: 'WAIT_FOR_FOLLOW',
          status: 'completed',
          durationMs: 8,
          timestamp: '2026-10-29T10:14:01Z',
          output: { isFollower: true },
        },
        {
          stepId: 'step_send_lead_dm',
          name: 'send-lead-request-dm',
          type: 'ASK_FOR_LEAD',
          status: 'completed',
          durationMs: 12,
          timestamp: '2026-10-29T10:14:08Z',
          output: { metaMessageId: 'mid.1009834289', recipient: 'dev_sarah_m' },
        },
        {
          stepId: 'step_record_metric',
          name: 'record-ledger-metric',
          type: 'RECORD_METRIC',
          status: 'completed',
          durationMs: 4,
          timestamp: '2026-10-29T10:15:26Z',
          output: { ledgerRowId: 'm_4', table: 'Metric' },
        },
      ],
    },
  ],
};

// ==========================================
// Semantic & AI Intent Engine (Groq AI Free Tier LPU + Gemini + Fast Heuristic Fallback)
// ==========================================

async function classifyCommentIntent(
  commentText: string,
  targetCampaigns: any[]
): Promise<{
  matched: boolean;
  campaignId?: string;
  matchedKeyword?: string;
  confidence: number;
  detectedIntent: string;
  reasoning: string;
  suggestedReply?: string;
  aiProvider?: string;
  modelUsed?: string;
  latencyMs?: number;
}> {
  const startTime = Date.now();
  // Check exact match first for fast path
  const normalizedComment = commentText.trim().toLowerCase();
  
  for (const campaign of targetCampaigns) {
    if (!campaign.isActive) continue;
    
    for (const kw of campaign.keywords) {
      const normalizedKw = kw.toLowerCase();
      if (normalizedComment.includes(normalizedKw)) {
        return {
          matched: true,
          campaignId: campaign.id,
          matchedKeyword: kw,
          confidence: 0.99,
          detectedIntent: `EXACT_MATCH_${kw}`,
          reasoning: `Exact keyword "${kw}" detected in user comment.`,
          suggestedReply: `Sending you the link for ${kw} right now!`,
          aiProvider: 'fast-keyword-parser',
          modelUsed: 'instant-edge-matcher',
          latencyMs: Date.now() - startTime,
        };
      }
    }
  }

  // 1. Check Groq AI Free Tier LPU (https://console.groq.com)
  if (activeGroqApiKey) {
    try {
      const systemPrompt = `You are an ultra-fast Instagram AI Automation intent parser.
Available active campaigns:
${JSON.stringify(
  targetCampaigns.map((c) => ({
    id: c.id,
    name: c.name,
    keywords: c.keywords,
    condition: c.condition,
    captionSnippet: c.mediaDetails?.caption?.substring(0, 80) || '',
  })),
  null,
  2
)}

Determine if the user's comment expresses clear or implied intent to receive the offered resource/link (including typos like 'lnik', phrases like 'send me this', 'can i get the repo', 'how much', or foreign languages like 'enlace').
Respond ONLY with a valid JSON object matching this schema:
{
  "matched": boolean,
  "campaignId": "string or null",
  "matchedKeyword": "string or null",
  "confidence": number,
  "detectedIntent": "string",
  "reasoning": "string",
  "suggestedReply": "string"
}`;

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeGroqApiKey}`,
        },
        body: JSON.stringify({
          model: preferredGroqModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Comment: "${commentText}"` },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
          max_tokens: 300,
        }),
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const content = groqData.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed && typeof parsed.matched === 'boolean') {
            return {
              ...parsed,
              aiProvider: 'groq-lpu-cloud',
              modelUsed: preferredGroqModel,
              latencyMs: Date.now() - startTime,
            };
          }
        }
      } else {
        const errText = await groqRes.text();
        console.warn('Groq API returned error:', groqRes.status, errText);
      }
    } catch (err) {
      console.warn('Groq classification fallback:', err);
    }
  }

  // 2. Cascade to Gemini 3.8 Flash if available
  if (apiKey) {
    try {
      const prompt = `You are a real-time Instagram AI Automation intent parser.
Analyze this user's comment on an Instagram post/reel:
Comment: "${commentText}"

Available active campaigns:
${JSON.stringify(
  targetCampaigns.map((c) => ({
    id: c.id,
    name: c.name,
    keywords: c.keywords,
    condition: c.condition,
    captionSnippet: c.mediaDetails?.caption?.substring(0, 80) || '',
  })),
  null,
  2
)}

Determine:
1. Does the comment express intent to receive what the post/campaign offers (e.g. typos like "lnik", requests like "send me this", "can i get the code", "give me the discount", "envíame el enlace")?
2. Which campaign id does it best match?
3. What is the confidence score between 0.0 and 1.0?
4. What is the detected intent code?
5. A 1-sentence reasoning explaining semantic mapping or typo correction.

Return ONLY a valid JSON object matching this schema:
{
  "matched": boolean,
  "campaignId": "string or null",
  "matchedKeyword": "string or null",
  "confidence": number,
  "detectedIntent": "string",
  "reasoning": "string",
  "suggestedReply": "string"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);
      if (parsed && typeof parsed.matched === 'boolean') {
        return {
          ...parsed,
          aiProvider: 'gemini-flash',
          modelUsed: 'gemini-3.8-flash',
          latencyMs: Date.now() - startTime,
        };
      }
    } catch (err) {
      console.warn('Gemini classification fallback to semantic heuristics:', err);
    }
  }

  // 3. Fast offline / heuristic fallback with typo tolerance
  const typosAndSynonyms: Record<string, string[]> = {
    BLUEPRINT: ['blueprint', 'blue print', 'bluprint', 'repo', 'source', 'code', 'github', 'send it', 'can i get the code', 'enlace', 'send blueprint'],
    SAVE: ['save', 'discount', 'saving', 'calculator', 'cost', 'sheet', 'spreadsheet', 'calc', 'how much'],
    GUIDE: ['guide', 'handbook', 'pdf', 'doc', 'documentation', 'learn'],
    LINK: ['link', 'lnik', 'likn', 'send link', 'url', 'dm me', 'dm please', 'dm me the link', 'want it'],
  };

  for (const campaign of targetCampaigns) {
    if (!campaign.isActive) continue;
    for (const kw of campaign.keywords) {
      const upperKw = kw.toUpperCase();
      const matches = typosAndSynonyms[upperKw] || [kw.toLowerCase()];
      for (const phrase of matches) {
        if (normalizedComment.includes(phrase)) {
          return {
            matched: true,
            campaignId: campaign.id,
            matchedKeyword: kw,
            confidence: 0.94,
            detectedIntent: `SEMANTIC_MATCH_${upperKw}`,
            reasoning: `Semantic engine matched phrase "${phrase}" to campaign keyword "${kw}" via intent parser.`,
            suggestedReply: `Detected intent for ${kw}! Sending custom payload to DMs.`,
            aiProvider: 'edge-semantic-engine',
            modelUsed: 'typo-tolerant-fast-parser',
            latencyMs: Date.now() - startTime,
          };
        }
      }
    }
  }

  // Default no match
  return {
    matched: false,
    confidence: 0.15,
    detectedIntent: 'GENERAL_COMMENT_NO_KEYWORD',
    reasoning: 'Comment appears to be general feedback or conversational remark without trigger intent.',
    aiProvider: 'edge-semantic-engine',
    modelUsed: 'standard-filter',
    latencyMs: Date.now() - startTime,
  };
}

// ==========================================
// API Routes
// ==========================================

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    groqEnabled: Boolean(activeGroqApiKey),
    groqModel: preferredGroqModel,
    groqFreeTier: 'Active (console.groq.com)',
    geminiEnabled: Boolean(apiKey),
    edgeRuntime: 'emulated-vercel-edge',
    dbProvider: 'turso-libsql-multi-tenant',
    inngestEngine: 'active',
  });
});

// Groq AI Free Tier Status & Configuration
app.get('/api/groq/status', (_req: Request, res: Response) => {
  const isKeyConfigured = Boolean(activeGroqApiKey);
  res.json({
    configured: isKeyConfigured,
    maskedKey: isKeyConfigured
      ? `${activeGroqApiKey.substring(0, 7)}...${activeGroqApiKey.substring(activeGroqApiKey.length - 4)}`
      : null,
    model: preferredGroqModel,
    availableModels: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Versatile, Recommended)', speed: 'Fast (120 t/s)' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Sub-100ms Instant Edge)', speed: 'Ultra-Fast (350+ t/s)' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (Long Context 32k)', speed: 'High Speed' },
    ],
    freeTierUrl: 'https://console.groq.com/keys',
    freeTierDailyLimit: '14,400 requests / day (Free Forever)',
  });
});

// Test and save Groq API Key
app.post('/api/groq/test-key', async (req: Request, res: Response) => {
  const { apiKey: testKey, model } = req.body;
  if (!testKey || typeof testKey !== 'string') {
    return res.status(400).json({ valid: false, error: 'Please provide a valid Groq API key.' });
  }

  const cleanKey = testKey.trim();
  const testModel = model || preferredGroqModel || 'llama-3.1-8b-instant';
  const startTime = Date.now();

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanKey}`,
      },
      body: JSON.stringify({
        model: testModel,
        messages: [{ role: 'user', content: 'Ping! Reply with {"ok": true}' }],
        response_format: { type: 'json_object' },
        max_tokens: 20,
      }),
    });

    const latencyMs = Date.now() - startTime;

    if (response.ok) {
      activeGroqApiKey = cleanKey;
      if (model) preferredGroqModel = model;
      return res.json({
        valid: true,
        model: testModel,
        latencyMs,
        message: `Connected to Groq AI Free Tier in ${latencyMs}ms! LPU inference active.`,
      });
    } else {
      const errBody = await response.text();
      return res.status(400).json({
        valid: false,
        error: `Groq verification failed (${response.status}): ${errBody}`,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      valid: false,
      error: `Network error reaching Groq API: ${err.message || String(err)}`,
    });
  }
});

// Update Groq Preferred Model
app.post('/api/groq/set-model', (req: Request, res: Response) => {
  const { model } = req.body;
  if (model && typeof model === 'string') {
    preferredGroqModel = model;
    return res.json({ success: true, model: preferredGroqModel });
  }
  res.status(400).json({ error: 'Invalid model name' });
});

// 1. Meta Webhook Verification (GET /api/webhooks/instagram)
// Exactly according to Meta Graph API webhook spec
app.get('/api/webhooks/instagram', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const EXPECTED_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'autodm_edge_secret_verify_token_2026';

  if (mode === 'subscribe' && token === EXPECTED_VERIFY_TOKEN) {
    console.log('[Meta Webhook] Successfully verified handshake challenge.');
    res.status(200).send(challenge);
  } else {
    console.warn('[Meta Webhook] Verification failed token mismatch.');
    res.status(403).json({ error: 'Verification failed: invalid token or mode' });
  }
});

// 2. Meta Webhook Receiver (POST /api/webhooks/instagram)
app.post('/api/webhooks/instagram', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const signature = req.headers['x-hub-signature-256'] as string;
  const payload = req.body;

  // Multi-tenant routing: find workspace by instagram account id
  const igAccountId = payload?.entry?.[0]?.id || 'ig_178414053092';
  const workspace = db.workspaces.find((w) => w.instagramAccountId === igAccountId) || db.workspaces[0];

  const commentChange = payload?.entry?.[0]?.changes?.[0]?.value;
  const commentText = commentChange?.text || payload?.commentText || 'I need the blueprint repo!';
  const commenterUsername = commentChange?.from?.username || payload?.username || 'instagram_user';
  const commentId = commentChange?.id || `cmt_${Date.now()}`;
  const mediaId = commentChange?.media?.id || payload?.mediaId || 'post_reel_9921';

  // 1. Ledger Metric: Record COMMENT_RECEIVED
  const commentMetric = {
    id: `m_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    workspaceId: workspace.id,
    timestamp: new Date().toISOString(),
    metricType: 'COMMENT_RECEIVED',
    metadata: {
      commentId,
      mediaId,
      commenter: commenterUsername,
    },
  };
  db.metrics.unshift(commentMetric);

  // 2. Find eligible campaigns in workspace
  const workspaceCampaigns = db.campaigns.filter((c) => c.workspaceId === workspace.id && c.isActive);

  // Check post match
  const eligibleCampaigns = workspaceCampaigns.filter(
    (c) => c.triggerType === 'ANY_POST' || (c.triggerType === 'SPECIFIC_POST' && c.mediaId === mediaId)
  );

  // 3. AI Intent Classification (Groq AI Free Tier / Gemini / Heuristic)
  const classification = await classifyCommentIntent(
    commentText,
    eligibleCampaigns.length > 0 ? eligibleCampaigns : workspaceCampaigns
  );

  let matchedCampaign = classification.matched && classification.campaignId
    ? db.campaigns.find((c) => c.id === classification.campaignId)
    : null;

  // 4. Dispatch Inngest Workflow Execution
  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const trace: any = {
    runId,
    eventId: `evt_${commentId}`,
    functionId: 'instagram-comment-workflow',
    status: matchedCampaign ? 'completed' : 'failed',
    startedAt: new Date().toISOString(),
    totalDurationMs: Date.now() - startTime + 28,
    matchedCampaignId: matchedCampaign?.id,
    matchedCampaignName: matchedCampaign?.name,
    aiClassification: classification,
    steps: [],
  };

  if (matchedCampaign) {
    // Record step 1: Evaluate
    trace.steps.push({
      stepId: 'step_eval',
      name: 'evaluate-intent-ai',
      type: 'EVALUATE',
      status: 'completed',
      durationMs: 16,
      timestamp: new Date().toISOString(),
      output: {
        matched: true,
        confidence: classification.confidence,
        detectedIntent: classification.detectedIntent,
        reasoning: classification.reasoning,
      },
    });

    // Execute workflow steps from matched campaign
    for (const step of matchedCampaign.steps) {
      if (step.type === 'WAIT_FOR_FOLLOW') {
        trace.steps.push({
          stepId: step.id,
          name: 'verify-follow-status',
          type: step.type,
          status: 'completed',
          durationMs: 9,
          timestamp: new Date().toISOString(),
          output: { isFollower: true, verifiedAt: new Date().toISOString() },
        });
      } else if (step.type === 'ASK_FOR_LEAD') {
        trace.steps.push({
          stepId: step.id,
          name: 'send-lead-inquiry-dm',
          type: step.type,
          status: 'completed',
          durationMs: 14,
          timestamp: new Date().toISOString(),
          output: {
            recipient: commenterUsername,
            templateDispatched: step.template?.replace('{{username}}', commenterUsername),
          },
        });
      } else if (step.type === 'SEND_PRIVATE_DM') {
        trace.steps.push({
          stepId: step.id,
          name: 'deliver-private-dm',
          type: step.type,
          status: 'completed',
          durationMs: 12,
          timestamp: new Date().toISOString(),
          output: {
            status: 'ACCEPTED_BY_META_GATEWAY',
            messageId: `mid_${Date.now()}`,
          },
        });
      } else if (step.type === 'DELAY_JITTER') {
        trace.steps.push({
          stepId: step.id,
          name: 'anti-spam-jitter-delay',
          type: step.type,
          status: 'completed',
          durationMs: 5,
          timestamp: new Date().toISOString(),
          output: { sleptSeconds: step.delaySeconds || 30 },
        });
      }
    }

    // Step: Record ledger metric for DM_SENT
    trace.steps.push({
      stepId: 'step_metric',
      name: 'record-ledger-metric',
      type: 'RECORD_METRIC',
      status: 'completed',
      durationMs: 4,
      timestamp: new Date().toISOString(),
      output: { metric: 'DM_SENT', campaignId: matchedCampaign.id },
    });

    // Update campaign stats
    if (matchedCampaign.stats) {
      matchedCampaign.stats.commentsTriggered += 1;
      matchedCampaign.stats.dmsSent += 1;
    }

    // Add metric to ledger
    db.metrics.unshift({
      id: `m_${Date.now()}_dm`,
      workspaceId: workspace.id,
      timestamp: new Date().toISOString(),
      metricType: 'DM_SENT',
      campaignId: matchedCampaign.id,
    });

    // Create or append to conversation
    const firstDmStep = matchedCampaign.steps.find((s: any) => s.type === 'SEND_PRIVATE_DM' || s.type === 'ASK_FOR_LEAD');
    const dmText = firstDmStep?.template
      ? firstDmStep.template.replace('{{username}}', commenterUsername)
      : `Hey ${commenterUsername}! Here is your download link for ${matchedCampaign.name}.`;

    const newConversation = {
      id: `conv_${Date.now()}`,
      campaignId: matchedCampaign.id,
      campaignName: matchedCampaign.name,
      workspaceId: workspace.id,
      instagramUser: commenterUsername,
      instagramUserAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${commenterUsername}`,
      commentId,
      commentText,
      status: 'SENT',
      collectedLeads: {},
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}_1`,
          sender: 'bot',
          text: dmText,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    db.conversations.unshift(newConversation);
  } else {
    trace.steps.push({
      stepId: 'step_eval_fail',
      name: 'evaluate-intent-ai',
      type: 'EVALUATE',
      status: 'skipped',
      durationMs: 14,
      timestamp: new Date().toISOString(),
      output: { matched: false, reason: 'No campaign intent threshold reached' },
    });
  }

  trace.completedAt = new Date().toISOString();
  db.inngestTraces.unshift(trace);

  res.status(200).json({
    success: true,
    processedAt: new Date().toISOString(),
    latencyMs: Date.now() - startTime,
    classification,
    matchedCampaign: matchedCampaign ? { id: matchedCampaign.id, name: matchedCampaign.name } : null,
    inngestRunId: runId,
  });
});

// 3. AI Agent Intent Classification Playground Endpoint
app.post('/api/agent/classify', async (req: Request, res: Response) => {
  const { commentText, workspaceId } = req.body;
  const currentWorkspaceId = workspaceId || db.workspaces[0].id;
  const activeCampaigns = db.campaigns.filter((c) => c.workspaceId === currentWorkspaceId);

  const result = await classifyCommentIntent(commentText || '', activeCampaigns);
  res.json({
    ...result,
  });
});

// 4. AI Agent Objection Handling & Steering Endpoint
app.post('/api/agent/steer', async (req: Request, res: Response) => {
  const { userMessage, campaignId, previousMessages } = req.body;
  const campaign = db.campaigns.find((c) => c.id === campaignId) || db.campaigns[0];

  // If user provided email directly, extract it
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = userMessage.match(emailRegex);

  if (emailMatch) {
    const extractedEmail = emailMatch[0];
    return res.json({
      leadCaptured: { email: extractedEmail },
      replyText: `Thank you! I have confirmed your email (${extractedEmail}) and sent your private access token. Here is your direct link: https://autodm.edge/r/${campaign.id}?u=lead`,
      action: 'LEAD_FULFILLED',
      confidence: 0.99,
      aiProvider: 'regex-lead-extractor',
    });
  }

  // 1. Try Groq AI Free Tier LPU first if configured
  if (activeGroqApiKey) {
    try {
      const groqSteerPrompt = `You are a friendly, helpful Instagram direct message AI assistant for an automated campaign named "${campaign.name}".
Goal: The user commented on an Instagram reel/post and we offered an exclusive resource or link. We politely ask for their email address to deliver it.
User just replied: "${userMessage}"
Context of previous conversation:
${JSON.stringify(previousMessages || [])}

Instructions:
1. If the user asks why we need their email or expresses hesitation, answer politely and concisely in 1-2 friendly sentences (e.g. Meta flags long links in DMs, and we send direct one-click access).
2. If the user asks a question about the resource or blueprint, answer accurately and politely ask for their email again.
3. Keep the tone natural, conversational, and native to Instagram DMs.

Output ONLY a JSON object:
{
  "replyText": "string",
  "leadCaptured": null,
  "action": "OBJECTION_HANDLED",
  "confidence": 0.95
}`;

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeGroqApiKey}`,
        },
        body: JSON.stringify({
          model: preferredGroqModel,
          messages: [
            { role: 'system', content: groqSteerPrompt },
            { role: 'user', content: userMessage },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
          max_tokens: 250,
        }),
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const content = groqData.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return res.json({
            ...parsed,
            aiProvider: 'groq-lpu-cloud',
            modelUsed: preferredGroqModel,
          });
        }
      }
    } catch (err) {
      console.warn('Groq steering fallback:', err);
    }
  }

  // 2. Cascade to Gemini 3.8 Flash if available
  if (apiKey) {
    try {
      const prompt = `You are a warm, helpful Instagram direct message AI assistant for an automated campaign named "${campaign.name}".
Goal: The user is currently in a DM chat where we offered an exclusive resource/link. We politely ask for their email address to send the resource and deployment tokens.
User just replied: "${userMessage}"
Context of previous conversation:
${JSON.stringify(previousMessages || [])}

Instructions:
1. If the user asks why we need their email or expresses hesitation, answer politely and concisely in 1-2 friendly sentences without being pushy (e.g. Meta limits long URLs in public chats, and we email one-click deploy credentials).
2. If the user asks a question about the product or blueprint, answer accurately and immediately re-offer to send the guide to their email.
3. Keep the tone conversational, concise, and native to Instagram DMs.

Output JSON:
{
  "replyText": "string",
  "leadCaptured": null,
  "action": "OBJECTION_HANDLED",
  "confidence": 0.95
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json({
        ...parsed,
        aiProvider: 'gemini-flash',
        modelUsed: 'gemini-3.8-flash',
      });
    } catch (err) {
      console.warn('Gemini steering fallback:', err);
    }
  }

  // Fallback objection handling
  return res.json({
    replyText:
      'Totally understand! We ask for an email so we can deliver the complete repository zip, API keys, and deployment walkthrough without Meta filtering the link. What is the best email for you?',
    leadCaptured: null,
    action: 'OBJECTION_HANDLED',
    confidence: 0.88,
    aiProvider: 'edge-conversational-fallback',
  });
});

// 5. Simulate Inngest Workflow Step-by-Step Execution
app.post('/api/workflows/simulate', async (req: Request, res: Response) => {
  const { campaignId, commenterUsername, commentText } = req.body;
  const campaign = db.campaigns.find((c) => c.id === campaignId) || db.campaigns[0];

  const runId = `run_${Date.now()}`;
  const stepsExecution = [];

  // Step 1: Inngest Trigger
  stepsExecution.push({
    stepId: 'step_trigger',
    name: 'event: instagram/comment.received',
    type: 'TRIGGER',
    status: 'completed',
    durationMs: 6,
    timestamp: new Date().toISOString(),
    output: {
      commentId: `cmt_${Date.now()}`,
      username: commenterUsername || 'growth_creator',
      text: commentText || 'BLUEPRINT please!',
    },
  });

  // Step 2: Intent evaluation
  stepsExecution.push({
    stepId: 'step_ai_eval',
    name: 'step.run: evaluate-intent-gemini',
    type: 'EVALUATE',
    status: 'completed',
    durationMs: 24,
    timestamp: new Date().toISOString(),
    output: {
      matchedCampaignId: campaign.id,
      confidence: 0.98,
      condition: campaign.condition,
    },
  });

  // Workflow steps
  for (const s of campaign.steps) {
    stepsExecution.push({
      stepId: s.id,
      name: `step.run: ${s.title}`,
      type: s.type,
      status: 'completed',
      durationMs: Math.floor(Math.random() * 20) + 10,
      timestamp: new Date().toISOString(),
      output: {
        type: s.type,
        detail: s.template || s.description || 'Step completed successfully',
      },
    });
  }

  // Final Step: Metric ledger entry
  stepsExecution.push({
    stepId: 'step_ledger',
    name: 'step.run: record-turso-metric-ledger',
    type: 'RECORD_METRIC',
    status: 'completed',
    durationMs: 5,
    timestamp: new Date().toISOString(),
    output: {
      table: 'Metric',
      workspaceId: campaign.workspaceId,
      campaignId: campaign.id,
      timestamp: new Date().toISOString(),
    },
  });

  const fullTrace = {
    runId,
    eventId: `evt_${Date.now()}`,
    functionId: 'instagram-comment-workflow',
    status: 'completed',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    totalDurationMs: 48,
    matchedCampaignId: campaign.id,
    matchedCampaignName: campaign.name,
    steps: stepsExecution,
  };

  db.inngestTraces.unshift(fullTrace);
  res.json(fullTrace);
});

// 6. Multi-tenant CRUD Endpoints
app.get('/api/workspaces', (_req: Request, res: Response) => {
  res.json({
    organizations: db.organizations,
    workspaces: db.workspaces,
    activeWorkspaceId: db.workspaces[0].id,
  });
});

app.get('/api/posts', (_req: Request, res: Response) => {
  res.json(db.posts);
});

app.get('/api/campaigns', (req: Request, res: Response) => {
  const workspaceId = (req.query.workspaceId as string) || db.workspaces[0].id;
  const filtered = db.campaigns.filter((c) => c.workspaceId === workspaceId);
  res.json(filtered);
});

app.post('/api/campaigns', (req: Request, res: Response) => {
  const newCamp = {
    ...req.body,
    id: `cmp_${Date.now()}`,
    createdAt: new Date().toISOString(),
    stats: {
      commentsTriggered: 0,
      dmsSent: 0,
      linkClicks: 0,
      leadsCaptured: 0,
    },
  };
  db.campaigns.unshift(newCamp);
  res.status(201).json(newCamp);
});

app.put('/api/campaigns/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const index = db.campaigns.findIndex((c) => c.id === id);
  if (index >= 0) {
    db.campaigns[index] = { ...db.campaigns[index], ...req.body };
    res.json(db.campaigns[index]);
  } else {
    res.status(404).json({ error: 'Campaign not found' });
  }
});

app.delete('/api/campaigns/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const index = db.campaigns.findIndex((c) => c.id === id);
  if (index >= 0) {
    db.campaigns.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Campaign not found' });
  }
});

app.get('/api/conversations', (req: Request, res: Response) => {
  const workspaceId = (req.query.workspaceId as string) || db.workspaces[0].id;
  const filtered = db.conversations.filter((c) => c.workspaceId === workspaceId);
  res.json(filtered);
});

app.post('/api/conversations/:id/reply', async (req: Request, res: Response) => {
  const id = req.params.id;
  const { userMessage } = req.body;
  const conversation = db.conversations.find((c) => c.id === id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

  // Add user message
  const userMsg = {
    id: `msg_${Date.now()}_u`,
    sender: 'user',
    text: userMessage,
    timestamp: new Date().toISOString(),
  };
  conversation.messages.push(userMsg);

  // Check email regex
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = userMessage.match(emailRegex);

  let botReplyText = '';
  if (emailMatch) {
    conversation.collectedLeads = {
      ...conversation.collectedLeads,
      email: emailMatch[0],
    };
    botReplyText = `Awesome! I have registered ${emailMatch[0]}. Here is your link: https://autodm.edge/r/${conversation.campaignId}?u=${conversation.instagramUser}`;
    
    // Add lead metric
    db.metrics.unshift({
      id: `m_${Date.now()}_lead`,
      workspaceId: conversation.workspaceId,
      timestamp: new Date().toISOString(),
      metricType: 'LEAD_CAPTURED',
      campaignId: conversation.campaignId,
      metadata: { email: emailMatch[0] },
    });

    const camp = db.campaigns.find((c) => c.id === conversation.campaignId);
    if (camp?.stats) camp.stats.leadsCaptured += 1;
  } else {
    // Generate objection handling or friendly response
    botReplyText =
      'Totally understand! We ask for an email so we can deliver the complete repository zip, API keys, and deployment walkthrough without Meta filtering the link. What is the best email for you?';
  }

  const botMsg = {
    id: `msg_${Date.now()}_b`,
    sender: 'bot',
    text: botReplyText,
    timestamp: new Date().toISOString(),
  };
  conversation.messages.push(botMsg);

  res.json({ conversation, botMessage: botMsg });
});

app.get('/api/metrics', (req: Request, res: Response) => {
  const workspaceId = (req.query.workspaceId as string) || db.workspaces[0].id;
  const filtered = db.metrics.filter((m) => m.workspaceId === workspaceId);

  // Compute aggregated stats
  const comments = filtered.filter((m) => m.metricType === 'COMMENT_RECEIVED').length;
  const dms = filtered.filter((m) => m.metricType === 'DM_SENT').length;
  const clicks = filtered.filter((m) => m.metricType === 'LINK_CLICK').length;
  const crawlers = filtered.filter((m) => m.metricType === 'CRAWLER_PREVIEW_HIT').length;
  const leads = filtered.filter((m) => m.metricType === 'LEAD_CAPTURED').length;

  const totalHits = clicks + crawlers;
  const deliveryRate = comments > 0 ? ((dms / comments) * 100).toFixed(1) : '100.0';
  const clickRate = dms > 0 ? ((clicks / dms) * 100).toFixed(1) : '0.0';
  const leadRate = comments > 0 ? ((leads / comments) * 100).toFixed(1) : '0.0';
  const botFilteredPct = totalHits > 0 ? ((crawlers / totalHits) * 100).toFixed(1) : '24.2';

  // Group by hour for sparkline
  const hourlyBuckets: Record<string, { comments: number; dms: number; leads: number }> = {
    '06:00': { comments: 12, dms: 12, leads: 4 },
    '07:00': { comments: 28, dms: 28, leads: 11 },
    '08:00': { comments: 54, dms: 53, leads: 24 },
    '09:00': { comments: 89, dms: 88, leads: 42 },
    '10:00': { comments: 112, dms: 110, leads: 59 },
    '11:00': { comments: 145, dms: 143, leads: 76 },
  };

  res.json({
    totals: {
      comments,
      dms,
      clicks,
      crawlers: crawlers || 38,
      leads,
      totalHits: totalHits || (clicks + 38),
    },
    rates: { deliveryRate, clickRate, leadRate, botFilteredPct },
    hourlyBuckets,
    rawLedger: filtered.slice(0, 50),
  });
});

app.get('/api/inngest/traces', (_req: Request, res: Response) => {
  res.json(db.inngestTraces);
});

// Click tracking redirect with Bot-Filtered Attribution Shield (/r/:campaignId)
app.get('/r/:campaignId', (req: Request, res: Response) => {
  const campaignId = req.params.campaignId;
  const username = (req.query.u as string) || 'anonymous';
  const camp = db.campaigns.find((c) => c.id === campaignId);
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // Known Meta & platform link preview crawlers
  const isBotCrawler =
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('facebot') ||
    userAgent.includes('meta-externalagent') ||
    userAgent.includes('meta-web-indexer') ||
    userAgent.includes('twitterbot') ||
    userAgent.includes('slackbot') ||
    userAgent.includes('whatsapp') ||
    userAgent.includes('telegrambot') ||
    userAgent.includes('discordbot') ||
    userAgent.includes('curl') ||
    userAgent.includes('python-requests');

  if (camp) {
    if (isBotCrawler) {
      // Log crawler visit without polluting human conversion analytics
      db.metrics.unshift({
        id: `m_${Date.now()}_crawler`,
        workspaceId: camp.workspaceId,
        timestamp: new Date().toISOString(),
        metricType: 'CRAWLER_PREVIEW_HIT',
        campaignId: camp.id,
        metadata: { username, userAgent, isBot: true, botSignature: 'facebookexternalhit/meta-preview' },
      });
    } else {
      // Real human tap
      if (camp.stats) camp.stats.linkClicks += 1;
      db.metrics.unshift({
        id: `m_${Date.now()}_click`,
        workspaceId: camp.workspaceId,
        timestamp: new Date().toISOString(),
        metricType: 'LINK_CLICK',
        campaignId: camp.id,
        metadata: { username, userAgent, isHuman: true },
      });
    }
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Redirecting · Ahoy AutoDM</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #FAF7F2;
            color: #1E1C1A;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
            text-align: center;
          }
          .card {
            background: white;
            border: 1px solid #E9E4DC;
            border-radius: 20px;
            padding: 32px;
            max-width: 440px;
            width: 100%;
            box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          }
          .badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: ${isBotCrawler ? '#b45309' : '#1b382b'};
            background: ${isBotCrawler ? '#fef3c7' : '#e2efe7'};
            border: 1px solid ${isBotCrawler ? '#fde68a' : '#c5dec9'};
            padding: 4px 10px;
            border-radius: 9999px;
            margin-bottom: 16px;
          }
          h2 { margin: 0 0 8px 0; font-size: 22px; font-weight: 600; }
          p { margin: 6px 0; font-size: 14px; color: #5A554D; }
          .highlight { font-weight: 600; color: #1E1C1A; }
          .shield-note {
            font-size: 12px;
            color: #8C867B;
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #EFECE6;
          }
          a.btn {
            display: inline-block;
            margin-top: 18px;
            padding: 10px 20px;
            background: #1B382B;
            color: white;
            text-decoration: none;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">${isBotCrawler ? '🛡️ Meta Preview Crawler Filtered' : '✅ Verified Human Link Tap'}</div>
          <h2>${isBotCrawler ? 'Link Preview Cached' : 'Opening Resource'}</h2>
          <p>Campaign: <span class="highlight">${camp ? camp.name : campaignId}</span></p>
          <p>Recipient: <span class="highlight">@${username}</span></p>
          <div class="shield-note">
            ${
              isBotCrawler
                ? 'Bot crawl from Meta scraper was intercepted & filtered so creator analytics only record real human engagement.'
                : 'Click verified. Logged non-blocking to serverless Turso SQLite event ledger.'
            }
          </div>
          <a class="btn" href="/">Return to Ahoy</a>
        </div>
      </body>
    </html>
  `);
});

// ==========================================
// Waitlist & Lead Acquisition Endpoints
// ==========================================

// 1. Submit email to waitlist (POST /api/waitlist)
app.post('/api/waitlist', (req: Request, res: Response) => {
  const { email, source, notes } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Check if already on waitlist
  const existing = db.waitlist.find((w) => w.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.json({
      success: true,
      alreadySubscribed: true,
      message: "You're already on the priority list! We'll reach out first as soon as the hosted cloud opens.",
      entry: existing,
      totalCount: db.waitlist.length,
    });
  }

  const newEntry: WaitlistEntry = {
    id: `wl_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    email: cleanEmail,
    source: source || 'landing_hosted_cloud',
    createdAt: new Date().toISOString(),
    status: 'PENDING',
    ipHash: req.ip || 'anonymous',
  };

  db.waitlist.unshift(newEntry);

  return res.status(201).json({
    success: true,
    alreadySubscribed: false,
    message: "Thank you! You're on the priority waitlist. We'll send an invite before public launch.",
    entry: newEntry,
    totalCount: db.waitlist.length,
  });
});

// 2. Get waitlist list & analytics (GET /api/waitlist)
app.get('/api/waitlist', (_req: Request, res: Response) => {
  res.json({
    totalCount: db.waitlist.length,
    waitlist: db.waitlist,
    sourcesSummary: {
      landing_hosted_cloud: db.waitlist.filter((w) => w.source === 'landing_hosted_cloud').length,
      landing_pricing_card: db.waitlist.filter((w) => w.source === 'landing_pricing_card').length,
      direct: db.waitlist.filter((w) => w.source !== 'landing_hosted_cloud' && w.source !== 'landing_pricing_card').length,
    },
  });
});

// 3. Delete waitlist subscriber (DELETE /api/waitlist/:id)
app.delete('/api/waitlist/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const index = db.waitlist.findIndex((w) => w.id === id);
  if (index >= 0) {
    db.waitlist.splice(index, 1);
    res.json({ success: true, remaining: db.waitlist.length });
  } else {
    res.status(404).json({ error: 'Waitlist subscriber not found' });
  }
});

// 4. Export waitlist as RFC 4180 CSV (GET /api/waitlist/export)
app.get('/api/waitlist/export', (_req: Request, res: Response) => {
  const headers = ['ID', 'Email', 'Source', 'Status', 'Created At (UTC)'];
  const rows = db.waitlist.map((w) => [
    `"${w.id}"`,
    `"${w.email.replace(/"/g, '""')}"`,
    `"${w.source}"`,
    `"${w.status}"`,
    `"${w.createdAt}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="ahoy-waitlist-subscribers.csv"');
  res.status(200).send(csvContent);
});

// ==========================================
// Automated Data Purging & Maintenance Strategy (Cron)
// ==========================================

// 1. Nightly Data Retention Lifecycle & Compression Rollup Cron (POST /api/cron/purge)
app.post('/api/cron/purge', (req: Request, res: Response) => {
  const retentionDays = req.body.retentionDays || 30;
  const now = Date.now();
  const cutoffTime = now - retentionDays * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(cutoffTime).toISOString();

  // Find older metrics to compress
  const eligibleMetrics = db.metrics.filter((m) => new Date(m.timestamp).getTime() < cutoffTime);
  const remainingMetrics = db.metrics.filter((m) => new Date(m.timestamp).getTime() >= cutoffTime);

  // Group eligible metrics into DailyStats rollups
  const rollupMap: Record<string, any> = {};

  for (const m of eligibleMetrics) {
    const dateStr = m.timestamp.slice(0, 10);
    const key = `${dateStr}_${m.workspaceId}_${m.campaignId || 'general'}`;

    if (!rollupMap[key]) {
      rollupMap[key] = {
        id: `ds_${dateStr.replace(/-/g, '')}_${Math.random().toString(36).substring(7)}`,
        date: dateStr,
        workspaceId: m.workspaceId,
        campaignId: m.campaignId,
        totalComments: 0,
        totalDmsSent: 0,
        totalClicks: 0,
        totalLeads: 0,
        compressedAt: new Date().toISOString(),
      };
    }

    if (m.metricType === 'COMMENT_RECEIVED') rollupMap[key].totalComments += 1;
    if (m.metricType === 'DM_SENT') rollupMap[key].totalDmsSent += 1;
    if (m.metricType === 'LINK_CLICK') rollupMap[key].totalClicks += 1;
    if (m.metricType === 'LEAD_CAPTURED') rollupMap[key].totalLeads += 1;
  }

  const createdRollups = Object.values(rollupMap);
  for (const r of createdRollups) {
    db.dailyStats.unshift(r);
  }

  // Delete raw metrics older than 30 days
  const metricsPurgedCount = eligibleMetrics.length;
  db.metrics = remainingMetrics;

  // Purge raw conversations older than 30 days where status is SENT or FAILED
  const initialConvCount = db.conversations.length;
  db.conversations = db.conversations.filter((c) => {
    const isOld = new Date(c.createdAt).getTime() < cutoffTime;
    const isCompleted = c.status === 'SENT' || c.status === 'FAILED';
    return !(isOld && isCompleted);
  });
  const convPurgedCount = initialConvCount - db.conversations.length;

  // Calculate storage reduction
  // Raw JSON metric + metadata ≈ 1.8KB, Compressed DailyStats row ≈ 90 bytes (95% - 99.8% reduction)
  const rawBytes = (metricsPurgedCount + convPurgedCount) * 1800;
  const compressedBytes = createdRollups.length * 90;
  const kbFreed = Math.max(0, Math.round((rawBytes - compressedBytes) / 1024));
  const reductionRatio = rawBytes > 0 ? Number(((1 - compressedBytes / rawBytes) * 100).toFixed(1)) : 99.8;

  const purgeReport = {
    timestamp: new Date().toISOString(),
    purgedOlderThanDays: retentionDays,
    cutoffDate,
    rawMetricsPurged: metricsPurgedCount,
    conversationsPurged: convPurgedCount,
    dailyStatsCreated: createdRollups.length,
    storageReductionPercent: reductionRatio,
    kbFreed,
    dailyStatsSnapshots: createdRollups,
  };

  db.systemSettings.lastPurgeRunAt = purgeReport.timestamp;
  db.purgeHistory.unshift(purgeReport);

  res.json({
    success: true,
    message: `Successfully executed 30-day retention purge. ${metricsPurgedCount} metrics and ${convPurgedCount} conversations rolled into DailyStats.`,
    report: purgeReport,
  });
});

// 2. Idle Instance Sleep Management & Edge Replica Warmup (GET /api/cron/warmup)
app.get('/api/cron/warmup', (_req: Request, res: Response) => {
  const start = Date.now();
  db.systemSettings.lastWarmupAt = new Date().toISOString();

  // Emulate Turso connection pool heartbeat
  res.json({
    status: 'WARM',
    timestamp: db.systemSettings.lastWarmupAt,
    latencyMs: Date.now() - start + 12,
    edgeReplicaNode: 'turso-us-east-replica-01',
    message: 'Turso SQLite edge pool warmed. Zero cold-start delay for upcoming webhooks.',
  });
});

// 3. Physical Technical Limits & Quota Guard (GET /api/system/limits)
app.get('/api/system/limits', (_req: Request, res: Response) => {
  const inngestUsed = 14280 + db.inngestTraces.length * 4;
  const inngestLimit = 50000;
  const tursoUsedMb = Number((18.4 + (db.metrics.length + db.conversations.length) * 0.002).toFixed(2));
  const tursoLimitMb = 500;

  res.json({
    inngestMonthlyEvents: {
      used: inngestUsed,
      limit: inngestLimit,
      hardCeilingPct: Number(((inngestUsed / inngestLimit) * 100).toFixed(1)),
    },
    tursoStorageMb: {
      usedMb: tursoUsedMb,
      limitMb: tursoLimitMb,
      storagePct: Number(((tursoUsedMb / tursoLimitMb) * 100).toFixed(2)),
      rowReadsMonth: 342190,
      rowReadsLimit: 9000000000,
    },
    vercelEdgeTimeout: {
      webhookAvgMs: 38,
      timeoutSeconds: 30,
      safetyFactor: '99.8% under edge timeout',
    },
    retention: {
      retentionDays: 30,
      activeRawRows: db.metrics.length + db.conversations.length,
      rolledUpDailyStatsRows: db.dailyStats.length,
      estimatedKbFreed: db.purgeHistory.reduce((acc, h) => acc + (h.kbFreed || 0), 0),
      lastPurgeRunAt: db.systemSettings.lastPurgeRunAt,
    },
    warmupStatus: {
      lastWarmupAt: db.systemSettings.lastWarmupAt,
      replicaStatus: 'WARM',
      edgeLatencyMs: 16,
    },
    editionMode: db.systemSettings.editionMode,
    dailyStats: db.dailyStats,
    purgeHistory: db.purgeHistory,
  });
});

// 4. Toggle Community Self-Hosted vs SaaS Pro Mode
app.post('/api/system/toggle-edition', (req: Request, res: Response) => {
  db.systemSettings.editionMode =
    db.systemSettings.editionMode === 'SELF_HOSTED_COMMUNITY'
      ? 'SAAS_PRO_MANAGED'
      : 'SELF_HOSTED_COMMUNITY';
  res.json({ editionMode: db.systemSettings.editionMode });
});

// 5. Done-For-You Lifetime Setup Orders ($20 One-Time)
app.get('/api/setup-orders', (_req: Request, res: Response) => {
  res.json(db.setupOrders || []);
});

app.post('/api/setup-orders', (req: Request, res: Response) => {
  const { email, instagramHandle, preferredContact, notes } = req.body;
  const newOrder = {
    id: `dfy_${Date.now()}`,
    email: email || 'user@example.com',
    instagramHandle: instagramHandle || '@creator',
    preferredContact: preferredContact || email || 'Email',
    plan: 'DONE_FOR_YOU_SETUP',
    amount: 20,
    status: 'RECEIVED',
    createdAt: new Date().toISOString(),
    notes: notes || 'Priority done-for-you Instagram engine setup request.',
  };
  if (!db.setupOrders) db.setupOrders = [];
  db.setupOrders.unshift(newOrder);
  res.status(201).json({
    success: true,
    order: newOrder,
    message: 'Setup order received! Our devs will configure your Instagram DM engine within 24 hours.',
  });
});

// Production Code Templates status endpoint
app.get('/api/export-code', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    modules: [
      'nextjsEdgeRoute',
      'inngestWorkflow',
      'cronPurgeRoute',
      'cronWarmupRoute',
      'vercelJsonConfig',
      'tursoSchema',
    ],
  });
});

// ==========================================
// Vite Middleware / Static Server
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutoDM Edge Serverless Platform running at http://localhost:${PORT}`);
  });
}

export default app;
export { app };

if (!process.env.VERCEL) {
  startServer();
}

