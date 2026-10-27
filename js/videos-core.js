// 유튜브 영상 카드 데이터 규칙 (DOM 없음)
export const thumbPath = id => `img/videos/${id}.jpg`;
export const embedUrl = id => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
export const watchUrl = id => `https://www.youtube.com/watch?v=${id}`;

export function validateVideo(v, fileExists) {
  const err = [];
  if (!/^[A-Za-z0-9_-]{11}$/.test(v.id ?? '')) err.push(`id 형식: ${v.id}`);
  else if (!fileExists(thumbPath(v.id))) err.push(`썸네일 없음: ${thumbPath(v.id)}`);
  if (!v.title) err.push('title 없음');
  return err;
}
