const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(
  /var\(--color-primary\)/g,
  'var(--theme-color, #8AD7D0)'
);

fs.writeFileSync('src/index.css', code);
