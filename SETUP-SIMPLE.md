# Simple Setup Guide - No Login Required! 🎉

This is the **easiest way** to use the Adobe Sign app. No OAuth, no login - just use a personal access token!

## Why This Is Better

**OAuth Version (server.js):**
- ❌ Requires login every time session expires
- ❌ More complex setup with OAuth credentials
- ❌ Requires HTTPS with certificates

**Token Version (server-simple.js):**
- ✅ No login required - works immediately
- ✅ Simpler setup - just one token
- ✅ Can use HTTP (no certificates needed)
- ✅ Perfect for personal use or backend services

## 🚀 Quick Setup (2 Minutes)

### Step 1: Get Your Personal Access Token

1. Go to: https://secure.na3.adobesign.com/account/accountSettingsPage#pageId::ACCESS_TOKENS
2. Click **"Create Access Token"** or **"+"** button
3. Give it a name (e.g., "My E-Sign App")
4. Click **Create**
5. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### Step 2: Configure the App

```bash
cd adobe-sign-app
cp .env.simple .env
```

Edit `.env` and paste your token:
```env
ACCESS_TOKEN=paste_your_token_here
API_BASE_URL=https://api.na3.adobesign.com/api/rest/v6
PORT=3000
USE_HTTPS=false
```

### Step 3: Install and Run

```bash
npm install
npm run simple
```

That's it! Open: **http://localhost:3000**

No login required - you'll see your documents immediately! 🎊

## 📋 What Changed?

**Old OAuth Flow:**
```
User → Opens App → Clicks Login → Adobe Sign Login → 
Authorizes → Redirects Back → Access Token → See Documents
```

**New Token Flow:**
```
User → Opens App → See Documents ✨
```

## 🔑 About Personal Access Tokens

- **Valid for:** Usually 1 year (check Adobe Sign settings)
- **Permissions:** Same as your user account
- **Security:** Keep it secret! Don't commit to Git (it's in .gitignore)
- **Renewal:** When it expires, just create a new one

## 🆚 When to Use Which Version?

**Use Token Version (server-simple.js) when:**
- ✅ Building for yourself or your team
- ✅ Backend/automation service
- ✅ Want simplest setup
- ✅ Don't need to support multiple different Adobe Sign accounts

**Use OAuth Version (server.js) when:**
- ✅ Building for multiple external users
- ✅ Each user has their own Adobe Sign account
- ✅ Need user-specific permissions
- ✅ Building a commercial application

## 📁 File Differences

| Feature | OAuth Version | Token Version |
|---------|--------------|---------------|
| Server File | `server.js` | `server-simple.js` |
| Frontend | `public/agreements.html` | `public/agreements-simple.html` |
| .env File | `.env.na3` | `.env.simple` |
| Start Command | `npm start` | `npm run simple` |
| Login Required | Yes | No |
| Setup Complexity | High | Low |
| HTTPS Required | Yes | No |

## 🛠️ Switching Between Versions

**To use OAuth version:**
```bash
cp .env.na3 .env
npm start
```

**To use Token version:**
```bash
cp .env.simple .env
npm run simple
```

## 🔒 Security Notes

- Your personal access token has the same permissions as your Adobe Sign account
- Don't share your token with others
- Don't commit `.env` to version control (already in .gitignore)
- If token is compromised, revoke it in Adobe Sign settings and create a new one

## ⚡ Troubleshooting

**"Failed to load documents"**
- Check that your ACCESS_TOKEN is correct (no extra spaces)
- Verify token hasn't expired in Adobe Sign settings
- Ensure API_BASE_URL matches your region (na3)

**"Access token is invalid or expired"**
- Token may have expired - create a new one
- Check for typos in the token

**Can't find Access Tokens page?**
- Some Adobe Sign accounts may have this disabled by admin
- Contact your Adobe Sign admin to enable API access tokens
- Alternative: Use the OAuth version (server.js)

## 🎯 Testing Your Token

Test if your token works:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.na3.adobesign.com/api/rest/v6/baseUris
```

If you see JSON data, your token works!

---

**Enjoy your no-login Adobe Sign integration! 🚀**
