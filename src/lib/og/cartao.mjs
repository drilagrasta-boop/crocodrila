import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { carregarFontes } from './fontes.mjs';

const C = { papel: '#f2e9d2', tinta: '#1d2b24', jacare: '#3c5a45', ouro: '#c49a3a', terracota: '#9c4a2e', suave: '#4b5a51' };
const el = (type, style, children = undefined) => ({ type, props: { style, children } });
const texto = (style, s) => ({ type: 'div', props: { style, children: s } });

function blocoSelo(numero) {
  return el('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 300, height: 300, border: `4px dashed ${C.terracota}`, borderRadius: 9999 }, [
    el('div', { display: 'flex' }, undefined), // respiro superior
    texto({ fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 34, letterSpacing: 4, color: C.terracota, marginTop: 12 }, `VOL. ${String(numero).padStart(3, '0')}`),
  ]);
}

function blocoArte(arteDataUri, largura, altura) {
  return el('div', { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 340 }, [
    { type: 'img', props: { src: arteDataUri, width: largura, height: altura, style: {} } },
  ]);
}

// opcoes: { rotulo, titulo, subtitulo?, selo?: {numero, arteDataUri?}, arte?: {dataUri, largura, altura} }
export async function gerarCartao(opcoes) {
  const direita = opcoes.selo ? blocoSelo(opcoes.selo.numero) : opcoes.arte ? blocoArte(opcoes.arte.dataUri, opcoes.arte.largura, opcoes.arte.altura) : el('div', { display: 'flex' });
  if (opcoes.selo?.arteDataUri) {
    // jacare dentro do selo, acima do numero
    direita.props.children.unshift({ type: 'img', props: { src: opcoes.selo.arteDataUri, width: 190, height: 70, style: {} } });
  }
  const arvore = el('div', { display: 'flex', width: 1200, height: 630, backgroundColor: C.papel, padding: 40 }, [
    el('div', { display: 'flex', flexDirection: 'column', flex: 1, border: `3px solid ${C.jacare}`, borderRadius: 14, padding: '44px 52px' }, [
      el('div', { display: 'flex', flex: 1, gap: 36 }, [
        el('div', { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }, [
          texto({ fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 26, letterSpacing: 5, color: C.ouro, textTransform: 'uppercase' }, opcoes.rotulo),
          texto({ fontFamily: 'Fraunces', fontWeight: 600, fontSize: 62, lineHeight: 1.08, color: C.tinta, marginTop: 22 }, opcoes.titulo),
          ...(opcoes.subtitulo ? [texto({ fontFamily: 'JetBrains Mono', fontWeight: 400, fontSize: 23, color: C.suave, marginTop: 20 }, opcoes.subtitulo)] : []),
        ]),
        el('div', { display: 'flex', alignItems: 'center' }, [direita]),
      ]),
      el('div', { display: 'flex', flexDirection: 'column', marginTop: 26 }, [
        el('div', { display: 'flex', height: 2, backgroundColor: C.jacare, opacity: 0.35 }),
        texto({ fontFamily: 'JetBrains Mono', fontWeight: 400, fontSize: 22, color: C.suave, marginTop: 16 }, 'Condenados à Atualização em IA · crocodrila.netlify.app'),
      ]),
    ]),
  ]);
  const svg = await satori(arvore, { width: 1200, height: 630, fonts: carregarFontes() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
