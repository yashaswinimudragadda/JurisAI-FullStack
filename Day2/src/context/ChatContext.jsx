import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const ChatContext = createContext();

// Map explicit welcome text prompts matching your project case study report features
const featureWelcomeTexts = {
  'Legal Rights Awareness': 'Hello! I am JurisAI. Ask me any general legal questions to receive an easy-to-understand breakdown of your constitutional rights.',
  'Complaint Filing Guidance': 'Welcome to the Complaint Filing Guidance module. I can assist you with step-by-step procedures on how to file a police complaint or an official First Information Report (FIR).',
  'Cybercrime Reporting Support': 'Cybercrime Portal active. If you are facing online financial fraud, identity theft, or social harassment, describe it to discover immediate reporting steps.',
  'Consumer Protection Guidance': 'Consumer Protection Portal active. If you bought a defective item or received unfair services, let me help you look up rules for commercial grievances.',
  'Domestic Violence Reporting Support': 'Domestic Violence Support Node. This is a private space. I can guide you through protection orders, contact points, and immediate emergency legal numbers.',
  'Legal Documentation Guidance': 'Welcome to the Documentation Module. I can help simplify complex jargon regarding lease terms, basic affidavits, or notary formats.',
};

export function ChatProvider({ children }) {
  const [currentView, setCurrentView] = useState('Legal Rights Awareness');
  const [backendStatus, setBackendStatus] = useState('offline'); 
  const [input, setInput] = useState('');
  
  // Real voice tracking & multilingual target configuration states
  const [isRecording, setIsRecording] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('en-IN'); 

  const BACKEND_URL = 'http://localhost:5000'; 
  
  // Hardware stream reference tracking to safely halt recording devices
  const recognitionRef = useRef(null);

  // Auto-generate isolated chat bubbles state history map per module
  const [chatHistories, setChatHistories] = useState(
    Object.keys(featureWelcomeTexts).reduce((acc, feature) => {
      acc[feature] = [{ sender: 'bot', text: featureWelcomeTexts[feature] }];
      return acc;
    }, {})
  );

  // Live health check handler mapping to Node.js backend server status
  const checkBackendHealth = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/`, { method: 'GET' });
      return response.ok;
    } catch (err) {
      console.error('Backend health check network failure:', err);
      return false;
    }
  }, []);

  // Asynchronous wrapper pattern eliminating ESLint setState-in-effect errors
  useEffect(() => {
    let isMounted = true;

    const runHealthCheck = async () => {
      const isOnline = await checkBackendHealth();
      if (isMounted) {
        setBackendStatus(isOnline ? 'online' : 'offline');
      }
    };

    runHealthCheck();

    return () => {
      isMounted = false;
    };
  }, [checkBackendHealth]);

  // Fetches chronological conversation logs directly from MongoDB Atlas
  const fetchModuleHistory = useCallback(async (category) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/history/${encodeURIComponent(category)}`);
      if (!response.ok) return;

      const data = await response.json();
      
      // If messages array exists in the database document, map it into the UI history map
      if (data && data.messages && data.messages.length > 0) {
        const parsedMessages = data.messages.map(msg => ({
          sender: msg.sender,
          text: msg.text
        }));

        setChatHistories(prev => ({
          ...prev,
          [category]: [
            { sender: 'bot', text: featureWelcomeTexts[category] }, // Keep standard top greeting context
            ...parsedMessages
          ]
        }));
      }
    } catch (err) {
      console.warn(`Could not sync conversation logs for ${category} from MongoDB Atlas natively:`, err);
    }
  }, []);

  // FIXED: Wrapped inside an isolated function scope to satisfy the eslint(react-hooks/set-state-in-effect) rule
  useEffect(() => {
    const syncHistory = async () => {
      if (backendStatus === 'online') {
        await fetchModuleHistory(currentView);
      }
    };

    syncHistory();
  }, [currentView, backendStatus, fetchModuleHistory]);

  // Sends the user input payload directly to the live API backend route
  const sendMessage = async (textToSubmit) => {
    if (!textToSubmit.trim()) return;

    const activeCategory = currentView;
    const updatedUserLogs = [...chatHistories[activeCategory], { sender: 'user', text: textToSubmit }];
    
    setChatHistories(prev => ({ ...prev, [activeCategory]: updatedUserLogs }));
    setInput('');

    // Append animated placeholder typing indicator block for UI feedback
    setChatHistories(prev => ({
      ...prev,
      [activeCategory]: [...updatedUserLogs, { sender: 'bot', text: '...', isTyping: true }]
    }));

    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/generate-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: textToSubmit, 
          category: activeCategory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get backend server response');
      }

      setChatHistories(prev => ({
        ...prev,
        [activeCategory]: prev[activeCategory].filter(m => !m.isTyping).concat({
          sender: 'bot',
          text: data.text 
        })
      }));

    } catch (err) {
      console.error('Frontend Fetch Error:', err);
      setChatHistories(prev => ({
        ...prev,
        [activeCategory]: prev[activeCategory].filter(m => !m.isTyping).concat({
          sender: 'bot',
          text: 'Connection error. Unable to connect to JurisAI core server routes. Please ensure your backend server is running on port 5000.'
        })
      }));
    }
  };

  // Safe Speech-to-Text handler opening and closing hardware device streams cleanly
  const toggleSpeechInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = speechLanguage; 
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsRecording(false);
    };

    recognition.onresult = (event) => {
      const spokenTranscript = event.results[0][0].transcript;
      setInput(prev => prev ? `${prev} ${spokenTranscript}` : spokenTranscript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // High-Fidelity Multilingual Text-to-Speech Engine
  const speakResponseAloud = (textToSpeak) => {
    if ('speechSynthesis' in window) {
      // Immediately terminate any active audio overlays or queues
      window.speechSynthesis.cancel();

      // Clean up markdown formatting characters before sending text to speech synthesizers
      const cleanText = textToSpeak.replace(/[*#_`~-]/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Sync speaking accent parameters instantly to the selected configuration dropdown
      utterance.lang = speechLanguage; 
      utterance.rate = 0.95; // Custom pacing optimized for clear legal explanations

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Web Speech Synthesis API is not supported in this client environment.");
    }
  };

  return (
    <ChatContext.Provider value={{
      currentView, setCurrentView,
      backendStatus, checkBackendHealth,
      isRecording, toggleSpeechInput, 
      speechLanguage, setSpeechLanguage, 
      input, setInput,
      messages: chatHistories[currentView] || [],
      sendMessage,
      speakResponseAloud 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be wrapped inside a valid ChatProvider component tree.');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { useChat };