// 과정 안내 표 — 진단 문구표(data/diagnosis-table.js)에서 그대로 만든다
import { diagnose, EDU } from './diagnosis.js';

export const TABS = { degree: '학위', transfer: '편입', cert: '자격증', grad: '대학원' };

export const tableRows = (goal, cert) => Object.entries(EDU).map(([edu, eduLabel]) => {
  const { level, headline, period } = diagnose(edu, goal, cert);
  return { eduLabel, level, headline, period };
});
