import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const [source = 'dist/index.html', output = 'EduardoOliveira.pdf'] = process.argv.slice(2);

// GitHub's Ubuntu runners block Chrome's sandbox; we only render our own local HTML.
const browser = await puppeteer.launch({ args: process.env.CI ? ['--no-sandbox'] : [] });
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(resolve(source)).href, { waitUntil: 'networkidle0' });
  await page.pdf({ path: output, format: 'A4', scale: 0.4, printBackground: true });
} finally {
  await browser.close();
}
