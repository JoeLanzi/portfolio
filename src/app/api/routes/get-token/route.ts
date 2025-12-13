import { NextResponse } from 'next/server';

/**
 * GET /api/get-token
 * Returns the API key token for authenticated requests
 */
export async function GET() {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  return NextResponse.json({ token: apiKey });
}
