const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK with your service account
const serviceAccount = require('./firebase-service.json');
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