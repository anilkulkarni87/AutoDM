import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  BookOpen,
  GitBranch,
  Terminal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
} from 'lucide-react';

export const DocsView: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<'readme' | 'vercel' | 'deployment' | 'env' | 'architecture'>('readme');
  const [copied, setCopied] = useState(false);

  const vercelContent = `# ⚡ Deploying AutoDM Edge to Vercel via GitHub

## Can I host this on Vercel via GitHub?
**YES! 100%.** The entire AutoDM Edge platform is built specifically for Vercel Serverless & Edge deployment.

You can push this repository directly to GitHub and deploy it to Vercel with zero code changes.

---

## 3-Step Vercel Deployment Flow

### Step 1: Push Code to GitHub
Initialize git and push to your GitHub profile or organization:

\`\`\`bash
git init
git add .
git commit -m "feat: AutoDM Edge Serverless Instagram automation"
git branch -M main
git remote add origin https://github.com/<your-username>/autodm-edge.git
git push -u origin main
\`\`\`

---

### Step 2: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/new).
2. Click **Add New...** > **Project** and select your GitHub repository (\`autodm-edge\`).
3. Vercel automatically detects the root \`vercel.json\` and configures:
   - **Framework Preset**: \`Vite\`
   - **Build Command**: \`vite build\`
   - **Output Directory**: \`dist\`
   - **API Serverless Handler**: Automatically mounted at \`/api\` via \`vercel.json\`

---

### Step 3: Configure Environment Variables in Vercel
In the Vercel project configuration panel, add these environment variables:

| Variable | Description | Required For |
| :--- | :--- | :--- |
| \`GROQ_API_KEY\` | Groq AI Key (Free from console.groq.com/keys) | Ultra-Fast LPU Intent & Objection Parsing |
| \`GEMINI_API_KEY\` | Google Gemini API Key (Optional) | Fallback AI Agent Routing |
| \`APP_URL\` | Your deployed Vercel domain (e.g. \`https://autodm-edge.vercel.app\`) | Meta OAuth & Webhooks |
| \`META_APP_ID\` | Meta Developer App ID | Production Instagram Graph API |
| \`META_APP_SECRET\` | Meta Developer App Secret | Production Instagram Graph API |
| \`META_VERIFY_TOKEN\`| Webhook verify string (e.g. \`autodm_edge_secret_verify_token_2026\`) | Meta Handshake |
| \`DATABASE_URL\` | Turso LibSQL URL (\`libsql://...\`) | Persistent Edge Multi-Tenant SQLite |
| \`DATABASE_AUTH_TOKEN\` | Turso DB Token | Persistent Edge Multi-Tenant SQLite |
| \`INNGEST_EVENT_KEY\` | Inngest Event Key | Production Inngest Workflow Dashboard |
| \`INNGEST_SIGNING_KEY\`| Inngest Signing Key | Production Inngest Workflow Dashboard |

Click **Deploy**! Vercel builds the SPA on edge CDN and spins up the serverless webhook routes in under 45 seconds.

---

## 💡 Do I need to create keys right now to test here?
**No!** In AI Studio, the application runs with an **In-Memory Zero-Config Engine**. You can simulate Instagram comments, test AI intent classifications, preview conversations, and test nightly retention rollups right in this dashboard without registering for any third-party accounts first.`;

  const readmeContent = `# AutoDM Edge ⚡
### 100% Serverless, Edge-Native Instagram AI Automation & Inngest Workflows

[![Vercel Edge](https://img.shields.io/badge/Runtime-Vercel%20Edge%20%28%3C25ms%29-black?logo=vercel)](https://vercel.com)
[![Inngest Workflows](https://img.shields.io/badge/Workflow-Inngest%20Serverless-00EDBE)](https://inngest.com)
[![Database](https://img.shields.io/badge/State-Turso%20LibSQL%20SQLite-00E599)](https://turso.tech)
[![AI Engine](https://img.shields.io/badge/AI%20Agent-Groq%20AI%20Free%20Tier-f55036)](https://console.groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

AutoDM Edge is an open-source, production-grade serverless Instagram AI automation platform. Instead of requiring continuous 24/7 background worker instances (\`npm run worker\`) and dedicated Redis clusters costing $7–$31+/month, AutoDM Edge runs **100% serverless** on the edge:

\`\`\`
                    ┌────────────────────────────────────────┐
                    │          Meta Graph API                │
                    └──────────────────┬─────────────────────┘
                                       │ (Webhook Event)
                                       ▼
                    ┌────────────────────────────────────────┐
                    │    Vercel Edge Webhook Handler         │
                    └──────────────────┬─────────────────────┘
                                       │ (Trigger Workflow)
                                       ▼
                    ┌────────────────────────────────────────┐
                    │     Inngest Serverless Workflows       │
                    └──────┬───────────────────────────┬─────┘
                           │                           │
                           ▼                           ▼
            ┌─────────────────────────────┐ ┌─────────────────────────────┐
            │   Turso Database (SQLite)   │ │    Groq AI Agent Engine     │
            │   Multi-tenant State Layer  │ │   Intent & Context Routing  │
            └─────────────────────────────┘ └─────────────────────────────┘
\`\`\`

## 🚀 Quickstart
\`\`\`bash
git clone https://github.com/your-org/autodm-edge.git
cd autodm-edge
npm install
cp .env.example .env
npm run dev
\`\`\``;

  const deploymentContent = `# Production Deployment Guide: AutoDM Edge

## Prerequisites
- Node.js 20+
- Free accounts: Vercel, Turso (LibSQL), Inngest
- Meta Developer Account (for Instagram Graph API)

## 1. Database Setup (Turso SQLite)
\`\`\`bash
turso auth login
turso db create autodm-edge-db
turso db show autodm-edge-db --url
turso db tokens create autodm-edge-db
npx prisma db push
\`\`\`

## 2. Inngest Workflows Setup
- Retrieve Event Key and Signing Key from inngest.com dashboard.
- Mount Inngest handlers at /api/inngest.

## 3. Meta Developer Webhook Configuration
- Set Webhook Callback URL: \`https://your-domain.vercel.app/api/webhooks/instagram\`
- Set Verify Token: matching \`META_VERIFY_TOKEN\`
- Subscribe to: \`comments\` and \`messages\` fields.

## 4. Vercel Edge Deployment
- Import repository into Vercel.
- Configure Environment Variables (GEMINI_API_KEY, DATABASE_URL, META_APP_SECRET, etc.).
- Deploy. Vercel automatically activates nightly retention purge via vercel.json.`;

  const envContent = `# GEMINI_API_KEY: Required for server-side Gemini AI agent intent classification & objection handling.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The hosted domain for OAuth redirects and webhook receivers
APP_URL="https://your-domain.vercel.app"

# META_GRAPH_API: Meta Graph API credentials for Instagram comment & DM webhooks
META_APP_ID="your_meta_app_id"
META_APP_SECRET="your_meta_app_secret"
META_VERIFY_TOKEN="autodm_edge_secret_verify_token_2026"

# TURSO_DATABASE: Edge-native SQLite multi-tenant database
DATABASE_URL="libsql://your-database.turso.io"
DATABASE_AUTH_TOKEN="your_turso_auth_token"

# INNGEST: Serverless event-driven workflow engine
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"

# VERCEL_CRON_SECRET: Header authorization for nightly retention purge cron
CRON_SECRET="your_cron_secret_random_token"`;

  const architectureContent = `# Architecture Specification: Edge-Native + Inngest Workflows

## Why Serverless Replaces Redis & Background Workers
1. **Cold Start Latency**: Vercel Edge network resolves in <25ms, well within Meta's 5-second webhook timeout window.
2. **Durable Orchestration**: Inngest functions execute step-by-step with state persistence. If Instagram's API returns a 429 or rate limit, Inngest automatically retries with exponential backoff without duplicating DMs.
3. **Data Retention & DailyStats Rollup**: Every night at 02:00 UTC, the /api/cron/purge job compacts raw metric rows into single-row daily snapshots, preventing storage bloat on Turso's free tier.
4. **Agentic Intent Classification**: Groq / Gemini 3.8 Flash classifies typos ('lnik') and phrases ('can i get the repo?') into exact campaign keys, preventing lost leads.`;

  const getCurrentText = () => {
    switch (selectedDoc) {
      case 'readme':
        return readmeContent;
      case 'vercel':
        return vercelContent;
      case 'deployment':
        return deploymentContent;
      case 'env':
        return envContent;
      case 'architecture':
        return architectureContent;
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filenames: Record<string, string> = {
      readme: 'README.md',
      vercel: 'VERCEL_DEPLOY.md',
      deployment: 'DEPLOYMENT.md',
      env: '.env.example',
      architecture: 'ARCHITECTURE.md',
    };
    const blob = new Blob([getCurrentText()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filenames[selectedDoc] || `${selectedDoc}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Zero-Key Prototyping Notice Banner */}
      <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-lg shadow-indigo-950/20">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold shrink-0 mt-0.5">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">Zero-Key Prototyping Mode Active</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 rounded">
                No setup required here
              </span>
            </div>
            <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
              You do <strong>not</strong> need to create Meta, Turso, or Inngest keys to test, simulate, and explore this app right now in AI Studio! Everything runs on local simulated state. When you want to host this on Vercel via GitHub, follow the 3-step Vercel guide below.
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedDoc('vercel')}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shrink-0 text-xs transition-colors cursor-pointer whitespace-nowrap"
        >
          View Vercel Guide
        </button>
      </div>

      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-400" />
            <span>GitHub Publishing & Documentation Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete, production-ready markdown documentation, environment templates, and deployment guides for publishing this repository to GitHub.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download File</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Raw Markdown'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Layout: Doc Selector on Left, Rendered Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Navigation and Launch Checklist (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Repository Documents
            </span>

            {[
              { id: 'readme', title: 'README.md', desc: 'Main GitHub documentation with badges & architecture' },
              { id: 'vercel', title: 'VERCEL_DEPLOY.md', desc: '3-step guide: Push to GitHub & Deploy to Vercel' },
              { id: 'deployment', title: 'DEPLOYMENT.md', desc: 'Step-by-step Vercel, Turso & Meta setup guide' },
              { id: 'env', title: '.env.example', desc: 'Complete environment variable blueprint' },
              { id: 'architecture', title: 'ARCHITECTURE.md', desc: 'Serverless Inngest & Turso specification' },
            ].map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc.id as any)}
                className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedDoc === doc.id
                    ? 'bg-slate-800 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold">{doc.title}</span>
                  <FileText className="w-3.5 h-3.5 opacity-60" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{doc.desc}</p>
              </button>
            ))}
          </div>

          {/* GitHub Launch Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              GitHub Publication Checklist
            </span>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Initialize git repository and commit files</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Add README.md, LICENSE, and DEPLOYMENT.md</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Sanitize .env (never commit secrets)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Create Turso edge database & run schema push</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Configure Meta Webhook URL & verify token</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Markdown Viewer (8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">{selectedDoc.toUpperCase()}.md</span>
              <span className="text-slate-500">Raw Markdown Format</span>
            </div>

            <pre className="p-5 font-mono text-xs text-slate-200 overflow-x-auto max-h-[600px] leading-relaxed whitespace-pre-wrap">
              {getCurrentText()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
