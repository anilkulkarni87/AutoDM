# ⚡ Deploying AutoDM Edge to Vercel via GitHub

## Can I host this on Vercel via GitHub?
**YES! 100%.** AutoDM Edge is engineered specifically for Vercel Serverless & Edge deployment.

You can push this repository directly to GitHub and deploy it to Vercel with zero code changes.

---

## 3-Step Vercel Deployment Flow

### Step 1: Push Code to GitHub
Initialize git and push to your GitHub profile or organization:

```bash
git init
git add .
git commit -m "feat: AutoDM Edge Serverless Instagram automation"
git branch -M main
git remote add origin https://github.com/anilkulkarni87/AutoDM.git
git push -u origin main
```

---

### Step 2: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/new).
2. Click **Add New...** > **Project** and select your GitHub repository (`autodm-edge`).
3. Vercel automatically detects the root `vercel.json` and configures:
   - **Framework Preset**: `Vite`
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
   - **API Serverless Handler**: Automatically mounted at `/api` via `vercel.json`

---

### Step 3: Configure Environment Variables in Vercel
In the Vercel project configuration panel, add these environment variables:

| Variable | Description | Required For |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key | AI Agent Intent Classification & Objections |
| `APP_URL` | Your deployed Vercel domain (e.g. `https://autodm-edge.vercel.app`) | Meta OAuth & Webhooks |
| `META_APP_ID` | Meta Developer App ID | Production Instagram Graph API |
| `META_APP_SECRET` | Meta Developer App Secret | Production Instagram Graph API |
| `META_VERIFY_TOKEN`| Webhook verify string (e.g. `autodm_edge_secret_verify_token_2026`) | Meta Handshake |
| `DATABASE_URL` | Turso LibSQL URL (`libsql://...`) | Persistent Edge Multi-Tenant SQLite |
| `DATABASE_AUTH_TOKEN` | Turso DB Token | Persistent Edge Multi-Tenant SQLite |
| `INNGEST_EVENT_KEY` | Inngest Event Key | Production Inngest Workflow Dashboard |
| `INNGEST_SIGNING_KEY`| Inngest Signing Key | Production Inngest Workflow Dashboard |

Click **Deploy**! Vercel builds the SPA on edge CDN and spins up the serverless webhook routes in under 45 seconds.

---

## 💡 Do I need to create keys right now to test here?
**No!** In AI Studio, the application runs with an **In-Memory Zero-Config Engine**. You can simulate Instagram comments, test AI intent classifications, preview conversations, and test nightly retention rollups right in this dashboard without registering for any third-party accounts first.

---

## 🔄 How to Pull Future Updates into Your Repo
If you cloned via the "Deploy with Vercel" button, your repository is linked directly to your own GitHub account. Whenever updates or bug fixes are published to the original AutoDM repository, sync them with:

```bash
# Add upstream remote
git remote add upstream https://github.com/anilkulkarni87/AutoDM.git

# Fetch & merge latest upstream updates
git fetch upstream
git merge upstream/main -m "sync: update from upstream"

# Push to your GitHub repo (Vercel redeploys automatically)
git push origin main
```
