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
          username: 'demo_sarah',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 dark:bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col items-center">
        {/* Close Button Floating */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-700 border border-stone-700 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Realistic iPhone Device Mock */}
        <div className="w-[380px] h-[780px] bg-black border-[10px] border-stone-900 rounded-[48px] shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-stone-700">
          {/* iPhone Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
          </div>

          {/* Top Status Bar */}
          <div className="h-10 pt-3 px-6 flex items-center justify-between text-[11px] font-semibold text-stone-300 z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2.5 border border-stone-300 rounded-xs p-0.5">
                <div className="h-full bg-white rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Screen Switcher Segmented Tab */}
          <div className="bg-stone-900/90 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-xs z-10">
            <div className="flex bg-stone-950 rounded-xl p-0.5">
              <button
                onClick={() => setActiveScreen('feed')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeScreen === 'feed'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Reel / Post
              </button>
              <button
                onClick={() => setActiveScreen('dm')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeScreen === 'dm'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>Direct DMs</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              </button>
            </div>

            <span className="text-[10px] font-mono text-emerald-400 font-bold">Live Emulation</span>
          </div>

          {/* SCREEN 1: INSTAGRAM FEED / REEL */}
          {activeScreen === 'feed' && (
            <div className="flex-1 flex flex-col overflow-y-auto bg-black text-white text-xs">
              {/* Instagram Top Bar */}
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-stone-900">
                <span className="font-extrabold text-sm tracking-tight font-serif italic">Instagram</span>
                <button
                  onClick={() => setActiveScreen('dm')}
                  className="relative p-1 text-white cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500" />
                </button>
              </div>

              {/* Author header */}
              <div className="px-3.5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover border border-black"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs">alexgrowth.co</span>
                      <span className="w-3 h-3 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center font-bold">✓</span>
                    </div>
                    <span className="text-[10px] text-stone-400">Audio · Original sound</span>
                  </div>
                </div>
                <span className="text-stone-500 text-sm">•••</span>
              </div>

              {/* Media Container */}
              <div className="w-full aspect-square bg-gradient-to-tr from-stone-900 via-stone-950 to-stone-900 flex flex-col items-center justify-center p-6 text-center border-y border-stone-900 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
                  alt="Post"
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="relative z-10 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-500/30 font-bold">
                    ⚡
                  </div>
                  <h4 className="text-sm font-bold text-white max-w-xs leading-snug">
                    "Comment BLUEPRINT to get our 2026 SaaS Growth Architecture doc!"
                  </h4>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono text-amber-300">
                    AutoDM · Instant Groq Reply
                  </div>
                </div>
              </div>

              {/* Instagram Action Icons */}
              <div className="px-3.5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <MessageCircle className="w-5 h-5 text-white" />
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <Bookmark className="w-5 h-5 text-white" />
              </div>

              {/* Likes & Caption */}
              <div className="px-3.5 space-y-1 text-xs">
                <span className="font-bold">3,892 likes</span>
                <p className="text-[11px] text-stone-200 leading-snug">
                  <span className="font-bold mr-1.5">alexgrowth.co</span>
                  {currentMedia?.caption || 'Comment BLUEPRINT below to receive the complete playbook instantly in your DMs!'}
                </p>
              </div>

              {/* Simulated Comments Section */}
              <div className="mt-3 pt-2 px-3.5 border-t border-stone-900 space-y-2 flex-1">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Comments</span>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start gap-2">
                    <span className="font-bold">sarah_m:</span>
                    <span className="text-stone-300">BLUEPRINT please! Excited to test this out!</span>
                  </div>
                  <div className="pl-4 text-[10px] text-rose-400 flex items-center gap-1 font-mono">
                    <span>↳ AutoDM: Sent your private guide via DM ⚡</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-bold">dev_mark:</span>
                    <span className="text-stone-300">can i get the repo link?</span>
                  </div>
                  <div className="pl-4 text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span>↳ Groq LPU detected intent "LINK" → Sent DM 🚀</span>
                  </div>
                </div>
              </div>

              {/* Comment Input Footer */}
              <div className="p-3 bg-stone-950 border-t border-stone-900 flex items-center gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a comment (e.g. BLUEPRINT)..."
                  className="flex-1 bg-stone-900 text-xs text-white rounded-full px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder:text-stone-500"
                  onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                />
                <button
                  onClick={handlePostComment}
                  disabled={isSubmittingComment}
                  className="px-3 py-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
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
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-stone-900">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveScreen('feed')}
                    className="text-stone-400 hover:text-white cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs block leading-tight">alexgrowth.co</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 text-white text-[7px] flex items-center justify-center font-bold">✓</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">● Active now (Groq AI)</span>
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
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-tr-xs'
                            : 'bg-stone-800 text-stone-100 rounded-tl-xs border border-stone-700'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-stone-500 mt-1 px-1">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-stone-500 text-xs py-8">
                    No active conversation yet. Post a comment on the Reel to trigger an automated DM!
                  </div>
                )}

                {isReplying && (
                  <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-mono">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Groq AI typing reply...</span>
                  </div>
                )}
              </div>

              {/* DM Input Bar */}
              <div className="p-3 bg-stone-950 border-t border-stone-900 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Reply to DM (e.g. your email)..."
                  className="flex-1 bg-stone-900 text-xs text-white rounded-full px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder:text-stone-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendDm()}
                />
                <button
                  onClick={handleSendDm}
                  disabled={isReplying || !chatInput.trim()}
                  className="p-1.5 text-rose-400 hover:text-rose-300 disabled:opacity-40 cursor-pointer"
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
