const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();

// Middleware to allow cross-origin requests
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK with your service account
// Initialize Firebase Admin SDK
const serviceAccount = {
  type: process.env.VITE_TYPE, 
  project_id: process.env.VITE_PROJECT_ID,
  private_key_id: process.env.VITE_PRIVATE_KEY_ID,
  private_key: process.env.VITE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.VITE_CLIENT_EMAIL,
  client_id: process.env.VITE_CLIENT_ID,
  auth_uri: process.env.VITE_AUTH_URI,  
  token_uri: process.env.VITE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.VITE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.VITE_CLIENT_X509_CERT_URL 
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Endpoint to disable a user account
app.post('/api/disable-user', async (req, res) => {
  try {
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Disable the user
    await admin.auth().updateUser(uid, {
      disabled: true
    });
    
    res.status(200).json({ 
      success: true, 
      message: `User ${uid} has been disabled successfully` 
    });
  } catch (error) {
    console.error('Error disabling user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Endpoint to enable a user account (in case you need this later)
app.post('/api/enable-user', async (req, res) => {
  try {
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Enable the user
    await admin.auth().updateUser(uid, {
      disabled: false
    });
    
    res.status(200).json({ 
      success: true, 
      message: `User ${uid} has been enabled successfully` 
    });
  } catch (error) {
    console.error('Error enabling user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// API endpoint to delete a user
app.post('/api/delete-user', async (req, res) => {
  try {
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    await admin.auth().deleteUser(uid);
    
    res.status(200).json({ 
      success: true, 
      message: `User ${uid} has been deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});