/**
 * @file aiService.ts
 * @description Encapsulates all interactions with the Google Gemini API.
 * Refactored to Frontend per AI Studio best practices (Skill: gemini-api).
 */

import { GoogleGenAI, Type } from "@google/genai";
import { MeetingAnalysis, ChatMessage } from "../types/meeting";

// Configuration for the intelligence layer
const MODEL_NAME = "gemini-3-flash-preview"; 

// The platform injects GEMINI_API_KEY into the process environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "2-3 sentence executive overview" },
    decisions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { description: { type: Type.STRING } },
        required: ["description"]
      }
    },
    action_items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          owner: { type: Type.STRING },
          deadline: { type: Type.STRING }
        },
        required: ["task"]
      }
    },
    meeting_health_score: { type: Type.INTEGER, description: "1-10 rating" },
    health_reasoning: { type: Type.STRING },
    follow_up_email: { type: Type.STRING }
  },
  required: ["summary", "decisions", "action_items", "meeting_health_score", "health_reasoning", "follow_up_email"]
};

/**
 * Analyzes a raw transcript using structured JSON output.
 */
export async function analyzeTranscript(transcript: string): Promise<MeetingAnalysis> {
  const startTime = Date.now();
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Perform a deep audit on the following meeting transcript. 
    Focus on identifying explicit decisions and task ownership.
    
    Transcript: 
    ${transcript}`,
    config: {
      systemInstruction: "You are a professional meeting analyst. Extract details accurately and objectively.",
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA as any,
      temperature: 0.1, // High consistency
    }
  });

  const analysis = JSON.parse(response.text) as MeetingAnalysis;

  // Manual analytics injection for portfolio demonstration
  analysis.analytics = {
    processingTimeMs: Date.now() - startTime,
    wordCount: transcript.split(/\s+/).length
  };

  return analysis;
}

/**
 * Chat Interface for nuanced transcript interrogation.
 */
export async function chatWithTranscript(transcript: string, question: string, history: ChatMessage[]) {
  const chat = ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: `You are a meeting assistant. You have access to the following transcript. 
      Answer questions based ONLY on this context. 
      
      Transcript:
      ${transcript}`
    }
  });

  const result = await chat.sendMessage({
    message: question
  });

  return result.text;
}
