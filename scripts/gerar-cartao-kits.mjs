// Cartão de divulgação dos kits (1080x1080), usado como prévia de link da toca.
// Uso, na raiz do projeto:  node scripts/gerar-cartao-kits.mjs <numero por extenso> [saida.png]
// Ex.: node scripts/gerar-cartao-kits.mjs oito public/divulgacao/kits-para-baixar.png
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { carregarFontes } from '../src/lib/og/fontes.mjs';
import { ARTE_HALTEROFILISTA, svgDataUri } from '../src/lib/og/artes.mjs';

const C = { papel: '#f2e9d2', tinta: '#1d2b24', jacare: '#3c5a45', terracota: '#9c4a2e' };
const el = (style, children) => ({ type: 'div', props: { style, children } });

const quantos = process.argv[2];
const saida = process.argv[3] ?? 'kits-para-baixar.png';
if (!quantos) throw new Error('informe o número por extenso, ex.: oito');

const mono = { fontFamily: 'JetBrains Mono', fontWeight: 500, display: 'flex' };
const arvore = el({ display: 'flex', width: 1080, height: 1080, backgroundColor: C.papel, alignItems: 'center', justifyContent: 'center' }, [
  el({ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 970, height: 970, border: `10px dashed ${C.terracota}`, borderRadius: 64, paddingTop: 62 }, [
    el({ ...mono, fontSize: 30, letterSpacing: 8, color: C.terracota }, 'NOVIDADE NA TOCA'),
    el({ display: 'flex', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 82, color: C.tinta, marginTop: 10 }, 'Agora dá para baixar'),
    { type: 'img', props: { src: svgDataUri(ARTE_HALTEROFILISTA), width: 496, height: 546, style: { marginTop: 14 } } },
    el({ ...mono, fontSize: 34, color: C.jacare, marginTop: -6 }, `${quantos} ferramentas prontas, com guia`),
    el({ ...mono, fontSize: 34, color: C.terracota, marginTop: 26 }, 'crocodrila.netlify.app/crocodrila'),
  ]),
]);

const svg = await satori(arvore, { width: 1080, height: 1080, fonts: carregarFontes() });
writeFileSync(saida, new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } }).render().asPng());
console.log('ok', saida);
