require("dotenv").config();
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
    const { uid } = req.params;
    try {
      await admin.auth().deleteUser(uid);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
