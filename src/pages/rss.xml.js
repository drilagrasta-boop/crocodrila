import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { publicadas, tituloItem } from '../lib/autonomia.mjs';

// Um feed só para o site: a edição de sábado e a AutonomIA de quarta, da mais nova
// para a mais antiga. A assinatura é do site, não de uma publicação.
export async function GET(context) {
  const edicoes = (await getCollection('edicoes'))
    .filter((e) => !e.data.rascunho)
    .map((e) => ({
      title: `Nº ${String(e.data.numero).padStart(3, '0')} · ${e.data.titulo}`,
      description: e.data.resumo,
      pubDate: e.data.data,
      link: `/edicoes/${e.id}/`,
    }));

  const autonomia = publicadas(await getCollection('autonomia')).map((e) => ({
    title: tituloItem(e),
    description: e.data.resumo,
    pubDate: e.data.data,
    link: `/autonomia/${e.id}/`,
  }));

  return rss({
    stylesheet: '/rss-styles.xsl',
    title: 'Condenados à Atualização em IA',
    description:
      'Captura semanal das novidades em IA a partir de fontes primárias, aos sábados, e a AutonomIA, resenha crítica da semana, às quartas.',
    site: context.site,
    items: [...edicoes, ...autonomia].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
    customData: `<language>pt-br</language>`,
  });
}
