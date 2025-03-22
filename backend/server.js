require("dotenv").config(); // ✅ Load env variables first
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();

// ✅ Middleware
app.use(cors()); // Allow all CORS requests
app.use(express.json()); // Parse JSON requests

// ✅ Ensure all required environment variables exist
if (!process.env.PRIVATE_KEY || !process.env.PROJECT_ID) {
  console.error("❌ Missing Firebase credentials in .env file");
  process.exit(1); // Stop execution if missing env variables
}

// ✅ Initialize Firebase Admin SDK
const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("✅ Firebase Initialized");

// ✅ API Routes
app.post("/api/disable-user", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "User ID is required" });

    await admin.auth().updateUser(uid, { disabled: true });

    res
      .status(200)
      .json({ success: true, message: `User ${uid} disabled successfully` });
  } catch (error) {
    console.error("❌ Error disabling user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/enable-user", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "User ID is required" });

    await admin.auth().updateUser(uid, { disabled: false });

    res
      .status(200)
      .json({ success: true, message: `User ${uid} enabled successfully` });
  } catch (error) {
    console.error("❌ Error enabling user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/delete-user", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "User ID is required" });

    await admin.auth().deleteUser(uid);

    res
      .status(200)
      .json({ success: true, message: `User ${uid} deleted successfully` });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
