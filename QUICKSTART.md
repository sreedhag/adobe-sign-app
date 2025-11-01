# Quick Start Guide - Adobe Sign Integration

## 🚀 Fast Setup (5 minutes)

### Step 1: Extract and Install
```bash
cd adobe-sign-app
npm install
```

### Step 2: Generate SSL Certificate
Choose your operating system:

**Mac/Linux:**
```bash
./generate-cert.sh
```

**Windows:**
```bash
generate-cert.bat
```

### Step 3: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` file with your Adobe Sign credentials:
```
CLIENT_ID=your_integration_key
CLIENT_SECRET=your_client_secret
REDIRECT_URI=https://localhost:3000/callback
API_BASE_URL=https://api.na1.adobesign.com/api/rest/v6
USE_HTTPS=true
```

### Step 4: Configure Adobe Sign
1. Go to Adobe Sign → Account Settings → API Applications
2. Set Redirect URI to: `https://localhost:3000/callback`
3. Enable these scopes:
   - agreement_read:account
   - agreement_write:account
   - agreement_send:account
   - widget_read:account
   - widget_write:account

### Step 5: Run
```bash
npm start
```

Open: `https://localhost:3000`

**Note:** Your browser will show a security warning. Click "Advanced" → "Proceed to localhost" (this is normal for self-signed certificates).

---

## Alternative: Using ngrok (No Certificate Required)

### Step 1-2: Same as above (but skip certificate generation)

### Step 3: Configure for ngrok
Edit `.env`:
```
USE_HTTPS=false
REDIRECT_URI=https://YOUR_NGROK_URL/callback
```

### Step 4: Start Application
```bash
npm start
```

### Step 5: Start ngrok (separate terminal)
```bash
ngrok http 3000
```

### Step 6: Update Configuration
- Copy ngrok HTTPS URL (e.g., https://abc123.ngrok.io)
- Update `.env` REDIRECT_URI with ngrok URL
- Update Adobe Sign redirect URI with ngrok URL
- Restart application

---

## Troubleshooting

**Can't connect?**
- Make sure REDIRECT_URI in `.env` exactly matches Adobe Sign configuration
- Must use HTTPS (not HTTP)
- Check CLIENT_ID and CLIENT_SECRET are correct

**No documents showing?**
- Verify you have pending documents in Adobe Sign
- Check browser console for errors
- Confirm API_BASE_URL matches your region

**Need help?** See full README.md for detailed instructions.
