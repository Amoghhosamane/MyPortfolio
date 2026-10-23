import fs from 'fs';
const content = fs.readFileSync('scratch/dump.html', 'utf8');
const lines = content.split('\n');
console.log(lines[2920].substring(0, 1000));
