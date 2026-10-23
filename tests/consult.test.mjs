import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone, buildPayload } from '../js/consult-core.js';

test('normalizePhone accepts common formats', () => {
  assert.equal(normalizePhone('010-1234-5678'), '010-1234-5678');
  assert.equal(normalizePhone('01012345678'), '010-1234-5678');
  assert.equal(normalizePhone('010 1234 5678'), '010-1234-5678');
  assert.equal(normalizePhone('011-123-4567'), '011-123-4567');
});

test('normalizePhone rejects junk', () => {
  assert.equal(normalizePhone('1234'), null);
  assert.equal(normalizePhone('abc'), null);
  assert.equal(normalizePhone(''), null);
  assert.equal(normalizePhone('02-123-4567'), null);
});

const base = { name: ' 김학생 ', phone: '01012345678', interest: '편입', page: 'index' };
const at = new Date('2026-10-23T03:05:00Z');

test('stale cert dropped when goal is not cert', () => {
  const p = buildPayload({ ...base, diag_edu: '고졸', diag_goal: 'transfer', diag_cert: '사회복지사 2급', diag_result: 'x' }, at);
  assert.equal(p.diag_cert, '');
  assert.equal(p.diag_goal, '편입');
});

test('cert kept when goal is cert', () => {
  const p = buildPayload({ ...base, diag_edu: '고졸', diag_goal: 'cert', diag_cert: '기사', diag_result: 'x' }, at);
  assert.equal(p.diag_cert, '기사');
  assert.equal(p.diag_goal, '자격증');
});

test('no diagnosis → empty diag fields', () => {
  const p = buildPayload(base, at);
  for (const k of ['diag_edu', 'diag_goal', 'diag_cert', 'diag_result']) assert.equal(p[k], '');
});

test('payload normalizes name, phone and KST time', () => {
  const p = buildPayload(base, at);
  assert.equal(p.name, '김학생');
  assert.equal(p.phone, '010-1234-5678');
  assert.equal(p.sent_at, '2026-10-23 12:05');
  assert.equal(p.page, 'index');
});
