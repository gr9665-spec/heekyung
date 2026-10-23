// 간이 진단: 학력 × 목표(× 자격증) → 짧은 결과 한 줄
import { TABLE } from '../data/diagnosis-table.js';

export const EDU = {
  hs: '고졸',
  jc_drop: '전문대 중퇴',
  jc_grad: '전문대 졸업',
  univ_drop: '4년제 중퇴',
  univ_grad: '4년제 졸업',
};

export const GOALS = { degree: '학위', transfer: '편입', cert: '자격증', grad: '대학원' };

export const CERTS = {
  sw: '사회복지사 2급',
  childcare: '보육교사 2급',
  sanup: '산업기사',
  gisa: '기사',
  etc: '기타',
};

const HEADLINE = { high: '가능성 높아요', check: '조건 확인이 필요해요' };
const ASK = '자격증마다 요건이 달라요 — 희경쌤에게 물어보세요';

export function diagnose(edu, goal, cert) {
  const courseHash = GOALS[goal] ? `#${goal}` : '#degree';
  const row = goal === 'cert' ? TABLE.cert[cert]?.[edu] : TABLE[goal]?.[edu];
  if (!row || goal === 'cert' && !Object.hasOwn(TABLE.cert, cert)) {
    return { level: 'ask', headline: ASK, period: null, courseHash };
  }
  return { level: row.level, headline: HEADLINE[row.level], period: row.period, courseHash };
}
