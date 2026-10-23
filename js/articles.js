// 교육정보 카드 렌더 — 클릭 시 네이버 블로그 글로 이동
import { sortArticles } from './articles-core.js';
import { CHANNELS } from './config.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export async function initArticles() {
  let list = [];
  try {
    const res = await fetch('data/articles.json', { cache: 'no-cache' });
    if (res.ok) list = await res.json();
  } catch { /* 실패 = 0건 */ }
  const items = sortArticles(list);
  document.documentElement.classList.toggle('has-articles', items.length > 0);
  const sec = document.getElementById('news');
  if (!sec || !items.length) return;
  // 같은 카드 묶음을 두 번 이어 붙여 끊김 없이 흐르게 한다 (두 번째 묶음은 화면 읽기·탭 이동에서 제외)
  const card = (a, dup) => `
    <a href="${esc(a.url)}" target="_blank" rel="noopener"${dup ? ' class="dup" tabindex="-1" aria-hidden="true"' : ''}>
      <img src="${esc(a.thumb)}" alt="" loading="lazy">
      <div class="tx"><small>${esc(a.category)}</small><h3>${esc(a.title)}</h3><time datetime="${esc(a.date)}">${esc(a.date.replaceAll('-', '.'))}</time></div>
    </a>`;
  const track = sec.querySelector('.news-track');
  track.innerHTML = items.map(a => card(a, false)).join('') + items.map(a => card(a, true)).join('');
  track.style.setProperty('--dur', `${items.length * 5}s`);
  const more = sec.querySelector('.to-blog');
  if (CHANNELS.blog) more.querySelector('a').href = CHANNELS.blog;
  else more.hidden = true;
}
