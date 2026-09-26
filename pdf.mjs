import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const [source = 'dist/index.html', output = 'EduardoOliveira.pdf'] = process.argv.slice(2);

const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(resolve(source)).href, { waitUntil: 'networkidle0' });
  await page.pdf({ path: output, format: 'A4', scale: 0.4, printBackground: true });
} finally {
  await browser.close();
}
