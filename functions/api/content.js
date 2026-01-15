/**
 * Content API - Returns all content from D1 database
 * Used by build process to fetch content at build time
 */

export async function onRequestGet(context) {
  const { env } = context;

  try {
    // Fetch all content from D1
    const result = await env.DB.prepare('SELECT * FROM content').all();

    // Transform to { key: value } format
    const content = result.results.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return new Response(JSON.stringify(content), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Content API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
