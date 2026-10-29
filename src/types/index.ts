export type TriggerType = 'SPECIFIC_POST' | 'ANY_POST' | 'NEXT_POST';
export type ConditionType = 'EXACT_MATCH' | 'FUZZY_SEMANTIC' | 'AI_ROUTING';
export type StepType = 
  | 'WAIT_FOR_FOLLOW'
  | 'SEND_PRIVATE_DM'
  | 'ASK_FOR_LEAD'
  | 'AI_QUALIFY'
  | 'PUBLIC_REPLY'
  | 'DELAY_JITTER';

export interface WorkflowStep {
  id: string;
  type: StepType;
  title: string;
  description?: string;
  timeoutMinutes?: number;
  fallback?: string;
  template?: string;
  delaySeconds?: number;
  expectedField?: 'email' | 'phone' | 'interest_level';
  aiPrompt?: string;
}

export interface WorkflowSchema {
  version: string;
  steps: WorkflowStep[];
}

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  billingState: 'free' | 'pro' | 'enterprise';
}

export interface Workspace {
  id: string;
  organizationId: string;
  instagramAccountId: string;
  instagramUsername: string;
  name: string;
  avatarUrl?: string;
  encryptedTokenMasked: string;
  isTokenActive: boolean;
  campaignsCount: number;
}

export interface PostMedia {
  id: string;
  mediaType: 'REEL' | 'FEED_POST' | 'CAROUSEL';
  permalink: string;
  thumbnailUrl: string;
  caption: string;
  commentsCount: number;
  likeCount: number;
  publishedAt: string;
}

export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  triggerType: TriggerType;
  mediaId?: string;
  mediaDetails?: {
    caption: string;
    thumbnailUrl: string;
    permalink: string;
  };
  condition: ConditionType;
  keywords: string[]; // e.g. ["LINK", "PROMPT", "GUIDE"]
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: string;
  stats?: {
    commentsTriggered: number;
    dmsSent: number;
    linkClicks: number;
    leadsCaptured: number;
  };
}

export interface MessageItem {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  leadCaptured?: {
    email?: string;
    phone?: string;
  };
}

export interface Conversation {
  id: string;
  campaignId: string;
  campaignName: string;
  workspaceId: string;
  instagramUser: string;
  instagramUserAvatar?: string;
  commentId: string;
  commentText: string;
  status: 'QUEUED' | 'AI_PROCESSING' | 'SENT' | 'FAILED';
  errorLog?: string;
  collectedLeads?: {
    email?: string;
    phone?: string;
    notes?: string;
  };
  messages: MessageItem[];
  createdAt: string;
}

export type MetricType = 'COMMENT_RECEIVED' | 'DM_SENT' | 'LINK_CLICK' | 'LEAD_CAPTURED';

export interface Metric {
  id: string;
  workspaceId: string;
  timestamp: string;
  metricType: MetricType;
  campaignId?: string;
  metadata?: Record<string, any>;
}

export interface InngestTraceStep {
  stepId: string;
  name: string;
  type: StepType | 'TRIGGER' | 'EVALUATE' | 'RECORD_METRIC';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'retrying' | 'skipped';
  durationMs: number;
  output?: Record<string, any>;
  timestamp: string;
}

export interface InngestExecutionTrace {
  runId: string;
  eventId: string;
  functionId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  totalDurationMs?: number;
  steps: InngestTraceStep[];
  matchedCampaignId?: string;
  matchedCampaignName?: string;
  aiClassification?: {
    matched: boolean;
    confidence: number;
    detectedIntent: string;
    correctedKeyword?: string;
    reasoning: string;
  };
}

export interface DailyStats {
  id: string;
  date: string; // "YYYY-MM-DD"
  workspaceId: string;
  campaignId?: string;
  totalComments: number;
  totalDmsSent: number;
  totalClicks: number;
  totalLeads: number;
  compressedAt: string;
}

export interface SystemLimits {
  inngestMonthlyEvents: {
    used: number;
    limit: number;
    hardCeilingPct: number;
  };
  tursoStorageMb: {
    usedMb: number;
    limitMb: number;
    storagePct: number;
    rowReadsMonth: number;
    rowReadsLimit: number;
  };
  vercelEdgeTimeout: {
    webhookAvgMs: number;
    timeoutSeconds: number;
    safetyFactor: string;
  };
  retention: {
    retentionDays: number;
    activeRawRows: number;
    rolledUpDailyStatsRows: number;
    estimatedKbFreed: number;
    lastPurgeRunAt?: string;
  };
  warmupStatus: {
    lastWarmupAt: string;
    replicaStatus: 'WARM' | 'COLD' | 'REFRESHING';
    edgeLatencyMs: number;
  };
  editionMode: 'SELF_HOSTED_COMMUNITY' | 'SAAS_PRO_MANAGED';
}

export interface PurgeReport {
  timestamp: string;
  purgedOlderThanDays: number;
  rawMetricsPurged: number;
  conversationsPurged: number;
  dailyStatsCreated: number;
  storageReductionPercent: number;
  kbFreed: number;
  dailyStatsSnapshots: DailyStats[];
}
