import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateVideo, embedUrl, watchUrl } from '../js/videos-core.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ok = { id: 'FyMvmny0Mpw', title: '제목' };

test('embedUrl uses privacy-enhanced domain with autoplay', () => {
  assert.equal(embedUrl('FyMvmny0Mpw'), 'https://www.youtube-nocookie.com/embed/FyMvmny0Mpw?autoplay=1&rel=0');
});

test('watchUrl links to YouTube', () => {
  assert.equal(watchUrl('FyMvmny0Mpw'), 'https://www.youtube.com/watch?v=FyMvmny0Mpw');
});

test('validateVideo rules', () => {
  assert.deepEqual(validateVideo(ok, () => true), []);
  assert.ok(validateVideo({ ...ok, id: 'bad id' }, () => true).length);
  assert.ok(validateVideo({ ...ok, title: '' }, () => true).length);
  assert.ok(validateVideo(ok, () => false).length, 'thumbnail must exist');
});

test('data/videos.json entries are all valid', () => {
  const list = JSON.parse(readFileSync(join(root, 'data/videos.json'), 'utf8'));
  assert.ok(list.length > 0);
  for (const v of list) assert.deepEqual(validateVideo(v, p => existsSync(join(root, p))), [], v.id);
});
