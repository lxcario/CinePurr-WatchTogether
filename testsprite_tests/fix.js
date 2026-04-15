const fs = require('fs');
const files = fs.readdirSync('testsprite_tests').filter(f => f.endsWith('.py'));
files.forEach(f => {
  const path = 'testsprite_tests/' + f;
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/"--single-process"/g, '""');
  fs.writeFileSync(path, content);
});