import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Node.js to use Google & Cloudflare DNS to safely resolve Atlas addresses
dotenv.config(); // Loads variables from your .env file into process.env

import aiRoutes from './src/routes/aiRoutes.js'; 
import ChatLog from './src/models/ChatLog.js';

const app = express();
app.use(cors());
app.use(express.json());

// Mount your OpenAI routes at /api/ai
app.use("/api/ai", aiRoutes);

// Database Integrity Validation Loop
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is missing inside your .env configuration file.");
  process.exit(1);
}

// Establish your Cloud MongoDB Atlas Connection securely via environment variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to Cloud MongoDB Atlas Database!'))
  .catch(err => console.error('MongoDB connection error:', err));

export { ChatLog };

// Base health check route
app.get("/", (req, res) => {
  res.send("JurisAI Backend Server is running successfully with OpenAI!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`JurisAI Backend Server is successfully running live on http://localhost:${PORT}`);
});