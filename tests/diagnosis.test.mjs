import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diagnose, EDU, GOALS, CERTS } from '../js/diagnosis.js';

test('hs + transfer → high, 8개월', () => {
  assert.deepEqual(diagnose('hs', 'transfer'), {
    level: 'high', headline: '가능성 높아요', period: '보통 8개월', courseHash: '#transfer',
  });
});

test('univ_grad + grad → 바로 지원', () => {
  assert.equal(diagnose('univ_grad', 'grad').period, '지금 바로 지원 가능해요');
});

test('cert etc → ask, no period', () => {
  const r = diagnose('hs', 'cert', 'etc');
  assert.equal(r.level, 'ask');
  assert.equal(r.period, null);
  assert.equal(r.courseHash, '#cert');
});

test('cert without cert choice → ask', () => {
  assert.equal(diagnose('hs', 'cert').level, 'ask');
});

test('cert value ignored for non-cert goal', () => {
  assert.deepEqual(diagnose('hs', 'degree', 'sanup'), diagnose('hs', 'degree'));
});

test('check level headline', () => {
  assert.equal(diagnose('hs', 'grad').headline, '조건 확인이 필요해요');
});

test('every combination has a period', () => {
  for (const e of Object.keys(EDU)) {
    for (const g of Object.keys(GOALS).filter(g => g !== 'cert')) {
      const r = diagnose(e, g);
      assert.ok(typeof r.period === 'string' && r.period.length > 0, `${e}/${g}`);
    }
    for (const c of Object.keys(CERTS).filter(c => c !== 'etc')) {
      const r = diagnose(e, 'cert', c);
      assert.ok(typeof r.period === 'string' && r.period.length > 0, `${e}/cert/${c}`);
    }
  }
});

test('no credit details or hype in copy', () => {
  for (const e of Object.keys(EDU)) {
    for (const g of Object.keys(GOALS)) {
      for (const c of [undefined, ...Object.keys(CERTS)]) {
        const r = diagnose(e, g, c);
        const text = `${r.headline} ${r.period ?? ''}`;
        assert.ok(!text.includes('학점'), text);
        assert.ok(!text.includes('100%'), text);
      }
    }
  }
});

test('unknown input → ask', () => {
  assert.equal(diagnose('x', 'degree').level, 'ask');
});
