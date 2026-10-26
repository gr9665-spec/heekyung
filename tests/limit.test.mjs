import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkLimit, recordSend, LIMIT, WINDOW_MS } from '../js/limit.js';

const T = Date.parse('2026-10-26T03:00:00Z');

test('limit is 3 per 24 hours', () => {
  assert.equal(LIMIT, 3);
  assert.equal(WINDOW_MS, 24 * 3600e3);
});

test('allows first three sends, blocks the fourth', () => {
  let h = [];
  for (let i = 0; i < 3; i++) {
    assert.equal(checkLimit(h, T + i * 1000).ok, true, `send ${i + 1}`);
    h = recordSend(h, T + i * 1000);
  }
  const r = checkLimit(h, T + 5000);
  assert.equal(r.ok, false);
  assert.equal(r.retryAt, T + WINDOW_MS);
});

test('old sends expire after 24 hours', () => {
  const h = [T, T + 1, T + 2];
  assert.equal(checkLimit(h, T + WINDOW_MS + 3).ok, true);
});

test('recordSend drops expired entries', () => {
  assert.deepEqual(recordSend([T - WINDOW_MS - 1, T - 10], T), [T - 10, T]);
});

test('junk history is ignored', () => {
  assert.equal(checkLimit(['x', null, {}], T).ok, true);
  assert.equal(checkLimit('not-an-array', T).ok, true);
});
