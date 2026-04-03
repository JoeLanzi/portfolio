import "server-only";

import { ALLOWED_ORIGINS } from "@/app/api/server-config";
import type { ChatRequestBody, PageContext } from "@/app/api/types";

const MAX_MESSAGE_LENGTH = 4_000;

function normalizeMessageText(value: string): string {
  return value
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH);
}

function normalizeMessage(input: unknown): string {
  if (typeof input !== "string") {
    throw new Error("Request body must include a message string.");
  }

  const message = normalizeMessageText(input);
  if (!message) {
    throw new Error("Message cannot be empty.");
  }

  return message;
}

function normalizePreviousResponseId(input: unknown): string | undefined {
  if (typeof input !== "string") {
    return undefined;
  }

  const value = input.trim();
  return value || undefined;
}

function getRefererPathname(request: Request): string | undefined {
  const referer = request.headers.get("referer");

  if (!referer) {
    return undefined;
  }

  try {
    return new URL(referer).pathname;
  } catch {
    return undefined;
  }
}

function normalizePageContext(input: unknown, request: Request): PageContext | undefined {
  const bodyContext = input && typeof input === "object" ? (input as PageContext) : undefined;

  const pathname =
    typeof bodyContext?.pathname === "string" && bodyContext.pathname.startsWith("/")
      ? bodyContext.pathname
      : getRefererPathname(request);

  const title =
    typeof bodyContext?.title === "string" && bodyContext.title.trim()
      ? bodyContext.title.trim().slice(0, 160)
      : undefined;

  if (!pathname && !title) {
    return undefined;
  }

  return {
    pathname,
    title,
  };
}

function getRequestOrigin(request: Request): string | undefined {
  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return undefined;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return undefined;
  }
}

export function isAllowedOrigin(request: Request): boolean {
  const origin = getRequestOrigin(request);

  if (!origin) {
    return process.env.NODE_ENV !== "production";
  }

  return ALLOWED_ORIGINS.includes(origin);
}

export async function parseChatRequest(request: Request): Promise<ChatRequestBody> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new Error("Request body must be valid JSON.");
  }

  return {
    message: normalizeMessage((body as { message?: unknown })?.message),
    previousResponseId: normalizePreviousResponseId(
      (body as { previousResponseId?: unknown })?.previousResponseId,
    ),
    pageContext: normalizePageContext((body as { pageContext?: unknown })?.pageContext, request),
  };
}
