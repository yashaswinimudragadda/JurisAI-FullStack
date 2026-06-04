import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatRoom from '../components/ChatRoom';
import DashboardHome from '../components/DashboardHome';
import { useChat } from '../hooks/useChat';

export default function Dashboard() {
  const [view, setView] = useState('home');
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  
  // NEW: State to control sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chatProps = useChat();

  const handleSelectCategory = (category) => {
    const newSession = { 
        id: Date.now(), 
        title: category, 
        messages: [] 
    };
    setSessions([newSession, ...sessions]);
    setActiveSession(newSession);
    setView('chat');
  };

  return (
    <div className="h-screen w-screen flex font-sans overflow-hidden">
      
      {view === 'chat' && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          sessions={sessions} 
          activeSessionId={activeSession?.id} 
          onSelectSession={(id) => {
            setActiveSession(sessions.find(s => s.id === id));
          }}
          onNewChat={() => setView('home')}
        />
      )}

      {view === 'home' ? (
        <DashboardHome onSelectCategory={handleSelectCategory} />
      ) : (
        <ChatRoom 
          activeSession={activeSession} 
          {...chatProps} 
          // Pass the toggle function to the ChatRoom header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          sendMessage={(msg) => chatProps.sendMessage(msg, activeSession.messages, (newMessages) => {
            setActiveSession(prev => ({ ...prev, messages: newMessages }));
          })}
        />
      )}
    </div>
  );
}