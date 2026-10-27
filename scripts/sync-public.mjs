import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      if (entry === 'sync-public.mjs') continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
copyRecursive(path.join(ROOT, 'assets'), path.join(PUBLIC_DIR, 'assets'));
copyRecursive(path.join(ROOT, 'data'), path.join(PUBLIC_DIR, 'data'));
copyRecursive(path.join(ROOT, 'scripts'), path.join(PUBLIC_DIR, 'scripts'));
copyRecursive(path.join(ROOT, 'styles'), path.join(PUBLIC_DIR, 'styles'));
copyRecursive(path.join(ROOT, 'favicon.svg'), path.join(PUBLIC_DIR, 'favicon.svg'));
copyRecursive(path.join(ROOT, 'favicon.ico'), path.join(PUBLIC_DIR, 'favicon.ico'));
