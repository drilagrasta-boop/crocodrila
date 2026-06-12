import { getCollection } from 'astro:content';
import { gerarCartao, gerarSelo } from '../../lib/og/cartao.mjs';
import { CROCODRILA, svgDataUri, POSES, ARTES_HOBBY } from '../../lib/og/artes.mjs';

export async function getStaticPaths() {
  const edicoes = (await getCollection('edicoes')).filter((e) => !e.data.rascunho);
  return [
    ...edicoes.map((e) => ({ params: { rota: `edicoes/${e.id}` }, props: { tipo: 'edicao', entry: e } })),
    ...(await getCollection('crocodrila')).map((e) => ({ params: { rota: `crocodrila/${e.id}` }, props: { tipo: 'projeto', entry: e } })),
    ...(await getCollection('hobbies')).filter((h) => !h.data.rascunho).map((e) => ({ params: { rota: `hobbies/${e.id}` }, props: { tipo: 'hobby', entry: e } })),
  ];
}

export async function GET({ props }) {
  const { tipo, entry } = props;
  let png;
  if (tipo === 'edicao') {
    png = await gerarSelo(entry.data.numero, svgDataUri(CROCODRILA));
  }
  if (tipo === 'projeto') {
    const svg = POSES[entry.data.pose] ?? CROCODRILA;
    png = await gerarCartao({ rotulo: 'A Toca da Crocodrila', titulo: entry.data.titulo, subtitulo: entry.data.subtitulo, arte: { dataUri: svgDataUri(svg), largura: 326, altura: 120 } });
  }
  if (tipo === 'hobby') {
    const resumo = entry.data.resumo;
    const arteSvg = ARTES_HOBBY[entry.data.arte];
    png = await gerarCartao({
      rotulo: 'Habemos Hobby',
      titulo: entry.data.titulo,
      subtitulo: resumo.length > 90 ? resumo.slice(0, 87) + '…' : resumo,
      arte: arteSvg
        ? { dataUri: svgDataUri(arteSvg), largura: 280, altura: 224 }
        : { dataUri: svgDataUri(CROCODRILA), largura: 326, altura: 120 },
    });
  }
  if (!png) throw new Error(`[og] tipo sem ramo de geracao: ${tipo}`);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
