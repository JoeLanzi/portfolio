import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.ip;

  if (!ip) {
    return new NextResponse('IP address not found', { status: 400 });
  }

  // Rate limiting implementation
  const now = Date.now();
  const limit = 5; // Max requests
  const timeframe = 1 * 60 * 1000; // 1 minute

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