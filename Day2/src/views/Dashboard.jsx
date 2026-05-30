import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown'; 
import { 
  FaBalanceScale, FaShieldAlt, FaUserShield, FaGavel, 
  FaFileContract, FaLanguage, FaMicrophone, FaPaperPlane, 
  FaSignOutAlt, FaBars, FaTimes, FaCircle, FaRobot, FaUser,
  FaVolumeUp 
} from 'react-icons/fa';
import { MdGavel } from 'react-icons/md';

// 1. UPDATED: Import tools needed to terminate the database session securely
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Verify this path matches your folder layout

export default function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { 
    currentView, 
    setCurrentView, 
    backendStatus, 
    checkBackendHealth,
    isRecording, 
    toggleSpeechInput, 
    speechLanguage, 
    setSpeechLanguage, 
    input, 
    setInput, 
    messages, 
    sendMessage,
    speakResponseAloud 
  } = useChat();

  const features = [
    { name: 'Legal Rights Awareness', icon: <FaBalanceScale /> },
    { name: 'Complaint Filing Guidance', icon: <FaFileContract /> },
    { name: 'Cybercrime Reporting Support', icon: <FaShieldAlt /> },
    { name: 'Consumer Protection Guidance', icon: <MdGavel /> }, 
    { name: 'Domestic Violence Reporting Support', icon: <FaGavel /> },
    { name: 'Legal Documentation Guidance', icon: <FaUserShield /> },
  ];

  useEffect(() => {
    checkBackendHealth();
  }, [checkBackendHealth]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 2. UPDATED: Added real-time asynchronous logout pipeline connection 
    const handleLogout = async () => {
      try {
        await signOut(auth); // Terminate token
        setIsAuthenticated(false); // Update App.jsx
        navigate('/Login'); // Redirect safely
      } catch (error) {
        console.error(error);
      }
    };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="h-screen w-screen flex bg-[#f4f1ea] overflow-hidden font-sans text-slate-800 select-none">
      
      {/* 1. DESKTOP PERMANENT NAVIGATION SIDEBAR */}
      <aside className="hidden md:flex md:w-72 bg-[#0d233a] flex-col text-slate-200 border-r border-slate-800/10 shrink-0">
        <div className="p-6 border-b border-slate-800/40 flex items-center gap-3 bg-slate-950/20">
          <FaBalanceScale className="text-[#00a896] text-2xl" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">JurisAI</h1>
            <p className="text-xs text-slate-400">Multilingual Assistant</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Core Modules</p>
          {features.map((feat) => (
            <button
              key={feat.name}
              onClick={() => setCurrentView(feat.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                currentView === feat.name 
                  ? 'bg-[#00a896] text-white shadow-md shadow-teal-600/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="text-base shrink-0">{feat.icon}</span>
              <span className="truncate">{feat.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/40 bg-slate-950/30 flex flex-col gap-3">
          <div className="flex items-center gap-2 px-3 text-xs">
            <FaCircle className={`text-[9px] ${backendStatus === 'online' ? 'text-emerald-500 animate-pulse' : backendStatus === 'offline' ? 'text-rose-500' : 'text-amber-500'}`} />
            <span className="text-slate-400">API Pipeline: <span className="text-slate-300 font-medium capitalize">{backendStatus}</span></span>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-red-950/30 hover:text-red-400 transition-all rounded-xl text-xs font-medium text-slate-400 border border-slate-700/40">
            <FaSignOutAlt /> Close Portal Session
          </button>
        </div>
      </aside>

      {/* 2. MOBILE RESPONSIVE SLIDE-OUT DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="w-72 bg-[#0d233a] h-full flex flex-col text-slate-200 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FaBalanceScale className="text-[#00a896] text-xl" />
                <span className="font-bold text-white text-lg">JurisAI Modules</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 text-xl p-2"><FaTimes /></button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {features.map((feat) => (
                <button
                  key={feat.name}
                  onClick={() => { setCurrentView(feat.name); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left ${
                    currentView === feat.name ? 'bg-[#00a896] text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base shrink-0">{feat.icon}</span>
                  <span className="truncate">{feat.name}</span>
                </button>
              ))}
            </nav>
            <button onClick={handleLogout} className="mt-auto w-full flex items-center justify-center gap-2 p-3 bg-slate-800 text-red-400 rounded-xl text-xs font-semibold">
              <FaSignOutAlt /> Log Out
            </button>
          </aside>
        </div>
      )}

      {/* 3. PRIMARY CONTENT & CHAT WINDOW CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f7f4eb] relative">
        
        <header className="h-16 bg-[#fdfbf7] border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between shadow-sm shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-200/50 rounded-lg text-xl"><FaBars /></button>
            <h2 className="text-sm md:text-base font-bold text-[#0d233a] truncate">{currentView}</h2>
          </div>
          <div className="flex items-center gap-1.5 bg-[#00a896]/10 border border-[#00a896]/30 px-3 py-1.5 rounded-full text-[#00a896] font-semibold text-xs shadow-sm">
            <FaLanguage className="text-sm" />
            <span className="uppercase font-bold tracking-wider">{speechLanguage.split('-')[0]} / Indian Regional</span>
          </div>
        </header>

        {/* Dynamic Chat Logs Workspace Panel */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#f7f4eb] select-text">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={index} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[78%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs shadow-sm ${isUser ? 'bg-[#0d233a] text-white' : 'bg-[#00a896] text-white'}`}>
                      {isUser ? <FaUser /> : <FaRobot />}
                    </div>

                    {/* Text Message Card Wrapper */}
                    <div className={`rounded-2xl p-4 text-sm shadow-sm leading-relaxed ${
                      isUser 
                        ? 'bg-[#0d233a] text-white rounded-tr-none' 
                        : 'bg-[#fdfbf7] border border-slate-200/60 text-slate-700 rounded-tl-none'
                    }`}>
                      {msg.isTyping ? (
                        <div className="flex space-x-1 py-1 px-1 items-center">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          ) : (
                            <div className="prose prose-sm max-w-none text-slate-700 space-y-1 block-markdown">
                              <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                          )}
                          
                          {/* SPEAKER ICON NODE */}
                          {!isUser && (
                            <button
                              type="button"
                              onClick={() => speakResponseAloud(msg.text)}
                              className="self-start mt-2 flex items-center gap-1.5 text-xs text-[#00a896] hover:text-teal-700 font-semibold transition-colors bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100/60 shadow-sm"
                              title="Listen to this response out loud"
                            >
                              <FaVolumeUp className="text-xs" /> Listen to Response
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* User Interaction Input Box Footer */}
        <footer className="p-4 bg-[#fdfbf7] border-t border-slate-200/60 shrink-0 shadow-inner">
          <form 
            onSubmit={handleFormSubmit}
            className="max-w-3xl mx-auto flex items-center gap-2 bg-slate-100 rounded-2xl border border-slate-200 p-2 focus-within:border-[#00a896] focus-within:bg-white transition-all shadow-sm"
          >
            <select
              value={speechLanguage}
              onChange={(e) => setSpeechLanguage(e.target.value)}
              className="text-xs bg-slate-200/60 text-slate-700 border border-slate-300 rounded-xl p-2 outline-none cursor-pointer font-semibold hover:bg-slate-200 transition-colors"
            >
              <option value="en-IN">English (India)</option>
              <option value="te-IN">తెలుగు (Telugu)</option>
              <option value="hi-IN">हिन्दी (Hindi)</option>
            </select>

            <button 
              type="button" 
              onClick={toggleSpeechInput} 
              className={`p-3 rounded-xl transition-all ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-200' 
                  : 'text-slate-400 hover:text-[#00a896] hover:bg-slate-200/60'
              }`}
              title={isRecording ? "Stop recording..." : "Click to type with your voice"}
            >
              <FaMicrophone className="text-base" />
            </button>
            
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder={isRecording ? "Listening closely... Speak now." : `Ask about ${currentView}...`}
              disabled={isRecording}
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 px-2 disabled:text-slate-400 select-text" 
            />
            
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="p-3 bg-[#00a896] text-white rounded-xl hover:bg-teal-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-md shadow-teal-600/10"
            >
              <FaPaperPlane className="text-xs" />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-2 tracking-wide font-medium">
            JurisAI Project Platform • Designed for IndiaSpan • Simplified Legal Guidance
          </p>
        </footer>

      </main>
    </div>
  );
}