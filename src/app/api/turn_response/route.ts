import { MODEL } from "@/app/api/config/constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request: Request) {
  try {
    // Check for API key or token in headers
    const apiKey = request.headers.get('X-API-Key');
    
    // Validate API key (server-to-server) or token (client-to-server)
    if (apiKey === process.env.API_KEY) {
      // Direct API key validation (for server-to-server calls)
      // Proceed with the request
    } else if (apiKey && global.validTokens && global.validTokens[apiKey] && global.validTokens[apiKey] > Date.now()) {
      // Token validation (for client-to-server calls)
      // Token is valid and not expired
      // Clean up the token after use (one-time use)
      delete global.validTokens[apiKey];
    } else {
      // Neither valid API key nor valid token
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 }
      );
    }

    const { messages } = await request.json();
    console.log("Received messages:", messages);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const events = await openai.responses.create({
      model: MODEL,
      input: messages,
      // tools: [{ type: "web_search_preview" }], // Place in tools if wanting to use web search feature in chat
      tools:[{
        "type": "file_search",
        "vector_store_ids": [process.env.VECTOR_STORE_ID!]
      }],
      tool_choice: "auto",
      store: false,
      stream: true,
      parallel_tool_calls: false,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of events) {
            // Sending all events to the client
            const data = JSON.stringify({
              event: event.type,
              data: event,
            });
            // Properly encode the data as bytes
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
          }
          
          // Send a final event to signal completion
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({event: "done"})}\n\n`));
          
          // End of stream
          controller.close();
        } catch (error) {
          console.error("Error in streaming loop:", error);
          
          // Send error to client before closing
          const errorMsg = JSON.stringify({
            event: "error", 
            data: { message: error instanceof Error ? error.message : "Unknown streaming error" }
          });
          controller.enqueue(new TextEncoder().encode(`data: ${errorMsg}\n\n`));
          controller.close();
        }
      },
    });

    // Return the ReadableStream as SSE
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no" // Prevents proxies from buffering the response
      },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}