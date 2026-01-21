/**
 * Cloudflare Pages Function
 * Endpoint: /api/login
 * Method: POST
 *
 * Validates admin credentials and sets session cookie
 */

import { createJWT } from '../utils/jwt.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    const rateLimit = await checkRateLimit(env.DB, clientIP);
    if (!rateLimit.allowed) {
      const resetMinutes = Math.ceil((rateLimit.resetAt - Date.now()) / 60000);
      return new Response(JSON.stringify({
        error: `Too many login attempts. Please try again in ${resetMinutes} minute${resetMinutes !== 1 ? 's' : ''}.`
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    let credentials;
    try {
      credentials = await request.json();
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { username, password } = credentials;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate credentials
    if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
      // Record failed attempt
      await recordFailedAttempt(env.DB, clientIP);

      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Clear rate limit on successful login
    await clearRateLimit(env.DB, clientIP);

    // Validate JWT_SECRET exists
    if (!env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create JWT token (valid for 24 hours)
    const token = await createJWT(
      { username, role: 'admin' },
      env.JWT_SECRET,
      86400 // 24 hours
    );

    // Set secure HTTP-only cookie
    const cookieOptions = [
      `admin_session=${token}`,
      'HttpOnly',
      'Path=/',
      'SameSite=Strict',
      'Max-Age=86400' // 24 hours
    ];

    // Add Secure flag in production
    if (env.CF_PAGES) {
      cookieOptions.push('Secure');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieOptions.join('; ')
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Rate limiting helpers

/**
 * Get client IP from request
 */
function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') ||
         request.headers.get('X-Forwarded-For')?.split(',')[0].trim() ||
         request.headers.get('X-Real-IP') ||
         '127.0.0.1';
}

/**
 * Check if IP is rate limited (5 attempts per 15 minutes)
 */
async function checkRateLimit(db, ip) {
  if (!db) {
    // No database, allow (fail open)
    return { allowed: true };
  }

  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        ip TEXT PRIMARY KEY,
        attempts INTEGER DEFAULT 0,
        first_attempt_at INTEGER,
        last_attempt_at INTEGER
      )
    `).run();

    const now = Math.floor(Date.now() / 1000);
    const windowSeconds = 15 * 60; // 15 minutes
    const maxAttempts = 5;

    const result = await db.prepare(
      'SELECT attempts, first_attempt_at FROM login_attempts WHERE ip = ?'
    ).bind(ip).first();

    if (!result || result.first_attempt_at < now - windowSeconds) {
      // No attempts or window expired
      return { allowed: true };
    }

    if (result.attempts >= maxAttempts) {
      return {
        allowed: false,
        resetAt: new Date((result.first_attempt_at + windowSeconds) * 1000)
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open on error
    return { allowed: true };
  }
}

/**
 * Record a failed login attempt
 */
async function recordFailedAttempt(db, ip) {
  if (!db) return;

  try {
    const now = Math.floor(Date.now() / 1000);

    await db.prepare(`
      INSERT INTO login_attempts (ip, attempts, first_attempt_at, last_attempt_at)
      VALUES (?, 1, ?, ?)
      ON CONFLICT(ip) DO UPDATE SET
        attempts = attempts + 1,
        last_attempt_at = ?
    `).bind(ip, now, now, now).run();
  } catch (error) {
    console.error('Failed to record login attempt:', error);
  }
}

/**
 * Clear rate limit on successful login
 */
async function clearRateLimit(db, ip) {
  if (!db) return;

  try {
    await db.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();
  } catch (error) {
    console.error('Failed to clear rate limit:', error);
  }
}
