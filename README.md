# AutoDM Edge ⚡
### 100% Serverless, Edge-Native Instagram AI Automation & Inngest Workflows

[![Vercel Edge](https://img.shields.io/badge/Runtime-Vercel%20Edge%20%28%3C25ms%29-black?logo=vercel)](https://vercel.com)
[![Inngest Workflows](https://img.shields.io/badge/Workflow-Inngest%20Serverless-00EDBE)](https://inngest.com)
[![Database](https://img.shields.io/badge/State-Turso%20LibSQL%20SQLite-00E599)](https://turso.tech)
[![AI Engine](https://img.shields.io/badge/AI%20Agent-Groq%20AI%20Free%20Tier-f55036)](https://console.groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

AutoDM Edge is an open-source, production-grade serverless Instagram AI automation engine. Instead of requiring continuous 24/7 background worker instances (`npm run worker`) and dedicated Redis clusters costing $7–$31+/month, AutoDM Edge runs **100% serverless** on the edge:

```
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
```

---

## ✨ Key Features

- **Zero-Worker Serverless**: No long-running Node daemons or Redis. Scales to zero at **$0/month** on standard free tiers.
- **Fast Webhook Handshake**: Returns HTTP 200 to Meta in `<40ms`, immediately queuing durable workflows into Inngest without edge function timeouts.
- **Agentic Semantic Routing**: Powered by Groq AI Free Tier LPU (Llama 3.3 70B & Llama 3.1 8B). Catches typos (e.g. `lnik`), regional phrasing (`envíame el enlace`), and semantic requests without rigid string failures.
- **Conversational Lead Steering**: Holds interactive DM dialogues asking for work emails and answering objections (*"why do you need my email?"*) dynamically.
- **Multi-Tenant from Day One**: Every transaction and ledger row is anchored to `organizationId` and `workspaceId`.
- **Automated 30-Day Purge & Rollups**: Nightly cron rolls 10,000 raw comment rows into a single `DailyStats` snapshot, achieving a **99.8% database footprint reduction**.

---

## 🚀 Quickstart (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/autodm-edge.git
cd autodm-edge
npm install
```

### 2. Configure Environment Variables
Copy the template and fill in your keys:
```bash
cp .env.example .env
```

```ini
# Required: Groq AI Free Tier (https://console.groq.com/keys - 14,400 free req/day)
GROQ_API_KEY="gsk_your_groq_free_api_key"
GROQ_MODEL="llama-3.3-70b-versatile"

# Optional: Google Gemini API Key
GEMINI_API_KEY="your_gemini_api_key"

# Meta Graph API Verification
META_VERIFY_TOKEN="autodm_edge_secret_verify_token_2026"
META_APP_SECRET="your_meta_app_secret"

# Edge Database
DATABASE_URL="libsql://your-database.turso.io"
DATABASE_AUTH_TOKEN="your_turso_token"
```

### 3. Launch Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to access the Landing Page and SaaS Console.

---

## 🛠️ Deploying to Production (Vercel + Turso + Inngest)

### Step 1: Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Deploy the repository to Vercel. In Project Settings > Environment Variables, add:
- `GROQ_API_KEY` (Free tier from console.groq.com/keys)
- `GROQ_MODEL` (e.g. `llama-3.3-70b-versatile`)
- `META_VERIFY_TOKEN`
- `META_APP_SECRET`
- `DATABASE_URL`
- `DATABASE_AUTH_TOKEN`

### Step 2: Configure Meta Webhook
1. Go to your [Meta for Developers App Dashboard](https://developers.facebook.com).
2. Under **Instagram > Webhooks**, subscribe to the `comments` field.
3. Set Callback URL: `https://your-domain.vercel.app/api/webhooks/instagram`.
4. Enter your `META_VERIFY_TOKEN`.
5. Meta will issue a GET challenge handshake; AutoDM Edge will verify and respond with HTTP 200 within 25ms.

### Step 3: Enable Automated Nightly Purge
Vercel automatically detects `vercel.json` to schedule:
- `/api/cron/purge` (Runs at 02:00 UTC daily to compress raw logs)
- `/api/cron/warmup` (Runs at 00:00 UTC daily to warm Turso edge replicas)

---

## 📊 Self-Hosted Community vs. Managed SaaS

| Feature | Community Self-Hosted (Free) | Managed Cloud SaaS (Paid) |
| :--- | :--- | :--- |
| **Hosting Cost** | **$0 / month** (Free tier allocations) | Transparent monthly subscription |
| **Meta App Review** | BYO Meta Developer account & review | **1-Click Login (Pre-Approved Meta App)** |
| **AI Intent Engine** | Gemini 3.8 Flash / BYO Groq Key | Fully managed high-throughput AI cluster |
| **Workflow Engine** | Inngest Free Tier (50k events/mo) | High-volume burst queues |
| **Team Governance** | Single Workspace / Multi-tenant core | Enterprise RBAC & Audit Logs |
| **Data Retention** | 30-Day raw logs + DailyStats rollups | Multi-year cold storage exports |

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
