export interface ChatReply {
  message: string;
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:9000/api/chat";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "test-api-key";

let threadId = generateId();
let sequenceId = 0;

function generateId() {
  return Math.random().toString(36).substring(2, 30);
}

export async function sendChatMessage(userMessage: string, file?: File): Promise<ChatReply> {
  const conversationId = generateId();

  const formData = new FormData();
  formData.append("message", userMessage);
  formData.append("conversationId", conversationId);
  formData.append("threadId", threadId);
  formData.append("sequenceId", sequenceId.toString());

  if (file) {
    formData.append("file", file);
  }

  console.log("API call to:", API_ENDPOINT, "with payload:", formData);

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: formData,
  });

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  console.log("Response received from API:", result);

  sequenceId++;
  return { message: result };
}