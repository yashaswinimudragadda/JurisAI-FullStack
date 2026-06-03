import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatRoom from '../components/ChatRoom';
import DashboardHome from '../components/DashboardHome';
import { useChat } from '../hooks/useChat';

export default function Dashboard() {
  const [view, setView] = useState('home');
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

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
    // Removed 'bg-base'. The body tag (via index.css) now handles the background
    // and text colors globally, ensuring a smooth transition when .dark is toggled.
    <div className="h-screen w-screen flex font-sans">
      
      {view === 'chat' && (
        <Sidebar 
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
  // Pass a custom handler to update the session state
  sendMessage={(msg) => chatProps.sendMessage(msg, activeSession.messages, (newMessages) => {
    setActiveSession(prev => ({ ...prev, messages: newMessages }));
  })}
/>
      )}
    </div>
  );
}