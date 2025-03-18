import { NextResponse } from "next/server";
import crypto from "crypto";

// Use global token store to share between routes
declare global {
  var tokenStore: Map<string, number> | undefined;
}

// Initialize if not exists
if (!global.tokenStore) {
  global.tokenStore = new Map<string, number>();
}

export async function GET() {
  try {
    // Generate a random token
    const token = crypto.randomBytes(16).toString('hex');
    
    // Set expiration time (5 minutes from now)
    const expiry = Date.now() + 5 * 60 * 1000;
    
    // Store the token with its expiry in the global store
    global.tokenStore?.set(token, expiry);
    
    // Clean up expired tokens occasionally
    if (Math.random() < 0.1) { // 10% chance to clean up on each request
      for (const [storedToken, expiryTime] of (global.tokenStore?.entries() || [])) {
        if (expiryTime < Date.now()) {
          global.tokenStore?.delete(storedToken);
        }
      }
    }
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}