import React, { useState } from 'react';
import { Campaign } from '../types';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Bot,
  User,
  RefreshCw,
  Zap,
  ShieldAlert,
} from 'lucide-react';

interface AIAgentStudioProps {
  campaigns: Campaign[];
}

export const AIAgentStudio: React.FC<AIAgentStudioProps> = ({ campaigns }) => {
  // Section 1: Intent & Fallback Playground State
  const [testComment, setTestComment] = useState('Could you please dm me the blueprint repo? Loved the video!');
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState<any>(null);

  // Section 2: Conversation Steering & Objection Handling State
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'bot'; text: string; action?: string; leadCaptured?: any }>
  >([
    {
      sender: 'bot',
      text: 'Hey there! Saw your comment on our Serverless Architecture reel. Where should I email your access key & GitHub repository link?',
    },
  ]);
  const [userInputMessage, setUserInputMessage] = useState('why do you need my email instead of dropping the link here?');
  const [isSteering, setIsSteering] = useState(false);

  const handleTestComment = async (customText?: string) => {
    const textToTest = customText || testComment;
    setIsClassifying(true);
    try {
      const res = await fetch('/api/agent/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentText: textToTest }),
      });
      const data = await res.json();
      setClassificationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSendChatMessage = async (presetText?: string) => {
    const text = presetText || userInputMessage;
    if (!text.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user' as const, text }];
    setChatMessages(newMsgs);
    setUserInputMessage('');
    setIsSteering(true);

    try {
      const res = await fetch('/api/agent/steer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          campaignId: campaigns[0]?.id,
          previousMessages: newMsgs,
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.replyText,
          action: data.action,
          leadCaptured: data.leadCaptured,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSteering(false);
    }
  };

  const resetChat = () => {
    setChatMessages([
      {
        sender: 'bot',
        text: 'Hey there! Saw your comment on our Serverless Architecture reel. Where should I email your access key & GitHub repository link?',
      },
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-900/40 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Stateless AI Agent Engine (Intent Parsing & Conversation Steering)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Traditional Instagram automation relies on rigid, exact string matching which fails on typos, regional phrases, or questions. The stateless Agent Engine understands semantic intent, catches spelling variations, and holds multi-step qualification conversations with dynamic objection handling.
            </p>
          </div>
        </div>
      </div>

      {/* Part 1: Intent Parsing & Typo Correction Playground */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>1. Fallback Handling & Semantic Intent Classifier</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                ⚡ Groq AI Free Tier LPU
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Powered by Groq LPU (Llama 3.3 70B & Llama 3.1 8B) with 14,400 free requests/day + Gemini & edge heuristics
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Groq LPU: Ready
          </span>
        </div>

        {/* Input & Quick Presets */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={testComment}
              onChange={(e) => setTestComment(e.target.value)}
              placeholder="Type an unstructured comment or typo (e.g. 'Can you send me the repo please?')"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleTestComment()}
            />
            <button
              onClick={() => handleTestComment()}
              disabled={isClassifying}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 whitespace-nowrap cursor-pointer"
            >
              {isClassifying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Evaluate Intent</span>
            </button>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 mr-1 font-medium">Try Preset Tests:</span>
            {[
              'Send me the discount code please!',
              'typo: lnik please send it',
              'can i get the blueprint repo?',
              'envíame el enlace por favor',
              'how much does the cloud hosting cost?',
              'just leaving a comment, love your content!',
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setTestComment(preset);
                  handleTestComment(preset);
                }}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded transition-colors cursor-pointer"
              >
                "{preset}"
              </button>
            ))}
          </div>
        </div>

        {/* Evaluation Comparison Result */}
        {classificationResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Rigid Keyword Match Card */}
            <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Basic Exact Keyword Match
                </span>
                <span className="text-[10px] font-mono text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded">
                  Rigid Logic
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {testComment.toUpperCase().includes('BLUEPRINT') ||
                testComment.toUpperCase().includes('SAVE')
                  ? 'Matched exact keyword string.'
                  : 'FAILED: Comment discarded. Rigid string comparison found no exact match for campaign keywords.'}
              </p>
              <div className="text-[11px] font-mono text-red-400 pt-1">
                Result: {testComment.toUpperCase().includes('BLUEPRINT') ? 'DM Triggered' : 'Lead Lost (0 DM)'}
              </div>
            </div>

            {/* Edge-Native AI Agent */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Autonomous AI Agent Engine
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                  {classificationResult.modelUsed || 'Groq LPU / Gemini Flash'}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Trigger Decision:</span>
                  <span
                    className={`font-bold ${
                      classificationResult.matched ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {classificationResult.matched ? 'TRIGGERED (Intent Detected)' : 'IGNORED (General Comment)'}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    ({(classificationResult.confidence * 100).toFixed(0)}% confidence
                    {classificationResult.latencyMs ? ` · ${classificationResult.latencyMs}ms` : ''})
                  </span>
                </div>

                {classificationResult.matchedKeyword && (
                  <p className="text-slate-300">
                    Mapped to Keyword: <span className="font-mono text-indigo-300">"{classificationResult.matchedKeyword}"</span>
                  </p>
                )}

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Reasoning: {classificationResult.reasoning}
                </p>
              </div>

              <div className="text-[11px] font-mono text-emerald-400 pt-1">
                Edge Inngest Event: {classificationResult.matched ? 'instagram/comment.received dispatched' : 'Skipped'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part 2: Conversation Steering & Dynamic DM Qualification */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              2. Dynamic DM Conversation Steering (Email Lead Capture)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instead of sending a single static reply, the AI agent holds an interactive conversation to capture verified emails and handle objections.
            </p>
          </div>
          <button
            onClick={resetChat}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Chat</span>
          </button>
        </div>

        {/* Chat Thread Container */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-w-2xl mx-auto space-y-3.5 min-h-[300px]">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-md rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                }`}
              >
                <p>{msg.text}</p>
                {msg.leadCaptured?.email && (
                  <div className="mt-2 pt-1.5 border-t border-slate-700/80 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Captured Lead: {msg.leadCaptured.email}</span>
                  </div>
                )}
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isSteering && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Gemini Agent formulating contextual steering reply...</span>
            </div>
          )}
        </div>

        {/* Chat input form */}
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInputMessage}
              onChange={(e) => setUserInputMessage(e.target.value)}
              placeholder="Reply to the DM (e.g. 'why do you need my email?', 'is this legit?', or 'alex@dev.co')"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
            />
            <button
              onClick={() => handleSendChatMessage()}
              disabled={isSteering}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </div>

          {/* Objection test chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 mr-1">Quick Objections / Inputs:</span>
            {[
              'why do you need my email?',
              'is this an automated bot?',
              'can you just DM me the link directly?',
              'here is my email: jordan.smith@growthlab.io',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendChatMessage(prompt)}
                className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded transition-colors text-[10px]"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
