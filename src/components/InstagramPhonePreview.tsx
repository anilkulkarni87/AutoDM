import React, { useState } from 'react';
import { Campaign, PostMedia, Conversation } from '../types';
import {
  X,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Send,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface InstagramPhonePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: Campaign;
  posts: PostMedia[];
  conversations: Conversation[];
  onSendMessage?: (convId: string, text: string) => Promise<void>;
}

export const InstagramPhonePreview: React.FC<InstagramPhonePreviewProps> = ({
  isOpen,
  onClose,
  campaign,
  posts,
  conversations,
  onSendMessage,
}) => {
  const [activeScreen, setActiveScreen] = useState<'feed' | 'dm'>('feed');
  const [commentInput, setCommentInput] = useState('BLUEPRINT please!');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  if (!isOpen) return null;

  const currentMedia = posts.find((p) => p.id === campaign?.mediaId) || posts[0];
  const activeConversation = conversations[0];

  const handlePostComment = async () => {
    if (!commentInput.trim()) return;
    setIsSubmittingComment(true);
    try {
      await fetch('/api/webhooks/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentText: commentInput,
          username: 'demo_user',
          mediaId: currentMedia?.id,
        }),
      });
      // Switch to DM view after short delay to show DM arrival
      setTimeout(() => {
        setActiveScreen('dm');
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSendDm = async () => {
    if (!chatInput.trim() || !activeConversation) return;
    const text = chatInput;
    setChatInput('');
    setIsReplying(true);
    try {
      if (onSendMessage) {
        await onSendMessage(activeConversation.id, text);
      } else {
        await fetch(`/api/conversations/${activeConversation.id}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userMessage: text }),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col items-center">
        {/* Close Button Floating */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Realistic iPhone Device Mock */}
        <div className="w-[380px] h-[780px] bg-slate-950 border-[10px] border-slate-900 rounded-[48px] shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-slate-800">
          {/* iPhone Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          {/* Top Status Bar */}
          <div className="h-10 pt-3 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2.5 border border-slate-300 rounded-sm p-0.5">
                <div className="h-full bg-white rounded-xs" />
              </div>
            </div>
          </div>

          {/* Screen Switcher Segmented Tab */}
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs z-10">
            <div className="flex bg-slate-950 rounded-lg p-0.5">
              <button
                onClick={() => setActiveScreen('feed')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  activeScreen === 'feed' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                Reel / Post
              </button>
              <button
                onClick={() => setActiveScreen('dm')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                  activeScreen === 'dm' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                <span>Direct DMs</span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              </button>
            </div>

            <span className="text-[10px] font-mono text-emerald-400">Live Emulation</span>
          </div>

          {/* SCREEN 1: INSTAGRAM FEED / REEL */}
          {activeScreen === 'feed' && (
            <div className="flex-1 flex flex-col overflow-y-auto bg-black text-white text-xs">
              {/* Instagram Top Bar */}
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-900">
                <span className="font-bold text-sm tracking-tight">Instagram</span>
                <button
                  onClick={() => setActiveScreen('dm')}
                  className="relative p-1 text-white"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-pink-500" />
                </button>
              </div>

              {/* Author header */}
              <div className="px-3.5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-0.5">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-[10px]">
                      AG
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs">acme.growth</span>
                      <span className="text-blue-400 text-[10px]">●</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">Sponsored · AutoDM Active</span>
                  </div>
                </div>
                <span className="text-neutral-500 text-sm">•••</span>
              </div>

              {/* Media Container */}
              <div className="w-full aspect-square bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center border-y border-neutral-900 relative">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-3 shadow-lg">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-white max-w-xs leading-snug">
                  100% Serverless Instagram Automation
                </h4>
                <p className="text-[11px] text-indigo-300 mt-1">
                  Edge-Native + Inngest Workflows + Turso SQLite
                </p>
                <div className="mt-3 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-emerald-300">
                  Comment "BLUEPRINT" for source code
                </div>
              </div>

              {/* Instagram Action Icons */}
              <div className="px-3.5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <MessageCircle className="w-5 h-5 text-white" />
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <Bookmark className="w-5 h-5 text-white" />
              </div>

              {/* Likes & Caption */}
              <div className="px-3.5 space-y-1 text-xs">
                <span className="font-bold">2,890 likes</span>
                <p className="text-[11px] text-neutral-200 leading-snug">
                  <span className="font-bold mr-1.5">acme.growth</span>
                  {currentMedia?.caption || 'Comment below to receive the complete architecture blueprint!'}
                </p>
              </div>

              {/* Simulated Comments Section */}
              <div className="mt-3 pt-2 px-3.5 border-t border-neutral-900/80 space-y-2 flex-1">
                <span className="text-[10px] font-semibold text-neutral-400">Comments</span>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start gap-2">
                    <span className="font-bold">sarah_dev:</span>
                    <span className="text-neutral-300">Could I get the blueprint repo? Loved this!</span>
                  </div>
                  <div className="pl-4 text-[10px] text-indigo-400 flex items-center gap-1">
                    <span>↳ AutoDM replied in DMs with custom token ⚡</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-bold">alex_codez:</span>
                    <span className="text-neutral-300">typo: lnik please!</span>
                  </div>
                  <div className="pl-4 text-[10px] text-emerald-400 flex items-center gap-1">
                    <span>↳ Gemini AI mapped intent "LINK" → Sent DM 🚀</span>
                  </div>
                </div>
              </div>

              {/* Comment Input Footer */}
              <div className="p-3 bg-neutral-950 border-t border-neutral-900 flex items-center gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a comment (e.g. BLUEPRINT)..."
                  className="flex-1 bg-neutral-900 text-xs text-white rounded-full px-3.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-neutral-500"
                  onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                />
                <button
                  onClick={handlePostComment}
                  disabled={isSubmittingComment}
                  className="px-3 py-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {isSubmittingComment ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Post'}
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: INSTAGRAM DIRECT MESSAGES (DMs) */}
          {activeScreen === 'dm' && (
            <div className="flex-1 flex flex-col bg-black text-white text-xs">
              {/* DM Thread Header */}
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-900">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveScreen('feed')}
                    className="text-neutral-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center font-bold text-[10px]">
                    AG
                  </div>
                  <div>
                    <span className="font-bold text-xs block leading-tight">acme.growth</span>
                    <span className="text-[10px] text-emerald-400">● Active now (AI Agent)</span>
                  </div>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                {activeConversation ? (
                  activeConversation.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-neutral-800 text-neutral-100 rounded-tl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-neutral-500 mt-1 px-1">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-neutral-500 text-xs py-8">
                    No active conversation yet. Post a comment on the Reel to trigger an automated DM!
                  </div>
                )}

                {isReplying && (
                  <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-mono">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>AI Agent typing...</span>
                  </div>
                )}
              </div>

              {/* DM Input Bar */}
              <div className="p-3 bg-neutral-950 border-t border-neutral-900 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Reply to DM (e.g. your email)..."
                  className="flex-1 bg-neutral-900 text-xs text-white rounded-full px-3.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-neutral-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendDm()}
                />
                <button
                  onClick={handleSendDm}
                  disabled={isReplying || !chatInput.trim()}
                  className="p-1.5 text-indigo-400 hover:text-indigo-300 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
