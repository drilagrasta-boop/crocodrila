// Cartão de divulgação de uma edição do radar (1080x1080), para LinkedIn, Instagram e afins.
// Uso, na raiz do projeto:
//   node scripts/gerar-cartao-edicao.mjs <numero> "<data>" "<manchete>" "<item 1|item 2|item 3>" [saida.png]
// Ex.: node scripts/gerar-cartao-edicao.mjs 25 "14 NOV 2026" "O Fable 5.2 volta ao primeiro lugar. A conta por tarefa sobe." "AlphaProof Code prova o código do Signal|Gemini Decision 1 devolve a dúvida em número|Jusbrasil lê o DJEN pelo advogado" docs/divulgacao/edicao-025.png
// A manchete quebra sozinha em até três linhas; os itens são curtos (uma linha cada), separados por "|".
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { carregarFontes } from '../src/lib/og/fontes.mjs';
import { CROCODRILA, svgDataUri } from '../src/lib/og/artes.mjs';

const C = { papel: '#f2e9d2', tinta: '#1d2b24', jacare: '#3c5a45', terracota: '#9c4a2e', ouro: '#c49a3a' };
const el = (style, children) => ({ type: 'div', props: { style, children } });

const [numero, data, manchete, itensBrutos, saida = `edicao-${String(process.argv[2]).padStart(3, '0')}.png`] = process.argv.slice(2);
if (!numero || !data || !manchete || !itensBrutos) {
  throw new Error('uso: node scripts/gerar-cartao-edicao.mjs <numero> "<data>" "<manchete>" "<item 1|item 2|item 3>" [saida.png]');
}
const itens = itensBrutos.split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);

const mono = { fontFamily: 'JetBrains Mono', fontWeight: 500, display: 'flex' };

const arvore = el({ display: 'flex', width: 1080, height: 1080, backgroundColor: C.papel, alignItems: 'center', justifyContent: 'center' }, [
  el({ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 970, height: 970, border: `10px dashed ${C.terracota}`, borderRadius: 64, paddingTop: 60 }, [
    el({ ...mono, fontSize: 26, letterSpacing: 6, color: C.terracota }, `RADAR SEMANAL · Nº ${numero} · ${data}`),
    el({ display: 'flex', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 66, color: C.tinta, lineHeight: 1.12, width: 820, textAlign: 'center', justifyContent: 'center', marginTop: 26 }, manchete),
    { type: 'img', props: { src: svgDataUri(CROCODRILA), width: 489, height: 180, style: { marginTop: 10 } } },
    el({ display: 'flex', width: 380, height: 4, backgroundColor: C.tinta, marginTop: 6 }),
    el({ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 780, marginTop: 30 },
      itens.map((t) => el({ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }, [
        el({ display: 'flex', width: 14, height: 14, borderRadius: 7, backgroundColor: C.ouro, marginTop: 11, marginRight: 20, flexShrink: 0 }),
        el({ display: 'flex', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 32, color: C.jacare, lineHeight: 1.2 }, t),
      ]))),
    el({ ...mono, fontSize: 30, color: C.terracota, marginTop: 'auto', marginBottom: 48 }, 'crocodrila.netlify.app/edicoes'),
  ]),
]);

const svg = await satori(arvore, { width: 1080, height: 1080, fonts: carregarFontes() });
writeFileSync(saida, new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } }).render().asPng());
console.log('ok', saida);
