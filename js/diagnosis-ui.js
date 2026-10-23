// 진단 폼 ↔ 결과 카드, 상담 폼 hidden 필드 채우기
import { diagnose, EDU, GOALS, CERTS } from './diagnosis.js';
import { openConsult } from './site.js';

const box = document.querySelector('#check .box');
if (box) {
  const form = box.querySelector('form');
  const certSet = form.querySelector('[data-cert]');
  const out = box.querySelector('.result');
  const consult = document.getElementById('consult-form');

  const chips = (name, map) => Object.entries(map).map(([v, t]) =>
    `<label><input type="radio" name="${name}" value="${v}"><span>${t}</span></label>`).join('');
  form.querySelector('[data-edu]').innerHTML = chips('edu', EDU);
  form.querySelector('[data-goal]').innerHTML = chips('goal', GOALS);
  certSet.querySelector('.chips').innerHTML = chips('cert', CERTS);

  const val = n => form.querySelector(`input[name="${n}"]:checked`)?.value;
  const pick = (n, v) => { form.querySelector(`input[name="${n}"][value="${v}"]`).checked = true; };

  // 빈 화면에 보여줄 "자주 받는 질문" (학력, 목표, 자격증, 질문)
  const EXAMPLES = [
    ['hs', 'transfer', null, '고졸인데 4년제 편입이 될까요?'],
    ['univ_grad', 'cert', 'sw', '대학 졸업했는데 사회복지사 2급은 얼마나 걸려요?'],
    ['jc_grad', 'grad', null, '전문대 졸업인데 대학원 갈 수 있나요?'],
  ];

  const setHidden = (edu, goal, cert, text) => {
    if (!consult) return;
    consult.diag_edu.value = edu ? EDU[edu] : '';
    consult.diag_goal.value = goal || '';
    consult.diag_cert.value = goal === 'cert' && cert ? CERTS[cert] : '';
    consult.diag_result.value = text || '';
    const note = consult.querySelector('.diag-note');
    note.hidden = !text;
    note.textContent = text ? `진단 결과 함께 전달: ${EDU[edu]} → ${GOALS[goal]}` : '';
  };

  const render = () => {
    const edu = val('edu'), goal = val('goal');
    certSet.hidden = goal !== 'cert';
    if (goal !== 'cert') certSet.querySelectorAll('input').forEach(i => { i.checked = false; });
    const cert = val('cert');

    if (!edu && !goal) {
      out.innerHTML = `
        <p class="lab on-dark">가장 많이 받는 질문</p>
        <p class="ex-title">눌러서 바로 확인해 보세요</p>
        <div class="examples">${EXAMPLES.map(([e, g, c, q], i) =>
          `<button type="button" data-ex="${i}"><span>“${q}”</span><em>${EDU[e]} · ${c ? CERTS[c] : GOALS[g]}</em></button>`).join('')}</div>
        <p class="ex-hint">또는 왼쪽에서 최종학력과 목표를 골라 주세요.</p>`;
      out.querySelectorAll('[data-ex]').forEach(b => b.addEventListener('click', () => {
        const [e, g, c] = EXAMPLES[b.dataset.ex];
        pick('edu', e); pick('goal', g); if (c) { certSet.hidden = false; pick('cert', c); }
        render();
      }));
      setHidden();
      return;
    }

    if (!edu || !goal || (goal === 'cert' && !cert)) {
      const step = !edu ? ['01', '최종학력'] : goal === 'cert' ? ['03', '자격증 종류'] : ['02', '목표'];
      out.innerHTML = `
        <p class="lab on-dark">거의 다 됐어요</p>
        <p class="ex-title">${step[0]} ${step[1]}만 고르면<br>결과가 나와요.</p>`;
      setHidden();
      return;
    }

    const r = diagnose(edu, goal, cert);
    const title = `${EDU[edu]} · ${goal === 'cert' ? CERTS[cert] : GOALS[goal]}`;
    out.innerHTML = `
      <p class="lab on-dark">${title}</p>
      <p class="head">${r.headline}</p>
      ${r.period ? `<p class="period">${r.period}</p>` : ''}
      <p class="note">내 상황에 맞는 정확한 계획은 희경쌤이 직접 알려드려요.<br>전적대 학점, 자격증, 남은 기간까지 같이 봐야 정확해요.</p>
      <div class="acts">
        <a class="btn btn-gold" href="index.html#apply" data-go>이 내용으로 상담 신청</a>
        <a class="btn btn-kakao" href="#" data-kakao-r>카카오톡</a>
        <a class="btn btn-line" href="tel:01021000321">전화</a>
      </div>
      <a class="more" href="courses.html${r.courseHash}">과정 안내 보기</a>`;
    setHidden(edu, goal, cert, `${title} — ${r.headline}${r.period ? ' · ' + r.period : ''}`);
    out.querySelector('[data-go]').addEventListener('click', e => { e.preventDefault(); openConsult(); });
    out.querySelector('[data-kakao-r]').addEventListener('click', e => {
      e.preventDefault();
      document.querySelector('[data-kakao]')?.click();
    });
  };

  form.addEventListener('change', render);
  render();
}
