// 유튜브 영상 카드 — 처음엔 썸네일만, 누르면 사이트 안 재생 창에서 재생
import { thumbPath, embedUrl, watchUrl } from './videos-core.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function openPlayer(v, opener) {
  const m = document.createElement('div');
  m.className = 'vmodal';
  m.setAttribute('role', 'dialog');
  m.setAttribute('aria-modal', 'true');
  m.setAttribute('aria-label', v.title);
  m.innerHTML = `
    <div class="vbox">
      <div class="vframe"><iframe src="${embedUrl(v.id)}" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>
      <div class="vbar"><p>${esc(v.title)}</p><a href="${watchUrl(v.id)}" target="_blank" rel="noopener">유튜브에서 보기</a></div>
    </div>
    <button type="button" class="vclose" aria-label="닫기">×</button>`;
  const close = () => {
    m.remove();
    document.removeEventListener('keydown', onKey);
    opener?.focus();
  };
  const onKey = e => { if (e.key === 'Escape') close(); };
  m.addEventListener('click', e => { if (e.target === m || e.target.closest('.vclose')) close(); });
  document.addEventListener('keydown', onKey);
  document.body.append(m);
  m.querySelector('.vclose').focus();
}

const grid = document.querySelector('[data-videos]');
if (grid) {
  fetch('data/videos.json', { cache: 'no-cache' })
    .then(r => r.ok ? r.json() : [])
    .catch(() => [])
    .then(list => {
      if (!list.length) { grid.closest('section').hidden = true; return; }
      grid.innerHTML = list.map((v, i) => `
        <button type="button" class="vcard" data-i="${i}">
          <span class="vthumb"><img src="${thumbPath(v.id)}" alt="" loading="lazy" width="640" height="360"><i aria-hidden="true"></i></span>
          <span class="vtitle">${esc(v.title)}</span>
        </button>`).join('');
      grid.querySelectorAll('.vcard').forEach(b =>
        b.addEventListener('click', () => openPlayer(list[b.dataset.i], b)));
    });
}
