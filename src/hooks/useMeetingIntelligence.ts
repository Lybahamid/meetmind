/**
 * @file useMeetingIntelligence.ts
 * @description Custom hook to manage the lifecycle of a meeting analysis session.
 * Demonstrates state management best practices and business logic extraction.
 */

import { useState } from 'react';
import { MeetingAnalysis, ChatMessage } from '../types/meeting';
import * as aiService from '../services/aiService';

export function useMeetingIntelligence() {
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Logs performance data to our custom backend telemetry system.
   */
  const logTelemetry = async (event: string, data: any) => {
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data }),
      });
    } catch (e) {
      console.warn('[Telemetry] Tracking failed silently.', e);
    }
  };

  /**
   * Triggers the AI analysis pipeline.
   */
  const analyze = async (inputTranscript: string) => {
    if (!inputTranscript || inputTranscript.trim().length < 50) {
      setError('Transcript is too short for meaningful analysis.');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setTranscript(inputTranscript);

    try {
      const data = await aiService.analyzeTranscript(inputTranscript);
      setAnalysis(data);
      
      // Log telemetry for portfolio analytics
      await logTelemetry('analysis_complete', {
        wordCount: data.analytics?.wordCount,
        processingTimeMs: data.analytics?.processingTimeMs
      });

      return data;
    } catch (err: any) {
      setError('Intelligence layer unreachable. Check API configuration.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles contextual Q&A interactions.
   */
  const askQuestion = async (question: string) => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = { 
      role: 'user', 
      content: question, 
      timestamp: Date.now() 
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const answer = await aiService.chatWithTranscript(transcript, question, chatHistory);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: answer,
        timestamp: Date.now()
      };

      setChatHistory(prev => [...prev, assistantMessage]);
      
      logTelemetry('chat_query', { questionLength: question.length });
    } catch (err) {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'I lost my connection to the intelligence layer.', 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transcript,
    analysis,
    chatHistory,
    isLoading,
    error,
    analyze,
    askQuestion
  };
}
