const fs = require('fs');
const content = fs.readFileSync('server/index.js', 'utf-8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('app.get') || line.includes('app.post') || line.includes('app.patch') || line.includes('app.delete') || line.includes('app.put')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
