/**
 * @file meeting.ts
 * @description Centralized type definitions for the MeetMind domain.
 * Sharing these between frontend and backend ensures type safety during API calls.
 */

export interface ActionItem {
  task: string;
  owner?: string;
  deadline?: string;
}

export interface Decision {
  description: string;
}

export interface MeetingAnalysis {
  summary: string;
  decisions: Decision[];
  action_items: ActionItem[];
  meeting_health_score: number;
  health_reasoning: string;
  follow_up_email: string;
  // Performance analytics added for portfolio value
  analytics?: {
    processingTimeMs: number;
    wordCount: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AnalysisResponse extends MeetingAnalysis {
  error?: string;
}

export interface ChatResponse {
  answer: string;
  error?: string;
}
