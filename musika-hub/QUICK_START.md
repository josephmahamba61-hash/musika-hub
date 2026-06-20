# 🚀 QUICK START: Deploy Musika Hub in 5 Steps

## Step 1: Create Required Accounts (5 minutes)
1. **GitHub**: https://github.com/signup
2. **Vercel**: https://vercel.com/signup (use GitHub login)
3. **Railway**: https://railway.app (use GitHub login)

All three are completely FREE.

---

## Step 2: Initialize Git Repository (3 minutes)

**Copy-paste these commands in PowerShell:**

```powershell
cd c:\Users\USER\Desktop\musika-hub
git init
git config user.name "Your Name"
git config user.email "your@email.com"
git add .
git commit -m "Initial Musika Hub"
```

---

## Step 3: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Repository name: `musika-hub`
3. Choose: **Private**
4. Click "Create repository"
5. **Copy the commands they show you** and run them:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/musika-hub.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

✅ Your code is now on GitHub!

---

## Step 4: Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Select `musika-hub` repository
4. Click "Import"
5. Vercel auto-detects Next.js ✓
6. Click "Deploy"
7. Wait for green ✓ (2-3 minutes)

📌 **SAVE THIS URL**: `https://musika-hub-xxxxx.vercel.app`

✅ Frontend is live!

---

## Step 5: Deploy Backend to Railway (10 minutes)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select `musika-hub` repository
4. Railway creates Node.js + PostgreSQL automatically ✓
5. Click on "api" service → Settings
6. Update Start Command:
   ```
   npm --workspace backend run build && npm --workspace backend run start
   ```
7. Go to Variables tab and add:
   - `NODE_ENV` = `production`
   - `PORT` = `4000`
   - `FRONTEND_URL` = (Your Vercel URL from Step 4)
   - `JWT_SECRET` = (Generate: `openssl rand -base64 32` or use any random string)
   - `DATABASE_URL` = (Copy from PostgreSQL service Variables)

8. Wait for green ✓ (3-5 minutes)

📌 **SAVE THIS URL**: Backend Public URL from Settings

✅ Backend is live!

---

## Step 6: Connect Frontend & Backend (2 minutes)

### 6a. Update Frontend Variables

Go to Vercel Dashboard:
1. Select your project
2. Settings → Environment Variables
3. Add/Update:
   - `NEXT_PUBLIC_API_URL` = (Your Railway URL from Step 5)
   - `NEXT_PUBLIC_SITE_URL` = (Your Vercel URL from Step 4)
4. Click "Redeploy" or wait for auto-redeploy

### 6b. Update Backend CORS

Edit `backend/src/server.ts`:

```typescript
import cors from 'cors'

const app = express()
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
```

Then:
```powershell
git add backend/src/server.ts
git commit -m "Update CORS for production"
git push
```

Railway auto-redeploys! ✓

---

## ✅ YOU'RE DONE!

### Your Live URLs:
- 🌐 **Frontend**: https://musika-hub-xxxxx.vercel.app
- 🔌 **Backend API**: https://musikahub-api-production.up.railway.app
- 🗄️ **Database**: PostgreSQL (private, automatic)

### Test It:
1. Visit your Vercel URL → Homepage should load
2. Try theme toggle
3. Try search
4. Visit `YOUR_BACKEND_URL/api/health` → Should show `{"status":"ok"}`

---

## 🔄 Make Changes & Redeploy Automatically

**That's the best part!**

```powershell
# Make changes to your code
# Then just:
git add .
git commit -m "Your change description"
git push

# Vercel & Railway automatically rebuild and deploy!
# Check their dashboards to see the deployment progress
```

---

## 📚 Need More Details?

- Full guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Checklist: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- Troubleshooting: See DEPLOYMENT.md section "🐛 TROUBLESHOOTING"

---

## 📞 Common Issues

| Problem | Solution |
|---------|----------|
| "Git not found" | Download Git: https://git-scm.com/download/win |
| GitHub push fails | Verify username in `git remote -v` is correct |
| Vercel build fails | Check `npm run build` works locally |
| Backend won't start | Check all environment variables are set in Railway |
| CORS errors | Verify both URLs are correct in env variables |

---

**Questions?** Refer to DEPLOYMENT.md for comprehensive explanations.

**Ready?** Start with Step 1 above! 🚀
