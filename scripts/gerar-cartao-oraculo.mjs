// Cartão do Oráculo para redes (1080x1080), no molde do cartão dos kits.
// Uso, na raiz do projeto:  node scripts/gerar-cartao-oraculo.mjs <saida.png>
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { carregarFontes } from '../src/lib/og/fontes.mjs';
import { POSES, svgDataUri } from '../src/lib/og/artes.mjs';

const C = { papel: '#f2e9d2', tinta: '#1d2b24', jacare: '#3c5a45', terracota: '#9c4a2e' };
const el = (style, children) => ({ type: 'div', props: { style, children } });

const saida = process.argv[2] ?? 'oraculo-card.png';
const mono = { fontFamily: 'JetBrains Mono', fontWeight: 500, display: 'flex' };

const arvore = el({ display: 'flex', width: 1080, height: 1080, backgroundColor: C.papel, alignItems: 'center', justifyContent: 'center' }, [
  el({ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 970, height: 970, border: `10px dashed ${C.terracota}`, borderRadius: 64, paddingTop: 62 }, [
    el({ ...mono, fontSize: 30, letterSpacing: 8, color: C.terracota }, 'NOVO KIT NA TOCA'),
    el({ display: 'flex', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 150, color: C.tinta, marginTop: 14 }, 'Oráculo'),
    { type: 'img', props: { src: svgDataUri(POSES.oraculo), width: 860, height: 316, style: { marginTop: 34 } } },
    el({ ...mono, fontSize: 36, color: C.jacare, marginTop: 26 }, 'Um tutor de estudo que cita com a página'),
    el({ ...mono, fontSize: 36, color: C.jacare, marginTop: 8 }, 'e o arquivo, e confere cada aspa'),
    el({ ...mono, fontSize: 30, color: C.terracota, marginTop: 46 }, 'crocodrila.netlify.app/crocodrila/oraculo'),
  ]),
]);

const svg = await satori(arvore, { width: 1080, height: 1080, fonts: carregarFontes() });
writeFileSync(saida, new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } }).render().asPng());
console.log('ok', saida);
