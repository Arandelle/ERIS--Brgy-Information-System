require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();

const corsOptions = {
  origin: [
    "https://eris-bagtas.vercel.app",
    "https://eris-brgy-information-system.vercel.app",
    "http://localhost:5175"
  ],
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://eris-bagtas.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).send();
});

// ✅ Allow CORS only from your frontend
app.use(cors(corsOptions));
// ✅ Middleware
app.use(express.json());

// ✅ Validate Required Env Variables
if (!process.env.PRIVATE_KEY || !process.env.PROJECT_ID || !process.env.CLIENT_EMAIL) {
  console.error("❌ Missing Firebase credentials in .env file");
  process.exit(1);
}

// ✅ Parse Firebase Private Key Properly
const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

// ✅ Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("✅ Firebase Initialized");


const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Optional: Check if the user has admin rights
    // const isAdmin = decodedToken.customClaims?.admin === true;
    // if (!isAdmin) return res.status(403).json({ error: 'Forbidden - Admin access required' });
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

// ✅ API Routes

// Disable User
app.post("/api/disable-user",authenticateAdmin, async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "User ID is required" });

    await admin.auth().updateUser(uid, { disabled: true });

    res.status(200).json({ success: true, message: `User ${uid} disabled successfully` });
  } catch (error) {
    console.error("❌ Error disabling user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enable User
app.post("/api/enable-user", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "User ID is required" });

    await admin.auth().updateUser(uid, { disabled: false });

    res.status(200).json({ success: true, message: `User ${uid} enabled successfully` });
  } catch (error) {
    console.error("❌ Error enabling user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete User
// Delete User
app.post("/api/delete-user", cors(corsOptions), async (req, res) => {
  try {
    const { uid } = req.body;

    console.log("Delete user request received:", req.body);

    if (!uid) return res.status(400).json({ error: "User ID is required" });

    await admin.auth().deleteUser(uid);

    res.status(200).json({ success: true, message: `User ${uid} deleted successfully` });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/test-cors', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://eris-bagtas.vercel.app');
  res.status(200).json({ message: 'CORS is working!' });
});


// Explicit handler for OPTIONS requests (preflight)
// Explicitly handle OPTIONS requests (preflight)
app.options("*", cors(corsOptions), (req, res) => {
  res.status(200).end();
});
// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
