import { useNavigate } from 'react-router-dom';
// CHANGED: Replaced FaSearchLegal with FaSearch, which is a valid export
import { FaBalanceScale, FaShieldAlt, FaRobot, FaArrowRight, FaSearch, FaRegFileAlt } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col justify-between relative overflow-hidden font-sans text-slate-800 selection:bg-[#00a896]/20">
      
      {/* Background Decorative Ambient Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-[#0d233a]/5 blur-[60px] sm:blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-[#00a896]/10 blur-[60px] sm:blur-[100px] pointer-events-none z-0" />

      {/* Top Navigation Header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="text-[#00a896] text-xl sm:text-2xl">
            <FaBalanceScale />
          </div>
          <span className="text-lg sm:text-xl font-black text-[#0d233a] tracking-wide">JurisAI</span>
        </div>
        <button 
          onClick={() => navigate('/Login')}
          className="bg-[#0d233a] hover:bg-slate-800 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
        >
          Portal Login
        </button>
      </header>

      {/* Main Hero Showcase Container */}
      <main className="flex-1 flex flex-col justify-center items-center max-w-5xl mx-auto text-center px-4 sm:px-6 z-10 my-8 sm:my-12 md:my-16 relative">
        
        {/* Decorative Badge Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-150 text-[#00a896] text-[11px] sm:text-xs font-semibold mb-6 shadow-sm select-none">
          <FaRobot className="text-xs sm:text-sm animate-pulse" /> Advanced AI Legal Consulting Workspace
        </div>
        
        {/* Headlining Title Block */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#0d233a] tracking-tight leading-tight max-w-3xl">
          Automate, Analyze, and <span className="text-[#00a896]">Simplify</span> Your Legal Workflows
        </h1>
        
        {/* Explanatory Subtext Description */}
        <p className="mt-4 sm:mt-6 text-slate-500 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed px-2 sm:px-0">
          Empowering enterprise teams and legal advisors with specialized computational intelligence. Instantly cross-reference compliance frameworks, analyze complex legal documents, and generate case summaries through conversational AI.
        </p>

        {/* Primary Click Action Button */}
        <div className="mt-8 sm:mt-10 w-full sm:w-auto px-4 sm:px-0">
          <button 
            onClick={() => navigate('/Login')}
            className="w-full sm:w-auto bg-[#00a896] hover:bg-teal-600 text-white font-semibold px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl transition-all duration-200 shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 text-sm select-none active:scale-95 group"
          >
            Enter Workspace Portal 
            <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-12 sm:mt-16 text-left w-full max-w-3xl px-2 sm:px-0">
          
          {/* Card 1: AI Analytical Capabilities */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-[#00a896] text-xl p-3 bg-teal-50 rounded-xl mt-0.5 shrink-0">
              {/* CHANGED: Swapped for FaSearch */}
              <FaSearch />
            </div>
            <div>
              <h3 className="font-bold text-[#0d233a] text-sm sm:text-base">Intelligent Jurisprudence Lookup</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Seamlessly interact with models fine-tuned to extract reference precedents, identify structural compliance vulnerabilities, and clarify complex statutory interpretations.
              </p>
            </div>
          </div>

          {/* Card 2: Legal Document Structuring */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-[#00a896] text-xl p-3 bg-teal-50 rounded-xl mt-0.5 shrink-0">
              <FaRegFileAlt />
            </div>
            <div>
              <h3 className="font-bold text-[#0d233a] text-sm sm:text-base">Document Analysis Suite</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Upload context contracts or briefing histories to automatically distill high-density case notes, locate hidden clauses, and format legal outlines within seconds.
              </p>
            </div>
          </div>

          {/* Card 3: Secure Identity Handling */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-[#00a896] text-xl p-3 bg-teal-50 rounded-xl mt-0.5 shrink-0">
              <FaShieldAlt />
            </div>
            <div>
              <h3 className="font-bold text-[#0d233a] text-sm sm:text-base">Enterprise Cryptographic Security</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Protected by industrial-grade parameters. Project workflows use sandboxed Firebase identity platforms, ensuring database tokens remain strictly bound to authorized assistants.
              </p>
            </div>
          </div>

          {/* Card 4: Compliance Alignment */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-[#00a896] text-xl p-3 bg-teal-50 rounded-xl mt-0.5 shrink-0">
              <FaBalanceScale />
            </div>
            <div>
              <h3 className="font-bold text-[#0d233a] text-sm sm:text-base">Training & Compliance Matrix</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Engineered specifically for corporate simulation protocols, aligning user evaluation matrices with the precise operational rules outlined in the IndiaSpan training curriculum.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Branding Area */}
      <footer className="w-full text-center py-4 sm:py-6 border-t border-slate-200/60 text-[10px] sm:text-[11px] text-slate-400 tracking-wide font-medium z-10 relative px-4">
        IndiaSpan Corporate Training Sandbox Module • © {new Date().getFullYear()} JurisAI Suite
      </footer>
    </div>
  );
}