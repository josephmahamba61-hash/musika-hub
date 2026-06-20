# DEPLOYMENT CHECKLIST

## Pre-Deployment ✓
- [x] Project structure validated (Frontend: Next.js, Backend: Express, Root: Static files)
- [x] GitHub repository initialized locally
- [x] Vercel configuration created (vercel.json)
- [x] Railway configuration created (railway.toml)
- [x] Backend start script added to package.json
- [x] Environment variable templates created
- [x] Deployment guide created (DEPLOYMENT.md)

## Required Accounts to Create
- [ ] GitHub Account (https://github.com) - FREE
- [ ] Vercel Account (https://vercel.com) - FREE, login with GitHub
- [ ] Railway Account (https://railway.app) - FREE

## Deployment Steps (In Order)

### Phase 1: GitHub
- [ ] Install Git on your computer
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial Musika Hub"`
- [ ] Create new repository on GitHub.com
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/musika-hub.git`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`

### Phase 2: Frontend (Vercel)
- [ ] Go to https://vercel.com/signup
- [ ] Sign up with GitHub
- [ ] Click "Add New Project"
- [ ] Import `musika-hub` repository
- [ ] Verify build settings are correct
- [ ] Leave environment variables blank for now
- [ ] Click Deploy
- [ ] Wait for deployment to complete (green ✓)
- [ ] **SAVE THIS URL**: https://musika-hub-xxxxx.vercel.app

### Phase 3: Backend (Railway)
- [ ] Go to https://railway.app
- [ ] Sign up with GitHub
- [ ] Click "Start Project" → "Deploy from GitHub"
- [ ] Select `musika-hub` repository
- [ ] Railway auto-creates Node.js and PostgreSQL services
- [ ] Update Backend Start Command to: `npm --workspace backend run build && npm --workspace backend run start`
- [ ] Add Environment Variables to backend service:
  - `NODE_ENV` = `production`
  - `PORT` = `4000`
  - `FRONTEND_URL` = (Your Vercel URL)
  - `JWT_SECRET` = (Generate random: `openssl rand -base64 32`)
  - `DATABASE_URL` = (Copy from PostgreSQL service variables)
- [ ] Wait for deployment to complete (green ✓)
- [ ] **SAVE THIS URL**: Backend Public URL from Railway settings

### Phase 4: Connect Frontend & Backend
- [ ] Go back to Vercel dashboard
- [ ] Update Environment Variables:
  - `NEXT_PUBLIC_API_URL` = (Your Railway backend URL)
  - `NEXT_PUBLIC_SITE_URL` = (Your Vercel frontend URL)
- [ ] Trigger redeploy or click "Redeploy"
- [ ] Update `backend/src/server.ts` CORS configuration
- [ ] Run: `git add backend/src/server.ts`
- [ ] Run: `git commit -m "Update CORS for production"`
- [ ] Run: `git push`
- [ ] Railway auto-redeploys

### Phase 5: Testing
- [ ] Visit Vercel URL - homepage loads
- [ ] Visit Vercel URL + `/api/health` - should show "ok"
- [ ] Test theme toggle
- [ ] Test responsive design on mobile
- [ ] No CORS errors in browser console
- [ ] Search functionality works

## Verification Commands

```powershell
# Test local build
npm run build

# Test backend locally
npm --workspace backend run build

# Check git status
git status

# View commits
git log --oneline
```

## Important URLs to Save

- GitHub Repository: https://github.com/YOUR_USERNAME/musika-hub
- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Live URL: https://musika-hub-xxxxx.vercel.app
- Railway Dashboard: https://railway.app/dashboard
- Railway Backend URL: https://musikahub-api-production.up.railway.app
- Railway Database: (PostgreSQL - internal)

## After Deployment

### Making Updates
```powershell
# Make your changes in the code
# Then:
git add .
git commit -m "Your change description"
git push

# That's it! Both Vercel and Railway automatically redeploy
```

### Monitoring
- Vercel: Check Deployments tab for status
- Railway: Check Deployments tab for status
- Both have logs for debugging

## Next Phase Features to Build
1. User Authentication (Backend API + Frontend UI)
2. Product CRUD Operations
3. Shopping Cart Functionality
4. Order Management
5. Supplier Dashboard
6. Admin Panel
7. Messaging System

---

**Total Time Required**: ~45-60 minutes
**Monthly Cost**: FREE (all services have free tiers)
**Support**: Check DEPLOYMENT.md for detailed instructions
