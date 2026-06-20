# MUSIKA HUB DEPLOYMENT GUIDE

## Quick Overview
This guide will help you deploy Musika Hub online in 30-45 minutes. You'll have:
- **Frontend**: Deployed on Vercel (free tier) → Global CDN, auto-deploys on git push
- **Backend**: Deployed on Railway (free tier) → Server running in cloud
- **Database**: PostgreSQL on Railway (included free)
- **Public URLs**: Accessible from any device worldwide

---

## ✅ PREREQUISITES (What You Need)

Before starting, have these ready:

### 1. **GitHub Account** (required)
   - Sign up FREE at https://github.com
   - Used for deploying frontend to Vercel
   - Enables automatic deployments on every git push

### 2. **Vercel Account** (required)
   - Sign up FREE at https://vercel.com
   - Uses your GitHub login
   - Hosts the frontend

### 3. **Railway Account** (required)
   - Sign up FREE at https://railway.app
   - Hosts backend API and PostgreSQL database
   - Includes free PostgreSQL database in free tier

### 4. **Your Computer**
   - Node.js (already installed)
   - Git (https://git-scm.com/download - download if not installed)
   - Terminal/PowerShell (already on Windows)

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### STEP 1: Prepare GitHub Repository (15 minutes)

#### 1.1 Check if Git is installed
```powershell
git --version
```
If you get an error, download Git from: https://git-scm.com/download/win

#### 1.2 Initialize Git Repository Locally
```powershell
cd c:\Users\USER\Desktop\musika-hub
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

#### 1.3 Create .gitignore (already exists, verify it includes)
```
node_modules/
.env
.env.local
.env.production
dist/
.next/
.DS_Store
*.log
```

#### 1.4 Commit Initial Code
```powershell
git add .
git commit -m "Initial Musika Hub prototype - ready for deployment"
```

#### 1.5 Create GitHub Repository
- Go to https://github.com/new
- Repository name: `musika-hub`
- Description: "Modern B2B Industrial Marketplace"
- Choose: **Private** (for now, can change to Public later)
- Click "Create repository"

#### 1.6 Connect Local Repo to GitHub
GitHub will show you commands. Run these:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/musika-hub.git
git branch -M main
git push -u origin main
```
Replace `YOUR_USERNAME` with your actual GitHub username.

#### ✅ Result: Your code is now on GitHub!

---

### STEP 2: Deploy Frontend to Vercel (10 minutes)

#### 2.1 Go to Vercel
- Visit https://vercel.com/signup
- Click "Continue with GitHub"
- Authorize Vercel to access your GitHub account
- You're now logged into Vercel

#### 2.2 Import Project
- Click "Add New..." → "Project"
- Find and select `musika-hub` repository
- Click "Import"

#### 2.3 Configure Build Settings
Vercel should auto-detect Next.js. Verify:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### 2.4 Add Environment Variables
Click "Environment Variables" and add:

| Key | Value | Note |
|-----|-------|------|
| `NEXT_PUBLIC_API_URL` | Leave blank for now (will update after backend deploys) | Points to backend |
| `NEXT_PUBLIC_SITE_URL` | Leave blank for now | Your frontend URL |

#### 2.5 Deploy
- Click "Deploy"
- Wait 2-3 minutes for build to complete
- You'll get a public URL like: `https://musika-hub-xxxxx.vercel.app`

#### ✅ Your frontend is live! Test it:
- Visit your Vercel URL
- Should see Musika Hub homepage
- Dark theme should be default

#### 📌 Note Your Frontend URL
You'll need this URL for:
- Backend CORS configuration
- Connecting backend to frontend

---

### STEP 3: Deploy Backend to Railway (15 minutes)

#### 3.1 Go to Railway
- Visit https://railway.app
- Click "Start Project"
- Choose "Deploy from GitHub"
- Authorize Railway to access GitHub
- Select `musika-hub` repository
- Railway auto-detects Node.js project

#### 3.2 Railway Will Suggest Services
- Confirm: Node.js service
- Confirm: PostgreSQL database (add if not auto-included)

#### 3.3 Configure Backend Service

In Railway Dashboard:
- Click on "api" service
- Go to "Settings" tab

**Update Start Command**:
```
npm --workspace backend run build && npm --workspace backend run start
```

**Add Environment Variables** (in "Variables" tab):

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `FRONTEND_URL` | (Your Vercel URL from Step 2) |
| `JWT_SECRET` | Generate a random string: `openssl rand -base64 32` or use an online generator |

#### 3.4 Configure PostgreSQL Service

In Railway Dashboard:
- Click on PostgreSQL service
- Go to "Variables" tab
- Copy `DATABASE_URL` value

Add to Backend Environment Variables:
| Key | Value |
|-----|-------|
| `DATABASE_URL` | (Paste the PostgreSQL URL) |

#### 3.5 Deploy
- Railway automatically deploys when you connect GitHub
- Build takes 3-5 minutes
- Check "Deployments" tab for status
- Once green ✓, it's live

#### ✅ Your backend is live!

**📌 Note Your Backend URL**:
- In Railway, click on "api" service
- Go to "Settings" tab
- Find "Public URL" 
- Should look like: `https://musikahub-api-production.up.railway.app`
- Copy this URL

---

### STEP 4: Connect Frontend & Backend (5 minutes)

Now both are deployed, but they don't know about each other.

#### 4.1 Update Frontend Environment Variables

Go back to Vercel Dashboard:
- Project: musika-hub
- Settings → Environment Variables
- Update `NEXT_PUBLIC_API_URL`:
  - Value: `https://your-railway-backend-url`
  - Replace with your actual Railway backend URL
- Update `NEXT_PUBLIC_SITE_URL`:
  - Value: `https://your-vercel-url`
  - Your Vercel frontend URL

#### 4.2 Redeploy Frontend
- Go to "Deployments" tab
- Click the three dots (...) on the latest deployment
- Select "Redeploy"
- Wait 1-2 minutes for rebuild

#### 4.3 Test Connection
- Visit your Vercel frontend URL
- Open browser DevTools (F12)
- Go to Console tab
- Should see no CORS errors

---

### STEP 5: Update Backend CORS (5 minutes)

#### 5.1 Update Backend Code

Open `backend/src/server.ts` and update CORS:

```typescript
import cors from 'cors'

const app = express()

// Allow requests from your Vercel frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
```

#### 5.2 Commit and Push
```powershell
git add backend/src/server.ts
git commit -m "Update CORS for production deployment"
git push
```

Railway automatically redeploys! ✓

---

## 🧪 TEST YOUR DEPLOYMENT

### Test Frontend
1. Visit your Vercel URL
2. Page should load instantly
3. Try theme toggle (🌙 button)
4. Try search
5. Try signing up / signing in buttons

### Test Backend API
Visit this URL in browser (replace with your Railway URL):
```
https://your-railway-url/api/health
```
Should see:
```json
{
  "status": "ok",
  "service": "musika-hub-api"
}
```

### Test Database Connection
In your backend logs (Railway Dashboard), should see:
```
MUSIKA HUB API running on http://localhost:4000
```

---

## 🔄 AUTOMATIC REDEPLOYMENT (The Magic Part!)

### How Auto-Deploy Works:
1. You make changes locally
2. Run `git push` to GitHub
3. Vercel & Railway automatically detect changes
4. They rebuild and deploy in 2-5 minutes
5. Your live site updates automatically

### Example Workflow:

**Make a change:**
```powershell
# Edit index.html or style.css
# Change something visually

git add .
git commit -m "Update homepage styling"
git push
```

**Then:**
- Check Vercel Deployments tab → see "Building..."
- Wait for green ✓
- Refresh your Vercel URL
- Changes are live! ✨

---

## 📋 ENVIRONMENT VARIABLES QUICK REFERENCE

### Frontend Variables (Vercel)
```
NEXT_PUBLIC_API_URL=https://musikahub-api-production.up.railway.app
NEXT_PUBLIC_SITE_URL=https://musika-hub-xxxxx.vercel.app
```

### Backend Variables (Railway)
```
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://musika-hub-xxxxx.vercel.app
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_generated_secret_key
```

---

## 🐛 TROUBLESHOOTING

### Frontend Not Loading?
- Check Vercel Deployments tab for build errors
- Check that `npm run build` works locally: `npm run build` in `/frontend`
- Verify Next.js installed: `npm list next`

### Backend Returning 502 Error?
- Check Railway Logs tab for errors
- Verify `npm --workspace backend run build` succeeds locally
- Check environment variables are set

### CORS Errors?
- Verify `FRONTEND_URL` is correct in backend
- Verify `NEXT_PUBLIC_API_URL` is correct in frontend
- Redeploy both services

### Can't Connect to PostgreSQL?
- Verify `DATABASE_URL` is set in Railway
- Check it includes the correct password
- Make sure Railway PostgreSQL service is running (green status)

---

## ✨ YOU'RE DONE!

### What You've Accomplished:
✅ Frontend deployed on Vercel (global CDN)
✅ Backend deployed on Railway (cloud server)
✅ PostgreSQL database deployed
✅ Auto-deployment on git push enabled
✅ Public URLs accessible worldwide
✅ Frontend & backend connected
✅ CORS properly configured

### Your URLs:
- **Frontend**: https://musika-hub-xxxxx.vercel.app
- **Backend API**: https://musikahub-api-production.up.railway.app
- **Database**: PostgreSQL on Railway (private)

### Next Steps (Optional Enhancements):
1. Add your custom domain to Vercel
2. Set up database migrations for Railway PostgreSQL
3. Implement actual authentication with JWT
4. Add product images to storage
5. Monitor performance in Vercel/Railway dashboards

### Getting Help:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Next.js Docs: https://nextjs.org/docs
- Express Docs: https://expressjs.com/docs

---

**Congratulations! Musika Hub is now online for the world! 🎉**
