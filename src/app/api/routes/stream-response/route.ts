import { NextResponse } from "next/server";
import type {
  EasyInputMessage,
  ResponseCreateParamsStreaming,
  ResponseStreamEvent,
} from "openai/resources/responses/responses";
import {
  CHAT_INSTRUCTIONS,
  getServerConfig,
  MAX_OUTPUT_TOKENS,
  PROMPT_CACHE_KEY,
} from "@/app/api/config";
import { buildPageContextNote, buildPortfolioContext } from "@/app/api/lib/context";
import { getOpenAIClient } from "@/app/api/lib/openai";
import { isAllowedOrigin, parseChatRequest } from "@/app/api/lib/request";

export const runtime = "nodejs";

const { MODEL, REASONING_EFFORT } = getServerConfig();

/**
 * POST /api/routes/stream-response
 * Streams OpenAI responses with conversation context
 */
export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json(
        { error: "Forbidden origin" },
        { status: 403 },
      );
    }

    const { message, previousResponseId, pageContext } = await parseChatRequest(request);

    const openai = getOpenAIClient();
    const portfolioContext = previousResponseId
      ? ""
      : await buildPortfolioContext(pageContext);
    const pageContextNote = buildPageContextNote(pageContext);

    const input: EasyInputMessage[] = [];

    if (portfolioContext) {
      input.push({ role: "developer", content: portfolioContext });
    }

    if (pageContextNote) {
      input.push({ role: "developer", content: pageContextNote });
    }

    input.push({ role: "user", content: message });

    const createArgs: ResponseCreateParamsStreaming = {
      model: MODEL,
      instructions: CHAT_INSTRUCTIONS,
      previous_response_id: previousResponseId,
      reasoning: {
        effort: REASONING_EFFORT,
      },
      input,
      stream: true,
      store: true,
      max_output_tokens: MAX_OUTPUT_TOKENS,
      prompt_cache_key: PROMPT_CACHE_KEY,
      parallel_tool_calls: false,
      metadata: {
        surface: "portfolio-chat",
        page: pageContext?.pathname || "unknown",
        continuation: previousResponseId ? "previous_response_id" : "fresh",
      },
    };

    const events = await openai.responses.create(createArgs);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of events as AsyncIterable<ResponseStreamEvent>) {
            const data = JSON.stringify({
              event: event.type,
              data: event,
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ event: "done" })}\n\n`),
          );
          controller.close();
        } catch (error) {
          console.error("Error in streaming loop:", error);
          const apiError = error as {
            code?: string;
            type?: string;
          };

          const errorMsg = JSON.stringify({
            event: "error",
            data: {
              message: error instanceof Error ? error.message : "Unknown streaming error",
              code: apiError.code,
              type: apiError.type,
            },
          });
          controller.enqueue(encoder.encode(`data: ${errorMsg}\n\n`));
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
      { status: 500 },
    );
  }
}
