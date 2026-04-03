import { API_ENDPOINT } from "@/app/api/config";
import { useConversationStore } from "@/app/api/stores/useConversationStore";
import type { PageContext } from "@/app/api/types";

/**
 * Sends a chat message and streams the response
 * @param userMessage - The user's message
 * @param onMessage - Callback to handle streaming events
 */
export async function sendChatMessage(
  userMessage: string,
  onMessage: (data: any) => void,
  pageContext?: PageContext,
): Promise<void> {
  const {
    lastResponseId,
    setLastResponseId,
  } = useConversationStore.getState();

  const requestBody = {
    message: userMessage,
    previousResponseId: lastResponseId,
    pageContext,
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    let latestResponseId = lastResponseId;

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
          if (
            (data.event === "response.created" || data.event === "response.completed") &&
            typeof data.data?.response?.id === "string"
          ) {
            latestResponseId = data.data.response.id;
          }

          onMessage(data);
        }
      }
    }

    if (latestResponseId) {
      setLastResponseId(latestResponseId);
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
