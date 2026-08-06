import fs from 'fs';
import path from 'path';

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const buildSrc = path.resolve('artifacts/anderson-pt/dist/public');

if (fs.existsSync(buildSrc)) {
  console.log('Copying build output to root public & dist folders...');
  copyDir(buildSrc, path.resolve('public'));
  copyDir(buildSrc, path.resolve('dist'));
  console.log('Build output copied successfully!');
} else {
  console.error('Build output not found at:', buildSrc);
}
