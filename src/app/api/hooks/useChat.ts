import { useConversationStore } from "@/app/api/stores/useConversationStore";
import { API_ENDPOINT, DEVELOPER_PROMPT } from "@/app/api/lib/core";

/**
 * Fetches API token from the server
 */
async function getApiToken(): Promise<string> {
  try {
    const response = await fetch('/api/routes/get-token');
    if (!response.ok) {
      throw new Error('Failed to get API token');
    }
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error getting API token:', error);
    throw error;
  }
}

/**
 * Sends a chat message and streams the response
 * @param userMessage - The user's message
 * @param onMessage - Callback to handle streaming events
 */
export async function useChat(
  userMessage: string,
  onMessage: (data: any) => void
): Promise<void> {
  const {
    conversationItems,
    addConversationItem,
  } = useConversationStore.getState();

  // Add user message to conversation
  const userMessageItem = {
    role: "user",
    content: [{ type: "input_text", text: userMessage }],
  };
  addConversationItem(userMessageItem);

  // Build messages array with system prompt
  const messages = [
    { role: "system", content: DEVELOPER_PROMPT },
    ...conversationItems,
    userMessageItem,
  ];

  const requestBody = {
    messages,
  };

  try {
    const token = await getApiToken();

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": token,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    // Process streaming response
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = "";
    let assistantMessage = "";

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

          // Collect assistant text from delta events
          if (data.event === "response.output_text.delta") {
            const { delta } = data.data;
            if (typeof delta === "string") {
              assistantMessage += delta;
            }
          }

          onMessage(data);
        }
      }
    }

    // Add assistant message to conversation
    if (assistantMessage) {
      const assistantMessageItem = {
        role: "assistant",
        content: [{ type: "output_text", text: assistantMessage }],
      };
      addConversationItem(assistantMessageItem);
    }

    // Handle remaining buffer data
    if (buffer && buffer.startsWith("data: ")) {
      const dataStr = buffer.slice(6);
      if (dataStr !== "[DONE]") {
        const data = JSON.parse(dataStr);
        onMessage(data);
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}