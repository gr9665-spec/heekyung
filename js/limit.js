// 상담 신청 연속 제출 제한 — 같은 브라우저에서 24시간에 3번까지
export const LIMIT = 3;
export const WINDOW_MS = 24 * 3600e3;

const recent = (history, now) =>
  (Array.isArray(history) ? history : []).filter(t => typeof t === 'number' && now - t < WINDOW_MS);

export function checkLimit(history, now = Date.now()) {
  const h = recent(history, now);
  return h.length < LIMIT ? { ok: true } : { ok: false, retryAt: Math.min(...h) + WINDOW_MS };
}

export const recordSend = (history, now = Date.now()) => [...recent(history, now), now];

// 브라우저 저장소 (막혀 있으면 이 페이지 안에서만 센다)
const KEY = 'hk_consult_sends';
let memory = [];

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? memory; } catch { return memory; }
}

export function saveHistory(h) {
  memory = h;
  try { localStorage.setItem(KEY, JSON.stringify(h)); } catch { /* 저장 불가 */ }
}
