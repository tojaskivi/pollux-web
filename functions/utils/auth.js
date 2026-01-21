/**
 * Authentication utilities
 */

import { verifyJWT } from './jwt.js';

/**
 * Verify admin session from request
 * @param {Request} request - Request object
 * @param {object} env - Environment variables
 * @returns {Promise<object|null>} User payload if authenticated, null otherwise
 */
export async function verifyAdminSession(request, env) {
  try {
    // Get session cookie
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) {
      return null;
    }

    // Parse cookies
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies.admin_session;

    if (!sessionToken) {
      return null;
    }

    // Validate JWT_SECRET exists
    if (!env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not configured');
      return null;
    }

    // Verify JWT
    const payload = await verifyJWT(
      sessionToken,
      env.JWT_SECRET
    );

    return payload;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

/**
 * Parse cookie header into object
 * @param {string} cookieHeader - Cookie header value
 * @returns {object} Parsed cookies
 */
function parseCookies(cookieHeader) {
  const cookies = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    cookies[name.trim()] = rest.join('=').trim();
  });
  return cookies;
}
