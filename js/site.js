// 공통 UI: 채널 버튼, 모바일 메뉴, 상담 시트, 카톡 ID 복사
import { CONTACT, CHANNELS } from './config.js';

export function hideMissingChannels(root = document) {
  root.querySelectorAll('[data-channel]').forEach(el => {
    const url = CHANNELS[el.dataset.channel];
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener';
    } else {
      el.hidden = true;
    }
  });
}

export function openConsult() {
  const bar = document.querySelector('.consult-bar');
  if (!bar) {
    location.href = 'index.html#apply';
    return;
  }
  if (matchMedia('(max-width: 767px)').matches) {
    bar.classList.add('open');
    document.body.classList.add('sheet-open');
  } else {
    bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  setTimeout(() => bar.querySelector('input[name="name"]')?.focus({ preventScroll: true }), 350);
}

export function closeConsult() {
  document.querySelector('.consult-bar')?.classList.remove('open');
  document.body.classList.remove('sheet-open');
}

export function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    document.body.append(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2600);
}

async function copyKakao() {
  try {
    await navigator.clipboard.writeText(CONTACT.kakaoId);
    toast(`카카오톡 ID ${CONTACT.kakaoId}가 복사됐어요`);
  } catch {
    toast(`카카오톡 ID: ${CONTACT.kakaoId}`);
  }
}

function init() {
  hideMissingChannels();

  document.querySelectorAll('[data-kakao]').forEach(el =>
    el.addEventListener('click', e => { e.preventDefault(); copyKakao(); }));

  document.querySelectorAll('[data-apply]').forEach(el =>
    el.addEventListener('click', e => { e.preventDefault(); openConsult(); }));

  document.querySelectorAll('[data-sheet-close]').forEach(el =>
    el.addEventListener('click', closeConsult));

  const menuBtn = document.querySelector('.menu-btn');
  menuBtn?.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  if (location.hash === '#apply') openConsult();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
