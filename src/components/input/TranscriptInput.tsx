/**
 * @file TranscriptInput.tsx
 * @description Ingestion component for raw meeting data.
 */

import React from 'react';
import { FileText, FileUp, X, CheckCircle2 } from 'lucide-react';

interface TranscriptInputProps {
  transcript: string;
  setTranscript: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  sampleTranscript: string;
  fileSelected: string | null;
  setFileSelected: (val: string | null) => void;
}

export const TranscriptInput: React.FC<TranscriptInputProps> = ({
  transcript,
  setTranscript,
  onAnalyze,
  isLoading,
  sampleTranscript,
  fileSelected,
  setFileSelected
}) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setTranscript(e.target?.result as string);
      reader.readAsText(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Transcript Stream
          </h3>
          <button 
            onClick={() => setTranscript(sampleTranscript)}
            className="text-[10px] uppercase font-black tracking-widest text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/20 px-3 py-1.5 rounded-full"
          >
            Load Demo
          </button>
        </div>
        <textarea 
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Input Raw Transcript Metadata..."
          className="w-full h-[500px] bg-black/40 text-white/90 border border-white/5 rounded-xl p-6 focus:border-blue-500/40 outline-none transition-all resize-none font-mono text-sm leading-relaxed"
        />
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#111] border border-white/10 p-8 rounded-2xl bg-gradient-to-br from-[#111] to-[#0a0a0a]">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold mb-6 flex items-center gap-2">
            <FileUp className="w-4 h-4 text-blue-500" />
            Source Ingestion
          </h3>
          <div 
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${fileSelected ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5 hover:border-white/20'}`}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input id="file-input" type="file" accept=".txt" className="hidden" onChange={handleFileUpload} />
            {fileSelected ? (
              <>
                <CheckCircle2 className="w-10 h-10 text-blue-500 mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <p className="text-sm font-medium text-white truncate w-full px-4">{fileSelected}</p>
                <button onClick={(e) => { e.stopPropagation(); setFileSelected(null); setTranscript(''); }} className="mt-4 text-[10px] uppercase tracking-widest text-white/20 hover:text-rose-400 flex items-center gap-1 transition-colors">
                  <X className="w-3 h-3" /> Clear
                </button>
              </>
            ) : (
              <>
                <FileUp className="w-12 h-12 text-white/5 mb-4" />
                <p className="text-sm text-white/40 font-medium tracking-wide">Upload .txt</p>
              </>
            )}
          </div>
        </div>

        <button 
          onClick={onAnalyze}
          disabled={isLoading || !transcript.trim()}
          className="w-full bg-white text-black hover:bg-white/90 disabled:bg-white/10 disabled:text-white/20 font-bold py-5 rounded-full uppercase tracking-[0.3em] text-xs shadow-[0_10px_40px_-10px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          {isLoading ? 'Processing...' : 'Apply Intelligence'}
        </button>
      </div>
    </div>
  );
};
