# Global Signal — Backend Deployment Guide
## Built by Dev (CTO) — Global Signal

---

## ARCHITECTURE

```
BEFORE (Frontend Only — Insecure):
Browser → Claude API directly (API key exposed!)
Browser → localStorage (data lost on clear)
No scheduler, no real DB, no auth

AFTER (Full Stack — Secure):
Browser → Your Backend API → Claude API (key hidden)
Browser → Your Backend API → Database (persistent)
Cron → /api/schedule → Auto-generates posts
```

---

## STEP 1: Get Your Anthropic API Key
1. Go to https://console.anthropic.com
2. Create API Key
3. Copy it — you'll need it in Step 3

---

## STEP 2: Deploy Backend to Vercel

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Go to backend folder
cd global-signal-backend

# Deploy (follow prompts)
vercel

# Set to production
vercel --prod
```

### Option B: GitHub + Vercel (Easiest)
1. Create new GitHub repo: `global-signal-backend`
2. Upload all files from `global-signal-backend/` folder
3. Go to vercel.com → New Project → Import your GitHub repo
4. Click Deploy

---

## STEP 3: Set Environment Variables in Vercel
After deployment, go to:
`Vercel Dashboard → Your Project → Settings → Environment Variables`

Add these:
```
ANTHROPIC_API_KEY = sk-ant-your-key-here
OWNER_SECRET      = choose-any-secret-password
```

---

## STEP 4: Update Frontend to Use Your Backend
In `index.html`, find this line near the top:
```javascript
const BACKEND_URL = ""; // Replace with your Vercel URL
```

Replace with your Vercel URL:
```javascript
const BACKEND_URL = "https://global-signal-backend.vercel.app";
```

---

## STEP 5: Set Up Auto-Scheduling (Optional)
Add a cron job that calls your scheduler every day:

### GitHub Actions (Free):
Create `.github/workflows/schedule.yml`:
```yaml
name: Generate Scheduled Posts
on:
  schedule:
    - cron: "30 3 * * 1,3,5"  # Mon/Wed/Fri 9AM IST
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST https://your-backend.vercel.app/api/schedule \
            -H "Authorization: Bearer YOUR_OWNER_SECRET" \
            -H "Content-Type: application/json" \
            -d '{"action":"run"}'
```

---

## WHAT EACH ENDPOINT DOES

| Endpoint | What it does | Security |
|---|---|---|
| POST /api/chat | Chat with Brij/Veer/Priya etc | API key hidden |
| POST /api/pipeline | Run 7 agent pipelines | API key hidden |
| GET /api/posts | List all generated posts | Public |
| POST /api/posts | Generate new post | API key hidden |
| PUT /api/posts | Approve/reject post | Public |
| GET /api/schedule | View schedule | Public |
| POST /api/schedule/run | Auto-generate | Owner secret required |
| GET /api/yc?filter=ai | YC company data | Public |
| POST /api/yc | AI company search | API key hidden |
| GET /api/health | Check server is running | Public |

---

## UPGRADE PATH (When You Have Clients)
Current: In-memory storage (resets on cold start)
Next: Replace `lib/db.js` with one of:
- **Vercel KV** (Redis): `npm install @vercel/kv` — ₹0 to start
- **Supabase** (Postgres): Free tier — ₹0 to start
- **MongoDB Atlas**: Free tier — ₹0 to start

All three have free tiers sufficient for first 50 clients.

---

## TEST YOUR BACKEND
After deployment, hit:
`https://your-backend.vercel.app/api/health`

You should see:
```json
{
  "status": "ok",
  "system": "Global Signal Backend",
  ...
}
```

---

**Built by Dev (CTO) — Global Signal**
**Owner: Brijesh Raval | globalsignal.io**
