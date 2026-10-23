import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tableRows, TABS } from '../js/courses-core.js';

test('transfer table has 5 education rows', () => {
  const rows = tableRows('transfer');
  assert.equal(rows.length, 5);
  assert.deepEqual(rows[0], { eduLabel: '고졸', level: 'high', headline: '가능성 높아요', period: '보통 8개월' });
});

test('cert table rows per certificate', () => {
  const rows = tableRows('cert', 'gisa');
  assert.equal(rows.length, 5);
  assert.equal(rows[0].period, '보통 1년');
});

test('tabs cover all four goals', () => {
  assert.deepEqual(Object.keys(TABS), ['degree', 'transfer', 'cert', 'grad']);
});
