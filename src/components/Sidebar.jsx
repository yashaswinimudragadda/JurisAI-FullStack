import { useState } from 'react';
import { FaPlus, FaComments, FaBalanceScale, FaSearch } from 'react-icons/fa';

export default function Sidebar({ sessions, activeSessionId, onSelectSession, onNewChat }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSessions = filteredSessions.reduce((acc, session) => {
    (acc[session.category] = acc[session.category] || []).push(session);
    return acc;
  }, {});

  return (
    // Removed hardcoded bg, relies on body/parent theme
    <aside className="w-80 h-full border-r border-text-main/20 flex flex-col shadow-xl text-accent/80">
      {/* Brand Header */}
      <div className="p-6">
        <h1 className="text-lg font-semibold text-text-main flex items-center gap-3 mb-8 tracking-tight">
          <div className="p-2 bg-accent/10 rounded-lg">
            <FaBalanceScale className="text-accent" />
          </div> 
          JurisAI
        </h1>
        
        {/* Action Button */}
        <button 
          onClick={onNewChat} 
          // Uses bg-text-main to contrast against bg-base
          className="w-full flex items-center justify-center gap-2 bg-text-main text-base py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <FaPlus size={12} /> New Consultation
        </button>

        {/* Search */}
        <div className="relative mt-6">
          <FaSearch className="absolute left-3 top-3 text-text-main/40" size={12} />
          <input
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // bg-text-main/5 ensures a subtle contrast in both modes
            className="w-full bg-text-main/5 border border-text-main/10 text-text-main text-sm rounded-lg py-2 pl-9 pr-4 outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-8">
        {Object.entries(groupedSessions).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-[10px] uppercase font-bold text-text-main/40 px-3 mb-2 tracking-widest">
              {category}
            </h3>
            <div className="space-y-0.5">
              {items.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all truncate ${
                    activeSessionId === session.id 
                      ? 'bg-accent/10 text-accent font-medium border border-accent/20' 
                      // Here: text-text-main/60 serves as the light accent/secondary shade
                      : 'text-text-main/60 hover:bg-text-main/5 hover:text-text-main'
                  }`}
                >
                  <FaComments size={13} />
                  <span className="truncate">{session.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}