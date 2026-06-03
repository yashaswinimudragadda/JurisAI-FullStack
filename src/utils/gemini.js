import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure you use environment variables for your API key
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export async function getGeminiResponse(userMessage, chatHistory = []) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Map your existing message format to Gemini's format
  const history = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}