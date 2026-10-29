import React, { useState } from 'react';
import {
  Campaign,
  WorkflowStep,
  StepType,
  TriggerType,
  ConditionType,
  PostMedia,
} from '../types';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  Clock,
  Send,
  UserCheck,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  Code2,
  Flame,
  ArrowRight,
  Sliders,
  Instagram,
  Eye,
} from 'lucide-react';

interface WorkflowCanvasProps {
  campaign: Campaign;
  posts: PostMedia[];
  onSave: (updated: Partial<Campaign>) => void;
  onPreviewInPhone?: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  campaign,
  posts,
  onSave,
  onPreviewInPhone,
}) => {
  const [name, setName] = useState(campaign.name);
  const [triggerType, setTriggerType] = useState<TriggerType>(campaign.triggerType);
  const [mediaId, setMediaId] = useState<string>(campaign.mediaId || (posts[0]?.id || ''));
  const [condition, setCondition] = useState<ConditionType>(campaign.condition);
  const [keywordsInput, setKeywordsInput] = useState(campaign.keywords.join(', '));
  const [steps, setSteps] = useState<WorkflowStep[]>(campaign.steps);
  const [isActive, setIsActive] = useState(campaign.isActive);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(steps[0]?.id || null);
  const [showJsonSchema, setShowJsonSchema] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const selectedStep = steps.find((s) => s.id === selectedStepId) || steps[0];
  const selectedMedia = posts.find((p) => p.id === mediaId) || posts[0];

  const handleAddStep = (type: StepType) => {
    const newStepId = `step_${Date.now()}`;
    let newStep: WorkflowStep;

    switch (type) {
      case 'WAIT_FOR_FOLLOW':
        newStep = {
          id: newStepId,
          type: 'WAIT_FOR_FOLLOW',
          title: 'Wait For User To Follow',
          description: 'Pauses workflow up to 5 min. If user is not following, posts public reminder.',
          timeoutMinutes: 5,
          fallback: 'PUBLIC_REPLY_REMINDER',
        };
        break;
      case 'ASK_FOR_LEAD':
        newStep = {
          id: newStepId,
          type: 'ASK_FOR_LEAD',
          title: 'Conversational DM (Email Lead Capture)',
          description: 'Asks commenter for their best work email before providing the link.',
          template: 'Hey {{username}}! Where should I email your access key & source code?',
          expectedField: 'email',
        };
        break;
      case 'AI_QUALIFY':
        newStep = {
          id: newStepId,
          type: 'AI_QUALIFY',
          title: 'Agent Intent & Objection Steering',
          description: 'Evaluates replies using Gemini 3.8 Flash. Handles hesitation or questions dynamically.',
          aiPrompt: 'Validate email syntax or answer questions warmly while steering back to conversion.',
        };
        break;
      case 'DELAY_JITTER':
        newStep = {
          id: newStepId,
          type: 'DELAY_JITTER',
          title: 'Anti-Spam Human Jitter',
          description: 'Randomized sleep between 30-90s to simulate organic human response.',
          delaySeconds: 45,
        };
        break;
      case 'PUBLIC_REPLY':
        newStep = {
          id: newStepId,
          type: 'PUBLIC_REPLY',
          title: 'Public Algorithm Viral Comment',
          description: 'Replies to the public comment to boost post reach in the Instagram feed algorithm.',
          template: 'Sent! Check your DMs for the link 🚀',
        };
        break;
      case 'SEND_PRIVATE_DM':
      default:
        newStep = {
          id: newStepId,
          type: 'SEND_PRIVATE_DM',
          title: 'Deliver Private Asset Link',
          description: 'Sends the tracked URL and download key to the commenter via Meta Graph API.',
          template: 'Here is your link: https://autodm.edge/r/' + campaign.id + '?u={{username}}',
        };
        break;
    }

    const updated = [...steps, newStep];
    setSteps(updated);
    setSelectedStepId(newStepId);
    setHasChanges(true);
  };

  const handleUpdateStep = (id: string, updates: Partial<WorkflowStep>) => {
    const updated = steps.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSteps(updated);
    setHasChanges(true);
  };

  const handleDeleteStep = (id: string) => {
    if (steps.length <= 1) return;
    const updated = steps.filter((s) => s.id !== id);
    setSteps(updated);
    if (selectedStepId === id) {
      setSelectedStepId(updated[0]?.id || null);
    }
    setHasChanges(true);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const copy = [...steps];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setSteps(copy);
    setHasChanges(true);
  };

  const handleSaveAll = () => {
    const parsedKeywords = keywordsInput
      .split(',')
      .map((k) => k.trim().toUpperCase())
      .filter(Boolean);

    onSave({
      name,
      triggerType,
      mediaId: triggerType === 'SPECIFIC_POST' ? mediaId : undefined,
      mediaDetails:
        triggerType === 'SPECIFIC_POST' && selectedMedia
          ? {
              caption: selectedMedia.caption,
              thumbnailUrl: selectedMedia.thumbnailUrl,
              permalink: selectedMedia.permalink,
            }
          : undefined,
      condition,
      keywords: parsedKeywords,
      steps,
      isActive,
    });
    setHasChanges(false);
  };

  const inngestJsonSchema = {
    version: '1.0',
    campaignId: campaign.id,
    name,
    trigger: {
      type: triggerType,
      mediaId: triggerType === 'SPECIFIC_POST' ? mediaId : '*',
      matchingStrategy: condition,
      keywords: keywordsInput.split(',').map((k) => k.trim()),
    },
    inngestSteps: steps.map((s, idx) => ({
      stepIndex: idx + 1,
      stepId: s.id,
      type: s.type,
      config: {
        timeoutMinutes: s.timeoutMinutes,
        fallback: s.fallback,
        template: s.template,
        delaySeconds: s.delaySeconds,
        expectedField: s.expectedField,
        aiPrompt: s.aiPrompt,
      },
    })),
  };

  const getStepIcon = (type: StepType) => {
    switch (type) {
      case 'WAIT_FOR_FOLLOW':
        return <UserCheck className="w-4 h-4 text-amber-400" />;
      case 'ASK_FOR_LEAD':
        return <HelpCircle className="w-4 h-4 text-purple-400" />;
      case 'AI_QUALIFY':
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'DELAY_JITTER':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'PUBLIC_REPLY':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case 'SEND_PRIVATE_DM':
      default:
        return <Send className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setHasChanges(true);
              }}
              className="text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 py-0.5 rounded transition-colors"
            />
            <button
              onClick={() => {
                setIsActive(!isActive);
                setHasChanges(true);
              }}
              className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded transition-colors ${
                isActive
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isActive ? '● ACTIVE WORKFLOW' : '○ PAUSED'}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Campaign ID: <span className="font-mono text-slate-300">{campaign.id}</span> · Multi-tenant Edge Workflow
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onPreviewInPhone && (
            <button
              onClick={onPreviewInPhone}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Preview DM Thread</span>
            </button>
          )}

          <button
            onClick={() => setShowJsonSchema(!showJsonSchema)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{showJsonSchema ? 'Hide Schema' : 'Inngest Schema'}</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={!hasChanges}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              hasChanges
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{hasChanges ? 'Deploy Changes' : 'Saved to Edge'}</span>
          </button>
        </div>
      </div>

      {/* JSON Schema Preview Drawer */}
      {showJsonSchema && (
        <div className="bg-slate-950 border border-indigo-900/50 rounded-xl p-4 font-mono text-xs text-indigo-300">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-950">
            <span className="font-semibold text-white">Inngest Step Workflow JSON Schema (version 1.0)</span>
            <span className="text-[11px] text-slate-400">Deployed to Turso Campaign.steps</span>
          </div>
          <pre className="max-h-64 overflow-auto p-2 bg-slate-900/80 rounded border border-slate-800/80 text-[11px] leading-relaxed text-slate-200">
            {JSON.stringify(inngestJsonSchema, null, 2)}
          </pre>
        </div>
      )}

      {/* 2-Column Builder Grid: Flow on Left, Configuration Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Step Pipeline (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Node 1: Trigger Block */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-bold">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">01. Meta Webhook Trigger</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">event: instagram/comment.received</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                {(['SPECIFIC_POST', 'ANY_POST', 'NEXT_POST'] as TriggerType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setTriggerType(type);
                      setHasChanges(true);
                    }}
                    className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                      triggerType === type
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {type === 'SPECIFIC_POST' && 'Specific Reel/Post'}
                    {type === 'ANY_POST' && 'Any Post / Reel'}
                    {type === 'NEXT_POST' && 'Next Published Post'}
                  </button>
                ))}
              </div>

              {triggerType === 'SPECIFIC_POST' && (
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3">
                  <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                    Select Target Reel or Feed Post:
                  </label>
                  <select
                    value={mediaId}
                    onChange={(e) => {
                      setMediaId(e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {posts.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.mediaType}] {p.caption.substring(0, 65)}...
                      </option>
                    ))}
                  </select>

                  {selectedMedia && (
                    <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-900/60 rounded border border-slate-800">
                      <div className="w-12 h-12 rounded bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 text-white font-mono text-[10px]">
                        REEL
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-slate-300 truncate font-medium">{selectedMedia.caption}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          ID: {selectedMedia.id} · {selectedMedia.commentsCount} comments
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center z-10 text-slate-400 text-xs">
              ↓
            </div>
          </div>

          {/* Node 2: Conditional Matching & AI Intent Block */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden pt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  02. Intent & Keyword Strategy
                </span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400">step.run: evaluate-intent</span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {(['EXACT_MATCH', 'FUZZY_SEMANTIC', 'AI_ROUTING'] as ConditionType[]).map((cond) => (
                  <button
                    key={cond}
                    onClick={() => {
                      setCondition(cond);
                      setHasChanges(true);
                    }}
                    className={`py-2 px-2 rounded-lg border text-center transition-all ${
                      condition === cond
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[11px]">
                      {cond === 'EXACT_MATCH' && 'Exact Match'}
                      {cond === 'FUZZY_SEMANTIC' && 'Fuzzy / Synonyms'}
                      {cond === 'AI_ROUTING' && 'Gemini AI Agent'}
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Trigger Keywords & Intent Tokens (comma-separated):
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => {
                    setKeywordsInput(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="BLUEPRINT, CODE, LINK, SAVE"
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  {condition === 'AI_ROUTING'
                    ? 'AI Agent Engine will classify typos (e.g. "lnik") and semantic requests ("can i get the repo?") into these keywords.'
                    : 'Checks comment text for exact or normalized substring occurrences.'}
                </p>
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center z-10 text-slate-400 text-xs">
              ↓
            </div>
          </div>

          {/* Node 3: Inngest Steps Sequence */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                03. Inngest Workflow Step Sequence ({steps.length} steps)
              </span>
              <span className="text-[11px] font-mono text-emerald-400">Zero Redis · Edge-Native</span>
            </div>

            {steps.map((step, idx) => (
              <div
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={`group relative bg-slate-900 border rounded-xl p-4 transition-all cursor-pointer ${
                  selectedStepId === step.id
                    ? 'border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/40'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      {getStepIcon(step.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500">Step {idx + 1}</span>
                        <h4 className="text-xs font-semibold text-white">{step.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {step.template || step.description || step.aiPrompt}
                      </p>
                    </div>
                  </div>

                  {/* Step control buttons */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveStep(idx, 'up');
                      }}
                      disabled={idx === 0}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded disabled:opacity-30"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveStep(idx, 'down');
                      }}
                      disabled={idx === steps.length - 1}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded disabled:opacity-30"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStep(step.id);
                      }}
                      disabled={steps.length <= 1}
                      className="p-1 hover:bg-red-950/60 text-slate-500 hover:text-red-400 rounded disabled:opacity-30"
                      title="Delete Step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-badges */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-3 text-[10px] font-mono text-slate-500">
                  <span>type: {step.type}</span>
                  {step.timeoutMinutes && <span>timeout: {step.timeoutMinutes}m</span>}
                  {step.delaySeconds && <span>jitter: {step.delaySeconds}s</span>}
                  {step.expectedField && <span>captures: {step.expectedField}</span>}
                </div>
              </div>
            ))}

            {/* Add Step Action Bar */}
            <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-3">
              <span className="block text-[11px] font-medium text-slate-400 mb-2">
                + Append Inngest Workflow Step:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAddStep('WAIT_FOR_FOLLOW')}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <UserCheck className="w-3 h-3 text-amber-400" />
                  <span>Wait for Follow</span>
                </button>
                <button
                  onClick={() => handleAddStep('ASK_FOR_LEAD')}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3 h-3 text-purple-400" />
                  <span>Ask for Email / Lead</span>
                </button>
                <button
                  onClick={() => handleAddStep('AI_QUALIFY')}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>AI Objection Steering</span>
                </button>
                <button
                  onClick={() => handleAddStep('DELAY_JITTER')}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>Anti-Spam Delay</span>
                </button>
                <button
                  onClick={() => handleAddStep('SEND_PRIVATE_DM')}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3 h-3 text-emerald-400" />
                  <span>Send Direct DM</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step Inspector & Live Config (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Step Configuration Inspector
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{selectedStep?.type}</span>
            </div>

            {selectedStep ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Step Title</label>
                  <input
                    type="text"
                    value={selectedStep.title}
                    onChange={(e) => handleUpdateStep(selectedStep.id, { title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {selectedStep.type === 'WAIT_FOR_FOLLOW' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Inngest Wait Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={selectedStep.timeoutMinutes || 5}
                        onChange={(e) =>
                          handleUpdateStep(selectedStep.id, {
                            timeoutMinutes: parseInt(e.target.value, 10) || 5,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Fallback Action if Not Followed
                      </label>
                      <select
                        value={selectedStep.fallback || 'PUBLIC_REPLY_REMINDER'}
                        onChange={(e) => handleUpdateStep(selectedStep.id, { fallback: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="PUBLIC_REPLY_REMINDER">Public Comment Reminder (@user follow us!)</option>
                        <option value="SKIP_DM">Abort Workflow (No DM sent)</option>
                        <option value="SEND_FOLLOW_DM">Send DM requesting follow first</option>
                      </select>
                    </div>
                  </>
                )}

                {(selectedStep.type === 'SEND_PRIVATE_DM' || selectedStep.type === 'ASK_FOR_LEAD') && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-300">Message DM Template</label>
                      <span className="text-[10px] text-slate-500">Variables: {'{{username}}'}, {'{{link}}'}</span>
                    </div>
                    <textarea
                      rows={4}
                      value={selectedStep.template || ''}
                      onChange={(e) => handleUpdateStep(selectedStep.id, { template: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
                    />
                  </div>
                )}

                {selectedStep.type === 'ASK_FOR_LEAD' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Target Lead Data to Extract
                    </label>
                    <select
                      value={selectedStep.expectedField || 'email'}
                      onChange={(e) =>
                        handleUpdateStep(selectedStep.id, {
                          expectedField: e.target.value as 'email' | 'phone',
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="email">Email Address (Validated via regex + AI)</option>
                      <option value="phone">Phone / WhatsApp Number</option>
                    </select>
                  </div>
                )}

                {selectedStep.type === 'AI_QUALIFY' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Gemini Agent Steering Prompt
                    </label>
                    <textarea
                      rows={3}
                      value={selectedStep.aiPrompt || ''}
                      onChange={(e) => handleUpdateStep(selectedStep.id, { aiPrompt: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Runs server-side on `@google/genai` (gemini-3.8-flash). Dynamically answers questions and handles hesitations.
                    </p>
                  </div>
                )}

                {selectedStep.type === 'DELAY_JITTER' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Delay Duration (seconds)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="300"
                      value={selectedStep.delaySeconds || 45}
                      onChange={(e) =>
                        handleUpdateStep(selectedStep.id, {
                          delaySeconds: parseInt(e.target.value, 10) || 45,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Uses Inngest `step.sleep('jitter', '45s')` — serverless non-blocking pause.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Step Notes / Rationale</label>
                  <input
                    type="text"
                    value={selectedStep.description || ''}
                    onChange={(e) => handleUpdateStep(selectedStep.id, { description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select a step from the workflow sequence to edit its parameters.</p>
            )}

            {/* Architecture Comparison Callout */}
            <div className="mt-6 p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] space-y-1 text-slate-400">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Zero-Worker Edge Guarantee
              </span>
              <p>
                This step does not require an active Node worker daemon or Redis server. It executes as a stateless step function on Vercel Edge + Inngest durable storage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
