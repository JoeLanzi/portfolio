/**
 * CONSOLIDATED CORE API UTILITIES
 * This file contains types and OpenAI client
 */

import OpenAI from "openai";
import { API_ENDPOINT, INITIAL_MESSAGE, MODEL, ALLOWED_ORIGINS, DEVELOPER_PROMPT } from "@/app/api/config";

// ============================================================================
// TYPES
// ============================================================================

export interface ContentItem {
  type: "input_text" | "output_text" | "refusal" | "output_audio";
  annotations?: any[];
  text?: string;
}

export interface MessageItem {
  type: "message";
  role: "user" | "assistant" | "system";
  id?: string;
  content: ContentItem[];
}

export interface ToolCallItem {
  type: "tool_call";
  tool_type: "file_search_call" | "web_search_call" | "function_call";
  status: "in_progress" | "completed" | "failed" | "searching";
  id: string;
  name?: string | null;
  call_id?: string;
  arguments?: string;
  parsedArguments?: any;
  output?: string | null;
}

export interface ChatRequestBody {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string | ContentItem[];
  }>;
}

// ============================================================================
// OPENAI CLIENT (SINGLETON)
// ============================================================================

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Re-export constants for convenience
export { API_ENDPOINT, INITIAL_MESSAGE, MODEL, ALLOWED_ORIGINS, DEVELOPER_PROMPT };
