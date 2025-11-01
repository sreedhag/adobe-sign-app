require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Adobe Sign API configuration
const ADOBE_CONFIG = {
  accessToken: process.env.ACCESS_TOKEN, // Personal access token
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.na3.adobesign.com/api/rest/v6'
};

// Extract region from API base URL
const API_REGION = (ADOBE_CONFIG.apiBaseUrl.match(/api\.([^.]+)\.adobesign/) || [])[1] || 'na3';

// Validate configuration on startup
function validateConfig() {
  const errors = [];
  
  if (!ADOBE_CONFIG.accessToken) {
    errors.push('ACCESS_TOKEN is missing in .env file');
    errors.push('Get your token from: https://secure.' + API_REGION + '.adobesign.com/account/accountSettingsPage#pageId::ACCESS_TOKENS');
  }
  if (!ADOBE_CONFIG.apiBaseUrl.includes('adobesign.com')) {
    errors.push('API_BASE_URL appears to be invalid');
  }
  
  if (errors.length > 0) {
    console.error('\n❌ Configuration Errors:\n');
    errors.forEach(error => console.error(`   - ${error}`));
    console.error('\n📝 Please check your .env file\n');
    process.exit(1);
  }
  
  console.log('\n✅ Configuration validated');
  console.log(`   Region: ${API_REGION}`);
  console.log(`   API URL: ${ADOBE_CONFIG.apiBaseUrl}`);
  console.log(`   Using Personal Access Token: ${ADOBE_CONFIG.accessToken.substring(0, 10)}...`);
  console.log('\n💡 No login required - using personal access token!\n');
}

validateConfig();

// Helper function to make Adobe Sign API calls
async function adobeSignAPI(endpoint, method = 'GET', data = null) {
  const config = {
    method,
    url: `${ADOBE_CONFIG.apiBaseUrl}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${ADOBE_CONFIG.accessToken}`,
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
    console.error('Adobe Sign API Error:', (error.response && error.response.data) || error.message);
    throw error;
  }
}

// Routes

// Home page - go directly to agreements
app.get('/', (req, res) => {
  res.redirect('/agreements');
});

// Get list of agreements waiting for signature
app.get('/agreements', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'agreements-simple.html'));
});

// API endpoint to fetch agreements
app.get('/api/agreements', async (req, res) => {
  try {
    // Get agreements where current user needs to sign
    const agreements = await adobeSignAPI(
      '/agreements?query=status:OUT_FOR_SIGNATURE OR status:WAITING_FOR_MY_SIGNATURE'
    );

    res.json(agreements);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch agreements',
      details: (error.response && error.response.data) || error.message 
    });
  }
});

// Get signing URL for a specific agreement
app.get('/api/agreements/:agreementId/signingUrl', async (req, res) => {
  try {
    const { agreementId } = req.params;
    
    // Get the signing URL
    const signingUrl = await adobeSignAPI(`/agreements/${agreementId}/signingUrls`);

    res.json(signingUrl);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get signing URL',
      details: (error.response && error.response.data) || error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test the access token by fetching base URIs
    await adobeSignAPI('/baseUris');
    res.json({ status: 'ok', message: 'Access token is valid' });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Access token is invalid or expired',
      details: (error.response && error.response.data) || error.message
    });
  }
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
    console.log(`✓ Open https://localhost:${PORT} to view your documents\n`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Open http://localhost:${PORT} to view your documents\n`);
  });
}
