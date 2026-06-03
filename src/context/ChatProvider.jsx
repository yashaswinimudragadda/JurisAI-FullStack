import { useState, useCallback,useEffect } from 'react';
import { ChatContext } from './ChatContext';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY, {
  apiVersion: 'v1' 
});

const featureWelcomeTexts = {
  'Legal Rights Awareness': 'Hello! I am JurisAI. Ask me any general legal questions to receive an easy-to-understand breakdown of your constitutional rights.',
  'Complaint Filing Guidance': 'Welcome to the Complaint Filing Guidance module. I can assist you with step-by-step procedures on how to file a police complaint.',
  'Cybercrime Reporting Support': 'Cybercrime Portal active. Describe your issue to discover immediate reporting steps.',
  'Consumer Protection Guidance': 'Consumer Protection Portal active. Let me help you look up rules for commercial grievances.',
  'Domestic Violence Reporting Support': 'Domestic Violence Support Node. I can guide you through protection orders and emergency numbers.',
  'Legal Documentation Guidance': 'Welcome to the Documentation Module. I can help simplify complex jargon regarding lease terms or affidavits.',
};

export const ChatProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('Legal Rights Awareness');
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('en-IN');
  const [isLoading, setIsLoading] = useState(false);

  const [chatHistories, setChatHistories] = useState(
    Object.keys(featureWelcomeTexts).reduce((acc, feature) => {
      acc[feature] = [{ sender: 'bot', text: featureWelcomeTexts[feature] }];
      return acc;
    }, {})
  );

  const sendMessage = useCallback(async (textToSubmit) => {
    if (!textToSubmit.trim()) return;

    const userMsg = { sender: 'user', text: textToSubmit };
    
    setChatHistories(prev => ({
      ...prev,
      [currentView]: [...prev[currentView], userMsg]
    }));
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
model: "gemini-2.5-flash", // Use this stable model
        systemInstruction: `You are JurisAI, a helpful and professional legal assistant specializing in ${currentView}. Provide clear, accurate, and responsible information. Always advise users to consult with a qualified legal professional for critical issues.`
      });

      // FIX: Filter out bot messages that appear before the first user message
      const formattedHistory = chatHistories[currentView]
        .filter(msg => msg.text.trim() !== '')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        }))
        .filter((msg, index) => !(index === 0 && msg.role === 'model'));
      const chat = model.startChat({ history: formattedHistory });

      const result = await chat.sendMessage(textToSubmit);
      const aiResponse = result.response.text();

      setChatHistories(prev => ({
        ...prev,
        [currentView]: [...prev[currentView], { sender: 'bot', text: aiResponse }]
      }));
    } catch (error) {
      console.error("Gemini API Error:", error);
      // Optional: Add error message to UI
      setChatHistories(prev => ({
        ...prev,
        [currentView]: [...prev[currentView], { sender: 'bot', text: "Error: Could not reach the server." }]
      }));
    } finally {
      setIsLoading(false);
    }
  }, [currentView, chatHistories]);

  // ... (rest of your functions: deleteChat, renameChat, etc. remain the same)
  const deleteChat = (category) => {
    setChatHistories(prev => ({
      ...prev,
      [category]: [{ sender: 'bot', text: featureWelcomeTexts[category] }]
    }));
  };

  const renameChat = (oldName, newName) => {
    if (!newName || oldName === newName) return;
    setChatHistories(prev => {
      const newState = { ...prev, [newName]: prev[oldName] };
      delete newState[oldName];
      return newState;
    });
    if (currentView === oldName) setCurrentView(newName);
  };

  const toggleSpeechInput = () => setIsRecording(!isRecording);

  const speakResponseAloud = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`~-]/g, ''));
    utterance.lang = speechLanguage;
    window.speechSynthesis.speak(utterance);
  };


  const checkAvailableModels = async () => {
  try {
    const models = await genAI.listModels();
    const modelNames = models.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name);
    
    console.log("Available models for generateContent:", modelNames);
  } catch (error) {
    console.error("Error listing models:", error);
  }
};

// You can call this inside a useEffect to run it once when the app starts
 useEffect(() => { checkAvailableModels(); }, []);

  return (
    <ChatContext.Provider value={{
      currentView, setCurrentView, isRecording, toggleSpeechInput, 
      speechLanguage, setSpeechLanguage, input, setInput,
      messages: chatHistories[currentView] || [],
      sendMessage, speakResponseAloud, deleteChat, renameChat, isLoading
    }}>
      {children}
    </ChatContext.Provider>
  );
};