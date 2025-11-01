# Adobe Sign Configuration Troubleshooting Guide

## Error: "Unable to authorize access because the client configuration is invalid: invalid_request"

This error typically means one of these issues:

### 1. Find Your Adobe Sign Region

**Check your Adobe Sign URL when logged in:**

| Your Adobe Sign URL | Region | API Base URL | OAuth URL |
|---------------------|--------|--------------|-----------|
| secure.na1.adobesign.com | North America 1 | https://api.na1.adobesign.com/api/rest/v6 | https://secure.na1.adobesign.com |
| secure.na2.adobesign.com | North America 2 | https://api.na2.adobesign.com/api/rest/v6 | https://secure.na2.adobesign.com |
| secure.na3.adobesign.com | North America 3 | https://api.na3.adobesign.com/api/rest/v6 | https://secure.na3.adobesign.com |
| secure.na4.adobesign.com | North America 4 | https://api.na4.adobesign.com/api/rest/v6 | https://secure.na4.adobesign.com |
| secure.eu1.adobesign.com | Europe 1 | https://api.eu1.adobesign.com/api/rest/v6 | https://secure.eu1.adobesign.com |
| secure.eu2.adobesign.com | Europe 2 | https://api.eu2.adobesign.com/api/rest/v6 | https://secure.eu2.adobesign.com |
| secure.jp1.adobesign.com | Japan | https://api.jp1.adobesign.com/api/rest/v6 | https://secure.jp1.adobesign.com |
| secure.au1.adobesign.com | Australia | https://api.au1.adobesign.com/api/rest/v6 | https://secure.au1.adobesign.com |

### 2. Verify Your Configuration

In Adobe Sign:
1. Go to **Account** → **Account Settings** → **Adobe Sign API** → **API Applications**
2. Click on your application
3. Check these settings:

**Redirect URI must EXACTLY match:**
- If using localhost: `https://localhost:3000/callback`
- If using ngrok: `https://YOUR_NGROK_URL/callback`

**Common mistakes:**
- ❌ `http://localhost:3000/callback` (must be HTTPS)
- ❌ `https://localhost:3000/callback/` (no trailing slash)
- ❌ `https://localhost:3000` (missing /callback)

### 3. Update Your .env File

```env
# Get these from your Adobe Sign application
CLIENT_ID=YOUR_INTEGRATION_KEY_HERE
CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE

# Must match EXACTLY what's in Adobe Sign redirect URI
REDIRECT_URI=https://localhost:3000/callback

# Use YOUR region's API URL from the table above
API_BASE_URL=https://api.YOUR_REGION.adobesign.com/api/rest/v6

# Example for North America 1:
# API_BASE_URL=https://api.na1.adobesign.com/api/rest/v6

# Example for Europe 1:
# API_BASE_URL=https://api.eu1.adobesign.com/api/rest/v6

PORT=3000
USE_HTTPS=true
SESSION_SECRET=any_random_string_here
```

### 4. Verify Scopes Are Enabled

In Adobe Sign API Application settings, ensure these scopes are checked:
- ✅ `agreement_read:account`
- ✅ `agreement_write:account`
- ✅ `agreement_send:account`
- ✅ `widget_read:account`
- ✅ `widget_write:account`

### 5. Check Application Status

In Adobe Sign API Applications:
- Status should be **Enabled** or **Active**
- If it says "Pending" or "Disabled", you may need to activate it

### 6. Common Issues Checklist

- [ ] CLIENT_ID and CLIENT_SECRET are correct (no extra spaces)
- [ ] API_BASE_URL matches your Adobe Sign region
- [ ] REDIRECT_URI in .env exactly matches Adobe Sign configuration
- [ ] REDIRECT_URI uses HTTPS (not HTTP)
- [ ] All required scopes are enabled in Adobe Sign
- [ ] Application status is Active/Enabled
- [ ] SSL certificates generated (if using localhost)
- [ ] No trailing slashes in URLs

### 7. Debug Mode

When you start the app, it will log the OAuth URL. Check the console output:

```bash
npm start
```

Look for:
```
OAuth URL: https://secure.YOUR_REGION.adobesign.com/public/oauth/v2?...
```

The region in this URL should match your Adobe Sign account region.

### 8. Test OAuth URL Manually

Copy the OAuth URL from the console and paste it in your browser. You should see:
- Adobe Sign login page, OR
- Authorization consent screen

If you see an error immediately, the OAuth URL configuration is wrong.

### 9. Still Having Issues?

**Check Adobe Sign API documentation:**
https://secure.YOUR_REGION.adobesign.com/public/docs/restapi/v6

**Enable detailed error logging:**
Add this to server.js after line 1:
```javascript
process.env.NODE_DEBUG = 'request';
```

**Check the browser console:**
Open Developer Tools (F12) and look for errors in the Console tab.

**Verify your integration works:**
Test your CLIENT_ID and CLIENT_SECRET with Adobe Sign's API test tool if available.

### 10. Quick Test

Try this curl command to test your credentials:
```bash
curl -X POST "https://secure.YOUR_REGION.adobesign.com/oauth/v2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=TEST&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&redirect_uri=YOUR_REDIRECT_URI"
```

If you get "invalid_request", the problem is with Adobe Sign configuration.
If you get "invalid_grant", the OAuth flow itself works (just the test code is invalid).
