import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function Dropdown({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[10px] font-bold text-accent uppercase tracking-wider py-2 px-2 hover:text-text-main transition-colors outline-none"
      >
        {selectedOption?.label.substring(0, 3)}
        <FaChevronDown size={8} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-24 bg-base border border-text-main/10 rounded-lg shadow-2xl py-1 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-[10px] uppercase font-bold transition-colors ${
                value === opt.value 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-text-main/60 hover:bg-text-main/5 hover:text-text-main'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}