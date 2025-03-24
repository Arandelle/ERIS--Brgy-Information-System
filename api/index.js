require("dotenv").config();
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const app = express();

// Recommended CORS configuration
const corsOptions = {
  origin: [
    // Local development URLs
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://localhost:3001',
    
    // Frontend deployment URL
    'https://eris-bagtas.vercel.app', 
  ],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers'
  ],
  credentials: true
};

// Apply CORS middleware before routes
app.use(cors(corsOptions));

// Preflight handler (moved before other middleware)
app.options('*', cors(corsOptions));

app.use(express.json());

// Rest of your existing code remains the same...

// ✅ Debugging: Check if FIREBASE_ADMIN_CREDENTIALS is loaded
if (!process.env.FIREBASE_ADMIN_CREDENTIALS) {
  console.error("❌ FIREBASE_ADMIN_CREDENTIALS is missing!");
  process.exit(1); // Stop server if env variable is missing
}

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin Initialized!");
} catch (error) {
  console.error("❌ Error parsing FIREBASE_ADMIN_CREDENTIALS:", error);
  process.exit(1); // Stop server if JSON is invalid
}

// DELETE user endpoint
app.delete("/api/delete-user/:uid", async (req, res) => {
  console.log("Delete Request Received");
  console.log("Origin:", req.get('origin'));
  console.log("Referrer:", req.get('referrer'));

  const { uid } = req.params;
  try {
    console.log("Attempting to delete user:", uid);
    
    await admin.auth().deleteUser(uid);
    
    // Explicit CORS headers for all potential origins
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'DELETE');
    
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Deletion Error:", error);
    
    // Explicit CORS headers for error response
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
