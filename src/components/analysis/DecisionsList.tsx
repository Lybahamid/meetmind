/**
 * @file DecisionsList.tsx
 * @description Renders a prioritized list of meeting outcomes.
 */

import React from 'react';
import { Decision } from '../../types/meeting';

interface DecisionsListProps {
  decisions: Decision[];
}

export const DecisionsList: React.FC<DecisionsListProps> = ({ decisions }) => {
  return (
    <div className="bg-[#111] border border-white/10 p-8 rounded-2xl flex-1 shadow-xl">
      <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6 font-bold">Key Decisions</h3>
      <ul className="space-y-6">
        {decisions.map((decision, idx) => (
          <li key={idx} className="flex gap-4 items-start group">
            <span className="text-blue-500 font-serif italic text-2xl leading-none opacity-80">
              0{idx + 1}.
            </span>
            <p className="text-sm text-white/80 leading-relaxed font-medium group-hover:text-white transition-colors">
              {decision.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
