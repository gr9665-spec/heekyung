// index.html의 공통 블록(<!-- @top --> / <!-- @bottom -->)을 다른 페이지에 복사
// 사용: node tools/sync-layout.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'index.html'), 'utf8');
const block = name => new RegExp(`<!-- @${name} -->[\\s\\S]*?<!-- /@${name} -->`);

for (const f of readdirSync(root).filter(f => f.endsWith('.html') && f !== 'index.html')) {
  let html = readFileSync(join(root, f), 'utf8');
  for (const name of ['top', 'bottom']) {
    if (!block(name).test(html)) throw new Error(`${f}: @${name} 표시 없음`);
    html = html.replace(block(name), src.match(block(name))[0]);
  }
  writeFileSync(join(root, f), html);
  console.log('synced', f);
}
