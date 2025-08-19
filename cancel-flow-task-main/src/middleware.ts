import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ============================================================================
  // SECURITY HEADERS
  // ============================================================================

  // Content Security Policy - Basic protection against XSS
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"
  );

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // ============================================================================
  // BASIC SECURITY CHECKS
  // ============================================================================

  // Check for suspicious request patterns
  const url = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || '';

  // Block requests with suspicious patterns
  if (url.includes('..') || url.includes('//')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Block suspicious user agents
  if (userAgent.includes('sqlmap') || userAgent.includes('nikto')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ============================================================================
  // CSRF PROTECTION FOR API ROUTES
  // ============================================================================

  if (url.startsWith('/api/') && request.method !== 'GET') {
    // For POST/PUT/DELETE requests, check Origin header
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    // Basic origin validation
    if (origin && !isValidOrigin(origin)) {
      return new NextResponse('Invalid origin', { status: 403 });
    }

    // Check if referer is from same origin (basic CSRF protection)
    if (referer && !isValidReferer(referer, request.nextUrl.origin)) {
      return new NextResponse('Invalid referer', { status: 403 });
    }
  }

  return response;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function isValidOrigin(origin: string): boolean {
  // Allow localhost for development
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return true;
  }
  
  // Add your production domains here
  const allowedOrigins = [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ];
  
  return allowedOrigins.includes(origin);
}

function isValidReferer(referer: string, expectedOrigin: string): boolean {
  try {
    const refererUrl = new URL(referer);
    return refererUrl.origin === expectedOrigin;
  } catch {
    return false;
  }
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
