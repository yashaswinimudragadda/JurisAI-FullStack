import { useEffect, useRef, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaVolumeUp, FaMicrophone, FaFilePdf, FaPlus, FaPaperPlane, FaSpinner, FaBars } from 'react-icons/fa'; 
import { exportChatToPDF } from '../utils/pdfExport';
import Dropdown from './Dropdown';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatContext } from '../context/ChatContext';

export default function ChatRoom({ activeSession, toggleSidebar }) {
  const { 
    sendMessage, input, setInput, isRecording, 
    toggleSpeechInput, speechLanguage, setSpeechLanguage, 
    speakResponseAloud, messages, isLoading 
  } = useContext(ChatContext);

  const languageOptions = [
    { label: 'English', value: 'en-IN' },
    { label: 'Telugu', value: 'te-IN' },
    { label: 'Hindi', value: 'hi-IN' }
  ];
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="flex-1 flex flex-col h-full bg-base transition-colors duration-300 w-full overflow-hidden">
      {/* Header - Optimized for 320px width */}
      <header className="h-14 px-3 flex items-center border-b border-text-main/10 bg-base/80 backdrop-blur-md justify-between shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-text-main/70">
            <FaBars size={18} />
          </button>
          <h2 className="text-xs font-semibold text-text-main truncate">
            {activeSession?.title || 'New Consultation'}
          </h2>
        </div>
        <button onClick={() => exportChatToPDF('chat-container')} className="px-2 py-1 text-[10px] uppercase font-bold flex items-center gap-1 rounded bg-text-main/5 text-text-main/60">
          <FaFilePdf size={10} /> <span className="hidden md:inline">Export</span>
        </button>
      </header>

      {/* Chat Area - Optimized padding for small screens */}
      <div id="chat-container" className="flex-1 overflow-y-auto p-3 md:p-8 space-y-4 md:space-y-6">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[92%] md:max-w-[70%] rounded-lg md:rounded-xl px-3 py-2 md:px-5 md:py-4 text-sm ${msg.sender === 'user' ? 'bg-accent text-white font-medium' : 'bg-text-main/5 border border-text-main/10 text-text-main'}`}>
                <div className="prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown>{msg.text || ''}</ReactMarkdown></div>
                {msg.sender !== 'user' && msg.text !== '' && (
                  <button onClick={() => speakResponseAloud(msg.text)} className="mt-2 md:mt-3 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent/80 flex items-center gap-1 md:gap-2">
                    <FaVolumeUp size={10} /> Listen
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-accent animate-pulse px-2 text-xs"><FaSpinner className="animate-spin" /> JurisAI is thinking...</motion.div>}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area - Compact for small keyboards */}
      <div className="p-2 md:p-6 bg-base border-t border-text-main/5 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-1 md:gap-2 bg-text-main/5 border border-text-main/10 rounded-lg md:rounded-xl p-1 md:p-2 shadow-lg focus-within:border-accent/50 transition-colors">
          <button onClick={() => fileInputRef.current.click()} className="p-2 text-text-main/50 hover:text-text-main"><FaPlus size={14} /></button>
          <input type="file" ref={fileInputRef} className="hidden" accept=".pdf, .doc, .docx" />
          <div className="hidden md:block"><Dropdown value={speechLanguage} onChange={setSpeechLanguage} options={languageOptions} /></div>
          <button onClick={toggleSpeechInput} className={`p-2 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-text-main/50 hover:text-text-main'}`}><FaMicrophone size={14} /></button>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)} className="flex-1 bg-transparent outline-none p-1 md:p-2 text-xs md:text-sm text-text-main placeholder:text-text-main/30" placeholder="Ask..." disabled={isLoading} />
          <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()} className="p-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-all disabled:opacity-50">
            {isLoading ? <FaSpinner size={14} className="animate-spin" /> : <FaPaperPlane size={14} />}
          </button>
        </div>
      </div>
    </main>
  );
}