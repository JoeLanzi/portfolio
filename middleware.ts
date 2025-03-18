import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This won't persist between cold starts, but helps during active periods
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const blockedIPs = new Set<string>();

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.ip;

  if (!ip) {
    return new NextResponse('IP address not found', { status: 400 });
  }

  // Block IPs that have been flagged as abusive
  if (blockedIPs.has(ip)) {
    return new NextResponse('Access denied', { status: 403 });
  }

  // Stricter rate limiting for serverless environment
  const now = Date.now();
  const limit = 5; // Limit to 5 requests in 30 seconds
  const timeframe = 30 * 1000;

  const rateLimitInfo = rateLimit.get(ip) || { count: 0, timestamp: now };

  if (now - rateLimitInfo.timestamp < timeframe) {
    rateLimitInfo.count += 1;
  } else {
    rateLimitInfo.count = 1;
    rateLimitInfo.timestamp = now;
  }

  rateLimit.set(ip, rateLimitInfo);

  if (rateLimitInfo.count > limit) {
    console.warn(`Rate limit exceeded for IP: ${ip} with ${rateLimitInfo.count} requests`);
    
    // Add repeat offenders to blocked list (within this instance)
    if (rateLimitInfo.count > limit * 2) {
      console.warn(`Blocking abusive IP: ${ip}`);
      blockedIPs.add(ip);
    }
    
    return new NextResponse('Too many requests', { status: 429 });
  }

  if (rateLimitInfo.count > limit * 0.8) {
    console.info(`IP approaching rate limit: ${ip} with ${rateLimitInfo.count} requests`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};