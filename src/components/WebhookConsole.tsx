import React, { useState } from 'react';
import { PostMedia } from '../types';
import {
  Terminal,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Code2,
  Copy,
  Check,
} from 'lucide-react';

interface WebhookConsoleProps {
  posts: PostMedia[];
  onWebhookDispatched?: () => void;
}

export const WebhookConsole: React.FC<WebhookConsoleProps> = ({
  posts,
  onWebhookDispatched,
}) => {
  // Handshake state
  const [verifyToken, setVerifyToken] = useState('autodm_edge_secret_verify_token_2026');
  const [challengeString, setChallengeString] = useState('1158201444');
  const [handshakeResult, setHandshakeResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Incoming event state
  const [username, setUsername] = useState('dev_elena');
  const [commentText, setCommentText] = useState('Hey could you send the blueprint repo? Thanks!');
  const [selectedPostId, setSelectedPostId] = useState(posts[0]?.id || 'post_reel_9921');
  const [isSendingEvent, setIsSendingEvent] = useState(false);
  const [eventResponse, setEventResponse] = useState<any>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleTestHandshake = async () => {
    setIsVerifying(true);
    try {
      const url = `/api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(
        verifyToken
      )}&hub.challenge=${encodeURIComponent(challengeString)}`;
      const res = await fetch(url);
      const text = await res.text();
      setHandshakeResult({
        status: res.status,
        ok: res.ok,
        body: text,
      });
    } catch (err: any) {
      setHandshakeResult({
        status: 500,
        ok: false,
        body: err.message,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendWebhookEvent = async () => {
    setIsSendingEvent(true);
    try {
      const metaPayload = {
        object: 'instagram',
        entry: [
          {
            id: 'ig_178414053092',
            time: Math.floor(Date.now() / 1000),
            changes: [
              {
                field: 'comments',
                value: {
                  id: `cmt_${Date.now()}`,
                  text: commentText,
                  from: {
                    id: `usr_${Math.floor(Math.random() * 90000) + 10000}`,
                    username: username,
                  },
                  media: {
                    id: selectedPostId,
                  },
                },
              },
            ],
          },
        ],
      };

      const res = await fetch('/api/webhooks/instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hub-signature-256': 'sha256=d3b07384d113edec49eaa6238ad5ff00',
        },
        body: JSON.stringify(metaPayload),
      });

      const data = await res.json();
      setEventResponse(data);
      if (onWebhookDispatched) onWebhookDispatched();
    } catch (err: any) {
      setEventResponse({ error: err.message });
    } finally {
      setIsSendingEvent(false);
    }
  };

  const curlCommand = `curl -X POST "${window.location.origin}/api/webhooks/instagram" \\
  -H "Content-Type: application/json" \\
  -H "x-hub-signature-256: sha256=simulated_hmac" \\
  -d '{"entry":[{"changes":[{"value":{"text":"${commentText}","from":{"username":"${username}"},"media":{"id":"${selectedPostId}"}}}]}]}'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Overview header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Meta Graph API Webhook Gateway Console
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Vercel Edge route: <code className="text-indigo-400 font-mono">/api/webhooks/instagram</code>. Handles both Meta's verification challenge handshake (GET) and incoming comment webhook payloads with HMAC SHA-256 signature verification (POST), immediately dispatching into Inngest workflows within &lt;40ms.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Meta Handshake Verification (GET) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                1. Meta Challenge Handshake (GET)
              </h3>
              <p className="text-[11px] text-slate-400">Verifies hub.verify_token and returns hub.challenge</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
              GET 200 OK
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                hub.verify_token:
              </label>
              <input
                type="text"
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                hub.challenge (Random number from Meta):
              </label>
              <input
                type="text"
                value={challengeString}
                onChange={(e) => setChallengeString(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>

            <button
              onClick={handleTestHandshake}
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              {isVerifying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Verify Webhook Challenge</span>
            </button>

            {handshakeResult && (
              <div
                className={`p-3 rounded-lg border text-xs font-mono ${
                  handshakeResult.ok
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-red-950/30 border-red-800/60 text-red-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Status: {handshakeResult.status} {handshakeResult.ok ? 'Verified' : 'Rejected'}</span>
                  <span>{handshakeResult.ok ? '✅' : '❌'}</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Response Body: <span className="text-white font-bold">{handshakeResult.body}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Meta Webhook Event Dispatcher (POST) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                2. Live Comment Webhook Trigger (POST)
              </h3>
              <p className="text-[11px] text-slate-400">Simulates Meta Graph webhook to Inngest workflow</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-400">
              POST /api/webhooks/instagram
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Commenter Handle (@):
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Post ID:</label>
                <select
                  value={selectedPostId}
                  onChange={(e) => setSelectedPostId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-white"
                >
                  {posts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} ({p.mediaType})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Comment Text:</label>
              <textarea
                rows={2}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="e.g. Can you please send the blueprint link? Loved this!"
                className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSendWebhookEvent}
                disabled={isSendingEvent}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all"
              >
                {isSendingEvent ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Dispatch Meta Webhook Event</span>
              </button>

              <button
                onClick={copyCurl}
                className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
                title="Copy cURL command"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {eventResponse && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>Processed in {eventResponse.latencyMs}ms on Edge</span>
                  <span>{eventResponse.success ? 'HTTP 200' : 'ERROR'}</span>
                </div>
                <p>Inngest Run ID: <span className="text-indigo-400">{eventResponse.inngestRunId}</span></p>
                {eventResponse.matchedCampaign && (
                  <p>Matched Campaign: <span className="text-white font-bold">{eventResponse.matchedCampaign.name}</span></p>
                )}
                <p className="text-slate-400">
                  AI Intent: {eventResponse.classification?.detectedIntent} ({(eventResponse.classification?.confidence * 100).toFixed(0)}% conf)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
