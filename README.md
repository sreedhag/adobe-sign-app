# Adobe Sign Integration Application

A simple Node.js application that integrates with Adobe Sign API to list and sign documents with an embedded widget.

## 🎯 Two Ways to Use This App

This app supports **two authentication methods**. Choose the one that fits your needs:

### Option 1: Personal Access Token (Recommended for Most Users) ⭐
- ✅ **No login required** - Works immediately
- ✅ **2-minute setup** - Just paste a token
- ✅ **No HTTPS needed** - Simpler configuration
- ✅ Perfect for personal use or backend automation

**Quick Start:**
```bash
npm install
cp .env.simple .env
# Get token from Adobe Sign, paste in .env
npm run simple
```

📖 **[See SETUP-SIMPLE.md for detailed instructions](SETUP-SIMPLE.md)**

---

### Option 2: OAuth 2.0 (For Multi-User Apps)
- ✅ Supports multiple users with different Adobe Sign accounts
- ✅ Standard OAuth flow with login
- ✅ Better for production applications
- ⚠️ Requires HTTPS setup with certificates

**Quick Start:**
```bash
npm install
./generate-cert.sh
cp .env.na3 .env
# Add CLIENT_ID and CLIENT_SECRET
npm start
```

📖 **[See SETUP-NA3.md for detailed instructions](SETUP-NA3.md)**

---

## 🤔 Which One Should You Choose?

| Use Personal Token If... | Use OAuth If... |
|---------------------------|-----------------|
| You're the only user | Multiple users need access |
| Building for yourself | Building for clients/customers |
| Want simplest setup | Need user-specific permissions |
| Backend automation | User-facing web application |

📖 **[See OAUTH-VS-TOKEN.md for detailed comparison](OAUTH-VS-TOKEN.md)**

---

## Features

- OAuth 2.0 authentication with Adobe Sign
- List all agreements waiting for your signature
- Embedded signing widget for viewing and signing documents
- Clean, responsive UI
- Session management

## Prerequisites

- Node.js (v14 or higher)
- Adobe Sign Developer Account
- Adobe Sign API credentials
- OpenSSL (for generating SSL certificates) OR ngrok (for HTTPS tunneling)

## Setup Instructions

### 1. Configure Adobe Sign Developer Account

1. Log in to your Adobe Sign account
2. Go to **Account Settings** > **Adobe Sign API** > **API Applications**
3. Create a new application or use an existing one
4. Configure your application with these settings:
   - **Redirect URI**: `https://localhost:3000/callback` (or your ngrok URL if using ngrok)
   - **Scopes**: Select the following:
     - `agreement_read:account`
     - `agreement_write:account`
     - `agreement_send:account`
     - `widget_read:account`
     - `widget_write:account`
