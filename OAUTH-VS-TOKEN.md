# OAuth vs Personal Token - Which Should You Use?

This app now supports **two different authentication methods**. Here's how to choose:

## 🎯 Quick Decision Guide

**Choose Personal Access Token if:**
- ✅ You're the only user of this app
- ✅ You want the simplest setup (2 minutes)
- ✅ You don't want to log in every time
- ✅ You're building automation/backend tools
- ✅ You're okay using HTTP (no HTTPS required)

**Choose OAuth if:**
- ✅ Multiple different users will use the app
- ✅ Each user has their own Adobe Sign account
- ✅ You need user-specific permissions
- ✅ You're building for clients/customers
- ✅ You need fine-grained access control

---

## 📊 Detailed Comparison

| Feature | Personal Access Token | OAuth 2.0 |
|---------|----------------------|-----------|
| **Setup Time** | 2 minutes | 10+ minutes |
| **Login Required** | ❌ No | ✅ Yes (every session) |
| **HTTPS Required** | ❌ No | ✅ Yes |
| **Certificates Needed** | ❌ No | ✅ Yes |
| **Configuration Files** | 1 (.env.simple) | 2 (.env + OAuth config) |
| **Multi-User Support** | ❌ No (single account) | ✅ Yes (any user) |
| **Token Expiry** | ~1 year | ~1 hour (auto-refresh) |
| **Complexity** | ⭐ Simple | ⭐⭐⭐ Complex |
| **Best For** | Personal/Backend | Production Apps |
| **Security Level** | Medium | High |

---

## 🔐 Security Considerations

### Personal Access Token
- **Pros:**
  - Simpler to manage
  - No redirect URI vulnerabilities
  - Works well for trusted environments
  
- **Cons:**
  - Long-lived token (if stolen, valid for months)
  - Single point of failure
  - Can't scope permissions per-session
  - Token has full account access

### OAuth 2.0
- **Pros:**
  - Short-lived access tokens (1 hour)
  - Can request specific scopes/permissions
  - User explicitly authorizes each app
  - Standard industry practice
  
- **Cons:**
  - More complex setup
  - Requires secure redirect handling
  - Can expire and require re-auth

---

## 📁 File Structure

### Personal Token Version
```
adobe-sign-app/
├── server-simple.js          ← Simple server (no OAuth)
├── .env.simple               ← Token configuration
├── public/
│   └── agreements-simple.html ← No login UI
└── SETUP-SIMPLE.md           ← Setup guide
```

### OAuth Version
```
adobe-sign-app/
├── server.js                 ← Full OAuth server
├── .env.na3                  ← OAuth configuration
├── ssl/                      ← HTTPS certificates
│   ├── key.pem
│   └── cert.pem
├── public/
│   ├── login.html           ← Login page
│   └── agreements.html      ← With login/logout
└── SETUP-NA3.md             ← OAuth setup guide
```

---

## 🚀 How to Use Each Version

### Personal Token Version

**1. Get Token:**
```
Visit: https://secure.na3.adobesign.com/account/accountSettingsPage#pageId::ACCESS_TOKENS
Click "Create Access Token"
Copy the token
```

**2. Configure:**
```bash
cp .env.simple .env
# Edit .env, paste token
```

**3. Run:**
```bash
npm run simple
# Open http://localhost:3000
```

---

### OAuth Version

**1. Get Credentials:**
```
Visit: https://secure.na3.adobesign.com/account/accountSettingsPage#pageId::API_APPLICATIONS
Copy CLIENT_ID and CLIENT_SECRET
Set Redirect URI: https://localhost:3000/callback
```

**2. Generate Certificate:**
```bash
./generate-cert.sh
```

**3. Configure:**
```bash
cp .env.na3 .env
# Edit .env, add CLIENT_ID and CLIENT_SECRET
```

**4. Run:**
```bash
npm start
# Open https://localhost:3000
# Click "Connect with Adobe Sign"
```

---

## 🔄 Can I Switch Between Them?

Yes! Both versions can coexist in the same project.

**To use Personal Token:**
```bash
cp .env.simple .env
npm run simple
```

**To use OAuth:**
```bash
cp .env.na3 .env
npm start
```

---

## 💡 Real-World Scenarios

### Scenario 1: Personal Document Manager
**You want to view and sign YOUR documents from YOUR account.**

**Best Choice:** Personal Access Token ✅
- Set it up once
- No login hassle
- Works forever (or until token expires)

---

### Scenario 2: Team Internal Tool
**Your team needs to sign documents from their own accounts.**

**Best Choice:** OAuth 2.0 ✅
- Each team member logs in with their account
- User-specific document lists
- Proper audit trail

---

### Scenario 3: Backend Automation
**Automated service that monitors/processes documents.**

**Best Choice:** Personal Access Token ✅
- No user interaction needed
- Service account token
- Can run as cron job or daemon

---

### Scenario 4: SaaS Application
**Building an app for customers to use.**

**Best Choice:** OAuth 2.0 ✅
- Each customer uses their own Adobe Sign account
- Proper security model
- Scalable architecture

---

## ⚠️ Common Mistakes

### ❌ Don't Do This:
- Using a personal token for a multi-user app
- Hardcoding tokens in your source code
- Committing .env files to Git
- Sharing your personal token with team members

### ✅ Do This:
- Use personal tokens for single-user scenarios
- Use OAuth for multi-user applications
- Keep tokens in .env files (gitignored)
- Create separate tokens for different services

---

## 🤔 Still Not Sure?

**Start with Personal Access Token** if you're:
- Just trying out the integration
- Building a proof of concept
- Using it yourself

**Upgrade to OAuth** when:
- You have multiple users
- You're deploying to production
- You need better security controls
- You're building for clients

---

## 📚 Additional Resources

- **Personal Tokens:** See SETUP-SIMPLE.md
- **OAuth Setup:** See SETUP-NA3.md
- **Troubleshooting:** See TROUBLESHOOTING.md

---

**Need help deciding? Feel free to ask! 🙋‍♂️**
