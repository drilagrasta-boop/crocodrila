// Cartão simples da AutonomIA, para LinkedIn, Instagram e afins: só o desenho (a Crocodrila
// na poltrona lendo o jornal) e o link da seção, dentro da moldura tracejada da casa.
// Pedido da editora em 25/11/2026: "quero o card simples só com o desenho e o link".
// Numeração no cartão desde o nº 01, de 02/12/2026 (pedido da editora em 25/11/2026).
// Uso, na raiz do projeto:
//   node scripts/gerar-cartao-autonomia.mjs <saida.png> [horizontal|quadrado] [número]
// Sem número, sai só o desenho e o link. O número vai com dois dígitos: 1 -> "Nº 01".
// "horizontal" (padrão) é 1200x627, a medida da imagem de link do LinkedIn; "quadrado" é 1080x1080.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { carregarFontes } from '../src/lib/og/fontes.mjs';
import { ARTE_AUTONOMIA, svgDataUri } from '../src/lib/og/artes.mjs';

const C = { papel: '#f2e9d2', terracota: '#9c4a2e' };
const el = (style, children) => ({ type: 'div', props: { style, children } });

const [saida, formato = 'horizontal', numero] = process.argv.slice(2);
if (!saida) throw new Error('uso: node scripts/gerar-cartao-autonomia.mjs <saida.png> [horizontal|quadrado] [número]');
if (numero !== undefined && !/^\d{1,3}$/.test(numero)) throw new Error('número deve ser inteiro, como 1 ou 01');
if (!['horizontal', 'quadrado'].includes(formato)) throw new Error('formato deve ser "horizontal" ou "quadrado"');

const arte = svgDataUri(ARTE_AUTONOMIA); // proporção 200x180
const LINK = 'crocodrila.netlify.app/autonomia';
const ehHorizontal = formato === 'horizontal';
const [largura, altura] = ehHorizontal ? [1200, 627] : [1080, 1080];
const [moldW, moldH, borda, raio] = ehHorizontal ? [1140, 567, 8, 48] : [970, 970, 10, 64];
const arteW = ehHorizontal ? 440 : 720;
const fonteLink = ehHorizontal ? 30 : 38;
const rotulo = numero === undefined ? null : `Nº ${String(Number(numero)).padStart(2, '0')}`;
const arteFinal = rotulo ? Math.round(arteW * (ehHorizontal ? 0.86 : 0.9)) : arteW;

const arvore = el({ display: 'flex', width: largura, height: altura, backgroundColor: C.papel, alignItems: 'center', justifyContent: 'center' }, [
  el({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: moldW, height: moldH, border: `${borda}px dashed ${C.terracota}`, borderRadius: raio }, [
    ...(rotulo ? [el({ fontFamily: 'Fraunces', fontWeight: 600, display: 'flex', fontSize: Math.round(fonteLink * 1.7), letterSpacing: 1, color: C.terracota, marginBottom: ehHorizontal ? 6 : 24 }, rotulo)] : []),
    { type: 'img', props: { src: arte, width: arteFinal, height: Math.round(arteFinal * 0.9) } },
    el({ fontFamily: 'JetBrains Mono', fontWeight: 500, display: 'flex', fontSize: fonteLink, letterSpacing: 2, color: C.terracota, marginTop: ehHorizontal ? 14 : 36 }, LINK),
  ]),
]);

const svg = await satori(arvore, { width: largura, height: altura, fonts: carregarFontes() });
writeFileSync(saida, new Resvg(svg, { fitTo: { mode: 'width', value: largura } }).render().asPng());
console.log('ok', saida);
