# 🚀 START HERE - Choose Your Setup Method

## Method 1: Personal Access Token (RECOMMENDED) ⭐

### ✅ Why Choose This?
- **No login required** - Just open and use
- **2-minute setup** - Fastest way to get started
- **No HTTPS certificates** - Runs on simple HTTP
- **Perfect for:** Personal use, testing, automation

### 📋 Quick Setup
1. Get token from Adobe Sign: 
   → https://secure.na3.adobesign.com/account/accountSettingsPage#pageId::ACCESS_TOKENS
   
2. Setup:
   ```bash
   npm install
   cp .env.simple .env
   # Edit .env and paste your token
   npm run simple
   ```

3. Open: http://localhost:3000

**✨ That's it! No login, no hassle!**

📖 Full Guide: **SETUP-SIMPLE.md**

---

## Method 2: OAuth 2.0 (For Multi-User Apps)

### ✅ Why Choose This?
- **Multiple users** - Each uses their own Adobe Sign account
- **Standard OAuth** - Industry best practice
- **Perfect for:** Production apps, team tools, client applications

### 📋 Quick Setup
1. Get OAuth credentials from Adobe Sign:
   → https://secure.na3.adobesign.com/account/accountSettingsPage#pageId::API_APPLICATIONS
   
2. Setup:
   ```bash
   npm install
   ./generate-cert.sh
   cp .env.na3 .env
   # Edit .env with CLIENT_ID and CLIENT_SECRET
   npm start
   ```

3. Open: https://localhost:3000

**Note:** Requires login via Adobe Sign

📖 Full Guide: **SETUP-NA3.md**

---

## 🤷 Still Not Sure?

**Are you building this just for yourself?** → Use Method 1 (Personal Token)

**Will other people use this app?** → Use Method 2 (OAuth)

📖 Detailed Comparison: **OAUTH-VS-TOKEN.md**

---

## 📦 What's Included in This Package?

```
Personal Token Version:
├── server-simple.js          ← No-login server
├── .env.simple              ← Token config
├── agreements-simple.html   ← Simplified UI
└── SETUP-SIMPLE.md          ← Setup guide

OAuth Version:
├── server.js                ← Full OAuth server  
├── .env.na3                 ← OAuth config
├── login.html              ← Login page
├── agreements.html         ← Full UI with logout
└── SETUP-NA3.md            ← Setup guide

Documentation:
├── README.md               ← Main documentation
├── OAUTH-VS-TOKEN.md       ← Detailed comparison
├── TROUBLESHOOTING.md      ← Problem solving
└── THIS FILE!              ← You are here
```

---

## 🎯 My Recommendation

**Start with Personal Access Token (Method 1)**
- It's faster to set up
- You can test everything works
- You can always upgrade to OAuth later if needed

**The OAuth version uses the exact same Adobe Sign APIs**, just with a different authentication method. Both work equally well for signing documents!

---

**Ready to start?** 

→ Open **SETUP-SIMPLE.md** (for personal token)  
→ Open **SETUP-NA3.md** (for OAuth)

Good luck! 🎉
