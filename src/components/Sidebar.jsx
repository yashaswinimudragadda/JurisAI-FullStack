import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaComments, FaBalanceScale, FaSearch, FaEllipsisV, FaTrash, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { ChatContext } from '../context/ChatContext';

// 1. Added isOpen and setIsOpen to props
export default function Sidebar({ isOpen, setIsOpen }) {
  const { 
    chatHistories, 
    setCurrentView, 
    currentView, 
    createNewSession, 
    deleteChat, 
    renameChat 
  } = useContext(ChatContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => { 
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(null); 
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sessions = Object.keys(chatHistories).map((id) => ({
    id: id,
    title: id.split('_')[0],
    category: id.split('_')[0],
  }));

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSessions = filteredSessions.reduce((acc, session) => {
    (acc[session.category] = acc[session.category] || []).push(session);
    return acc;
  }, {});

  const handleRename = (id) => {
    const newName = prompt("Enter new name:", id.split('_')[0]);
    if (newName) renameChat(id, newName);
    setMenuOpen(null);
  };

  return (
    <>
      {/* 2. Responsive Sidebar Wrapper */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-base border-r border-text-main/20 flex flex-col shadow-xl text-accent/80 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static
      `}>
        {/* Brand Header */}
        <div className="p-4 md:p-6">
          <h1 className="text-lg font-semibold text-text-main flex items-center gap-3 mb-6 tracking-tight">
            <div className="p-2 bg-accent/10 rounded-lg"><FaBalanceScale className="text-accent" /></div> 
            JurisAI
          </h1>
          
          <button 
            onClick={() => { createNewSession('Legal Rights Awareness'); if(window.innerWidth < 1024) setIsOpen(false); }} 
            className="w-full flex items-center justify-center gap-2 bg-text-main text-base py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <FaPlus size={12} /> New Consultation
          </button>

          <div className="relative mt-4">
            <FaSearch className="absolute left-3 top-3 text-text-main/40" size={12} />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-text-main/5 border border-text-main/10 text-text-main text-sm rounded-lg py-2 pl-9 pr-4 outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </div>

        {/* Nav List */}
        <nav className="flex-1 overflow-y-auto px-2 md:px-3 space-y-6">
          {Object.entries(groupedSessions).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-[10px] uppercase font-bold text-text-main/40 px-3 mb-2 tracking-widest">
                {category}
              </h3>
              <div className="space-y-1">
                {items.map((session) => (
                  <div key={session.id} className="group relative flex items-center">
                    <button
                      onClick={() => { setCurrentView(session.id); if(window.innerWidth < 1024) setIsOpen(false); }}
                      className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all truncate ${
                        currentView === session.id 
                          ? 'bg-accent/10 text-accent font-medium border border-accent/20' 
                          : 'text-text-main/60 hover:bg-text-main/5 hover:text-text-main'
                      }`}
                    >
                      <FaComments size={13} />
                      <span className="truncate">{session.title}</span>
                    </button>

                    <button 
                      className="p-2 opacity-0 group-hover:opacity-100 hover:text-text-main"
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === session.id ? null : session.id); }}
                    >
                      <FaEllipsisV size={12} />
                    </button>

                    {menuOpen === session.id && (
                      <div ref={menuRef} className="absolute right-0 top-10 bg-base border border-text-main/20 rounded-lg shadow-lg z-50 w-32 py-1">
                        <button onClick={() => handleRename(session.id)} className="flex w-full items-center gap-2 px-4 py-2 text-xs hover:bg-text-main/5"><FaEdit size={10}/> Rename</button>
                        <button onClick={() => { deleteChat(session.id); setMenuOpen(null); }} className="flex w-full items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-text-main/5"><FaTrash size={10}/> Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-text-main/10">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 text-red-500/80 hover:text-red-500 transition-colors py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-500/10"
          >
            <FaSignOutAlt size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* 3. Mobile Overlay: Closes sidebar when clicking outside on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}