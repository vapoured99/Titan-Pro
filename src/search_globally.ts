import fs from 'fs';
import path from 'path';

function searchGlobally(dir: string, depth = 0) {
  if (depth > 6) return;
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (['node_modules', '.git', 'dist', 'proc', 'sys', 'dev', 'usr', 'lib', 'lib64', 'root', 'etc', 'sbin', 'bin', 'var'].includes(item)) continue;
      const full = path.join(dir, item);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          searchGlobally(full, depth + 1);
        } else {
          if (item.toLowerCase().endsWith('.png') || item.toLowerCase().endsWith('.jpg') || item.toLowerCase().endsWith('.jpeg') || item.toLowerCase().endsWith('.webp')) {
            console.log(`FOUND: ${full} (${stat.size} bytes)`);
          }
        }
      } catch(e) {}
    }
  } catch(e) {}
}

console.log('--- GLOBAL SEACH FOR ANY IMAGES ---');
searchGlobally('/workspace');
searchGlobally('/home');
searchGlobally('/www-data-home');
searchGlobally('/tmp');
searchGlobally('/app');
console.log('--- END OF GLOBAL SEARCH ---');
