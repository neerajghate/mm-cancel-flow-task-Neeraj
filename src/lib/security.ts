import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Security configuration
export const SECURITY_CONFIG = {
  CSRF_TOKEN_HEADER: 'x-csrf-token',
  CSRF_TOKEN_LENGTH: 32,
  MAX_REQUEST_SIZE: 1024 * 1024, // 1MB
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
} as const;

// Input validation schemas
export const validationSchemas = {
  // User input validation
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  
  // Cancellation reason validation
  cancellationReason: z.string()
    .min(1, 'Reason is required')
    .max(1000, 'Reason too long')
    .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, 'Invalid characters in reason'),
  
  // Visa type validation
  visaType: z.string()
    .min(1, 'Visa type is required')
    .max(100, 'Visa type too long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Invalid characters in visa type'),
  
  // Found job data validation
  foundJobData: z.object({
    foundWithMate: z.enum(['Yes', 'No']),
    appsApplied: z.string().max(500).optional(),
    companiesEmailed: z.string().max(500).optional(),
    companiesInterviewed: z.string().max(500).optional(),
    feedback: z.string().max(1000).optional(),
    hasCompanyLawyer: z.boolean().optional(),
    visa: z.string().max(100).optional(),
  }),
  
  // A/B bucket validation
  abBucket: z.enum(['A', 'B']),
  
  // Monthly price validation
  monthlyPrice: z.number().positive().max(10000), // Max $100
};

// CSRF token generation and validation
export class CSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>();

  static generateToken(userId: string): string {
    const token = this.generateRandomString(SECURITY_CONFIG.CSRF_TOKEN_LENGTH);
    const expires = Date.now() + (30 * 60 * 1000); // 30 minutes
    
    this.tokens.set(userId, { token, expires });
    
    // Clean up expired tokens
    this.cleanupExpiredTokens();
    
    return token;
  }

  static validateToken(userId: string, token: string): boolean {
    const stored = this.tokens.get(userId);
    
    if (!stored || stored.expires < Date.now()) {
      this.tokens.delete(userId);
      return false;
    }
    
    return stored.token === token;
  }

  private static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private static cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [userId, data] of this.tokens.entries()) {
      if (data.expires < now) {
        this.tokens.delete(userId);
      }
    }
  }
}

// Input sanitization
export class InputSanitizer {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static sanitizeNumber(input: string | number): number {
    const num = Number(input);
    return isNaN(num) ? 0 : Math.max(0, num);
  }

  static sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized = { ...obj } as T;
    
    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'string') {
        (sanitized as Record<string, unknown>)[key] = this.sanitizeString(value);
      } else if (typeof value === 'number') {
        (sanitized as Record<string, unknown>)[key] = this.sanitizeNumber(value);
      } else if (Array.isArray(value)) {
        (sanitized as Record<string, unknown>)[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeString(item) : item
        );
      }
    }
    
    return sanitized;
  }
}

// Rate limiting
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();

  static isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const requestData = this.requests.get(identifier);
    
    if (!requestData || now > requestData.resetTime) {
      // Reset or create new window
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW
      });
      return false;
    }
    
    if (requestData.count >= SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
      return true;
    }
    
    requestData.count++;
    return false;
  }

  static getRemainingRequests(identifier: string): number {
    const requestData = this.requests.get(identifier);
    if (!requestData) return SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS;
    
    return Math.max(0, SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS - requestData.count);
  }
}

// Security middleware for API routes
export function withSecurity(handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: unknown[]) => {
    try {
      // Check request size
      const contentLength = parseInt(req.headers.get('content-length') || '0');
      if (contentLength > SECURITY_CONFIG.MAX_REQUEST_SIZE) {
        return NextResponse.json(
          { error: 'Request too large' },
          { status: 413 }
        );
      }

      // Rate limiting by IP
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      if (RateLimiter.isRateLimited(ip)) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }

      // Add security headers
      const response = await handler(req, ...args);
      
      if (response instanceof NextResponse) {
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
      }
      
      return response;
    } catch (error) {
      console.error('Security middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Validation helper
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(e => e.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

// SQL injection prevention
export function escapeSQL(input: string): string {
  // This is a basic implementation - in production, use parameterized queries
  return input
    .replace(/'/g, "''")
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
}

// XSS prevention
export function escapeHTML(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Secure random number generation
export function secureRandom(): number {
  // Use crypto.getRandomValues if available, fallback to Math.random
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  return Math.random();
}
