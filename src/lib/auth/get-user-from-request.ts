import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * JWT payload interface matching the Rust backend
 */
export interface JWTPayload {
  sub: string; // user ID
  email: string;
  exp: number;
  iat: number;
}

/**
 * Extract and verify user ID from JWT token in request cookies or Authorization header
 * Returns the user ID or throws an error if not authenticated
 */
export async function getUserIdFromRequest(request: NextRequest): Promise<string> {
  // Try to get token from cookie first (Rust backend sets this)
  let token = request.cookies.get('auth_token')?.value;

  // If not in cookie, try Authorization header (for Next.js API routes)
  if (!token) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    throw new Error('Not authenticated - no token found');
  }

  try {
    // Verify and decode JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );

    const { payload } = await jwtVerify(token, secret);

    const userId = payload.sub as string;

    if (!userId) {
      throw new Error('Invalid token - no user ID');
    }

    return userId;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid or expired token');
  }
}

/**
 * Get user ID from request, or return null if not authenticated
 * Non-throwing version for optional auth
 */
export async function getUserIdOrNull(request: NextRequest): Promise<string | null> {
  try {
    return await getUserIdFromRequest(request);
  } catch {
    return null;
  }
}
