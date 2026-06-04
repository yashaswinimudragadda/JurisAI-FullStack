import { FaGavel, FaLock, FaShoppingCart, FaHandHoldingHeart, FaFileAlt, FaShieldAlt } from 'react-icons/fa';

const iconMap = {
  'Legal Rights Awareness': FaGavel,
  'Complaint Filing Guidance': FaFileAlt,
  'Cybercrime Reporting Support': FaLock,
  'Consumer Protection Guidance': FaShoppingCart,
  'Domestic Violence Reporting Support': FaHandHoldingHeart,
  'Legal Documentation Guidance': FaShieldAlt
};

export default function DashboardHome({ onSelectCategory }) {
  return (
    // Removed 'bg-base' and 'min-h-screen' to rely on parent/body inheritance
    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          {/* Changed text-white to text-text-main and font-serif from index.css */}
          <h1 className="text-4xl font-serif font-bold text-accent mb-2">Welcome to JurisAI</h1>
          <p className="text-text-main/60">Select a legal service to begin your consultation.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(iconMap).map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => onSelectCategory(name)}
              // Updated background to bg-text-main/5 (translucent tint)
              // Updated border to be visible against both light/dark backgrounds
              className="group p-8 bg-text-main/5 border border-text-main/10 rounded-2xl text-left hover:border-accent transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-text-main mb-2 group-hover:text-accent transition-colors">
                {name}
              </h3>
              <p className="text-sm text-text-main/60 leading-relaxed">
                Get professional guidance and support regarding {name.toLowerCase().replace(' guidance', '').replace(' support', '')}.
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}