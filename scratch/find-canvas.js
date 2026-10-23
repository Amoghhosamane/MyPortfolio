import fs from 'fs';
const content = fs.readFileSync('scratch/dump.html', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('cursor-grid__canvas')) {
    console.log(`Match on line ${i}: length ${lines[i].length}`);
    const idx = lines[i].indexOf('cursor-grid__canvas');
    console.log('Context around match:');
    console.log(lines[i].substring(Math.max(0, idx - 150), idx + 200));
    break;
  }
}
