// Cartão de divulgação do hobby do mês (1080x1080), para LinkedIn, Instagram e afins.
// Uso, na raiz do projeto:
//   node scripts/gerar-cartao-hobby.mjs <rotulo-do-mes> <chave-da-arte> "<titulo>" "<frase>" [saida.png]
// Ex.: node scripts/gerar-cartao-hobby.mjs "NOVEMBRO" viola-quebrada "Viola quebrada" "Decore uma canção de Mário de Andrade e cante para alguém." public/divulgacao/hobby-2026-11-viola-quebrada.png
// A chave da arte é a mesma do campo `arte` do frontmatter do hobby (ver ARTES_HOBBY em src/lib/og/artes.mjs).
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { carregarFontes } from '../src/lib/og/fontes.mjs';
import { ARTES_HOBBY, svgDataUri } from '../src/lib/og/artes.mjs';

const C = { papel: '#f2e9d2', tinta: '#1d2b24', jacare: '#3c5a45', terracota: '#9c4a2e', ouro: '#c49a3a' };
const el = (style, children) => ({ type: 'div', props: { style, children } });

const [mes, chave, titulo, frase, saida = `hobby-${process.argv[3]}.png`] = process.argv.slice(2);
if (!mes || !chave || !titulo || !frase) {
  throw new Error('uso: node scripts/gerar-cartao-hobby.mjs <rotulo-do-mes> <chave-da-arte> "<titulo>" "<frase>" [saida.png]');
}
if (!ARTES_HOBBY[chave]) throw new Error(`arte desconhecida: ${chave}. Disponíveis: ${Object.keys(ARTES_HOBBY).join(', ')}`);

const mono = { fontFamily: 'JetBrains Mono', fontWeight: 500, display: 'flex' };

const arvore = el({ display: 'flex', width: 1080, height: 1080, backgroundColor: C.papel, alignItems: 'center', justifyContent: 'center' }, [
  el({ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 970, height: 970, border: `10px dashed ${C.terracota}`, borderRadius: 64, paddingTop: 64 }, [
    el({ ...mono, fontSize: 28, letterSpacing: 7, color: C.terracota }, `HABEMOS HOBBY · ${mes}`),
    el({ display: 'flex', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 108, color: C.tinta, lineHeight: 1.1, marginTop: 28 }, titulo),
    { type: 'img', props: { src: svgDataUri(ARTES_HOBBY[chave]), width: 450, height: 360, style: { marginTop: 24 } } },
    el({ display: 'flex', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 42, color: C.tinta, lineHeight: 1.3, width: 760, textAlign: 'center', justifyContent: 'center', marginTop: 28 }, frase),
    el({ ...mono, fontSize: 32, color: C.terracota, marginTop: 'auto', marginBottom: 50 }, 'crocodrila.netlify.app/hobbies'),
  ]),
]);

const svg = await satori(arvore, { width: 1080, height: 1080, fonts: carregarFontes() });
writeFileSync(saida, new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } }).render().asPng());
console.log('ok', saida);
