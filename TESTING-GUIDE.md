# 🚀 CareerOS Testing Guide

## ✅ Both Servers Are Running

### Backend (Rust/Axum)
- **URL**: http://localhost:8080
- **Status**: ✓ Running & Healthy
- **Database**: ✓ Connected to Neon PostgreSQL

### Frontend (Next.js)
- **URL**: http://localhost:3000
- **Status**: ✓ Running & Ready
- **Backend API**: Connected to http://localhost:8080

---

## 🧪 How to Test

### 1. Open the App
Open your browser and go to:
```
http://localhost:3000
```

Since you're not logged in, you'll be automatically redirected to:
```
http://localhost:3000/login
```

### 2. Create an Account (Signup Flow)
1. On the login page, click **"Don't have an account? Sign up"**
2. Enter:
   - **Email**: your-email@example.com
   - **Password**: testpassword123
   - **Name**: Your Name (optional)
3. Click **"Sign up"**
4. You'll be redirected to the **Onboarding Wizard**

### 3. Complete Onboarding (4 Steps)
**Step 1: Dream Job**
- Enter: "Senior Full Stack Engineer at a startup"
- Select experience level: Mid Level or Senior
- Click **Next**

**Step 2: Location & Salary**
- Check: "Open to remote positions"
- Location: "Remote" or "San Francisco"
- Minimum salary: 100000
- Click **Next**

**Step 3: Skills**
- Select at least 3 skills: TypeScript, React, Node.js, PostgreSQL
- Click **Next**

**Step 4: Industries**
- Select at least 1 industry: Technology, Startups
- (Optional) LinkedIn URL: leave blank or add your profile
- Click **Complete Setup**

### 4. You're In!
After completing onboarding, you'll be redirected to:
```
http://localhost:3000/dashboard
```

---

## 🔄 Test the Flow Again

### Test Login (Existing User)
1. Open a new incognito/private window
2. Go to: http://localhost:3000
3. You'll be redirected to login
4. Enter the email and password you just created
5. Click **"Sign in"**
6. You'll be redirected to **dashboard** (skipping onboarding)

### Test Backend Health Check Button
On the login page, scroll down and click:
```
Test Backend Connection
```
You should see an alert:
```
Backend status: ok
Database: connected
```

---

## 🎨 What You'll See

### Main Navigation (Sidebar)
Once logged in, you'll see the app with a collapsible sidebar:
- Dashboard
- Resume Builder
- Resume v2 (new version)
- Jobs (job search - coming in Phase 1)
- Projects
- Documents
- Calendar
- Tasks
- Reporting
- Users
- Support
- Settings

### Current Working Pages
- ✅ Login/Signup
- ✅ Onboarding Wizard
- ✅ Dashboard (placeholder)
- ✅ Resume Builder (existing, needs integration)
- ✅ Resume v2 (working)
- ✅ Jobs (existing, needs integration)

---

## 🐛 Troubleshooting

### Backend Not Responding?
```bash
# Check if backend is running
curl http://localhost:8080/health

# If not, restart it
cd backend
source ~/.cargo/env
cargo run
```

### Frontend Not Loading?
```bash
# Check if frontend is running
curl http://localhost:3000

# If not, restart it
npm run dev
```

### See Logs
```bash
# Backend logs
tail -f /tmp/backend.log

# Frontend logs
tail -f /tmp/frontend.log
```

### Kill Servers
```bash
# Stop backend
kill $(cat /tmp/backend.pid)

# Stop frontend
kill $(cat /tmp/frontend.pid)
```

---

## 🌐 Test Production

### Production URLs
- **Frontend**: https://dale-eta.vercel.app
- **Backend**: https://careeros-backend-prod.fly.dev

### Test Production Signup
1. Go to: https://dale-eta.vercel.app
2. Sign up with a real email
3. Complete onboarding
4. You're using the live production system!

---

## 📊 Test API Endpoints Directly

### Health Check
```bash
curl http://localhost:8080/health
```

### Signup
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"api-test@example.com","password":"test123","name":"API Test"}'
```

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"api-test@example.com","password":"test123"}'
```

---

## ✨ Key Features to Test

### ✅ Authentication
- [x] Signup with email/password
- [x] Login with email/password
- [x] JWT token stored in localStorage
- [x] Auto-redirect based on auth state
- [x] Protected routes

### ✅ Onboarding
- [x] 4-step wizard
- [x] Form validation
- [x] Progress bar
- [x] Skip option
- [x] Data saved to localStorage

### ✅ Navigation
- [x] Collapsible sidebar
- [x] Active page indicator
- [x] Responsive design
- [x] All routes accessible

---

## 🎯 What Works vs What's Coming

### ✅ Working Now (Phase 0)
- User signup/login
- JWT authentication
- Onboarding flow
- Navigation
- Resume builder (existing)
- Basic job search (existing)

### 🚧 Coming Soon (Phase 1)
- AI-powered job matching
- One-click apply to multiple jobs
- AI resume tailoring
- Application analytics
- Usage tracking and limits
- Stripe payment integration (frontend)
- Email notifications

---

## 📝 Notes

- Your data is stored in a real PostgreSQL database (Neon)
- JWT tokens expire after 30 days
- The backend is production-ready but missing some Phase 1 features
- Both local and production environments use the same database

---

## 🎉 Success!

If you can:
1. ✓ Sign up at http://localhost:3000
2. ✓ Complete the onboarding wizard
3. ✓ Land on the dashboard
4. ✓ See the navigation sidebar
5. ✓ Log out and log back in

**Then everything is working perfectly!** 🚀

The root homepage now intelligently redirects:
- Not logged in → Login page
- Logged in → Dashboard

Your CareerOS app is ready to use at **http://localhost:3000** (local) or **https://dale-eta.vercel.app** (production)!
