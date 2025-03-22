require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();

const corsOptions = {
  origin: [
    "https://eris-bagtas.vercel.app",
    "https://eris-brgy-information-system.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};


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
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBmvK8ASvLjNTe\nTCdKVQEMJ78m1m7OEj2PmpFx55TbeTsA9F22Eue+J+vogt3uABQkuDyaWAPtxN0V\nF3pf0kh/VyE5CqISHwO3jfyrur4nUdnMxzgORUU2hzHLf5HMU14Ko3MBucsmKeZI\nAVbRMEL/0vmVLv7/kfchoE3JD+Q9XGmyp6ERUyK2A41Adl7hbkobUVaCI1EZe/R7\ntt8xkrEgWH9YBI6NWD6PydR3dhAmce8dMFbKMZB5dL18GrdjDCt+U4iji2FOu0cn\nOUye28emGBChc/HttS7maVyeWLbjPnng0luN2SwmdE/ohGc89IpBCLq6oZ+2z5H6\nIB7rryypAgMBAAECggEAHKSwBOCnehX76Geb6INrBEFdJoHTIunP8c8Mda2teEsX\nT6zXsHhbkOaXIG88JlocoNIhJTSgYC0gCF7Q3BxgXXamk6nfEI9GHYIEP+QA/hA+\nCO3wfSwCcW7PDyxwhapP34MPINI8HAlW6JBKJ+jcAL1V75xkXataxL7Sw0x2mB0x\n5gxsac1/4ZDFfzUlPEjRYbZcVb0KYCGYHYnyboCU8I1ULfAJ1Cwzf5M26M4giDrN\nQz66meWLLNlchjkTBpHhcZvYcOTMP+LicAL2Ne3K/3UHoRRYkXgLepNIJg5h59EA\nIyU5PLItN/2ZKLTkjvuF8nrZJII1qiDOSOwhj9dNgQKBgQDy5I6Q+WKRC399fwIl\nfMfNj5tk0QmpDyV0ClneKnZAfSpStVbfHX70kN2V3JvbztPasE1XpHC110Sh8UDQ\nf9OyF2sQeXAVmy1n3FTl7JtCtgK2KGIwfs6CtsvFNEcUpcFDd824QVBp8d60OiZM\ne0QJDokjxNZsF+Yu03qP9gCIVwKBgQDMDYIvnL9PXgld6HXL8WAAEdfKgfYrEniA\ndzkY4kdwL18Nf+1E3sq5Nam/+jD7JQwxM/Z8YpTJQA/BJpWk/vjldH9wOWMvsk9K\nGA57KUZotPDWFlL6u1jQBj+8w+BrlNuhLbwSxeVvI2avyrkAdn4amLVa/YU65iIx\n5AxbhzDS/wKBgCO7PcHT/g0KXPnwOjebkKUL0DdXjQ1CvibA8xF8u6KnBxfdt2bh\nJvEBcqd+Kat/VKkiMG6JMU9+2IjePcOuWk0jpstoofV7u4VA43hjgz+gGOwFKtSp\nguW10Go1U5OVAsZTFH9blGHRhAqNV17+7zZJ3iDV7xk9ts4CrFALR27HAoGAbmTg\nieHDnqzBZIzfLfboeSEuHeExzRuxFc9qlIvXGlqGkkcjlp7yDkF6FOLGnRjt/7Cd\nKa4r0LVX0KePTjSjc4ATciOaBbPyMaPSMc+iyAMcSLbLLdstsV2wHe/a+lkOeaTE\nm2N1PStp4rFKZXW1w63ab9+4tKTM2zEFfn8lawECgYEAlBuoJ/ljAYScz4mtwdgY\nUKUeWxNuWMt1ROd2UiQFDqr33xWlqLkLuNwi65/Fs/CgXBV8X9RVuG9U0GsF30xC\nZZUBFYGDMmnB/r89Lz/+vIp+kYq+KoXSaM1ibK/gIYPpTl4G/+bKjIx67WYUnQYX\nB0oKcp8sc0Pz5IjimauJhhQ=\n-----END PRIVATE KEY-----\n",
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};

// ✅ Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("✅ Firebase Initialized");

// ✅ API Routes

// Disable User
app.post("/api/disable-user", async (req, res) => {
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
app.delete("/api/delete-user", cors(corsOptions), async (req, res) => {
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
