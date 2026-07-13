'use strict';

/**
 * Compares parser output against a gold standard.
 *
 *   node scripts/compare.js [path/to/golden.json]
 *
 * Defaults to goldens/golden-v1.json.
 */

const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('../src/parser');

const root = path.join(__dirname, '..');
const goldenPath = process.argv[2] ?? path.join(root, 'goldens', 'golden-v1.json');
const inputPath = path.join(root, 'sample-input', 'logs.txt');

const golden = JSON.parse(fs.readFileSync(goldenPath, 'utf8'));
const actual = parse(fs.readFileSync(inputPath, 'utf8'));

const goldenStr = JSON.stringify(golden, null, 2);
const actualStr = JSON.stringify(actual, null, 2);

if (goldenStr === actualStr) {
    console.log(`PASS — output matches ${path.relative(root, goldenPath)} (${golden.length} events)`);
    process.exit(0);
}

console.error(`FAIL — output does not match ${path.relative(root, goldenPath)}`);
console.error(`  expected ${golden.length} events, got ${actual.length}`);
const max = Math.max(golden.length, actual.length);
for (let i = 0; i < max; i++) {
    const e = JSON.stringify(golden[i]);
    const a = JSON.stringify(actual[i]);
    if (e !== a) {
        console.error(`  [${i}] expected: ${e ?? '<missing>'}`);
        console.error(`      actual:   ${a ?? '<missing>'}`);
    }
}
process.exit(1);
