import { writeFileSync } from 'node:fs';
import { gerarCartao } from '../src/lib/og/cartao.mjs';

const png = await gerarCartao({ rotulo: 'Radar Semanal', titulo: 'IA em Cognição Nada Exauriente', subtitulo: 'Lavrado em 13 de junho de 2026', selo: { numero: 3 } });
const w = png.readUInt32BE(16), h = png.readUInt32BE(20); // IHDR
if (w !== 1200 || h !== 630) throw new Error(`dimensões erradas: ${w}x${h}`);
writeFileSync('teste-cartao.png', png);
console.log(`OK ${w}x${h}`);
