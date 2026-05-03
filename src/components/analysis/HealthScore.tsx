/**
 * @file HealthScore.tsx
 * @description Visualizes meeting productivity and processing analytics.
 */

import React from 'react';
import { motion } from 'motion/react';
import { MeetingAnalysis } from '../../types/meeting';

interface HealthScoreProps {
  analysis: MeetingAnalysis;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ analysis }) => {
  const getThemeColor = (score: number) => {
    if (score >= 8) return 'emerald';
    if (score >= 5) return 'amber';
    return 'rose';
  };

  const theme = getThemeColor(analysis.meeting_health_score);

  return (
    <div className="bg-[#111] border border-white/10 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
      <div className={`absolute top-0 left-0 w-1 h-full bg-${theme}-500 shadow-[2px_0_10px_rgba(0,0,0,0.5)]`}></div>
      
      <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6 font-bold">Meeting Health</h3>
      
      <div className="flex items-end gap-6 mb-6">
        <span className="text-7xl font-light tracking-tighter">{analysis.meeting_health_score}</span>
        <div className="mb-2">
          <p className={`text-sm font-bold uppercase tracking-widest text-${theme}-500`}>
            {theme === 'emerald' ? 'Exceptional' : theme === 'amber' ? 'Productive' : 'Controversial'}
          </p>
          <p className="text-white/40 text-[10px] leading-tight font-medium mt-1 uppercase tracking-wider italic font-serif">
            Productivity Index
          </p>
        </div>
      </div>

      <p className="text-sm text-white/60 leading-relaxed font-serif italic border-t border-white/5 pt-6 mb-4">
        "{analysis.health_reasoning}"
      </p>

      {/* Portfolio Value: Performance Analytics */}
      {analysis.analytics && (
        <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-white/20">Latency</span>
            <span className="text-[10px] font-mono text-blue-400">{(analysis.analytics.processingTimeMs / 1000).toFixed(2)}s</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-white/20">Volume</span>
            <span className="text-[10px] font-mono text-white/60">{analysis.analytics.wordCount} words</span>
          </div>
        </div>
      )}
    </div>
  );
};
