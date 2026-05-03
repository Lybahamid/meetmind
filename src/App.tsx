/**
 * @file App.tsx
 * @description Main application orchestrator for MeetMind.
 * Refactored to demonstrate modular React architecture and custom hooks.
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';

// Modules
import { useMeetingIntelligence } from './hooks/useMeetingIntelligence';
import { Header } from './components/layout/Header';
import { HealthScore } from './components/analysis/HealthScore';
import { DecisionsList } from './components/analysis/DecisionsList';
import { TranscriptInput } from './components/input/TranscriptInput';
import { ChatPanel } from './components/chat/ChatPanel';
import { ActionItem } from './types/meeting';

const SAMPLE_TRANSCRIPT = `
Sarah: Okay everyone, let's get the quarterly planning meeting started. Ben, can you start with the engineering update?
Ben: Sure. We've completed the core architecture for the new API. We're on track to start beta testing by the 15th of next month. However, we're still waiting on the security audit details from the devops team.
Jessica: I've already reached out to the external auditors. They said we should have the report by Friday.
Sarah: Good. So, decision made: we will proceed with the internal security review in parallel starting tomorrow to save time.
Ben: That works. I'll assign Mark to lead that review.
Sarah: Great. Now, for the marketing campaign. Jessica?
Jessica: We're launching the "Summer Social" campaign on June 1st. I need the final design assets by May 20th. Sarah, can you approve the budget for the influencer outreach?
Sarah: Approved. Let's keep it under $5k for the first month.
Jessica: Perfect. I'll have the contract ready for them by Thursday.
Sarah: Anything else?
Ben: We need to decide on the pricing tier for the new enterprise plan.
Sarah: Let's table that for next Tuesday when the CFO is back.
Sarah: To summarize: Ben is internalizing the security review starting tomorrow. Jessica is finalizing the marketing contracts by Thursday and needs designs by May 20th. And I've approved the $5k influencer budget. Our next sync is Friday morning.
`;

export default function App() {
  const { 
    analysis, 
    chatHistory, 
    isLoading, 
    error, 
    analyze, 
    askQuestion 
  } = useMeetingIntelligence();

  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'chat'>('input');
  const [localTranscript, setLocalTranscript] = useState('');
  const [fileSelected, setFileSelected] = useState<string | null>(null);

  const handleAnalyze = async () => {
    const result = await analyze(localTranscript);
    if (result) setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans selection:bg-blue-500/30 flex flex-col">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasAnalysis={!!analysis} 
      />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 flex-1 w-full pb-20">
        {error && (
          <div className="mb-8 bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl flex gap-3 text-rose-400 text-xs tracking-wider animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 1: INGESTION */}
          {activeTab === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-5xl font-light tracking-tighter mb-4 italic">Turn dialogue into data.</h2>
                <p className="text-white/30 text-lg font-serif">A modular intelligence layer for organizational memory.</p>
              </div>

              <TranscriptInput 
                transcript={localTranscript}
                setTranscript={setLocalTranscript}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                sampleTranscript={SAMPLE_TRANSCRIPT}
                fileSelected={fileSelected}
                setFileSelected={setFileSelected}
              />
            </motion.div>
          )}

          {/* STEP 2: INTELLIGENCE DASHBOARD */}
          {activeTab === 'results' && analysis && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-12 gap-8"
            >
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                <HealthScore analysis={analysis} />
                <DecisionsList decisions={analysis.decisions} />
              </div>

              <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                <div className="bg-[#111] border border-white/10 p-10 rounded-2xl shadow-2xl">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6 font-bold">Executive Summary</h3>
                  <p className="text-3xl font-serif italic text-white/90 leading-tight">
                    "{analysis.summary}"
                  </p>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col">
                  <div className="bg-white/5 border-b border-white/10 px-8 py-5">
                    <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold">Active Assignments</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                        <tr>
                          <th className="px-8 py-5">Objective</th>
                          <th className="px-8 py-5">Ownership</th>
                          <th className="px-8 py-5">Target</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-white/70 divide-y divide-white/5">
                        {analysis.action_items.map((item: ActionItem, idx: number) => (
                          <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-8 py-6 text-white/90 font-medium">{item.task}</td>
                            <td className="px-8 py-6">
                              <span className="bg-blue-500/10 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/10">
                                {item.owner || "PENDING"}
                              </span>
                            </td>
                            <td className="px-8 py-6 font-mono text-[11px] text-white/30 italic">
                              {item.deadline || "TBD"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: TRANSCRIPT INTERROGATION */}
          {activeTab === 'chat' && analysis && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ChatPanel 
                chatHistory={chatHistory}
                onSendMessage={askQuestion}
                isLoading={isLoading}
                followUpEmail={analysis.follow_up_email}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-white/5 opacity-20 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">MeetMind Intelligence</span>
            <span className="text-blue-500">•</span>
            <span className="text-[10px] uppercase tracking-widest italic font-serif">Portfolio Refactor</span>
          </div>
          <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.2em]">
            <span className="text-white">v2.0.0 Global Intelligence</span>
            <span>Refactored Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
