// Self-check for title search folding and highlight mapping in index.html. Run: node check-search.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const src = html.slice(html.indexOf('    function normalizeSearchText'), html.indexOf('    const songSearchIndex'));
const { normalizeSearchText: fold, findTitleMatchRange: find } = new Function(`${src}; return { normalizeSearchText, findTitleMatchRange };`)();

const hit = (title, query) => { const r = find(title, fold(query)); return r && title.slice(...r); };
const day = 'Lord’s Day - Ordinary Time';
assert.equal(hit(day, 'lords day'), 'Lord’s Day');
assert.equal(hit(day, "lord's"), 'Lord’s');
assert.equal(hit(day, 'lord’s d'), 'Lord’s D');
assert.equal(hit('Ilumina O Señor', 'senor'), 'Señor');
assert.equal(find(day, fold('xyz')), null);
console.log('search ok');
