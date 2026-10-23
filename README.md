# 학점은행제 희경쌤 사이트

정적 HTML 사이트 (GitHub Pages). 설계: `../heekyung_site_mockups/DESIGN.md`, 계획: `../heekyung_site_mockups/PLAN.md`

## 로컬 미리보기 · 테스트

- 미리보기: 상위 폴더 `.claude/launch.json`의 `heekyung_site` (python http.server 8766)
- 테스트: `npm test` (Node 24 `node:test`)

## 1. 연락처·채널 (`js/config.js`)

전화·카톡 ID·네이버폼, 유튜브/인스타/블로그 URL을 여기서만 바꿉니다. URL이 `null`이면 해당 버튼이 자동으로 숨겨집니다.

## 2. 상담 접수 EmailJS

`js/config.js`의 `EMAILJS`에 희경쌤 계정의 public key / service ID / template ID를 넣습니다. 비어 있으면 접수 대신 "카카오톡 ZMZM65로 문의" 안내가 뜹니다.

EmailJS 템플릿에서 쓸 변수:

| 변수 | 내용 |
|---|---|
| `{{name}}` | 이름 |
| `{{phone}}` | 연락처 (010-0000-0000 형태로 정리됨) |
| `{{interest}}` | 관심 분야 |
| `{{diag_edu}}` `{{diag_goal}}` `{{diag_cert}}` | 간이 진단에서 고른 학력·목표·자격증 (안 했으면 빈칸) |
| `{{diag_result}}` | 진단 결과 한 줄 |
| `{{page}}` | 접수한 페이지 |
| `{{sent_at}}` | 접수 시각 (KST) |

받는 메일 = 템플릿의 To Email. 휴대폰 Gmail 앱 알림을 켜두면 바로 알림이 옵니다.

## 3. 진단 문구 (`data/diagnosis-table.js`)

학력 × 목표별 "가능성 + 기간 한 줄". 과목·학점 내역은 넣지 않습니다(테스트가 '학점' 단어를 막음). 과정 안내 표도 이 파일에서 만들어집니다.

## 4. 캐시

CSS 링크의 `?v=N`을 수정할 때마다 올립니다. JS 모듈은 쿼리 없이 불러옵니다(쿼리를 붙이면 같은 모듈이 두 번 실행됨).

## 5. 후기 추가 방법

1. 받은 캡처·합격증에서 이름·전화번호·얼굴을 가린다 (원문 문장은 고치지 않음).
2. `img/reviews/`에 저장 (가로 900px 안팎, jpg).
3. `data/reviews.json`에 한 줄 추가:
   `{"id":"2026-11-sw-01","category":"cert","title":"사회복지사 2급 합격","image":"img/reviews/2026-11-sw-01.jpg","date":"2026-11","quote":"(캡처 속 문장 그대로, 선택)"}`
   - category: `degree` 학위 / `cert` 자격증 / `transfer` 편입 / `grad` 대학원
4. `npm test` (경로·파일 확인) → 커밋·푸시.

후기가 0건이면 후기 관련 칸·메뉴가 전부 숨겨지고, 1건부터 자동으로 나타납니다. 히어로 한 줄 후기는 `quote`가 있는 가장 최근 후기입니다.

## 6. 공통 머리말·꼬리말

헤더·퀵메뉴(`<!-- @top -->`)와 푸터·모바일 하단바(`<!-- @bottom -->`)는 `index.html`에서만 고치고 `node tools/sync-layout.mjs`로 다른 페이지에 복사합니다.

## 7. 교육정보 카드 추가

1. 블로그 글 대표 이미지를 `img/articles/`에 내려받아 저장 (네이버 이미지 직접 링크 금지 — 막힐 수 있음).
2. `data/articles.json`에 한 줄: `{"title":"…","category":"자격증","url":"https://blog.naver.com/…","thumb":"img/articles/파일.jpg","date":"2026-10-20"}`
3. 최신 5개만 보이고, 0개면 섹션과 메뉴 "교육정보"가 숨겨집니다.

## 8. 상세 상담 신청 페이지 (`contact.html`)

메인 상담바(간단)와 같은 EmailJS 템플릿으로 보냅니다. 상세 페이지에서만 채워지는 변수: `{{method}}` 희망 상담 방식, `{{email}}`, `{{edu}}` 최종 학력, `{{message}}` 문의 내용. 메인 상담바로 접수하면 이 칸들은 비어서 옵니다.
