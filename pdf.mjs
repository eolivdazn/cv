import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const [source = 'dist/index.html', output = 'EduardoOliveira.pdf'] = process.argv.slice(2);

const pageCount = (pdf) => Buffer.from(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;

// GitHub's Ubuntu runners block Chrome's sandbox; we only render our own local HTML.
const browser = await puppeteer.launch({ args: process.env.CI ? ['--no-sandbox'] : [] });
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(resolve(source)).href, { waitUntil: 'networkidle0' });

  // Shrink from 0.4 until the CV fits on a single A4 page.
  let pdf;
  for (let scale = 0.4; scale >= 0.1; scale = Math.round((scale - 0.01) * 100) / 100) {
    pdf = await page.pdf({ format: 'A4', scale, printBackground: true });
    if (pageCount(pdf) === 1) break;
  }
  await writeFile(output, pdf);
} finally {
  await browser.close();
}
