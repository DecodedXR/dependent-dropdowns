// Self-check for cascade order, choice lookup and column letters: node test.js
const vm = require('vm'), fs = require('fs'), assert = require('assert');
const ctx = {}; vm.runInNewContext(fs.readFileSync(__dirname + '/Code.gs', 'utf8'), ctx);
const plain = x => JSON.parse(JSON.stringify(x));
const L = [{ sheet: 'S', parent: 1, child: 2 }, { sheet: 'S', parent: 2, child: 3 }, { sheet: 'S', parent: 3, child: 4 }, { sheet: 'S', parent: 6, child: 7 }];
assert.deepEqual(plain(ctx.cascadeOrder_(L, 1, 1)).map(l => l.child), [2, 3, 4]);   // edit A: B, C, D reset in order
assert.deepEqual(plain(ctx.cascadeOrder_(L, 3, 3)).map(l => l.child), [4]);         // edit C: only D
assert.deepEqual(plain(ctx.cascadeOrder_(L, 1, 3)).map(l => l.child), [2, 3, 4]);   // paste A:C: each once
assert.deepEqual(plain(ctx.cascadeOrder_(L, 5, 5)), []);
const map = { usa: ['NYC', 'LA'], france: ['Paris'] };
assert.deepEqual([...ctx.choicesFor_(map, ' USA ')], ['NYC', 'LA']);
assert.deepEqual([...ctx.choicesFor_(map, 'Spain')], []);
assert.equal(ctx.keepChild_('Paris', ['NYC', 'LA']), false);
assert.equal(ctx.keepChild_('', ['NYC']), true);
assert.equal(ctx.colLetter_(1), 'A'); assert.equal(ctx.colLetter_(27), 'AA'); assert.equal(ctx.colLetter_(52), 'AZ');
console.log('ok');
