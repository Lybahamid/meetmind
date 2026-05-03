/**
 * @file ChatPanel.tsx
 * @description Real-time Q&A interface for transcript interrogation.
 */

import React from 'react';
import { BrainCircuit, Mail, Loader2 } from 'lucide-react';
import { ChatMessage } from '../../types/meeting';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  onSendMessage: (q: string) => void;
  isLoading: boolean;
  followUpEmail: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  chatHistory,
  onSendMessage,
  isLoading,
  followUpEmail
}) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = () => {
    if (!query.trim()) return;
    onSendMessage(query);
    setQuery('');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[700px]">
      <div className="flex-1 bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold">Inference Engine</h3>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(followUpEmail)}
            className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
          >
            <Mail className="w-3 h-3" /> Copy Email Summary
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-10 scroll-smooth">
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <BrainCircuit className="w-16 h-16 mb-6 text-blue-400/20" />
              <p className="font-serif italic text-2xl">Interrogate the transcript for nuanced context.</p>
            </div>
          )}

          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-3xl rounded-tr-none px-6 py-4' 
                  : 'bg-white/5 text-white/80 rounded-3xl rounded-tl-none border border-white/10 px-8 py-6 font-serif italic text-lg leading-relaxed'
              }`}>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 px-6 py-4 rounded-3xl border border-white/10">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-black/40 border-t border-white/5">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Ask the intelligence layer about specific interactions..."
              className="w-full bg-[#050505] border border-white/10 rounded-full py-5 pl-10 pr-40 text-sm focus:border-blue-500/30 outline-none transition-all placeholder:text-white/10"
            />
            <div className="absolute right-3">
               <button 
                 onClick={handleSubmit}
                 className="bg-blue-600 text-white px-8 py-2.5 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
               >
                 Synthesize
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
