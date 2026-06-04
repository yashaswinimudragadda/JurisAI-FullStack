import { useState, useCallback } from 'react';
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

  // --- UPDATED SPEECH-TO-TEXT LOGIC ---
  const toggleSpeechInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = speechLanguage;
    recognition.continuous = false;
    recognition.interimResults = false;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Append the recognized text to your existing input state
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => setIsRecording(false);
    }
  }, [isRecording, speechLanguage, setInput]);

  const speakResponseAloud = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`~-]/g, ''));
    utterance.lang = speechLanguage;
    window.speechSynthesis.speak(utterance);
  };

  // --- KEEP YOUR EXISTING sendMessage, createNewSession, deleteChat, renameChat ---
  const createNewSession = (category) => {
    const newId = `${category}_${Date.now()}`;
    setChatHistories(prev => ({
      ...prev,
      [newId]: [{ sender: 'bot', text: featureWelcomeTexts[category] || 'How can I assist you?' }]
    }));
    setCurrentView(newId);
    setInput('');
  };

  const sendMessage = useCallback(async (textToSubmit) => {
    if (!textToSubmit.trim()) return;
    const userMsg = { sender: 'user', text: textToSubmit };
    setChatHistories(prev => ({ ...prev, [currentView]: [...(prev[currentView] || []), userMsg] }));
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        systemInstruction: `You are JurisAI, a helpful legal assistant specializing in ${currentView.split('_')[0]}.`
      });
      const result = await model.generateContent(textToSubmit);
      setChatHistories(prev => ({ ...prev, [currentView]: [...(prev[currentView] || []), { sender: 'bot', text: result.response.text() }] }));
    } catch (error) {
      console.error("Gemini API Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentView]);

  const deleteChat = (category) => {
    setChatHistories(prev => {
      const newState = { ...prev };
      delete newState[category];
      return newState;
    });
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

  return (
    <ChatContext.Provider value={{
      currentView, setCurrentView, isRecording, toggleSpeechInput, 
      speechLanguage, setSpeechLanguage, input, setInput,
      messages: chatHistories[currentView] || [],
      sendMessage, speakResponseAloud, deleteChat, renameChat, isLoading,
      createNewSession, chatHistories
    }}>
      {children}
    </ChatContext.Provider>
  );
};