# Quick Start Guide - URL Shortener with Authentication

## Prerequisites

- Node.js (v16 or higher)
- MongoDB running locally or remote connection string
- npm or yarn

## 🚀 Quick Setup (5 minutes)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd server

# Install dependencies
npm install

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5001`

✅ You should see: `Server started successfully on PORT 5001`

### Step 2: Frontend Setup (in a new terminal)

```bash
# Navigate to frontend
cd client

# Install dependencies
npm install

# Start frontend app
npm run dev
```

Frontend will run on `http://localhost:3001`

### Step 3: Test the Application

1. **Open Browser**: Go to `http://localhost:3001`
2. **Redirected to Login**: You'll be redirected to login page (not authenticated)
3. **Create Account**: Click "Sign up" → Fill in details → Click "Create Account"
4. **Dashboard**: You're now logged in and can shorten URLs!
5. **Verify**: Only your URLs appear in the list
6. **Logout**: Click your name in header → Click "Logout"

---

## 📋 Complete Feature List

### ✅ Implemented Features

**Authentication**
- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Token persistence with localStorage
- ✅ Automatic token attachment to requests
- ✅ Token expiration handling (7 days)

**User Management**
- ✅ User profile in header
- ✅ Logout functionality
- ✅ Protected routes
- ✅ Account creation
- ✅ Secure session management

**URL Management (User-Specific)**
- ✅ Create shortened URLs (saved with user ID)
- ✅ View only your URLs
- ✅ Click tracking per URL
- ✅ Real-time analytics
- ✅ Copy shortened URL to clipboard
- ✅ QR code generation and download
- ✅ Delete URLs (only your own)
- ✅ Public redirect without login

**Design & UX**
- ✅ Glassmorphism UI design
- ✅ Dark theme with purple/indigo accents
- ✅ Smooth animations (Framer Motion)
- ✅ Toast notifications
- ✅ Loading states
- ✅ Form validation with feedback
- ✅ Responsive design

---

## 🔑 Key API Endpoints

### Authentication Endpoints (Public)

```
POST /api/auth/register
Body: { name, email, password, confirmPassword }
Returns: { token, user }

POST /api/auth/login
Body: { email, password }
Returns: { token, user }

GET /api/auth/me (Protected)
Headers: Authorization: Bearer <token>
Returns: { user }
```

### URL Endpoints (Protected)

```
POST /api/shortUrl (Protected)
Create new shortened URL for user

GET /api/shortUrl (Protected)
Get all user's shortened URLs

GET /api/shortUrl/:id (Protected)
Get specific URL details

GET /api/shortUrl/:id/qr (Protected)
Get QR code for URL

DELETE /api/shortUrl/:id (Protected)
Delete user's URL

GET /r/:shortUrl (Public)
Redirect to original URL
```

---

## 🔐 Security & Environment

