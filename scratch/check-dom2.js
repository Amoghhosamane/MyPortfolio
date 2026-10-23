import fs from 'fs';
const content = fs.readFileSync('scratch/dump2.html', 'utf8');
const idx = content.indexOf('AI products');
console.log('--- BEFORE AI PRODUCTS (600 chars) ---');
console.log(content.substring(Math.max(0, idx - 600), idx));
console.log('--- AFTER AI PRODUCTS (400 chars) ---');
console.log(content.substring(idx, idx + 400));
