import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { ALLOWED_ORIGINS } from "@/app/api/config/constants";

export async function GET(request: Request) {
  try {
    // Check if request comes from your domain
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    // Use the origins from constants file
    const isAllowedOrigin = ALLOWED_ORIGINS.some(allowedOrigin => 
      origin?.includes(allowedOrigin) || referer?.includes(allowedOrigin)
    );
    
    if (!isAllowedOrigin) {
      return NextResponse.json({ error: "Unauthorized origin" }, { status: 401 });
    }

    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable not set");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Create a signed JWT using API_KEY
    const token = sign(
      { 
        exp: Math.floor(Date.now() / 1000) + (5 * 60)
      }, 
      process.env.API_KEY
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