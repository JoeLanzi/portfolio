import { useConversationStore } from "@/app/api/stores/useConversationStore";
import { DEVELOPER_PROMPT, API_ENDPOINT } from "@/app/api/config/constants";

export interface ChatReply {
  message: string;
}

export async function sendChatMessage(userMessage: string, onMessage: (data: any) => void): Promise<void> {
  const { conversationItems, addConversationItem } = useConversationStore.getState();

  // Add the user's message to the conversation items
  const userMessageItem = { 
    role: "user", 
    content: [{ type: "input_text", text: userMessage }] 
  };
  addConversationItem(userMessageItem);

  // Prepare the messages to be sent, including system prompts
  const messages = [
    { role: "system", content: DEVELOPER_PROMPT },
    ...conversationItems,
    userMessageItem,
  ];

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.API_KEY || "",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  // Reader for streaming data
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let buffer = "";
  let assistantMessage = "";
  let assistantMessageId = null;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    buffer += chunkValue;

    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const dataStr = line.slice(6);
        if (dataStr === "[DONE]") {
          done = true;
          break;
        }
        const data = JSON.parse(dataStr);

        // Collect assistant response text
        if (data.event === "response.output_text.delta") {
          const { delta, item_id } = data.data;
          if (typeof delta === "string") {
            assistantMessage += delta;
            if (!assistantMessageId) {
              assistantMessageId = item_id;
            }
          }
        }

        onMessage(data);
      }
    }
  }

  // Once streaming is complete, add the assistant's full response to conversation history
  if (assistantMessage) {
    const assistantMessageItem = {
      role: "assistant",
      id: assistantMessageId,
      content: [{ type: "output_text", text: assistantMessage }]
    };
    
    // Add to conversation history for future context
    addConversationItem(assistantMessageItem);
  }

  // Handle any remaining data in buffer
  if (buffer && buffer.startsWith("data: ")) {
    const dataStr = buffer.slice(6);
    if (dataStr !== "[DONE]") {
      const data = JSON.parse(dataStr);
      onMessage(data);
    }
  }
}