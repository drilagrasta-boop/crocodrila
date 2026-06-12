import { getCollection } from 'astro:content';
import { gerarCartao } from '../../lib/og/cartao.mjs';
import { CROCODRILA, svgDataUri, POSES } from '../../lib/og/artes.mjs';

export async function getStaticPaths() {
  const edicoes = (await getCollection('edicoes')).filter((e) => !e.data.rascunho);
  return [
    ...edicoes.map((e) => ({ params: { rota: `edicoes/${e.id}` }, props: { tipo: 'edicao', entry: e } })),
    ...(await getCollection('crocodrila')).map((e) => ({ params: { rota: `crocodrila/${e.id}` }, props: { tipo: 'projeto', entry: e } })),
  ];
}

export async function GET({ props }) {
  const { tipo, entry } = props;
  let png;
  if (tipo === 'edicao') {
    png = await gerarCartao({
      rotulo: `Radar Semanal · Nº ${String(entry.data.numero).padStart(3, '0')}`,
      titulo: entry.data.titulo,
      subtitulo: entry.data.dateline ?? '',
      selo: { numero: entry.data.numero, arteDataUri: svgDataUri(CROCODRILA) },
    });
  }
  if (tipo === 'projeto') {
    const svg = POSES[entry.data.pose] ?? CROCODRILA;
    png = await gerarCartao({ rotulo: 'A Toca da Crocodrila', titulo: entry.data.titulo, subtitulo: entry.data.subtitulo, arte: { dataUri: svgDataUri(svg), largura: 326, altura: 120 } });
  }
  if (!png) throw new Error(`[og] tipo sem ramo de geracao: ${tipo}`);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
