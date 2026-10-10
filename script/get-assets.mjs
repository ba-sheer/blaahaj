import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Crediting this to augie and tongyu for assets
const BASE = 'https://jamegam.hackclub.com';
const ROOT = fileURLToPath(new URL('..', import.meta.url));

const FILES = [
  'fonts/augiepixel.ttf',
  'assets/underline550.png',
  'assets/blahaj.png',
  'assets/blahaj.glb',
  'assets/blahaj_prize.png',
];

for (const f of FILES) {
  try {
    const res = await fetch(`${BASE}/${f}`);
    if (!res.ok) {
      console.log('Skipped:', f, res.status);
      continue;
    }

    // Safely resolve the output path
    const out = join(ROOT, 'public', f);

    // Ensure the target directory exists
    await mkdir(dirname(out), { recursive: true });

    // Convert the stream arrayBuffer to a Node Buffer and save
    const arrayBuffer = await res.arrayBuffer();
    await writeFile(out, Buffer.from(arrayBuffer));

    console.log('Saved:', f);
  } catch (e) {
    console.log('Failed:', f, e.message);
  }
}
