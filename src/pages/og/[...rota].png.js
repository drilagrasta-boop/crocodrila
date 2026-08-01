import { getCollection } from 'astro:content';
import { gerarArte, gerarSelo } from '../../lib/og/cartao.mjs';
import { CROCODRILA, svgDataUri, POSES, ARTES_HOBBY, ARTE_ENSAIOS, ARTE_ANIVERSARIO } from '../../lib/og/artes.mjs';

export async function getStaticPaths() {
  const edicoes = (await getCollection('edicoes')).filter((e) => !e.data.rascunho);
  return [
    ...edicoes.map((e) => ({ params: { rota: `edicoes/${e.id}` }, props: { tipo: 'edicao', entry: e } })),
    ...(await getCollection('crocodrila')).map((e) => ({ params: { rota: `crocodrila/${e.id}` }, props: { tipo: 'projeto', entry: e } })),
    ...(await getCollection('hobbies')).filter((h) => !h.data.rascunho).map((e) => ({ params: { rota: `hobbies/${e.id}` }, props: { tipo: 'hobby', entry: e } })),
    ...(await getCollection('ensaios')).filter((e) => !e.data.rascunho).map((e) => ({ params: { rota: `ensaios/${e.id}` }, props: { tipo: 'ensaio', entry: e } })),
    { params: { rota: 'ensaios' }, props: { tipo: 'secao-ensaios' } },
    { params: { rota: 'aniversario-10' }, props: { tipo: 'aniversario' } },
    { params: { rota: 'site' }, props: { tipo: 'site' } },
  ];
}

export async function GET({ props }) {
  const { tipo, entry } = props;
  let png;
  if (tipo === 'edicao') {
    png = await gerarSelo(entry.data.numero, svgDataUri(CROCODRILA));
  }
  if (tipo === 'projeto') {
    png = await gerarArte(svgDataUri(POSES[entry.data.pose] ?? CROCODRILA), 680, 250);
  }
  if (tipo === 'hobby') {
    const arteSvg = ARTES_HOBBY[entry.data.arte];
    png = arteSvg
      ? await gerarArte(svgDataUri(arteSvg), 600, 480)
      : await gerarArte(svgDataUri(CROCODRILA), 680, 250);
  }
  if (tipo === 'ensaio') {
    // Por padrão o ensaio compartilha a arte da seção (as aspas). Só usa jacaré
    // se o texto declarar uma `pose` no frontmatter.
    png = entry.data.pose
      ? await gerarArte(svgDataUri(POSES[entry.data.pose]), 680, 250)
      : await gerarArte(svgDataUri(ARTE_ENSAIOS), 600, 480);
  }
  if (tipo === 'secao-ensaios') {
    png = await gerarArte(svgDataUri(ARTE_ENSAIOS), 600, 480);
  }
  if (tipo === 'aniversario') {
    png = await gerarArte(svgDataUri(ARTE_ANIVERSARIO), 700, 258);
  }
  if (tipo === 'site') {
    png = await gerarSelo(null, svgDataUri(CROCODRILA));
  }
  if (!png) throw new Error(`[og] tipo sem ramo de geracao: ${tipo}`);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
