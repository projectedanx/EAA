
import React, { useState, useRef, useEffect } from 'react';
import { CognitiveMode } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface HeaderProps {
  cognitiveMode: CognitiveMode;
  setCognitiveMode: (mode: CognitiveMode) => void;
}

const Header: React.FC<HeaderProps> = ({ cognitiveMode, setCognitiveMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleModeChange = (mode: CognitiveMode) => {
        setCognitiveMode(mode);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

  return (
    <header className="bg-slate-800/50 border-b border-slate-700/50 p-4 flex justify-between items-center flex-shrink-0">
      <h2 className="text-lg font-semibold text-white">Epistemic Audit System</h2>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-64 bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-sm text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <span>{cognitiveMode}</span>
          <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-10">
                <ul>
                    {Object.values(CognitiveMode).map(mode => (
                         <li key={mode}>
                            <button
                                onClick={() => handleModeChange(mode)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600"
                            >
                                {mode}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;
