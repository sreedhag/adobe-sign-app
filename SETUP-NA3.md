# Setup Guide for Adobe Sign NA3 Region

You're using Adobe Sign in the **North America 3 (na3)** region.

## Step-by-Step Setup

### 1. Get Your API Credentials

Go to: https://secure.na3.adobesign.com/account/accountSettingsPage#pageId::API_APPLICATIONS

1. Click on your application (or create a new one)
2. You'll need:
   - **Integration Key** (this is your CLIENT_ID)
   - **Client Secret** (click "Show" to reveal it)

### 2. Configure Redirect URI in Adobe Sign

In the same Adobe Sign application settings page:

1. Find the **Redirect URI** field
2. Enter EXACTLY this (no trailing slash): `https://localhost:3000/callback`
3. Click **Save**

### 3. Enable Required Scopes

In the Adobe Sign application settings, make sure these scopes are checked:

- ✅ agreement_read:account
- ✅ agreement_write:account  
- ✅ agreement_send:account
- ✅ widget_read:account
- ✅ widget_write:account

Click **Save** after enabling scopes.

### 4. Configure Your Application

I've created a pre-configured `.env.na3` file for you.

**Rename it to `.env`:**
```bash
mv .env.na3 .env
```

**Or copy it:**
```bash
cp .env.na3 .env
```

**Then edit `.env` and add your credentials:**
```env
CLIENT_ID=paste_your_integration_key_here
CLIENT_SECRET=paste_your_client_secret_here
REDIRECT_URI=https://localhost:3000/callback
API_BASE_URL=https://api.na3.adobesign.com/api/rest/v6
PORT=3000
USE_HTTPS=true
SESSION_SECRET=change_this_to_any_random_string
```

### 5. Generate SSL Certificate

**Mac/Linux:**
```bash
./generate-cert.sh
```

**Windows:**
```bash
generate-cert.bat
```

### 6. Install and Run

```bash
npm install
npm start
```

You should see:
```
✅ Configuration validated
   Region: na3
   OAuth URL: https://secure.na3.adobesign.com
   API URL: https://api.na3.adobesign.com/api/rest/v6
   Redirect URI: https://localhost:3000/callback

✓ HTTPS Server running on https://localhost:3000
```

### 7. Test the Application

1. Open: **https://localhost:3000**
2. Your browser will show a security warning (normal for self-signed certificates)
3. Click **Advanced** → **Proceed to localhost (unsafe)**
4. Click **Connect with Adobe Sign**
5. You should be redirected to Adobe Sign login page

---

## Troubleshooting for NA3

### Still getting "invalid_request" error?

**Double-check these match EXACTLY:**

In Adobe Sign:
- Redirect URI: `https://localhost:3000/callback`

In your `.env` file:
- REDIRECT_URI: `https://localhost:3000/callback`
- API_BASE_URL: `https://api.na3.adobesign.com/api/rest/v6`

**Common mistakes:**
- ❌ Using `http://` instead of `https://`
- ❌ Adding trailing slash: `https://localhost:3000/callback/`
- ❌ Wrong region (na1, na2 instead of na3)
- ❌ Spaces in CLIENT_ID or CLIENT_SECRET

### Need more help?

See **TROUBLESHOOTING.md** for detailed troubleshooting steps.

---

## Your NA3 URLs Reference

- **Login**: https://secure.na3.adobesign.com
- **OAuth**: https://secure.na3.adobesign.com/public/oauth/v2
- **API**: https://api.na3.adobesign.com/api/rest/v6
- **Settings**: https://secure.na3.adobesign.com/account/accountSettingsPage#pageId::API_APPLICATIONS
