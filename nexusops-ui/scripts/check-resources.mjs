// Browser smoke check for the Resources library. Start Vite first.
// RESOURCE_BASE_URL=http://127.0.0.1:5175 BROWSER_PATH=<Chrome path> node scripts/check-resources.mjs
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const base = process.env.RESOURCE_BASE_URL || 'http://127.0.0.1:5175';
const executable = process.env.BROWSER_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/chromium', '/usr/bin/google-chrome',
].find(existsSync);
assert(executable, 'Set BROWSER_PATH to an installed Chromium browser.');
const directory = readFileSync(new URL('../src/pages/resource-directory.ts', import.meta.url), 'utf8');
const articles = [...directory.matchAll(/key: '([^']+)', group: '[^']+', title: '([^']+)'/g)].map(([, key, title]) => ({ key, title }));
assert.equal(articles.length, 12);
const output = mkdtempSync(join(tmpdir(), 'nexusops-resource-check-'));
const browser = spawn(executable, ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${join(output, 'profile')}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
let session;
const pending = new Map();
let counter = 0;
const exceptions = [];
const checks = [];
function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++counter;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)); }, 25000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, session);
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function until(expression) {
  const started = Date.now();
  while (Date.now() - started < 15000) {
    try { if (await evaluate(expression)) return; }
    catch (error) { if (!/navigated|context|closed/i.test(error.message)) throw error; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`UI condition timed out: ${expression}`);
}
async function open(article) {
  await send('Page.navigate', { url: `${base}/#resource-${article.key}` }, session);
  await until(`document.querySelector('h1')?.textContent === ${JSON.stringify(article.title)}`);
  await evaluate('document.fonts.ready.then(() => true)');
  await evaluate('window.scrollTo(0, 0)');
}
async function screenshot(name) {
  await evaluate('Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})))');
  const { data } = await send('Page.captureScreenshot', { format: 'png' }, session);
  writeFileSync(join(output, name), Buffer.from(data, 'base64'));
}
async function viewport(width, height) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 }, session);
}
try {
  const endpoint = await new Promise((resolve, reject) => {
    let logs = '';
    const timer = setTimeout(() => reject(new Error('Chromium did not expose a debugging endpoint.')), 20000);
    browser.once('error', reject);
    browser.stderr.on('data', chunk => {
      logs += chunk.toString();
      const match = logs.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
    const request = pending.get(message.id);
    if (request) { clearTimeout(request.timer); pending.delete(message.id); if (message.error) request.reject(new Error(message.error.message)); else request.resolve(message.result); }
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  ({ sessionId: session } = await send('Target.attachToTarget', { targetId, flatten: true }));
  await send('Page.enable', {}, session);
  await send('Runtime.enable', {}, session);
  for (const [width, height] of [[1440, 1100], [768, 1024], [390, 844]]) {
    await viewport(width, height);
    for (const article of articles) {
      await open(article);
      const state = await evaluate(`({h1:document.querySelectorAll('h1').length,sections:document.querySelectorAll('.rd-section').length,width:document.documentElement.scrollWidth,viewport:innerWidth,active:document.querySelector('.rd-browse a[aria-current]')?.getAttribute('href'),title:document.title,metadata:document.querySelector('.rd-metadata')?.textContent,links:[...document.querySelectorAll('a[href^="#resource-"]')].map(a=>a.getAttribute('href').slice(10))})`);
      assert.equal(state.h1, 1, `${article.key}: one H1`);
      assert(state.sections >= 2, `${article.key}: substantive content`);
      assert(state.width <= state.viewport + 1, `${article.key} @${width}: page overflow ${state.width}/${state.viewport}`);
      assert.equal(state.active, `#resource-${article.key}`);
      assert(state.title.includes(article.title));
      assert(state.metadata.includes('MVP v3') && state.metadata.includes('25 Sep 2026'), `${article.key}: documented scope baseline`);
      for (const key of state.links) assert(articles.some(a => a.key === key), `Broken resource link: ${key}`);
      checks.push(`${width}px: ${article.key}`);
    }
    await open(articles.find(a => a.key === (width === 390 ? 'roles-permissions' : 'product-documentation')));
    await screenshot(`resources-${width}.png`);
    if (width === 390) {
      await evaluate(`document.getElementById('rd-matrix').scrollIntoView()`);
      await screenshot('resources-mobile-table.png');
    }
  }
  const helpArticle = articles.find(a => a.key === 'help-support');
  await viewport(1440, 1100);
  await open(helpArticle);
  await evaluate(`document.getElementById('rd-quick').scrollIntoView({block:'center'})`);
  await screenshot('resources-support-triage-1440.png');
  await evaluate(`document.querySelector('.rd-support-template').scrollIntoView({block:'center'})`);
  await screenshot('resources-support-report-1440.png');
  await viewport(390, 844);
  await open(helpArticle);
  await evaluate(`document.getElementById('rd-quick').scrollIntoView({block:'center'})`);
  await screenshot('resources-support-triage-390.png');
  await evaluate(`document.querySelector('.rd-support-template').scrollIntoView({block:'center'})`);
  await screenshot('resources-support-report-390.png');
  await viewport(1440, 1100);
  await open(articles.find(a => a.key === 'incident-glossary'));
  await evaluate(`document.querySelector('.rd-topics button:nth-child(4)').click()`);
  await until(`document.querySelectorAll('.rd-glossary dt').length === 6`);
  await evaluate(`const input=document.querySelector('[aria-label="Search glossary"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'zz-no-result');input.dispatchEvent(new Event('input',{bubbles:true}));`);
  await until(`document.querySelector('.rd-empty') !== null`);
  await evaluate(`document.querySelector('.rd-empty button').click()`);
  await until(`document.querySelectorAll('.rd-glossary dt').length === 25`);
  checks.push('Glossary category + search + empty state + clear');
  await evaluate(`const resourceInput=document.querySelector('[aria-label="Search resources"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(resourceInput,'episodeId');resourceInput.dispatchEvent(new Event('input',{bubbles:true}));`);
  await until(`document.querySelector('.rd-search-results a[href="#resource-api-reference"]') !== null`);
  await evaluate(`document.querySelector('.rd-search-results a[href="#resource-api-reference"]').click()`);
  await until(`document.querySelector('h1')?.textContent === 'API Reference'`);
  const payload = await evaluate(`document.querySelector('.rd-code code').textContent`);
  assert.equal(JSON.parse(payload).eventType, 'TRIGGER');
  checks.push('Full-text resource search + result navigation + valid JSON example');
  await open(articles.find(a => a.key === 'help-support'));
  const support = await evaluate(`({template:document.querySelector('#rd-support-template')?.value,tableRows:document.querySelectorAll('section[aria-labelledby="rd-quick"] .rd-table-wrap tbody tr').length,guideLinks:document.querySelectorAll('section[aria-labelledby="rd-quick"] .rd-table-wrap tbody a[href^="#resource-"]').length,status:document.querySelector('.rd-support-status')?.textContent})`);
  assert(support.template.includes('Steps to reproduce:') && support.template.includes('Do not include passwords'));
  assert.equal(support.tableRows, 5);
  assert.equal(support.guideLinks, 5);
  assert(support.status.includes('No ticket or email is sent'));
  await evaluate(`document.querySelector('.rd-support-template-head button').click()`);
  await until(`document.querySelector('.rd-support-status').textContent.includes('Template copied') || document.querySelector('.rd-support-status').textContent.includes('Clipboard unavailable')`);
  checks.push('Help triage table + safe issue-report template + honest support boundary');
  await evaluate(`document.querySelector('.rd-faq summary').click()`);
  assert(await evaluate(`document.querySelector('.rd-faq details').open`));
  await evaluate(`document.querySelector('.rd-start').click()`);
  assert.equal(await evaluate(`document.activeElement.id`), 'rd-quick');
  await evaluate(`[...document.querySelectorAll('.rd-header button')].find(b=>b.textContent.includes('Resources')).click()`);
  await until(`document.querySelector('.resources-panel') !== null`);
  await evaluate(`document.querySelector('.resources-panel summary').click();document.querySelector('.resource-open-link').click()`);
  await until(`document.querySelector('h1')?.textContent === 'Product Documentation'`);
  checks.push('FAQ expansion + reading focus + Resources menu navigation');
  assert.equal(exceptions.length, 0, JSON.stringify(exceptions));
  writeFileSync(join(output, 'result.json'), JSON.stringify({ checks, exceptions }, null, 2));
  console.log(JSON.stringify({ passed: checks.length, output, exceptions: exceptions.length }, null, 2));
} finally {
  if (socket?.readyState === WebSocket.OPEN) { try { await send('Browser.close'); } catch { /* Chromium may close before replying. */ } socket.close(); }
  browser.kill();
}
