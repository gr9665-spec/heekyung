import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewVisibility, filterReviews, validateReview, latestQuote } from '../js/reviews-core.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const exists = p => existsSync(join(root, p));

const a = { id: 'a', category: 'cert', title: '사회복지사 2급 합격', image: 'img/reviews/a.jpg', date: '2026-05' };
const b = { id: 'b', category: 'transfer', title: '편입 합격', image: 'img/reviews/b.jpg', date: '2026-08', quote: '덕분에 한 번에 붙었어요' };

test('zero reviews → hidden, no count text', () => {
  assert.deepEqual(reviewVisibility(0), { show: false, countText: null });
});

test('some reviews → count text', () => {
  assert.deepEqual(reviewVisibility(3), { show: true, countText: '3건' });
});

test('filterReviews by category', () => {
  assert.deepEqual(filterReviews([a, b], 'cert'), [a]);
  assert.deepEqual(filterReviews([a, b], 'all'), [a, b]);
});

test('latestQuote picks newest item with quote', () => {
  assert.equal(latestQuote([a, b]).id, 'b');
  assert.equal(latestQuote([a]), null);
});

test('validateReview flags bad path and missing file', () => {
  assert.ok(validateReview({ ...a, image: 'x.jpg' }, () => true).length > 0);
  assert.ok(validateReview(a, () => false).length > 0);
  assert.ok(validateReview({ ...a, category: 'etc' }, () => true).length > 0);
  assert.ok(validateReview({ ...a, date: '2026/05' }, () => true).length > 0);
  assert.deepEqual(validateReview(a, () => true), []);
});

test('data/reviews.json entries are all valid', () => {
  const list = JSON.parse(readFileSync(join(root, 'data/reviews.json'), 'utf8'));
  assert.ok(Array.isArray(list));
  for (const r of list) assert.deepEqual(validateReview(r, exists), [], r.id);
});
