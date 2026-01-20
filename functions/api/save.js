/**
 * Cloudflare Pages Function
 * Endpoint: /api/save
 * Method: POST
 *
 * Saves content updates to D1 database and triggers site redeploy
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 1. Validate ADMIN_TOKEN
    const token = request.headers.get('X-Admin-Token');

    if (!token || token !== env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Parse request body
    let updates;
    try {
      updates = await request.json();
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Validate updates object
    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
      return new Response(JSON.stringify({ error: 'No content to save' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. Sanitize and update D1
    const db = env.DB;

    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process each content update
    for (const [key, value] of Object.entries(updates)) {
      // Sanitize value (strip HTML, trim whitespace)
      const sanitizedValue = stripHtml(value);

      // Validate key format (alphanumeric, underscores only)
      if (!/^[a-z0-9_]+$/.test(key)) {
        console.warn(`Invalid key format: ${key}`);
        continue;
      }

      // Upsert to D1
      try {
        await db.prepare(
          'INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)'
        ).bind(key, sanitizedValue).run();
      } catch (dbError) {
        console.error(`Error saving ${key}:`, dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }
    }

    // 5. Trigger deploy hook (only in production)
    // In local dev, CF_PAGES env var won't be set
    if (env.CF_PAGES && env.CF_PAGES_DEPLOY_HOOK_URL) {
      try {
        const deployResponse = await fetch(env.CF_PAGES_DEPLOY_HOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!deployResponse.ok) {
          console.warn('Deploy hook failed:', deployResponse.status);
          // Don't fail the save if deploy hook fails
        }
      } catch (deployError) {
        console.warn('Deploy hook error:', deployError);
        // Don't fail the save if deploy hook fails
      }
    } else {
      console.log('Local dev: Skipping deploy hook trigger');
    }

    // 6. Return success
    return new Response(JSON.stringify({
      success: true,
      updated: Object.keys(updates).length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Save error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Strip HTML tags from text while preserving <br> tags
 * @param {string} text - Text that may contain HTML
 * @returns {string} Plain text with only <br> tags preserved
 */
function stripHtml(text) {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    // Remove all HTML tags EXCEPT <br> and <br/>
    .replace(/<(?!br\s*\/?)(?![\/]?br>)[^>]+>/gi, '')
    // Normalize <br> tags to <br>
    .replace(/<br\s*\/?>/gi, '<br>')
    // Remove excessive consecutive <br> tags (more than 2)
    .replace(/(<br>){3,}/gi, '<br><br>')
    // Decode common HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Trim leading/trailing whitespace
    .trim()
    // Limit length to prevent abuse (optional)
    .substring(0, 10000);
}
