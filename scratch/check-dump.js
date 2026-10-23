import fs from 'fs';
const content = fs.readFileSync('scratch/dump.html', 'utf8');
const idx = content.indexOf('id="home"');
console.log(content.substring(idx, idx + 1200));
