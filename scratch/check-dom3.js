import fs from 'fs';
const content = fs.readFileSync('scratch/dump2.html', 'utf8');
const idx = content.indexOf('AI products');
console.log('--- BEFORE (1200 chars) ---');
console.log(content.substring(Math.max(0, idx - 1200), idx));
