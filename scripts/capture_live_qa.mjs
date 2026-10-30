import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire('C:/Users/Alter/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const { chromium } = require('playwright');

const root = path.resolve(process.cwd());
const out = path.join(root, 'output', 'qa-screenshots');
fs.mkdirSync(out, { recursive: true });
const base = 'https://usj86p-qn.myshopify.com';
const allPages = [
  ['home', '/'], ['tire-search', '/pages/tire-search'], ['wheel-search', '/pages/wheel-brands'],
  ['packages', '/pages/packages'], ['services', '/pages/services'], ['oil-change', '/pages/service-oil-change'],
  ['alignment', '/pages/service-wheel-alignment'], ['promotions', '/pages/promotions'], ['coupons', '/pages/coupons'],
  ['financing', '/pages/financing'], ['locations', '/pages/locations'], ['ventura', '/pages/location-ventura-ca'],
  ['thousand-oaks', '/pages/location-thousand-oaks-ca'], ['valencia', '/pages/location-valencia-ca'],
  ['hollywood', '/pages/location-hollywood-ca'], ['glendale', '/pages/location-glendale-ca'],
  ['glendale-ii', '/pages/location-glendale-ii-ca'], ['bellflower', '/pages/location-bellflower-ca'],
  ['costa-mesa', '/pages/location-costa-mesa-ca'], ['cathedral-city', '/pages/location-cathedral-city-ca'],
  ['downey', '/pages/location-downey-ca']
];
const start = Number(process.argv[2] || 0);
const count = Number(process.argv[3] || allPages.length);
const pages = allPages.slice(start, start + count);
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1600 }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
console.log('home loaded');
const password = page.locator('input[type="password"], input[name="password"]').first();
if (await password.count()) {
  await password.fill('chitea');
  const submit = page.locator('button[type="submit"], input[type="submit"]').first();
  await submit.click();
  await page.waitForLoadState('domcontentloaded');
}
for (const [name, href] of pages) {
  await page.setViewportSize({ width: 1440, height: 1600 });
  await page.goto(base + href, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1200);
  console.log(name, await page.locator('.ats-store-actions .ats-btn').count());
  await page.screenshot({ path: path.join(out, `${name}-desktop.png`), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(out, `${name}-mobile.png`), fullPage: true });
}
await browser.close();
console.log(out);
