import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = readdirSync(root).filter(f => f.endsWith('.html'));
const read = f => readFileSync(join(root, f), 'utf8');

const navHrefs = html => {
  const nav = html.match(/<nav[\s\S]*?<\/nav>/);
  assert.ok(nav, 'nav block missing');
  return [...nav[0].matchAll(/href="([^"]+)"/g)].map(m => m[1]).sort();
};

test('index.html exists', () => {
  assert.ok(pages.includes('index.html'));
});

test('every page has legal footer', () => {
  for (const p of pages) {
    const html = read(p);
    for (const s of ['418-09-09355', '에듀솔루션', 'privacy.html']) {
      assert.ok(html.includes(s), `${p} missing ${s}`);
    }
  }
});

test('every page has same nav', () => {
  const base = navHrefs(read('index.html'));
  for (const p of pages) assert.deepEqual(navHrefs(read(p)), base, p);
});

test('no placeholders shipped', () => {
  for (const p of pages) {
    const html = read(p);
    for (const s of ['[○○', '○○건', 'TODO']) assert.ok(!html.includes(s), `${p} has ${s}`);
  }
});

test('index sections follow spec order', () => {
  const html = read('index.html');
  const ids = ['check', 'support', 'reviews', 'news', 'contact'].map(id => html.indexOf(`id="${id}"`));
  assert.ok(ids.every(i => i > 0), `missing section: ${ids}`);
  assert.deepEqual([...ids].sort((a, b) => a - b), ids);
});

test('all pages exist', () => {
  for (const p of ['index.html', 'about.html', 'courses.html', 'reviews.html', 'privacy.html']) {
    assert.ok(pages.includes(p), p);
  }
});

test('privacy policy discloses overseas transfer', () => {
  const html = read('privacy.html');
  for (const s of ['국외 이전', '이전 국가', 'EmailJS']) assert.ok(html.includes(s), s);
});

test('consent notice near the form states item, purpose, period, right to refuse', () => {
  const form = read('index.html').match(/<form id="consult-form"[\s\S]*?<\/form>/)[0];
  for (const s of ['이름·연락처', '상담 연락', '1년', '거부']) assert.ok(form.includes(s), s);
});

test('consult buttons use the in-page form, not naver form', () => {
  for (const p of pages) assert.ok(!read(p).includes('form.naver.com'), p);
});

test('no hotlinked images', () => {
  const files = [...pages, 'css/style.css'];
  for (const f of files) {
    const txt = read(f);
    for (const s of ['images.unsplash.com', 'pstatic.net']) assert.ok(!txt.includes(s), `${f} has ${s}`);
  }
});

test('index has Organization structured data matching config', async () => {
  const { CHANNELS, CONTACT } = await import('../js/config.js');
  const m = read('index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(m, 'JSON-LD missing');
  const data = JSON.parse(m[1]);
  const org = data['@graph'].find(n => n['@type'] === 'Organization');
  assert.equal(org.name, '학점은행제 희경쌤');
  assert.equal(org.parentOrganization.name, '에듀솔루션');
  assert.deepEqual([...org.sameAs].sort(), Object.values(CHANNELS).filter(Boolean).sort());
  assert.equal(org.contactPoint.telephone, '+82-' + CONTACT.phone.slice(1));
  assert.ok(data['@graph'].some(n => n['@type'] === 'WebSite'));
});
