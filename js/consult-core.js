// 상담 접수 순수 로직: 연락처 정리, 메일 데이터 조립
import { GOALS } from './diagnosis.js';

export function normalizePhone(s) {
  const raw = String(s ?? '').trim();
  if (!/^[\d\s-]+$/.test(raw)) return null;
  const d = raw.replace(/\D/g, '');
  if (!/^(010\d{8}|01[16789]\d{7,8})$/.test(d)) return null;
  return d.length === 11
    ? `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
    : `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

export const validEmail = s => {
  const v = String(s ?? '').trim();
  return v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

const txt = (v, max = 200) => String(v ?? '').trim().slice(0, max);

const kst = now => {
  const t = new Date(now.getTime() + 9 * 3600e3).toISOString();
  return `${t.slice(0, 10)} ${t.slice(11, 16)}`;
};

export function buildPayload(f, now = new Date()) {
  const goal = f.diag_goal || '';
  return {
    name: String(f.name ?? '').trim(),
    phone: normalizePhone(f.phone) ?? String(f.phone ?? '').trim(),
    interest: f.interest || '',
    diag_edu: f.diag_edu || '',
    diag_goal: GOALS[goal] || '',
    diag_cert: goal === 'cert' ? f.diag_cert || '' : '',
    diag_result: f.diag_result || '',
    method: txt(f.method, 20),
    email: txt(f.email, 100),
    edu: txt(f.edu, 40),
    message: txt(f.message, 1000),
    page: f.page || '',
    sent_at: kst(now),
  };
}
