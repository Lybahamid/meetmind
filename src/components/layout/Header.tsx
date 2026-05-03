/**
 * @file Header.tsx
 * @description Primary navigation and brand identity component.
 */

import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface HeaderProps {
  activeTab: 'input' | 'results' | 'chat';
  setActiveTab: (tab: 'input' | 'results' | 'chat') => void;
  hasAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, hasAnalysis }) => {
  return (
    <header className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10 mb-8">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-2.5 rounded-full shadow-lg shadow-blue-500/20">
          <BrainCircuit className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-light tracking-widest uppercase">
          MeetMind <span className="text-blue-500">•</span> 
          <span className="text-white/40 text-lg normal-case italic font-serif ml-3">Intelligence Layer</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-2 py-1.5 rounded-full backdrop-blur-md">
        {(['input', 'results', 'chat'] as const).map((tab) => (
          <button 
            key={tab}
            disabled={tab !== 'input' && !hasAnalysis}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all disabled:opacity-20
              ${activeTab === tab ? 'bg-white text-black' : 'text-white/60 hover:text-white'}
            `}
          >
            {tab === 'results' ? 'Dashboard' : tab}
          </button>
        ))}
      </div>
    </header>
  );
};