### Backend .env file
```env
CONNECTION_STRING=mongodb://127.0.0.1:27017/url_shortener
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

### Frontend .env file
```env
VITE_SERVER_URL=http://localhost:5001/api
VITE_API_URL=http://localhost:5001
```

⚠️ **IMPORTANT**: 
- Change `JWT_SECRET` in production
- Never commit `.env` files to git
- Use environment-specific secrets

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### URLs Collection
```javascript
{
  _id: ObjectId,
  fullUrl: String,
  shortUrl: String (unique),
  user: ObjectId (references Users),
  clicks: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing Scenarios

### Test 1: User Registration
```
1. Go to /register
2. Enter: Name, Email, Password
3. Click "Create Account"
4. Verify redirected to dashboard
5. Verify header shows your name
```

### Test 2: Login/Logout
```
1. Click your name → Logout
2. Verify redirected to login
3. Enter credentials
4. Verify logged back in
```

### Test 3: URL Shortening
```
1. Paste long URL in input
2. Click Shorten
3. Copy shortened URL
4. Verify URL appears in list
5. Test clicking copy button
```

### Test 4: User Isolation
```
1. Create URL as User A
2. Logout and login as User B
3. Verify User B doesn't see User A's URLs
4. Create URL as User B
5. Verify only User B's URL appears
```

### Test 5: Public Redirect
```
1. Copy short URL (e.g., /r/abc123def4)
2. Visit in new private window (logged out)
3. Verify redirects to original URL
4. Verify click count incremented
```

---

## 🛠️ Troubleshooting

### Backend won't start
```
Error: "Cannot find module 'bcrypt'"
Solution: Run npm install again in server directory
```

### "Unauthorized" errors
```
Issue: Frontend can't access protected endpoints
Solution: 
1. Check token in browser console: localStorage.getItem('authToken')
2. Verify backend is running on 5001
3. Check CORS configuration in server.js
```

### Frontend shows "Loading..." forever
```
Issue: Auth check stuck
Solution:
1. Clear localStorage
2. Clear browser cache
3. Restart frontend server
```

### MongoDB connection error
```
Issue: Cannot connect to MongoDB
Solution:
1. Ensure MongoDB is running: mongod --version
2. Check CONNECTION_STRING in .env
3. Verify MongoDB URI format
```

### CORS Error
```
Issue: "Access to XMLHttpRequest has been blocked by CORS policy"
Solution:
1. Verify CORS is enabled in server.js
2. Check frontend URL matches CORS origins
3. Verify Authorization header is allowed
```

---

## 📁 File Changes Summary

### New Files Created
- `server/src/model/user.js` - User schema
- `server/src/controllers/auth.js` - Auth logic
- `server/src/routes/auth.js` - Auth routes
- `server/src/middleware/authMiddleware.js` - JWT verification
- `client/src/context/AuthContext.jsx` - Auth state
- `client/src/pages/Login.jsx` - Login page
- `client/src/pages/Register.jsx` - Register page
- `client/src/utils/axiosConfig.js` - Axios setup
- `client/src/components/ProtectedRoute/...` - Route guard

### Updated Files
- `server/src/model/shortUrl.js` - Added user reference
- `server/src/controllers/shortUrl.js` - Added auth checks
- `server/src/routes/shortUrl.js` - Added auth middleware
- `server/src/server.js` - Added auth routes
- `server/package.json` - Added bcrypt, jsonwebtoken
- `client/src/App.jsx` - Added routing and auth
- `client/src/components/Header/Header.jsx` - Added user menu
- `client/package.json` - No changes (dependencies already present)

---

## 📈 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser (Frontend)                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  React App (AuthProvider + Protected Routes)              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ Login Page   │  │ Register Pg  │  │ Dashboard    │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │  ┌────────────────────────────────────────────────────┐   │ │
│  │  │  Axios Interceptor (Token Manager)               │   │ │
│  │  └────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          HTTP/REST API                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Express Server (Backend)                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Auth Routes                   URL Routes                 │ │
│  │  ├─ POST /register  ◄─────────► ├─ POST /shortUrl        │ │
│  │  ├─ POST /login     ◄─────────► ├─ GET /shortUrl         │ │
│  │  └─ GET /me         ◄─────────► ├─ DELETE /shortUrl      │ │
│  │      (Protected)      (Protected) └─ GET /r/:shortUrl     │ │
│  │                                     (Public Redirect)     │ │
│  │  ┌────────────────────────────────────────────────────┐   │ │
│  │  │  Auth Middleware (JWT Verification)              │   │ │
│  │  └────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          Database Queries                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  MongoDB Database                               │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │  Users Collection    │  │  URLs Collection     │            │
│  │  - name              │  │  - fullUrl           │            │
│  │  - email (unique)    │  │  - shortUrl          │            │
│  │  - password (hashed) │  │  - user (FK)         │            │
│  │  - timestamps        │  │  - clicks            │            │
│  └──────────────────────┘  │  - timestamps        │            │
│                            └──────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💡 Key Concepts

### JWT Token Flow
```
1. User registers/logs in
   ↓
2. Backend generates JWT token (7-day expiration)
   ↓
3. Frontend stores token in localStorage
   ↓
4. Every API request includes: Authorization: Bearer <token>
   ↓
5. Backend verifies token with authMiddleware
   ↓
6. Request proceeds or returns 401 if invalid
```

### User Isolation
```
1. Each URL has a 'user' field (ObjectId reference)
2. When creating URL: saved user ID is req.userId
3. When fetching: query only URLs where user === req.userId
4. When deleting: verify ownership before deletion
5. No cross-user data access
```

---

## 🚢 Production Deployment Checklist

- [ ] Change JWT_SECRET to random strong secret
- [ ] Enable HTTPS/SSL
- [ ] Update CORS origins to production domain
- [ ] Use environment-specific .env files
- [ ] Set NODE_ENV=production
- [ ] Use httpOnly cookies instead of localStorage (if possible)
- [ ] Enable rate limiting
- [ ] Add logging and monitoring
- [ ] Test all auth flows
- [ ] Backup database regularly
- [ ] Set up automated backups
- [ ] Use strong MongoDB credentials
- [ ] Enable MongoDB authentication

---

## 📞 Support & Help

See `AUTHENTICATION_GUIDE.md` for detailed documentation including:
- Complete API reference
- Error codes and solutions
- Security best practices
- Future improvements
- Troubleshooting guide

---

## 🎉 You're All Set!

Your URL shortener now has:
✅ Complete authentication system
✅ User-based URL management
✅ Secure JWT tokens
✅ Professional UI with glassmorphism
✅ Production-ready code

Start shortening URLs securely! 🚀
