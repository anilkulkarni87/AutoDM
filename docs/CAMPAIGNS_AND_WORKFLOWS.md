# 📖 Ahoy Campaign & Workflow Step Guide

This guide explains how to build high-converting, compliant Instagram DM automations using Ahoy's serverless workflow engine.

---

## 📑 Table of Contents
1. [Core Concepts](#-core-concepts)
2. [Step-by-Step: Creating Your First Campaign](#-step-by-step-creating-your-first-campaign)
3. [Trigger Types & Targeting](#-trigger-types--targeting)
4. [Matching Conditions & AI Intent Parsing](#-matching-conditions--ai-intent-parsing)
5. [The 6 Workflow Step Types](#-the-6-workflow-step-types)
6. [Dynamic Template Variables](#-dynamic-template-variables)
7. [Battle-Tested Campaign Recipes](#-battle-tested-campaign-recipes)
8. [Testing & Previewing Without Spamming Followers](#-testing--previewing-without-spamming-followers)

---

## 💡 Core Concepts

Every automation in Ahoy is called a **Campaign**. A campaign consists of three parts:

```
[ Trigger: Comment on Reel ] 
           ↓
[ Condition: Keyword or AI Semantic Match ]
           ↓
[ Workflow Steps: Sequence of Serverless Actions executed by Inngest ]
```

Because Ahoy uses **Inngest**, each workflow step is **durable**. If a step pauses for 5 minutes to wait for a follower, no server is running or consuming memory during the wait.

---

## 🚀 Step-by-Step: Creating Your First Campaign

1. **Log in to the Admin Console**:
   * Open your deployed URL or `http://localhost:3000`.
   * Click **Log In** in the top-right navbar.
   * Enter your `ADMIN_PASSWORD` to unlock the dashboard.

2. **Navigate to Campaigns**:
   * Click the **Campaigns** tab in the top navigation.
   * Click the **+ New Campaign** button in the upper right.

3. **Configure Campaign Basics**:
   * **Campaign Name**: Give it an identifiable label (e.g., `2026 AI Blueprint Reel`).
   * **Status**: Toggle **Active** ON or leave as Draft.

4. **Select Trigger & Media**:
   * Choose **Specific Post / Reel** and pick the post from your feed preview, or choose **Any Post / Reel** to trigger across all content.

5. **Set Keyword Triggers**:
   * Add keywords (separated by commas): e.g., `BLUEPRINT, GUIDE, LINK, SEND`.
   * Select your matching condition (Exact Match, Contains Keyword, or AI Semantic Match).

6. **Design Your Workflow Steps**:
   * Add and arrange steps on the canvas (see below for step options).
   * Click **Save Changes** when finished.

7. **Test in the Simulator**:
   * Click **Preview in Phone** to review the visual mobile DM dialogue.
   * Go to **Webhook Tester** to simulate a comment and watch the live execution trace.

---

## 🎯 Trigger Types & Targeting

| Trigger Type | Description | Best Used For |
| :--- | :--- | :--- |
| **Specific Post / Reel** | Attaches only to one selected Reel, Post, or Carousel. | Launching a dedicated lead magnet for a specific video. |
| **Any Post / Reel** | Listens for the keyword across every post on your profile. | Brand-wide evergreen keywords (e.g. `VIP`, `CALCULATOR`). |
| **Story Reply / Mention** | Triggers when someone replies to your active Story. | Time-sensitive flash promos and AMA story stickers. |

---

## 🧠 Matching Conditions & AI Intent Parsing

Ahoy supports three levels of comment evaluation:

### 1. `EXACT_MATCH`
* Triggers **only** if the comment exactly matches one of your keywords (case-insensitive).
* Example keyword: `BLUEPRINT`.
* Matches: `"BLUEPRINT"`, `"blueprint"`.
* Ignores: `"Can I get the blueprint?"`

### 2. `CONTAINS_KEYWORD`
* Triggers if the keyword appears anywhere within the comment text.
* Example keyword: `BLUEPRINT`.
* Matches: `"Hey send me the BLUEPRINT please!"`

### 3. `AI_ROUTING` (Recommended — Powered by Groq AI Free Tier LPU)
* Evaluates comments semantically in under 30ms using Llama 3.3 70B on Groq.
* **Typo Tolerance**: Automatically resolves misspellings like *"lnik please"*, *"bluprint"*, or *"quide"*.
* **Conversational Intent**: Matches natural language queries like *"Could you share the repository link with me?"* or multilingual comments (*"¿Me envías el enlace?"*).
* **Cost**: $0 (14,400 free requests per day on Groq).

---

## 🛠️ The 6 Workflow Step Types

You can chain any combination of the following 6 modular steps in your workflow canvas:

### 1. `WAIT_FOR_FOLLOW` (Follower Gatekeeper)
* **What it does**: Checks whether the commenter follows your Instagram account.
* **Durable Sleep**: Pauses the workflow for a configurable time (e.g. 5 minutes) to give the commenter time to follow.
* **Fallbacks**:
  * `PUBLIC_REPLY_REMINDER`: Replies publicly on their comment: *"Almost there! Tap follow and I'll send the link right over 🤝"*.
  * `DELIVER_ANYWAY_SOFT_GATE`: Sends the link anyway, but adds a warm P.S. note asking them to follow for future drops.

### 2. `DELAY_JITTER` (Anti-Spam Human Timing)
* **What it does**: Injects an organic, randomized delay (e.g. 30–90 seconds) before sending the next message.
* **Why it matters**: Meta monitors rapid programmatic burst DMs. Adding jitter ensures compliance with Instagram's rate limits and feels more personal.

### 3. `PUBLIC_REPLY` (Algorithm Reach Booster)
* **What it does**: Posts a public comment reply under the commenter's original message.
* **Why it matters**: Doubles the comment count on your post, signaling strong engagement to Instagram's explore algorithm.
* **Template Example**:  
  `"Sent! Check your DMs for the download link 🚀"`

### 4. `ASK_FOR_LEAD` (Email & Data Capture)
* **What it does**: Sends an interactive DM asking for their email address or company name before revealing the link.
* **Lead Directory**: Captured emails are automatically validated and recorded in your **Conversations & Stats** directory.
* **Template Example**:  
  `"Hey {{username}}! Where should I email your access key & bonus files?"`

### 5. `AI_QUALIFY` (Objection Handling & AI Steering)
* **What it does**: If a user replies with a question or hesitation (*"Is this free?"*, *"What format is the file?"*), the AI agent answers conversationally and steers them toward the goal.
* **Prompt Customization**: You can customize the agent's tone, brand persona, and objection rules.

### 6. `SEND_PRIVATE_DM` (Asset & Link Delivery)
* **What it does**: Delivers the final download URL, code snippet, or booking link to their private DM.
* **Link Attribution Shield**: Links formatted as `https://your-domain.vercel.app/r/{{campaign_id}}` filter out Meta crawler bots, tracking **True Human Clicks**.
* **Template Example**:  
  `"Here is your private access link: https://your-domain.vercel.app/r/cmp_blueprint?u={{username}}"`

---

## 🔤 Dynamic Template Variables

You can use merge tags in any public or DM message template:

| Variable | Description | Example Output |
| :--- | :--- | :--- |
| `{{username}}` | Instagram handle of the commenter | `@alexgrowth` |
| `{{first_name}}` | Extracted display first name | `Alex` |
| `{{post_title}}` | Truncated caption snippet of the post | `2026 AI Blueprint` |
| `{{keyword}}` | The specific keyword matched | `BLUEPRINT` |
| `{{lead_email}}` | The captured email address | `alex@growthmedia.com` |

---

## 🍳 Battle-Tested Campaign Recipes

### Recipe A: The High-Engagement Lead Magnet (Recommended)
*Goal: Boost post reach and capture verified emails.*
1. **Trigger**: Specific Reel with keyword `GUIDE`.
2. **Step 1**: `PUBLIC_REPLY` → *"Sent! Check your DMs for the guide 📩"*
3. **Step 2**: `DELAY_JITTER` → 45 seconds.
4. **Step 3**: `ASK_FOR_LEAD` → *"Hey {{username}}! Dropping the 2026 handbook now. What's your best email so I can send the editable template too?"*
5. **Step 4**: `AI_QUALIFY` → Verify email syntax or answer questions.
6. **Step 5**: `SEND_PRIVATE_DM` → *"Thanks {{first_name}}! Here's your link: https://your-app.vercel.app/r/guide?u={{username}}"*

---

### Recipe B: Instant Direct Delivery (Frictionless)
*Goal: Maximize clicks and deliver immediate value without asking for email.*
1. **Trigger**: Any Post with keyword `LINK`.
2. **Step 1**: `DELAY_JITTER` → 20 seconds.
3. **Step 2**: `SEND_PRIVATE_DM` → *"Hey {{username}}! Thanks for watching. Here's the direct link you requested: https://your-app.vercel.app/r/link?u={{username}}"*
4. **Step 3**: `PUBLIC_REPLY` → *"Just sent to your DMs!"*

---

### Recipe C: Follower Soft-Gate
*Goal: Turn viral viewers into profile followers respectfully.*
1. **Trigger**: Specific Reel with keyword `BLUEPRINT`.
2. **Step 1**: `WAIT_FOR_FOLLOW` (Timeout: 5 minutes).
3. **Step 2**: `SEND_PRIVATE_DM` → *"Here's your blueprint: https://your-app.vercel.app/r/blueprint. (P.S. Make sure you follow along for the Part 2 teardown next week! 🤝)"*

---

## 🧪 Testing & Previewing Without Spamming Followers

Before publishing campaigns to your live feed, use Ahoy's built-in testing tools:

1. **Interactive Phone Preview**:
   * In **App Console → Campaigns**, click **Preview in Phone**.
   * Test the visual DM dialogue and click buttons just like an iPhone or Android user would.
2. **Webhook Console**:
   * In **App Console → Webhook Tester**, select any mock post and comment.
   * Type test variations (e.g. `BLUEPRINT`, `blueprint plz`, `lnik`) and click **Dispatch Webhook Simulation**.
   * Watch the sub-40ms execution logs in **Inngest Traces**.
