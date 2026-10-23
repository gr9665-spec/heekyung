// 후기 로드 → 노출 여부, 숫자, 히어로 한 줄, 미리보기/후기 페이지/과정별 후기 렌더
import { reviewVisibility, filterReviews, latestQuote, sortReviews, REVIEW_CATS } from './reviews-core.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const card = r => `
  <button class="rv-card" type="button" data-full="${esc(r.image)}">
    <img src="${esc(r.image)}" alt="${esc(r.title)} 후기 캡처" loading="lazy">
    <div><small>${REVIEW_CATS[r.category]}</small><p>${esc(r.title)}</p></div>
  </button>`;

function openModal(src) {
  const m = document.createElement('div');
  m.className = 'modal';
  m.innerHTML = `<img src="${esc(src)}" alt="후기 원본"><button type="button" aria-label="닫기">×</button>`;
  m.addEventListener('click', () => m.remove());
  document.body.append(m);
}

function fill(grid, list) {
  grid.innerHTML = list.map(card).join('');
  grid.querySelectorAll('[data-full]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.full)));
}

export async function initReviews() {
  let list = [];
  try {
    const res = await fetch('data/reviews.json', { cache: 'no-cache' });
    if (res.ok) list = await res.json();
  } catch { /* 실패 = 0건 취급 */ }
  list = sortReviews(list);

  const v = reviewVisibility(list.length);
  document.documentElement.classList.toggle('has-reviews', v.show);
  if (!v.show) return;

  document.querySelectorAll('[data-review-count]').forEach(el => { el.textContent = v.countText; });

  const q = latestQuote(list);
  document.querySelectorAll('[data-hero-quote]').forEach(el => {
    if (!q) { el.remove(); return; }
    el.innerHTML = `“${esc(q.quote)}”<small>— ${esc(q.title)}</small>`;
  });

  document.querySelectorAll('[data-review-preview]').forEach(g => fill(g, list.slice(0, 4)));
  document.querySelectorAll('[data-review-cat]').forEach(g => {
    const sub = filterReviews(list, g.dataset.reviewCat).slice(0, 3);
    if (sub.length) fill(g, sub); else g.closest('[data-needs-reviews]')?.remove();
  });

  const page = document.querySelector('[data-review-page]');
  if (page) {
    const grid = page.querySelector('.rv-grid');
    const btns = page.querySelectorAll('.filters button');
    const show = cat => {
      btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
      fill(grid, filterReviews(list, cat));
    };
    btns.forEach(b => b.addEventListener('click', () => show(b.dataset.cat)));
    show('all');
  }
}
