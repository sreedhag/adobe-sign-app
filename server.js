require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'adobe-sign-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: USE_HTTPS,
    sameSite: 'lax'
  }
}));

// Adobe Sign API configuration
const ADOBE_CONFIG = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.na1.adobesign.com/api/rest/v6'
};

// Extract region from API base URL (e.g., "na1" from "https://api.na1.adobesign.com")
const API_REGION = ADOBE_CONFIG.apiBaseUrl.match(/api\.([^.]+)\.adobesign/)?.[1] || 'na1';
const OAUTH_BASE_URL = `https://secure.${API_REGION}.adobesign.com`;

// Validate configuration on startup
function validateConfig() {
  const errors = [];
  
  if (!ADOBE_CONFIG.clientId) {
    errors.push('CLIENT_ID is missing in .env file');
  }
  if (!ADOBE_CONFIG.clientSecret) {
    errors.push('CLIENT_SECRET is missing in .env file');
  }
  if (!ADOBE_CONFIG.redirectUri) {
    errors.push('REDIRECT_URI is missing in .env file');
  } else if (!ADOBE_CONFIG.redirectUri.startsWith('https://')) {
    errors.push('REDIRECT_URI must start with https:// (Adobe Sign requirement)');
  }
  if (!ADOBE_CONFIG.apiBaseUrl.includes('adobesign.com')) {
    errors.push('API_BASE_URL appears to be invalid');
  }
  
  if (errors.length > 0) {
    console.error('\n❌ Configuration Errors:\n');
    errors.forEach(error => console.error(`   - ${error}`));
    console.error('\n📝 Please check your .env file and TROUBLESHOOTING.md\n');
    process.exit(1);
  }
  
  console.log('\n✅ Configuration validated');
  console.log(`   Region: ${API_REGION}`);
  console.log(`   OAuth URL: ${OAUTH_BASE_URL}`);
  console.log(`   API URL: ${ADOBE_CONFIG.apiBaseUrl}`);
  console.log(`   Redirect URI: ${ADOBE_CONFIG.redirectUri}\n`);
}

validateConfig();

// Helper function to make Adobe Sign API calls
async function adobeSignAPI(endpoint, method = 'GET', data = null, accessToken) {
  const config = {
    method,
    url: `${ADOBE_CONFIG.apiBaseUrl}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Adobe Sign API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Routes
app.get('/', (req, res) => {
  if (req.session.accessToken) {
    res.redirect('/agreements');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.get('/auth', (req, res) => {
  const authUrl = `${OAUTH_BASE_URL}/public/oauth/v2?` +
    `redirect_uri=${encodeURIComponent(ADOBE_CONFIG.redirectUri)}` +
    `&response_type=code` +
    `&client_id=${ADOBE_CONFIG.clientId}` +
    `&scope=agreement_read:account+agreement_write:account+agreement_send:account+widget_read:account+widget_write:account`;
  
  console.log('OAuth URL:', authUrl); // Debug log
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code not provided');
  }

  try {
    const tokenResponse = await axios.post(
      `${OAUTH_BASE_URL}/oauth/v2/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: ADOBE_CONFIG.clientId,
        client_secret: ADOBE_CONFIG.clientSecret,
        redirect_uri: ADOBE_CONFIG.redirectUri,
        code: code
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    req.session.accessToken = tokenResponse.data.access_token;
    req.session.refreshToken = tokenResponse.data.refresh_token;
    
    res.redirect('/agreements');
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

app.get('/agreements', (req, res) => {
  if (!req.session.accessToken) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'agreements.html'));
});

app.get('/api/agreements', async (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const agreements = await adobeSignAPI(
      '/agreements?query=status:OUT_FOR_SIGNATURE OR status:WAITING_FOR_MY_SIGNATURE',
      'GET',
      null,
      req.session.accessToken
    );

    res.json(agreements);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch agreements',
      details: error.response?.data || error.message 
    });
  }
});

app.get('/api/agreements/:agreementId/signingUrl', async (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { agreementId } = req.params;
    
    const signingUrl = await adobeSignAPI(
      `/agreements/${agreementId}/signingUrls`,
      'GET',
      null,
      req.session.accessToken
    );

    res.json(signingUrl);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get signing URL',
      details: error.response?.data || error.message 
    });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Start server
if (USE_HTTPS) {
  // HTTPS server with self-signed certificate
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
  };
  
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`✓ HTTPS Server running on https://localhost:${PORT}`);
    console.log(`✓ Make sure to add https://localhost:${PORT}/callback as a redirect URI in your Adobe Sign integration`);
    console.log('\nNote: Your browser will show a security warning because of the self-signed certificate.');
    console.log('This is normal for local development. Click "Advanced" and "Proceed" to continue.\n');
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`\n⚠️  WARNING: Adobe Sign requires HTTPS for redirect URIs.`);
    console.log(`Please set USE_HTTPS=true in your .env file and generate SSL certificates,`);
    console.log(`or use a tool like ngrok to create an HTTPS tunnel.\n`);
  });
}
