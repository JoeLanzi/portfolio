import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { getOpenAIClient, type ChatRequestBody, MODEL } from "@/app/api/lib/core";

dotenv.config();

/**
 * POST /api/routes/stream-response
 * Streams OpenAI responses with conversation context
 */
export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-API-Key');

    // Validate API key
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable not set");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    if (apiKey !== process.env.API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 }
      );
    }

    const { messages } = await request.json();

    console.log("Received messages:", JSON.stringify(messages, null, 2));

    const openai = getOpenAIClient();

    // Build request for OpenAI Responses API
    const createArgs: any = {
      model: MODEL,
      input: messages,
      tools: [
        {
          type: "file_search",
          vector_store_ids: [process.env.VECTOR_STORE_ID!],
        },
      ],
      tool_choice: "auto",
      store: false,
      stream: true,
      parallel_tool_calls: false,
    };

    const events = await openai.responses.create(createArgs);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of events as unknown as AsyncIterable<any>) {
            const data = JSON.stringify({
              event: event.type,
              data: event,
            });
            controller.enqueue(
              new TextEncoder().encode(`data: ${data}\n\n`)
            );
          }

          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "done" })}\n\n`
            )
          );
          controller.close();
        } catch (error) {
          console.error("Error in streaming loop:", error);

          const errorMsg = JSON.stringify({
            event: "error",
            data: {
              message: error instanceof Error ? error.message : "Unknown streaming error",
            },
          });
          controller.enqueue(
            new TextEncoder().encode(`data: ${errorMsg}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
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