5. Save your application and note down:
   - **Integration Key** (Client ID)
   - **Client Secret**
   - **API Access Point** (e.g., https://api.na1.adobesign.com)

**Important**: Adobe Sign requires HTTPS for redirect URIs. You have two options:

#### Option A: Self-Signed Certificate (Easiest for Local Development)
#### Option B: ngrok Tunnel (No Certificate Needed)

### 2. Install Dependencies

```bash
cd adobe-sign-app
npm install
```

### 3. Choose Your HTTPS Setup Method

#### **Option A: Self-Signed Certificate (Recommended for Local Development)**

This method runs HTTPS directly on localhost with a self-signed certificate.

**Step 1**: Generate SSL certificates

On Mac/Linux:
```bash
chmod +x generate-cert.sh
./generate-cert.sh
```

On Windows (requires OpenSSL installed):
```bash
generate-cert.bat
```

Or manually:
```bash
mkdir ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

**Step 2**: Configure environment variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```env
CLIENT_ID=your_integration_key_here
CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=https://localhost:3000/callback
API_BASE_URL=https://api.na1.adobesign.com/api/rest/v6
PORT=3000
USE_HTTPS=true
SESSION_SECRET=your_random_session_secret_here
```

**Step 3**: Configure Adobe Sign Redirect URI
- In your Adobe Sign application settings, set Redirect URI to: `https://localhost:3000/callback`

**Step 4**: Run the application
```bash
npm start
```

**Step 5**: Access the application
- Open `https://localhost:3000` in your browser
- Your browser will show a security warning (this is normal for self-signed certificates)
- Click "Advanced" → "Proceed to localhost (unsafe)" to continue

---

#### **Option B: ngrok Tunnel (No Certificate Required)**

This method creates an HTTPS tunnel to your local server.

**Step 1**: Install ngrok
- Download from https://ngrok.com/download
- Or install via npm: `npm install -g ngrok`

**Step 2**: Configure environment variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` (note: USE_HTTPS=false since ngrok handles HTTPS):
```env
CLIENT_ID=your_integration_key_here
CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=https://YOUR_NGROK_URL/callback
API_BASE_URL=https://api.na1.adobesign.com/api/rest/v6
PORT=3000
USE_HTTPS=false
SESSION_SECRET=your_random_session_secret_here
```

**Step 3**: Start the application
```bash
npm start
```

**Step 4**: In a separate terminal, start ngrok
```bash
ngrok http 3000
```

**Step 5**: Configure Adobe Sign
- Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)
- Update your `.env` file: `REDIRECT_URI=https://abc123.ngrok.io/callback`
- In your Adobe Sign application settings, set Redirect URI to: `https://abc123.ngrok.io/callback`
- Restart your application: `npm start`

**Step 6**: Access the application
- Open the ngrok HTTPS URL in your browser (e.g., `https://abc123.ngrok.io`)

---

### 4. Start Using the Application

### 4. Start Using the Application

1. Open your browser and navigate to:
   - **Option A**: `https://localhost:3000`
   - **Option B**: Your ngrok HTTPS URL
2. Click **Connect with Adobe Sign** to authenticate
3. Authorize the application to access your Adobe Sign account
4. You'll be redirected to the agreements page showing all documents waiting for your signature
5. Click **Sign Now** on any document to open the embedded signing widget
6. Sign the document within the embedded widget
7. The document list will refresh automatically after signing

## API Region Configuration

Make sure to set the correct API_BASE_URL in your `.env` file based on your Adobe Sign account region:

- **North America 1**: `https://api.na1.adobesign.com/api/rest/v6`
- **North America 2**: `https://api.na2.adobesign.com/api/rest/v6`
- **North America 3**: `https://api.na3.adobesign.com/api/rest/v6`
- **North America 4**: `https://api.na4.adobesign.com/api/rest/v6`
- **Europe 1**: `https://api.eu1.adobesign.com/api/rest/v6`
- **Europe 2**: `https://api.eu2.adobesign.com/api/rest/v6`
- **Japan**: `https://api.jp1.adobesign.com/api/rest/v6`
- **Australia**: `https://api.au1.adobesign.com/api/rest/v6`

## Project Structure

```
adobe-sign-app/
├── server.js              # Express server and API routes
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── .env                  # Your actual credentials (not in git)
└── public/
    ├── login.html        # Login/authentication page
    └── agreements.html   # Document listing and signing page
```

## API Endpoints

- `GET /` - Home page (redirects to login or agreements)
- `GET /auth` - Initiates OAuth flow
- `GET /callback` - OAuth callback endpoint
- `GET /agreements` - Agreements listing page
- `GET /api/agreements` - Fetch user's agreements (JSON)
- `GET /api/agreements/:id/signingUrl` - Get signing URL for specific agreement
- `GET /logout` - Logout and clear session

## Troubleshooting

### HTTPS / SSL Issues
- **Browser security warning**: This is normal with self-signed certificates. Click "Advanced" → "Proceed to localhost"
- **SSL certificate errors**: Make sure you ran the `generate-cert.sh` or `generate-cert.bat` script
- **Certificate files not found**: Ensure `ssl/key.pem` and `ssl/cert.pem` exist in the project directory
- **ngrok connection issues**: Make sure ngrok is running and the URL in `.env` matches the ngrok URL exactly

### Authentication Errors
- Verify your Client ID and Client Secret are correct
- Ensure the Redirect URI in your Adobe Sign app matches exactly: 
  - Self-signed cert: `https://localhost:3000/callback`
  - ngrok: `https://YOUR_NGROK_URL/callback`
- Check that all required scopes are enabled in your Adobe Sign application
- Make sure you're using HTTPS (not HTTP) in your redirect URI

### No Documents Showing
- Make sure you have agreements waiting for your signature in Adobe Sign
- Check the browser console for any API errors
- Verify your API_BASE_URL matches your account's region

### CORS or Network Errors
- Ensure you're using the correct API endpoint for your region
- Check that your Adobe Sign integration has the necessary permissions
- Verify your access token is valid (try logging out and back in)

### ngrok-Specific Issues
- **URL changes on restart**: Free ngrok URLs change each time. Update `.env` and Adobe Sign redirect URI when this happens
- **Tunnel not found**: Make sure ngrok is running in a separate terminal
- **Rate limiting**: Free ngrok has request limits. Consider upgrading for production use

## Security Notes

- Never commit your `.env` file or SSL certificates to version control
- Self-signed certificates are for local development only - use proper certificates in production
- The `ssl/` directory is ignored in `.gitignore`
- Set `USE_HTTPS=true` and `cookie.secure=true` when using HTTPS
- Implement token refresh logic for production use
- Consider adding rate limiting and additional security measures
- For production, use a proper SSL certificate from a trusted Certificate Authority

## License

ISC
