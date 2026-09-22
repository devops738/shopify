import { readFile, writeFile } from 'node:fs/promises';

// Creates a Liquid section from a Netlify HTML export after assets have been
// imported. Header/footer are deliberately excluded: Shopify supplies those
// globally, so the visual shell stays consistent site-wide.
const [source, destination] = process.argv.slice(2);
if (!source || !destination) throw new Error('Usage: node tools/port-netlify-page.mjs source.html.shopify.html section.liquid');

const html = await readFile(source, 'utf8');
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1]).join('\n');
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) throw new Error('The source document has no body.');

let body = bodyMatch[1]
  .replace(/<div class="promo">[\s\S]*?<\/div><\/div>\s*/i, '')
  .replace(/<header[\s\S]*?<\/header>\s*/i, '')
  .replace(/<div class="mobile-menu"[\s\S]*?<\/div>\s*<\/div>\s*/i, '')
  .replace(/<footer[\s\S]*?<\/footer>\s*/i, '')
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>\s*/gi, '');

// Prevent an imported page stylesheet from re-styling the global Shopify shell.
// The content keeps the original class names and DOM, which preserves the source
// layout while the shared header/footer are used once per page.
const scopedCss = styles
  .replace(/(^|})\s*(body|html)\s*\{/g, '$1\n.ats-netlify-port $2{')
  .replace(/(^|})\s*\*\s*\{/g, '$1\n.ats-netlify-port *{');

const section = `{% comment %} Generated from the supplied Netlify export. Keep source assets in /assets. {% endcomment %}\n<style>\n${scopedCss}\n</style>\n<div class="ats-netlify-port">\n${body.trim()}\n</div>\n\n{% schema %}\n{ "name": "Netlify page port", "settings": [] }\n{% endschema %}\n`;
await writeFile(destination, section, 'utf8');
console.log(`Wrote ${destination}`);
