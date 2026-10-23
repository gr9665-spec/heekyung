// 상담 폼 전송 — EmailJS (정민쌤 사이트 contact.js 흐름과 동일)
import { EMAILJS, CONTACT } from './config.js';
import { normalizePhone, buildPayload } from './consult-core.js';

const SDK = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
const FALLBACK = `카카오톡 ${CONTACT.kakaoId}로 문의해 주세요.`;

const loadSdk = () => window.emailjs ? Promise.resolve(window.emailjs) : new Promise((ok, fail) => {
  const s = document.createElement('script');
  s.src = SDK;
  s.onload = () => ok(window.emailjs);
  s.onerror = fail;
  document.head.append(s);
});

const form = document.getElementById('consult-form');
if (form) {
  const btn = form.querySelector('button[type="submit"]');
  const label = btn.textContent;
  const status = form.querySelector('.form-status');
  const phone = form.phone;
  let sending = false;

  const setStatus = (msg, type = '') => {
    status.textContent = msg;
    status.className = `form-status ${type}`.trim();
  };

  phone.addEventListener('input', () => phone.setCustomValidity(''));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (sending) return;
    if (form.website.value) return; // 스팸봇

    phone.setCustomValidity(normalizePhone(phone.value) ? '' : '휴대폰 번호를 확인해 주세요');
    if (!form.reportValidity()) return;

    if (!EMAILJS.publicKey || !EMAILJS.serviceId || !EMAILJS.templateId) {
      setStatus(`상담 신청 준비 중이에요. ${FALLBACK}`, 'error');
      return;
    }

    sending = true;
    btn.disabled = true;
    btn.textContent = '보내는 중…';
    setStatus('');
    try {
      const fields = Object.fromEntries(new FormData(form));
      const payload = buildPayload({ ...fields, page: location.pathname });
      const emailjs = await loadSdk();
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, payload, { publicKey: EMAILJS.publicKey });
      setStatus('접수됐어요. 확인 후 희경쌤이 직접 연락드릴게요.', 'ok');
      form.reset();
      form.querySelector('.diag-note').hidden = true;
    } catch (err) {
      console.error(err);
      setStatus(`전송에 실패했어요. ${FALLBACK}`, 'error');
    } finally {
      sending = false;
      btn.disabled = false;
      btn.textContent = label;
    }
  });
}
