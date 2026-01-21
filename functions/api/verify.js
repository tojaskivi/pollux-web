/**
 * Cloudflare Pages Function
 * Endpoint: /api/verify
 * Method: GET
 *
 * Verifies if the current session is authenticated
 */

import { verifyAdminSession } from '../utils/auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const user = await verifyAdminSession(request, env);

    if (!user) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      authenticated: true,
      username: user.username
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
