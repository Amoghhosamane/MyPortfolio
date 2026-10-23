import fs from 'fs';
const content = fs.readFileSync('scratch/dump.html', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('class="cursor-grid__canvas"')) {
    console.log(`DOM Match on line ${i}:`);
    const idx = lines[i].indexOf('class="cursor-grid__canvas"');
    console.log(lines[i].substring(Math.max(0, idx - 150), idx + 200));
    break;
  }
}
