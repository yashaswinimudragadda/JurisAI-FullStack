import { useNavigate } from 'react-router-dom';
import { FaBalanceScale, FaShieldAlt, FaRobot, FaArrowRight, FaGlobe, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../hooks/useTheme';

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
// Your code stays clean and readable!
<div className="min-h-screen bg-base text-text-main selection:bg-accent/30 font-sans transition-colors duration-300">
  
  {/* The cards will now swap colors automatically because they use bg-text-main/5 */}
  <div className="p-8 rounded-3xl bg-text-main/5 border border-text-main/5 hover:border-accent/50 transition-all">      {/* Background Glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-125 h-125 bg-accent/10 blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-accent text-3xl"><FaBalanceScale /></div>
          <span className="text-2xl font-bold tracking-tighter">JURIS<span className="text-accent">AI</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full border border-text-main/10 hover:bg-text-main/5 transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-accent" />}
          </button>

          <button onClick={() => navigate('/Login')} className="px-6 py-2 rounded-full border border-text-main/10 hover:bg-text-main/5 transition-all text-sm font-medium">
            Portal Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-16 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold tracking-wide uppercase">
          Empowering Access to Justice
        </div>
        
        <h1 className="font-serif text-5xl  md:text-7xl font-bold mb-8 leading-[1.1]">
          Multilingual Legal Guidance <br /> 
          <span className="text-accent">Powered by Intelligence</span>
        </h1>
        
        <p className="text-lg text-text-main/60 mb-12 max-w-2xl mx-auto">
          JurisAI bridges the gap for underserved communities by simplifying complex legal procedures through AI-driven multilingual support, ensuring equal access for every citizen.
        </p>

        <button onClick={() => navigate('/Login')} className="bg-accent hover:bg-violet-700 text-white px-10 py-4 rounded-xl font-bold transition-all flex items-center gap-3 mx-auto shadow-lg hover:scale-105">
          Access Legal Assistant <FaArrowRight />
        </button>

        {/* Impact-Driven Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 text-left">
          {[
            { icon: FaGlobe, title: "Multilingual Support", desc: "Breaking language barriers to provide legal awareness in local dialects." },
            { icon: FaRobot, title: "AI-Powered Guidance", desc: "Simplifying legal terminology and procedures through conversational AI." },
            { icon: FaShieldAlt, title: "Social Empowerment", desc: "Supporting consumer protection, cybercrime reporting, and rights awareness." }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-text-main/5 border border-text-main/5 hover:border-accent/50 transition-all">
              <div className="text-accent text-2xl mb-4"><item.icon /></div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-text-main/50 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-12 text-text-main/30 text-xs">
        © {new Date().getFullYear()} JurisAI Suite • IndiaSpan Training Initiative
      </footer>
    </div>
    </div>
  );
}