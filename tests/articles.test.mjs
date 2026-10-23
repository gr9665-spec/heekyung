import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sortArticles, validateArticle } from '../js/articles-core.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ok = { title: '제목', category: '자격증', url: 'https://blog.naver.com/x/1', thumb: 'img/articles/1.jpg', date: '2026-10-01' };

test('sortArticles newest first, max 12', () => {
  const list = Array.from({ length: 14 }, (_, i) => ({ ...ok, date: `2026-10-${String(i + 1).padStart(2, '0')}` }));
  const out = sortArticles(list);
  assert.equal(out.length, 12);
  assert.equal(out[0].date, '2026-10-14');
});

test('validateArticle rules', () => {
  assert.deepEqual(validateArticle(ok, () => true), []);
  assert.deepEqual(validateArticle({ ...ok, url: 'https://m.blog.naver.com/x/1' }, () => true), []);
  assert.ok(validateArticle({ ...ok, url: 'https://example.com' }, () => true).length);
  assert.ok(validateArticle({ ...ok, thumb: 'https://blogthumb.pstatic.net/a.jpg' }, () => true).length);
  assert.ok(validateArticle(ok, () => false).length);
  assert.ok(validateArticle({ ...ok, date: '2026.10.01' }, () => true).length);
  assert.ok(validateArticle({ ...ok, title: '' }, () => true).length);
});

test('data/articles.json entries are all valid', () => {
  const list = JSON.parse(readFileSync(join(root, 'data/articles.json'), 'utf8'));
  for (const a of list) assert.deepEqual(validateArticle(a, p => existsSync(join(root, p))), [], a.title);
});
