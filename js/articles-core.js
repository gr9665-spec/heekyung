// 교육정보 카드 데이터 규칙 (DOM 없음)
export const sortArticles = list => [...list].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

export function validateArticle(a, fileExists) {
  const err = [];
  if (!a.title) err.push('title 없음');
  if (!/^https:\/\/(m\.)?blog\.naver\.com\//.test(a.url ?? '')) err.push(`url은 네이버 블로그 글: ${a.url}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date ?? '')) err.push(`date 형식(YYYY-MM-DD): ${a.date}`);
  if (!String(a.thumb ?? '').startsWith('img/articles/')) err.push(`thumb 경로: ${a.thumb}`);
  else if (!fileExists(a.thumb)) err.push(`thumb 파일 없음: ${a.thumb}`);
  return err;
}
