import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize the OpenAI client with your hidden API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;