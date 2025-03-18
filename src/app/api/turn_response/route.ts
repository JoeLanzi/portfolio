import { MODEL } from "@/app/api/config/constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import dotenv from "dotenv";
import { verify } from "jsonwebtoken";

dotenv.config();

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    
    // Check for environment variable
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable not set");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }
    
    // Direct API key check
    if (apiKey === process.env.API_KEY) {
      // Valid admin key - proceed
    } else {
      try {
        // Verify using the API_KEY
        verify(apiKey || '', process.env.API_KEY);
      } catch (err) {
        return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
      }
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