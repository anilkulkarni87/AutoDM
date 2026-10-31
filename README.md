# Ahoy (AutoDM Edge) ⛵
### The Open-Source, Serverless Instagram AI DM Automation Engine

[![Vercel Edge](https://img.shields.io/badge/Runtime-Vercel%20Edge%20%28%3C25ms%29-black?logo=vercel)](https://vercel.com)
[![Inngest Workflows](https://img.shields.io/badge/Workflow-Inngest%20Serverless-00EDBE)](https://inngest.com)
[![Database](https://img.shields.io/badge/State-Turso%20LibSQL%20SQLite-00E599)](https://turso.tech)
[![AI Engine](https://img.shields.io/badge/AI%20Agent-Groq%20AI%20Free%20Tier-f55036)](https://console.groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **When someone asks for your link, they get it.**  
> Send an instant, friendly direct message the moment a follower comments your keyword on a Post, Reel, or Story.  
> Runs **100% serverless** at **$0/month** on free-tier infrastructure. No 24/7 background servers, no Redis, and your audience data stays on your own accounts.

---

## 📑 Table of Contents

1. [Prerequisites](#-prerequisites-what-you-need-first)
2. [1-Click Cloud Deployment (Recommended)](#-1-click-cloud-deployment-recommended)
3. [Step-by-Step Configuration Guide](#-step-by-step-configuration-guide)
   - [Step 1: Get Free Turso SQLite Database](#step-1-get-free-turso-sqlite-database)
   - [Step 2: Get Free Inngest Workflow Keys](#step-2-get-free-inngest-workflow-keys)
   - [Step 3: Get Free Groq AI Key (Fast Intent Parsing)](#step-3-get-free-groq-ai-key)
   - [Step 4: Set Up Free Meta Developer App](#step-4-set-up-free-meta-developer-app)
   - [Step 5: Connect Meta Webhook](#step-5-connect-meta-webhook)
   - [Step 6: Secure Your Admin Console (`ADMIN_PASSWORD`)](#step-6-secure-your-admin-console)
   - [Step 7: Cron Protection (`CRON_SECRET`) & Public Domain (`APP_URL`)](#step-7-cron-protection--public-domain)
4. [Complete Secrets & Environment Variables Reference](#-complete-secrets--environment-variables-reference)
5. [Creating Campaigns & Workflow Steps](#-creating-campaigns--workflow-steps)
6. [Local Development (Test on your laptop)](#-local-development)
7. [Built-in Verification & Testing Tools](#-testing-your-automations)
8. [Novel Features Included](#-novel-creator-features)
9. [Troubleshooting & Common Questions](#-troubleshooting)
10. [License](#-license)

---

## 📋 Prerequisites (What You Need First)

Before you begin, ensure you have:

1. **An Instagram Business or Creator Account**  
   *Personal accounts cannot use Instagram's messaging tools.*  
   *How to check:* On your phone, open Instagram → **Settings and privacy** → **Account type and tools** → Switch to **Creator** or **Business**.
2. **"Allow Access to Messages" Toggled ON**  
   In Instagram app → **Settings** → **Messages and story replies** → **Message controls** → Under "Connected tools", turn **Allow access to messages** ON.
3. **A Free GitHub Account** (to clone or fork this repository).
4. **A Free Vercel Account** (to deploy the serverless edge routes).

---

## ⚡ 1-Click Cloud Deployment (Recommended)

Deploy your own complete, private instance directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fanilkulkarni87%2FAutoDM)

During deployment, Vercel will ask for environment variables. Follow the 5-minute setup guide below to get your free keys.

---

## 🛠️ Step-by-Step Configuration Guide

### Step 1: Get Free Turso SQLite Database
Turso is a distributed serverless SQLite database with a generous free tier (9 billion row reads/month, 500MB storage).

1. Go to **[turso.tech](https://turso.tech)** and sign up with GitHub.
2. In the Turso dashboard, click **Create Database** (e.g. name it `autodm-db`).
3. Under database details, copy:
   * **Database URL**: looks like `libsql://autodm-db-yourname.turso.io`
   * Click **Generate Token** and copy the **Auth Token**.
4. Set these in your environment:
   * `DATABASE_URL="libsql://your-database.turso.io"`
   * `DATABASE_AUTH_TOKEN="your_token_here"`

---

### Step 2: Get Free Inngest Workflow Keys
Inngest handles asynchronous background execution, step-by-step delays, and follower verification without needing continuous server instances.

1. Go to **[inngest.com](https://inngest.com)** and create a free account (50,000 runs/month included).
2. Open your default environment (or click **Create App**).
3. In the sidebar, navigate to **Manage > API Keys**.
4. Copy:
   * **Event Key** (used to trigger workflows)
   * **Signing Key** (used to verify webhooks)
5. Set these in your environment:
   * `INNGEST_EVENT_KEY="your_inngest_event_key"`
   * `INNGEST_SIGNING_KEY="your_inngest_signing_key"`

> 💡 **Do I need to run a local server for Inngest?**  
> **No.** Inngest's website mentions running a local CLI server (`npx inngest-cli dev`) for offline testing. You can **ignore and skip that completely**. When deployed to Vercel, Inngest Cloud connects to your serverless URL automatically. For testing, AutoDM has a built-in simulator inside **App Console → Webhook Tester**.

---

### Step 3: Get Free Groq AI Key
Groq powers ultra-fast (<30ms) intent evaluation and typo tolerance (matching comments like *"lnik please"* or *"can I get the repo?"*) with **14,400 free requests per day** and no credit card required.

1. Go to **[console.groq.com/keys](https://console.groq.com/keys)** and sign in.
2. Click **Create API Key**, give it a name (e.g. `AutoDM`), and copy the key (starts with `gsk_...`).
3. Set in your environment:
   * `GROQ_API_KEY="gsk_your_key_here"`
   * `GROQ_MODEL="llama-3.3-70b-versatile"`

*(Optional)* You can also add `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com) as an automatic fallback.

---

### Step 4: Set Up Free Meta Developer App
To receive comment alerts and send DMs, you need a free Meta App connected to your Instagram account:

1. Go to **[developers.facebook.com](https://developers.facebook.com)** and log in with your Facebook account.
2. Click **My Apps** → **Create App**.
3. Select **Other** → **Business** (or **Creator**).
4. Give your app a name (e.g. `My AutoDM Engine`) and click **Create App**.
5. In the App Dashboard:
   * Go to **Settings > Basic**.
   * Note your **App ID** (`META_APP_ID`) and click **Show** on **App Secret** (`META_APP_SECRET`).
6. In the left sidebar, click **Add Product** and add **Instagram Graph API**.
7. Create a random secret string for verification (e.g. `my_secret_token_2026`) and set:
   * `META_VERIFY_TOKEN="my_secret_token_2026"`

---

### Step 5: Connect Meta Webhook
Once your Vercel deployment is live (e.g. `https://your-app.vercel.app`):

1. Back in your **Meta for Developers Dashboard**, navigate to **Instagram > Webhooks** in the sidebar.
2. Click **Edit Subscription** (or **Subscribe to a webhook**).
3. Fill in the fields:
   * **Callback URL**: `https://your-app.vercel.app/api/webhooks/instagram`
   * **Verify Token**: Enter the exact `META_VERIFY_TOKEN` you set in Step 4.
4. Click **Verify and Save**. Meta will send a verification ping; Ahoy responds within 25ms and turns green ✅.
5. In the list of webhook fields, click **Subscribe** on:
   * `comments` (alerts your app when someone comments on your post/reel)
   * `mentions` (optional: alerts on Story tags)
   * `messages` (optional: receives lead email replies in DMs)

---

### Step 6: Secure Your Admin Console
To prevent public visitors from accessing your dashboard, modifying campaigns, or reading lead lists:
* Set `ADMIN_PASSWORD="your_secure_password"` in your Vercel project environment variables (or in your local `.env`).

---

### Step 7: Cron Protection & Public Domain
* **`CRON_SECRET`**:
  * **What it does**: Vercel Cron jobs send an `Authorization: Bearer <CRON_SECRET>` header with each automated run. Setting this prevents unauthorized visitors from triggering your database purge endpoint (`/api/cron/purge`).
  * **How to create**: Generate any random 24–32 character string (e.g. run `openssl rand -hex 24` in your terminal, or create a random secret token).
* **`APP_URL`**:
  * **What it does**: Used as the base URL for Instagram link redirects (`/r/:campaignId`), true-human click attribution, and OAuth callbacks.
  * **How to set**: Set to your production Vercel URL (e.g. `https://your-domain.vercel.app`), or `http://localhost:3000` for local testing.

---

## 🔑 Complete Secrets & Environment Variables Reference

Here is the quick-reference checklist of all environment variables supported by Ahoy:

| Variable Name | Required? | Purpose | Where to Get / How to Create | Example Value |
| :--- | :---: | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | Turso serverless SQLite database endpoint | [turso.tech](https://turso.tech) → Database Overview | `libsql://autodm-db-yourname.turso.io` |
| `DATABASE_AUTH_TOKEN` | **Yes** | Turso authentication token | [turso.tech](https://turso.tech) → Generate Token | `eyJhbGciOi...` |
| `INNGEST_EVENT_KEY` | **Yes** | Triggers serverless workflow steps | [inngest.com](https://inngest.com) → Manage → API Keys | `ink_prod_...` |
| `INNGEST_SIGNING_KEY` | **Yes** | Verifies incoming Inngest webhooks | [inngest.com](https://inngest.com) → Manage → API Keys | `signkey-prod-...` |
| `GROQ_API_KEY` | **Yes** | Sub-30ms AI intent parsing & typo tolerance | [console.groq.com/keys](https://console.groq.com/keys) (Free Tier, no CC) | `gsk_abc123...` |
| `GROQ_MODEL` | No | LPU model name for intent parser | Set to `llama-3.3-70b-versatile` (default) | `llama-3.3-70b-versatile` |
| `META_APP_ID` | **Yes** | Meta Developer App ID | [developers.facebook.com](https://developers.facebook.com) → Settings > Basic | `178414053092...` |
| `META_APP_SECRET` | **Yes** | Meta App secret key for webhook HMAC verification | [developers.facebook.com](https://developers.facebook.com) → Settings > Basic | `a1b2c3d4e5f6...` |
| `META_VERIFY_TOKEN` | **Yes** | Handshake secret for Instagram webhook setup | Create any random passphrase you choose | `autodm_verify_secret_2026` |
| `APP_URL` | **Yes** | Public domain for OAuth and link redirects | Your Vercel domain or custom domain | `https://your-app.vercel.app` |
| `ADMIN_PASSWORD` | **Yes** | Password to protect your private Admin Console | Choose your own password in `.env` / Vercel settings | `MySecureAdminPass123!` |
| `CRON_SECRET` | Recommended | Secures nightly `/api/cron/purge` runs | Generate via `openssl rand -hex 24` or random passphrase | `4f8a9e2b1c7d...` |
| `GEMINI_API_KEY` | Optional | Automatic backup AI provider | [aistudio.google.com](https://aistudio.google.com) | `AIzaSy...` |

---

## 📐 Creating Campaigns & Workflow Steps

Ahoy allows creators to design multi-step, serverless automation funnels with AI intent evaluation, durable follower gates, and true-human link attribution.

👉 **[Read the Complete Campaigns & Workflow Steps Guide →](docs/CAMPAIGNS_AND_WORKFLOWS.md)**

### Campaign Anatomy:
1. **Trigger Target**:
   * **Specific Post / Reel**: Attaches only to selected media.
   * **Any Post / Reel**: Evergreen triggers across all content.
   * **Story Reply**: Direct engagement from temporary stories.
2. **Matching Rule**:
   * **`EXACT_MATCH`**: Strict keyword check (e.g. `BLUEPRINT`).
   * **`CONTAINS_KEYWORD`**: Matches keyword within sentences.
   * **`AI_ROUTING`**: Uses Groq AI (<30ms) to resolve typos (*"lnik pls"*) and natural conversation without charging per comment.
3. **The 6 Modular Workflow Steps**:
   * **`WAIT_FOR_FOLLOW`**: Pauses up to 5 min and verifies if the commenter follows your profile (with gentle fallback reminders).
   * **`DELAY_JITTER`**: Injects an organic 30–90s randomized delay to mimic natural human typing and protect account health.
   * **`PUBLIC_REPLY`**: Posts an official comment reply (e.g. *"Sent! Check your DMs 🚀"*), doubling comments to boost reach in the algorithm.
   * **`ASK_FOR_LEAD`**: Interactively requests their work email in DMs and records it directly to your lead directory.
   * **`AI_QUALIFY`**: Leverages Groq LPU / Gemini to answer commenter questions and handle objections warmly.
   * **`SEND_PRIVATE_DM`**: Delivers the tracked link or download code directly to their direct messages.

---

## 💻 Local Development

Want to test or customize code on your laptop first?

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/anilkulkarni87/AutoDM.git
cd AutoDM
npm install
```

### 2. Configure Local Environment
```bash
cp .env.example .env
```
Open `.env` and paste your keys from above.

### 3. Start Local Engine
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser. You will see the landing page; click **Log In** in the top navigation and enter the `ADMIN_PASSWORD` you set in your `.env` to open the Admin Console to view campaigns, AI agent sandbox, traces, and metrics.

---

## 🧪 Testing Your Automations

Ahoy includes built-in tools so you don't have to risk spamming your live Instagram feed while setting up:

1. **Built-in Webhook Simulator**:
   Open **App Console → Webhook Tester**. Pick any post, type a test comment (e.g. *"BLUEPRINT please"* or typos like *"lnik"*), and click **Dispatch Webhook Simulation**. You will see the sub-40ms execution trace in real time.
2. **Interactive Phone Preview**:
   Open **App Console → Campaigns → Phone Preview** to inspect exactly how the DM dialogue looks on iOS / Android before turning the campaign active.
3. **Semantic Typo Sandbox**:
   Open **App Console → AI Agent** to test how Groq parses misspellings, colloquial phrases, and multilingual requests (*"envíame el enlace"*).

---

## 🛡️ Novel Creator Features

Unlike legacy bots (e.g., ManyChat) that charge per contact and use rigid string matching, Ahoy includes three specialized features built specifically for modern Instagram creators:

* **Anti-Crawler Link Attribution Shield**:  
  When an Instagram DM contains a link, Meta’s background scraper (`facebookexternalhit/1.1`) crawls it immediately to generate the preview thumbnail card. Legacy tools count this as a human click, inflating click rates by 200–400%. Ahoy's `/r/:campaignId` redirect engine filters out preview bots at the edge, reporting **True Human Clicks**.
* **Typo & Semantic LPU Tolerance**:  
  Never lose a lead because a follower typed *"lnik"* or *"send this pls"*. Groq's sub-30ms LPU resolves user intent instantly without charging per comment.
* **Gentle Follower Soft-Gate**:  
  Instead of aggressively refusing to send links to non-followers (which causes unfollows), Ahoy delivers the link while politely adding a personalized P.S. prompt (*"P.S. Make sure you follow along for next week’s drop!"*).

---

## ❓ Troubleshooting

### 1. Meta Webhook Handshake Fails ("The URL couldn't be validated")
* **Cause**: The `META_VERIFY_TOKEN` in your Meta App settings does not match the `META_VERIFY_TOKEN` in your Vercel Environment Variables, or your Vercel deployment URL has a trailing slash.
* **Fix**: Ensure your Callback URL is exactly `https://your-domain.vercel.app/api/webhooks/instagram` (no trailing slash) and your verify token matches character-for-character.

### 2. Comment received, but no DM is sent
* **Cause 1**: The Instagram account is set to "Personal" instead of "Creator" or "Business".
* **Cause 2**: In the Instagram mobile app, **Settings > Messages > Connected Tools > "Allow access to messages"** is toggled off.
* **Cause 3**: The user has their DMs restricted to close friends only.

### 3. Vercel Cron Warmup Error
* **Cause**: Sub-daily crons (like every 10 minutes) require Vercel Pro.
* **Fix**: In `vercel.json`, we have set the warmup cron to `0 0 * * *` (once daily at midnight UTC), which is **100% permitted on Vercel's Hobby Free Tier**.

### 4. What is `CRON_SECRET`?
* Vercel Cron jobs send an `Authorization: Bearer <CRON_SECRET>` header with each automated call. Setting `CRON_SECRET` ensures that random external visitors cannot trigger your database purge endpoint (`/api/cron/purge`).

### 5. Vercel Build Error: "Conflicting peer dependency (esbuild / vite)"
* **Cause**: `npm install` on modern Node versions can halt when peer dependencies between Vite 8, Tailwind 4, and bundler tooling have overlapping ranges.
* **Fix**: The repository includes a `/.npmrc` file with `legacy-peer-deps=true`, and removes unnecessary duplicate `esbuild` overrides from `devDependencies`. If deploying an existing fork, ensure `.npmrc` is present in your repo root.

### 6. Do I need to run a local server for Inngest?
* **No.** When you register at `inngest.com`, the onboarding screen suggests running `npx inngest-cli@latest dev`. You can **safely skip this prompt**. Inngest Cloud handles event delivery to your deployed Vercel URL directly over the web. For testing flows before going live, open **App Console → Webhook Tester** inside your app.

### 7. Vercel Runtime Error: "Cannot find native binding ... rolldown"
* **Cause**: Bundlers like Vite 8 depend on `rolldown`, which uses platform-specific native binaries (`@rolldown/binding-wasm32-wasi`). If `vite` is listed in production `dependencies` or imported statically at the top of `server.ts`, Vercel attempts to load it inside the AWS Lambda serverless function (`/var/task`), where the native binary is missing.
* **Fix**: `vite` and its plugins are kept in `devDependencies`, and `server.ts` dynamically imports `vite` only during local development (`process.env.NODE_ENV !== 'production' && !process.env.VERCEL`). The Vercel serverless function (`/api/index.ts`) executes purely on Express and business logic without bundling Vite or Rolldown.

### 8. How do I sync new updates to my own cloned Vercel repository?
When you click **Deploy with Vercel**, Vercel creates a new independent repository in your personal GitHub account. To pull the latest bug fixes, performance improvements, and features into your repo:

```bash
# 1. Open your terminal in your local repository folder
# 2. Add the original repository as the 'upstream' remote (one-time setup):
git remote add upstream https://github.com/anilkulkarni87/AutoDM.git

# 3. Fetch the latest updates:
git fetch upstream

# 4. Merge the latest updates into your main branch:
git merge upstream/main -m "sync: update from upstream"

# 5. Push to your own GitHub repo (Vercel automatically rebuilds and deploys!):
git push origin main
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information. Free for personal, commercial, and creator use.
