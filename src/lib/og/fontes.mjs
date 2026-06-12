import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const f = (p) => readFileSync(join(process.cwd(), 'node_modules', p));

export function carregarFontes() {
  return [
    { name: 'Fraunces', data: f('@fontsource/fraunces/files/fraunces-latin-600-normal.woff'), weight: 600, style: 'normal' },
    { name: 'JetBrains Mono', data: f('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'JetBrains Mono', data: f('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff'), weight: 500, style: 'normal' },
  ];
}
