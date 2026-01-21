/**
 * Cloudflare Pages Function
 * Endpoint: /api/logout
 * Method: POST
 *
 * Logs out the admin by clearing the session cookie
 */

export async function onRequestPost(context) {
  try {
    // Clear the session cookie by setting Max-Age to 0
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'admin_session=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0'
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
