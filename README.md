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
4. [Local Development (Test on your laptop)](#-local-development)
5. [Built-in Verification & Testing Tools](#-testing-your-automations)
6. [Novel Features Included](#-novel-creator-features)
7. [Troubleshooting & Common Questions](#-troubleshooting)
8. [License](#-license)

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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fanil77k%2Fautodm-edge)

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
2. Click **Create App** or open your default environment.
3. Go to **Manage > API Keys**.
4. Copy:
   * **Event Key** (used to trigger workflows)
   * **Signing Key** (used to verify webhooks)
5. Set these in your environment:
   * `INNGEST_EVENT_KEY="your_inngest_event_key"`
   * `INNGEST_SIGNING_KEY="your_inngest_signing_key"`

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

## 💻 Local Development

Want to test or customize code on your laptop first?

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/anil77k/autodm-edge.git
cd autodm-edge
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
Open **`http://localhost:3000`** in your browser. You will see the landing page and can click **App Console** in the top navigation to view campaigns, AI agent sandbox, traces, and metrics.

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

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information. Free for personal, commercial, and creator use.
