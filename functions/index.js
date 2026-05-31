const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 2,
  });
  
  return cachedConnection;
}

app.get("/api/data", async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ message: "Connected successfully (v1 mode)!" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Export the app using v1
exports.api = functions.https.onRequest(app);