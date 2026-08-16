import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { carregarFontes } from './fontes.mjs';

const C = { papel: '#f2e9d2', tinta: '#1d2b24', jacare: '#3c5a45', ouro: '#c49a3a', terracota: '#9c4a2e', suave: '#4b5a51' };
const el = (type, style, children = undefined) => ({ type, props: { style, children } });
const texto = (style, s) => ({ type: 'div', props: { style, children: s } });

// `largura` só reescala o vetor na rasterização: 800 é o cartão de compartilhamento,
// valores maiores servem para uso avulso (post, slide, impressão).
export async function gerarSelo(numero, arteDataUri, largura = 800) {
  const filhos = numero != null
    ? [
        { type: 'img', props: { src: arteDataUri, width: 400, height: 147, style: {} } },
        texto({ fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 72, letterSpacing: 8, color: C.terracota, marginTop: 24 }, `VOL. ${String(numero).padStart(3, '0')}`),
      ]
    : [
        { type: 'img', props: { src: arteDataUri, width: 440, height: 162, style: {} } },
      ];
  const arvore = el('div', { display: 'flex', width: 800, height: 800, backgroundColor: C.papel, alignItems: 'center', justifyContent: 'center' }, [
    el('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 620, height: 620, border: `9px dashed ${C.terracota}`, borderRadius: 9999, transform: 'rotate(-6deg)' }, filhos),
  ]);
  const svg = await satori(arvore, { width: 800, height: 800, fonts: carregarFontes() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: largura } }).render().asPng();
}

export async function gerarArte(arteDataUri, largura, altura) {
  const arvore = el('div', { display: 'flex', width: 800, height: 800, backgroundColor: C.papel, alignItems: 'center', justifyContent: 'center' }, [
    { type: 'img', props: { src: arteDataUri, width: largura, height: altura, style: {} } },
  ]);
  const svg = await satori(arvore, { width: 800, height: 800, fonts: carregarFontes() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 800 } }).render().asPng();
}
