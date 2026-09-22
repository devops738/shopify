import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

// Mechanical importer for the supplied Netlify export.  It turns embedded data
// images into Shopify theme assets and writes a manifest used by the page ports.
const root = process.cwd();
const input = process.argv.slice(2);
if (!input.length) throw new Error('Pass one or more exported HTML files.');

const outputDir = join(root, 'assets');
await mkdir(outputDir, { recursive: true });
const manifest = {};
const byHash = new Map();

const extensionFor = (mime) => ({
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png',
  'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg',
})[mime] || 'bin';

for (const source of input) {
  const html = await readFile(source, 'utf8');
  const slug = basename(source, extname(source)).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const matches = [...html.matchAll(/data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)/g)];
  const entries = [];
  for (let index = 0; index < matches.length; index++) {
    const [, mime, encoded] = matches[index];
    const bytes = Buffer.from(encoded, 'base64');
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
    let name = byHash.get(hash);
    if (!name) {
      name = `netlify-${slug}-${String(index + 1).padStart(2, '0')}-${hash}.${extensionFor(mime)}`;
      await writeFile(join(outputDir, name), bytes);
      byHash.set(hash, name);
    }
    entries.push({ index: index + 1, mime, asset: name, dataUri: matches[index][0] });
  }
  manifest[source] = entries.map(({ index, mime, asset }) => ({ index, mime, asset }));

  let converted = html;
  for (const entry of entries) {
    converted = converted.replace(entry.dataUri, `{{ '${entry.asset}' | asset_url }}`);
  }
  await writeFile(`${source}.shopify.html`, converted, 'utf8');
}

await writeFile(join(root, 'tools', 'netlify-assets-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Imported ${Object.values(manifest).flat().length} embedded images from ${input.length} page(s).`);
