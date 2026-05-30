import { Router } from 'express';
import OpenAI from 'openai';
import ChatLog from '../models/ChatLog.js'; // Ensure correct relative pathing to your model

const router = Router();

// ====================================================================
// POST ENDPOINT: Generate Analysis via OpenAI or Fail-safe Fallback
// ====================================================================
router.post('/generate-analysis', async (req, res) => {
  const { prompt, category } = req.body;
  const currentCategory = category || "General Inquiry";

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required in the request body." });
  }

  try {
    // Instantiate the OpenAI client inside the route execution scope.
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });

    // 1. EXECUTE API CALL ON LIVE OPENAI GATEWAY
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `You are an expert Indian legal assistant specializing in: ${currentCategory}. Respond using clear markdown formatting with bold headers and clean bulleted or numbered structures.` 
        },
        { role: "user", content: prompt }
      ],
    });

    const aiResponseText = completion.choices[0].message.content;

    // 2. CONVERSATION LOG THREAD SAVING (MONGODB ATLAS)
    await ChatLog.findOneAndUpdate(
      { category: currentCategory },
      {
        $push: {
          messages: [
            { sender: 'user', text: prompt },
            { sender: 'bot', text: aiResponseText }
          ]
        }
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ text: aiResponseText });

  } catch (error) {
    console.error("OpenAI Route Failure intercepted:", error);

    // 3. SECURE FALLBACK LOGIC FOR CODE 429 (INSUFFICIENT QUOTA / RATE LIMITS)
    if (error.status === 429 || (error.error && error.error.code === 'insufficient_quota')) {
      console.warn("⚠️ OpenAI Account Balance Empty. Deploying Local Legal Sandbox Engine.");

      const sandboxFallbackText = `### ⚖️ JurisAI Sandbox Guidance [Offline Mode]\n\nThank you for accessing the **${currentCategory}** portal.\n\nOur primary live API pipeline is currently undergoing system maintenance, but here is a standard regulatory assessment for your records:\n\n* **Inquiry Overview:** Your request concerning "${prompt}" has been logged successfully inside our secure database sandbox cluster.\n* **Standard Directive:** Ensure all primary text receipts, communication timestamps, or digital validation tokens are systematically preserved.\n* **Immediate Action Point:** Proceed to note down detailed chronological descriptions while legal support protocols are initialized.\n\n*Click "Listen to Response" below to test the full Text-to-Speech audio engine!*`;

      try {
        await ChatLog.findOneAndUpdate(
          { category: currentCategory },
          {
            $push: {
              messages: [
                { sender: 'user', text: prompt },
                { sender: 'bot', text: sandboxFallbackText }
              ]
            }
          },
          { upsert: true, new: true }
        );

        return res.status(200).json({ text: sandboxFallbackText, sandbox: true });

      } catch (dbError) {
        console.error("Database fallback logging failed:", dbError);
        return res.status(500).json({ error: "Complete technical pipeline failure." });
      }
    }
    
    return res.status(500).json({ error: "Failed to process core analysis engine requirements." });
  }
});

// ====================================================================
// GET ENDPOINT: Fetch Chronological Conversation Logs from MongoDB Atlas
// ====================================================================
router.get('/history/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    // Find the chat log document matching the active sidebar category
    const log = await ChatLog.findOne({ category });
    
    // If no document exists yet, return an empty messages array cleanly
    return res.status(200).json(log || { messages: [] });
  } catch (error) {
    console.error("History Fetch Error Details:", error);
    return res.status(500).json({ error: "Could not fetch structural chat trends." });
  }
});

export default router;