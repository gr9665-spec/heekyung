// 과정 안내: 탭 전환(URL hash 동기화) + 표 렌더
import { tableRows, TABS } from './courses-core.js';
import { CERTS } from './diagnosis.js';

const table = rows => `
  <table class="tbl">
    <thead><tr><th>최종학력</th><th>가능 여부</th><th>대략 기간</th></tr></thead>
    <tbody>${rows.map(r => `<tr><td>${r.eduLabel}</td><td><span class="lv ${r.level}">${r.headline}</span></td><td>${r.period}</td></tr>`).join('')}</tbody>
  </table>`;

document.querySelectorAll('[data-table]').forEach(el => {
  const [goal, cert] = el.dataset.table.split(':');
  el.innerHTML = (cert ? `<h3>${CERTS[cert]}</h3>` : '') + table(tableRows(goal, cert));
});

const tabs = [...document.querySelectorAll('.tabs a')];
const show = id => {
  if (!TABS[id]) id = 'degree';
  tabs.forEach(a => a.setAttribute('aria-selected', String(a.hash === `#${id}`)));
  document.querySelectorAll('.panel').forEach(p => { p.hidden = p.dataset.panel !== id; });
};
tabs.forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  history.replaceState(null, '', a.hash);
  show(a.hash.slice(1));
}));
addEventListener('hashchange', () => show(location.hash.slice(1)));
show(location.hash.slice(1));
