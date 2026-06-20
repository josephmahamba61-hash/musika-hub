# 📌 DEPLOYMENT REFERENCE CARD

**Keep this handy during deployment!**

---

## 🔗 ACCOUNT SIGNUP LINKS

| Service | URL | Notes |
|---------|-----|-------|
| GitHub | https://github.com/signup | Required |
| Vercel | https://vercel.com/signup | Use GitHub login |
| Railway | https://railway.app | Use GitHub login |

---

## 🧮 COMMANDS TO RUN

### Initialize Git
```powershell
cd c:\Users\USER\Desktop\musika-hub
git init
git config user.name "Your Name"
git config user.email "your@email.com"
git add .
git commit -m "Initial commit"
```

### Push to GitHub
```powershell
git remote add origin https://github.com/YOUR_USERNAME/musika-hub.git
git branch -M main
git push -u origin main
```

### Make Changes Later
```powershell
git add .
git commit -m "Description of changes"
git push
```

---

## 📋 ENVIRONMENT VARIABLES

### Backend (Railway)
```
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://musika-hub-xxxxx.vercel.app
DATABASE_URL=postgresql://...
JWT_SECRET=your_random_secret_key
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://musikahub-api.railway.app
NEXT_PUBLIC_SITE_URL=https://musika-hub-xxxxx.vercel.app
```

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] GitHub account created
- [ ] Vercel account created
- [ ] Railway account created
- [ ] Git initialized locally
- [ ] Code committed to GitHub

### Frontend (Vercel)
- [ ] Project imported to Vercel
- [ ] Build succeeded (green ✓)
- [ ] Frontend URL obtained
- [ ] Environment variables set

### Backend (Railway)
- [ ] Project imported from GitHub
- [ ] Start command configured
- [ ] Environment variables set
- [ ] Build succeeded (green ✓)
- [ ] Backend URL obtained

### Connection
- [ ] Frontend updated with backend URL
- [ ] Backend updated with frontend URL
- [ ] Both services redeployed
- [ ] CORS errors resolved

### Testing
- [ ] Frontend loads
- [ ] Theme toggle works
- [ ] Backend health check passes
- [ ] Search functionality works
- [ ] No console errors

---

## 🚨 COMMON ISSUES & FIXES

| Issue | Fix |
|-------|-----|
| Git command not found | Install: https://git-scm.com/download/win |
| GitHub push fails | Run: `git remote -v` (verify URL correct) |
| Vercel build fails | Run: `npm run build` (test locally first) |
| Backend won't start | Check Railway logs, verify env vars |
| CORS errors | Verify URLs in NEXT_PUBLIC_API_URL and FRONTEND_URL |
| Database connection fails | Verify DATABASE_URL has correct format |

---

## 📞 HELP RESOURCES

- **Full Guide**: DEPLOYMENT.md (this repository)
- **Checklist**: DEPLOYMENT_CHECKLIST.md
- **Quick Start**: QUICK_START.md
- **Troubleshooting**: DEPLOYMENT.md → "🐛 TROUBLESHOOTING" section

---

## 🔍 VERIFICATION COMMANDS

```powershell
# Check git status
git status

# View commits
git log --oneline

# Check local build
npm run build
```

---

## 🌐 YOUR FUTURE LIVE URLS

**After Deployment:**
- Frontend: https://musika-hub-xxxxx.vercel.app
- Backend: https://musikahub-api-production.up.railway.app
- Database: PostgreSQL on Railway (private)

---

## 📅 DEPLOYMENT TIMELINE

| Step | Time | What to Expect |
|------|------|----------------|
| Git setup | 5 min | Local repository created |
| GitHub push | 2 min | Code on GitHub |
| Vercel deploy | 10 min | Frontend building, then live |
| Railway deploy | 15 min | Backend building, database provisioning |
| Configuration | 5 min | Connect URLs, redeploy |
| Testing | 5 min | Verify everything works |
| **TOTAL** | **45 min** | **Live on Internet!** |

---

## 🎯 QUICK DECISION TREE

**Is this your first time?**
- YES → Read QUICK_START.md (5 steps)
- NO → Read DEPLOYMENT.md (detailed)

**What's failing?**
- Vercel build → Check: npm run build locally
- Railway error → Check: Railway logs tab
- CORS error → Check: Environment variable URLs
- Still stuck? → DEPLOYMENT.md → Troubleshooting

**After deployment, how do I make changes?**
```powershell
# 1. Edit your code
# 2. Run these commands:
git add .
git commit -m "Your change"
git push
# 3. Done! Automatic redeploy happens automatically
```

---

**Print this page and keep it visible during deployment!**
