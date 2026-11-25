import { getCollection } from 'astro:content';
import { gerarArte, gerarSelo, gerarSeloComemorativo, gerarSeloAutonomia } from '../../lib/og/cartao.mjs';
import { publicadas } from '../../lib/autonomia.mjs';
import { CROCODRILA, svgDataUri, POSES, ARTES_HOBBY, ARTES_ENSAIO, ARTE_ENSAIOS, ARTE_ANIVERSARIO, ARTE_VIGESIMA, ARTE_AUTONOMIA } from '../../lib/og/artes.mjs';

export async function getStaticPaths() {
  const edicoes = (await getCollection('edicoes')).filter((e) => !e.data.rascunho);
  return [
    ...edicoes.map((e) => ({ params: { rota: `edicoes/${e.id}` }, props: { tipo: 'edicao', entry: e } })),
    ...(await getCollection('crocodrila')).map((e) => ({ params: { rota: `crocodrila/${e.id}` }, props: { tipo: 'projeto', entry: e } })),
    ...(await getCollection('hobbies')).filter((h) => !h.data.rascunho).map((e) => ({ params: { rota: `hobbies/${e.id}` }, props: { tipo: 'hobby', entry: e } })),
    ...(await getCollection('ensaios')).filter((e) => !e.data.rascunho).map((e) => ({ params: { rota: `ensaios/${e.id}` }, props: { tipo: 'ensaio', entry: e } })),
    // AutonomIA: mesma regra de visibilidade das páginas (rascunho não ganha imagem em produção).
    ...publicadas(await getCollection('autonomia')).map((e) => ({ params: { rota: `autonomia/${e.id}` }, props: { tipo: 'autonomia', entry: e } })),
    { params: { rota: 'autonomia' }, props: { tipo: 'secao-autonomia' } },
    { params: { rota: 'ensaios' }, props: { tipo: 'secao-ensaios' } },
    { params: { rota: 'aniversario-10' }, props: { tipo: 'aniversario' } },
    { params: { rota: 'site' }, props: { tipo: 'site' } },
  ];
}

export async function GET({ props }) {
  const { tipo, entry } = props;
  let png;
  if (tipo === 'edicao') {
    // A décima e a vigésima edições compartilham artes comemorativas; as demais, o selo numerado.
    png = entry.data.numero === 10
      ? await gerarArte(svgDataUri(ARTE_ANIVERSARIO), 700, 258)
      : entry.data.numero === 20
        ? await gerarSeloComemorativo(20, svgDataUri(ARTE_VIGESIMA), 'VIGÉSIMA EDIÇÃO')
        : await gerarSelo(entry.data.numero, svgDataUri(CROCODRILA));
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
    // Padrão da casa: cada ensaio declara uma `arte` própria (ARTES_ENSAIO).
    // Sem arte, cai na `pose` do jacaré; sem pose, na arte da seção (as aspas).
    const arteSvg = ARTES_ENSAIO[entry.data.arte];
    png = arteSvg
      ? await gerarArte(svgDataUri(arteSvg), 600, 480)
      : entry.data.pose
        ? await gerarArte(svgDataUri(POSES[entry.data.pose]), 680, 250)
        : await gerarArte(svgDataUri(ARTE_ENSAIOS), 600, 480);
  }
  if (tipo === 'autonomia') {
    const n = entry.data.numero;
    png = await gerarSeloAutonomia(n === 0 ? 'Piloto' : `Nº ${String(n).padStart(3, '0')}`, svgDataUri(ARTE_AUTONOMIA));
  }
  if (tipo === 'secao-autonomia') {
    png = await gerarSeloAutonomia('Toda quarta', svgDataUri(ARTE_AUTONOMIA));
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
