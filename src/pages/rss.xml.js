import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const edicoes = (await getCollection('edicoes'))
    .filter((e) => !e.data.rascunho)
    .sort((a, b) => b.data.numero - a.data.numero);

  return rss({
    title: 'Condenados à Atualização em IA',
    description:
      'Captura semanal das principais novidades sobre IA, a partir de fontes primárias.',
    site: context.site,
    items: edicoes.map((e) => ({
      title: `Nº ${String(e.data.numero).padStart(3, '0')} · ${e.data.titulo}`,
      description: e.data.resumo,
      pubDate: e.data.data,
      link: `/edicoes/${e.id}/`,
    })),
    customData: `<language>pt-br</language>`,
  });
}
