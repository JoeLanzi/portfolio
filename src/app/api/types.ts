export interface PageContext {
  pathname?: string;
  title?: string;
}

export interface ChatRequestBody {
  message: string;
  previousResponseId?: string;
  pageContext?: PageContext;
}

export interface ChatMessageContent {
  type: "input_text" | "output_text";
  text: string;
  annotations?: unknown[];
}

export interface ChatMessageItem {
  type: "message";
  role: "user" | "assistant";
  id?: string;
  done?: boolean;
  content: ChatMessageContent[];
}
