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

test('no hotlinked images', () => {
  const files = [...pages, 'css/style.css'];
  for (const f of files) {
    const txt = read(f);
    for (const s of ['images.unsplash.com', 'pstatic.net']) assert.ok(!txt.includes(s), `${f} has ${s}`);
  }
});
