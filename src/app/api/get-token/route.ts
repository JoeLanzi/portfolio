import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    // Check if request comes from your domain
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    // Allow any request from your domain
    const allowedOrigins = [
      'https://joelanzi.vercel.app',
      'http://localhost:3000', 
      'http://localhost:3001'
    ];
    
    const isAllowedOrigin = allowedOrigins.some(allowedOrigin => 
      origin?.includes(allowedOrigin) || referer?.includes(allowedOrigin)
    );
    
    if (!isAllowedOrigin) {
      return NextResponse.json({ error: "Unauthorized origin" }, { status: 401 });
    }

    // Create a signed JWT using API_KEY
    const token = sign(
      { 
        exp: Math.floor(Date.now() / 1000) + (5 * 60)
      }, 
      process.env.API_KEY || 'fallback-secret'
    );
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}