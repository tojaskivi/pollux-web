import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

const DB_NAME = 'pollux-db';
const OUTPUT_PATH = `${__dirname}/../src/content/site.json`;

// Detect environment: use --remote for Cloudflare Pages, --local for local dev
const isProduction = process.env.CF_PAGES === '1';
const dbFlag = isProduction ? '--remote' : '--local';

console.log(`🔄 Fetching content from D1 (${isProduction ? 'production' : 'local'})...`);

try {
  // Execute wrangler command to fetch all content
  const command = `wrangler d1 execute ${DB_NAME} ${dbFlag} --json --command="SELECT * FROM content"`;

  const { stdout, stderr } = await execAsync(command);

  if (stderr && !stderr.includes('Warning')) {
    console.warn('⚠️  Warning from wrangler:', stderr);
  }

  // Parse wrangler JSON output
  const result = JSON.parse(stdout);

  // Wrangler returns: { results: [ { key: 'hero_title', value: 'Hello world' }, ... ] }
  const rows = result[0]?.results || [];

  if (rows.length === 0) {
    console.warn('⚠️  Warning: No content found in D1 database');
    console.log('📝 Creating empty site.json - components will use fallback values');
  }

  // Convert array of {key, value} objects to simple {key: value} object
  const content = rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  // Ensure the output directory exists
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });

  // Write to site.json
  await writeFile(OUTPUT_PATH, JSON.stringify(content, null, 2));

  console.log(`✅ Content fetched successfully: ${rows.length} items`);
  console.log(`📄 Written to: ${OUTPUT_PATH}`);

} catch (error) {
  console.error('❌ Error fetching content from D1:', error.message);

  // Create empty site.json to prevent build failure
  console.log('📝 Creating empty site.json as fallback...');

  try {
    await mkdir(dirname(OUTPUT_PATH), { recursive: true });
    await writeFile(OUTPUT_PATH, JSON.stringify({}, null, 2));
    console.log('✅ Fallback site.json created - build can proceed with default values');
  } catch (writeError) {
    console.error('❌ Failed to create fallback site.json:', writeError.message);
    process.exit(1);
  }
}
