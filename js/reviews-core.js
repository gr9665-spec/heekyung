// 후기 데이터 규칙 (DOM 없음)
export const REVIEW_CATS = { degree: '학위', cert: '자격증', transfer: '편입', grad: '대학원' };

export function reviewVisibility(count) {
  return count > 0 ? { show: true, countText: `${count}건` } : { show: false, countText: null };
}

export const filterReviews = (list, cat) => cat === 'all' ? list : list.filter(r => r.category === cat);

const byDateDesc = (x, y) => y.date.localeCompare(x.date);

export const latestQuote = list => [...list].filter(r => r.quote).sort(byDateDesc)[0] ?? null;

export const sortReviews = list => [...list].sort(byDateDesc);

export function validateReview(r, fileExists) {
  const err = [];
  if (!r.id) err.push('id 없음');
  if (!REVIEW_CATS[r.category]) err.push(`category 잘못됨: ${r.category}`);
  if (!r.title) err.push('title 없음');
  if (!/^\d{4}-\d{2}$/.test(r.date ?? '')) err.push(`date 형식(YYYY-MM): ${r.date}`);
  if (!String(r.image ?? '').startsWith('img/reviews/')) err.push(`image 경로: ${r.image}`);
  else if (!fileExists(r.image)) err.push(`image 파일 없음: ${r.image}`);
  return err;
}
