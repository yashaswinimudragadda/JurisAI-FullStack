import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaVolumeUp, FaMicrophone, FaFilePdf, FaPlus, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { exportChatToPDF } from '../utils/pdfExport';
import Dropdown from './Dropdown';

export default function ChatRoom({ 
  activeSession, sendMessage, input, setInput, isRecording, 
  toggleSpeechInput, speechLanguage, setSpeechLanguage, speakResponseAloud,
  messages, isLoading // Ensure these are passed from the parent/hook
}) {
  const languageOptions = [
    { label: 'English', value: 'en-IN' },
    { label: 'Telugu', value: 'te-IN' },
    { label: 'Hindi', value: 'hi-IN' }
  ];
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Track messages from context

  const _handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) console.log("Document selected:", file.name);
  };

  return (
    <main className="flex-1 flex flex-col h-full transition-colors duration-300">
      
      {/* Professional Header */}
      <header className="h-16 px-8 flex items-center border-b border-text-main/10 bg-base/80 backdrop-blur-md justify-between sticky top-0 z-10">
        <h2 className="text-sm font-semibold text-text-main tracking-wide">
          {activeSession?.title || 'New Consultation'}
        </h2>
        <button 
          onClick={() => exportChatToPDF('chat-container')} 
          className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 rounded bg-text-main/5 text-text-main/60 hover:text-text-main hover:bg-text-main/10 transition-all"
        >
          <FaFilePdf size={12} /> Export
        </button>
      </header>

      {/* Chat Area */}
      <div id="chat-container" className="flex-1 overflow-y-auto p-8 space-y-8">
        {messages.map((msg, index) => (
          <div key={index} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-xl px-5 py-4 ${
              msg.sender === 'user' 
                ? 'bg-accent text-white font-medium' 
                : 'bg-text-main/5 border border-text-main/10 text-text-main'
            }`}>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {msg.text || ''}
                </ReactMarkdown>
              </div>              
              {/* Show typing/loading indicator if streaming bot response */}
              {isLoading && index === messages.length - 1 && msg.sender === 'bot' && msg.text === '' && (
                <div className="flex items-center gap-2 text-accent animate-pulse">
                  <FaSpinner className="animate-spin" /> Thinking...
                </div>
              )}

              {msg.sender !== 'user' && msg.text !== '' && (
                <button 
                  onClick={() => speakResponseAloud(msg.text)} 
                  className="mt-4 text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent/80 flex items-center gap-2"
                >
                  <FaVolumeUp /> Listen
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Enterprise Input Footer */}
      <div className="p-6 bg-base">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-text-main/5 border border-text-main/10 rounded-xl p-2 shadow-xl focus-within:border-accent/50 transition-colors">
          <button onClick={() => fileInputRef.current.click()} className="p-3 text-text-main/50 hover:text-text-main transition-colors">
            <FaPlus />
          </button>
          
          <input type="file" ref={fileInputRef} className="hidden" onChange={_handleFileChange} accept=".pdf, .doc, .docx" />
          <Dropdown value={speechLanguage} onChange={setSpeechLanguage} options={languageOptions} />

          <button 
            onClick={toggleSpeechInput} 
            className={`p-3 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-text-main/50 hover:text-text-main'}`}
          >
            <FaMicrophone />
          </button>

          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
            className="flex-1 bg-transparent outline-none p-2 text-sm text-text-main placeholder:text-text-main/30" 
            placeholder={isLoading ? "JurisAI is responding..." : "Type your legal inquiry..."}
            disabled={isLoading}
          />
          
          <button 
            onClick={() => sendMessage(input)} 
            disabled={isLoading || !input.trim()}
            className="p-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane size={14} />}
          </button>
        </div>
      </div>
    </main>
  );
}