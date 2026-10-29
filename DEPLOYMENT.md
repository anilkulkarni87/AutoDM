# Production Deployment Guide: AutoDM Edge

This guide provides end-to-end instructions for deploying AutoDM Edge to **Vercel**, **Turso (LibSQL)**, and **Inngest**, and connecting to the **Meta Graph API**.

---

## Prerequisites
- Node.js 20+ installed locally
- A free [Vercel](https://vercel.com) account
- A free [Turso](https://turso.tech) account
- A free [Inngest](https://inngest.com) account
- A Meta Developer Account with an approved or test Instagram Professional account

---

## 1. Database Setup (Turso SQLite)

1. Install the Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
2. Authenticate and create your edge database:
   ```bash
   turso auth login
   turso db create autodm-edge-db
   ```
3. Get the database URL and create an authentication token:
   ```bash
   turso db show autodm-edge-db --url
   # Output: libsql://autodm-edge-db-[org].turso.io

   turso db tokens create autodm-edge-db
   ```
4. Push the Prisma schema:
   ```bash
   npx prisma db push
   ```

---

## 2. Inngest Serverless Workflows Setup

1. Create a free Inngest account at [inngest.com](https://inngest.com).
2. Create a new App named `autodm-edge`.
3. Retrieve your **Event Key** and **Signing Key** from the Inngest Dashboard.
4. AutoDM Edge automatically serves your Inngest functions via `/api/inngest` with durable retries and concurrency control.

---

## 3. Meta Developer Portal & Instagram Webhooks

1. Go to [developers.facebook.com](https://developers.facebook.com) and create an app with type **Business**.
2. Add the **Instagram Graph API** product to your app.
3. In App Settings > Basic, copy your **App Secret**.
4. In Webhooks > Instagram:
   - **Callback URL**: `https://your-domain.vercel.app/api/webhooks/instagram`
   - **Verify Token**: Set a secure token matching `META_VERIFY_TOKEN` (e.g. `autodm_edge_secret_verify_token_2026`).
   - Click **Verify and Save**. Meta will execute a `GET` handshake request to your endpoint.
   - Subscribe to the `comments` and `messages` field.

---

## 4. Vercel Deployment

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Add the following Environment Variables in Vercel:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.
   - `DATABASE_URL`: Your Turso connection string (`libsql://...`).
   - `DATABASE_AUTH_TOKEN`: Your Turso authentication token.
   - `META_VERIFY_TOKEN`: Your custom webhook verification string.
   - `META_APP_SECRET`: Your Meta App Secret (for HMAC verification).
   - `CRON_SECRET`: A secure random token for Vercel Cron.
4. Click **Deploy**. Vercel will build and deploy the edge routes.

---

## 5. Verifying the Deployment

1. **Check Health**:
   ```bash
   curl https://your-domain.vercel.app/api/health
   ```
   Should return `{"status":"healthy","edgeRuntime":"emulated-vercel-edge",...}`.

2. **Trigger Keep-Alive**:
   ```bash
   curl https://your-domain.vercel.app/api/cron/warmup
   ```

3. **Test Webhook Dispatch**:
   Post a comment on your connected Instagram post and watch the workflow trace execute in the dashboard under the **Inngest Traces** tab!
