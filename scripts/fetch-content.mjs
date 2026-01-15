import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = `${__dirname}/../src/content/site.json`;

// Detect environment
const isProduction = process.env.CF_PAGES === '1';

console.log(`🔄 Fetching content from D1 (${isProduction ? 'production' : 'local'})...`);

try {
  let content = {};

  if (isProduction) {
    // In Cloudflare Pages build: Fetch from API endpoint
    const apiUrl = process.env.CF_PAGES_URL || 'https://pollux-web.pages.dev';
    const contentUrl = `${apiUrl}/api/content`;

    console.log(`📡 Fetching from API: ${contentUrl}`);

    const response = await fetch(contentUrl);

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    content = await response.json();

  } else {
    // Local dev: Use wrangler CLI
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    const command = 'wrangler d1 execute pollux-db --local --json --command="SELECT * FROM content"';
    const { stdout } = await execAsync(command);
    const result = JSON.parse(stdout);

    content = result[0]?.results?.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {}) || {};
  }

  // Ensure directory exists
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });

  // Write to site.json
  await writeFile(OUTPUT_PATH, JSON.stringify(content, null, 2));

  console.log(`✅ Content fetched successfully: ${Object.keys(content).length} items`);
  console.log(`📄 Written to: ${OUTPUT_PATH}`);

} catch (error) {
  console.error('❌ Error fetching content:', error.message);

  // Create empty site.json as fallback
  console.log('📝 Creating empty site.json as fallback...');

  try {
    await mkdir(dirname(OUTPUT_PATH), { recursive: true });
    await writeFile(OUTPUT_PATH, JSON.stringify({}, null, 2));
    console.log('✅ Fallback site.json created - components will use default values');
  } catch (writeError) {
    console.error('❌ Failed to create fallback site.json:', writeError.message);
    process.exit(1);
  }
}
