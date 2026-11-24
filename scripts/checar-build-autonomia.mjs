// Confere, no site já construído (dist/), o que a seção AutonomIA promete.
//
// Uso, depois de `npm run build`:
//   node scripts/checar-build-autonomia.mjs                  build de produção: rascunho não aparece
//   node scripts/checar-build-autonomia.mjs --com-rascunhos  build feito com MOSTRAR_RASCUNHOS=1
//
// Nada aqui fixa uma edição: tudo sai do frontmatter dos arquivos de src/content/.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const comRascunhos = process.argv.includes('--com-rascunhos');
const DIST = 'dist';
const AVISO = 'Nada aqui é recomendação de investimento.';
const DECLARACAO = 'modelo de IA da Anthropic';

const falhas = [];
const exigir = (cond, msg) => { if (!cond) falhas.push(msg); };
const ler = (caminho) => (existsSync(caminho) ? readFileSync(caminho, 'utf8') : null);

function colecao(pasta) {
  if (!existsSync(pasta)) return [];
  return readdirSync(pasta).filter((f) => f.endsWith('.md')).map((f) => {
    const texto = readFileSync(join(pasta, f), 'utf8');
    const front = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    return { id: f.replace(/\.md$/, ''), rascunho: /^rascunho:\s*true\s*$/m.test(front) };
  });
}

const autonomia = colecao('src/content/autonomia');
const visiveis = autonomia.filter((e) => comRascunhos || !e.rascunho);
const ocultas = autonomia.filter((e) => !comRascunhos && e.rascunho);

// --- Lista e menu -----------------------------------------------------------
const lista = ler(join(DIST, 'autonomia', 'index.html'));
exigir(lista !== null, 'falta dist/autonomia/index.html');
exigir(lista?.includes(AVISO), 'a lista da AutonomIA não traz o aviso fixo');
exigir(lista?.includes('Como é feita'), 'a página da seção não explica como a AutonomIA é feita');
const home = ler(join(DIST, 'index.html'));
exigir(home?.includes('href="/autonomia"'), 'o menu da home não tem link para /autonomia');

// --- Capa do site -------------------------------------------------------------
// A capa apresenta a AutonomIA mais recente, logo depois da edição de sábado; sem edição
// publicada, o bloco some (rascunho nunca aparece na capa de produção).
{
  const bloco = home?.match(/<section[^>]*class="[^"]*\bautonomia-home\b[\s\S]*?<\/section>/)?.[0] ?? null;
  if (visiveis.length > 0) {
    const recente = visiveis.map((e) => e.id).sort().at(-1);
    exigir(bloco !== null, 'a capa do site não apresenta a AutonomIA');
    exigir(bloco?.includes(`href="/autonomia/${recente}"`), `a capa não leva à AutonomIA mais recente (${recente})`);
    exigir(bloco?.includes('href="/autonomia"'), 'o bloco da capa não leva à página da seção');
    const iUltima = home?.indexOf('id="ultima"') ?? -1;
    exigir(iUltima === -1 || (home?.indexOf('autonomia-home') ?? -1) > iUltima, 'na capa, a AutonomIA vem antes da edição de sábado');
  } else {
    exigir(bloco === null, 'a capa mostra o bloco da AutonomIA sem edição publicada');
  }
}

// --- Páginas de leitura -----------------------------------------------------
const sitemap = ler(join(DIST, 'sitemap-0.xml')) ?? '';
for (const e of visiveis) {
  const html = ler(join(DIST, 'autonomia', e.id, 'index.html'));
  exigir(html !== null, `falta a página de ${e.id}`);
  if (!html) continue;
  for (const fixa of ['Como IA dizendo...', 'Papo Amarelo', 'Memória']) {
    exigir(html.includes(fixa), `${e.id}: a página não mostra a rubrica "${fixa}"`);
  }
  exigir(/<article[^>]*class="[^"]*\bautonomia\b/.test(html), `${e.id}: falta a classe "autonomia" no artigo`);
  exigir(html.includes('<blockquote'), `${e.id}: nenhum bloco de Leitura na página`);
  exigir(html.includes(AVISO), `${e.id}: a página não traz o aviso fixo`);
  exigir(html.includes(DECLARACAO), `${e.id}: a página não traz a declaração de uso de IA`);
  // Toda edição sai assinada e com o contato da editora para críticas.
  exigir(/class="assina-nomes[^"]*"[^>]*>\s*Adriana Aneli/.test(html), `${e.id}: falta a assinatura "Adriana Aneli"`);
  // O e-mail tem de estar no bloco de assinatura da edição (o rodapé geral do site tem outro).
  const assina = html.match(/<div[^>]*class="assina[\s"][\s\S]*?<\/div>/)?.[0] ?? '';
  exigir(/href="mailto:[^"@\s]+@[^"\s]+"/.test(assina), `${e.id}: falta o e-mail de contato da editora junto da assinatura`);
  exigir(/class="assina-bio[\s"][^>]*>[^<]{60,}/.test(assina), `${e.id}: falta a mini bio da editora junto da assinatura`);
  exigir(lista?.includes(`/autonomia/${e.id}`), `${e.id}: não está na lista da seção`);
}
for (const e of ocultas) {
  exigir(!existsSync(join(DIST, 'autonomia', e.id, 'index.html')), `rascunho publicado: ${e.id} tem página`);
  exigir(!sitemap.includes(e.id), `rascunho publicado: ${e.id} está no sitemap`);
  exigir(!lista?.includes(e.id), `rascunho publicado: ${e.id} está na lista da seção`);
}

// --- Parágrafos justificados (pedido da editora) -------------------------------
// O estilo da página de leitura sai num arquivo CSS em dist/_astro ou embutido no HTML.
if (visiveis.length > 0) {
  const pastaCss = join(DIST, '_astro');
  const css = existsSync(pastaCss)
    ? readdirSync(pastaCss).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(pastaCss, f), 'utf8')).join('\n')
    : '';
  const htmlEdicao = ler(join(DIST, 'autonomia', visiveis[0].id, 'index.html')) ?? '';
  exigir(/\.autonomia[^{}]*\.prose p[^{}]*\{[^}]*text-align:\s*justify/.test(css + htmlEdicao),
    'os parágrafos da edição da AutonomIA não estão justificados');
}

// --- Feed ---------------------------------------------------------------------
// Um feed só para o site: edições de sábado e AutonomIA, em ordem de data.
const rss = ler(join(DIST, 'rss.xml'));
exigir(rss !== null, 'falta dist/rss.xml');
if (rss) {
  const itens = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => ({
    titulo: m[1].match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '',
    link: m[1].match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? '',
    data: new Date(m[1].match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? NaN),
  }));
  const sabado = colecao('src/content/edicoes').filter((e) => !e.rascunho);
  const deSabado = itens.filter((i) => i.link.includes('/edicoes/'));
  const deQuarta = itens.filter((i) => i.link.includes('/autonomia/'));

  exigir(deSabado.length === sabado.length, `feed com ${deSabado.length} edições de sábado; o site tem ${sabado.length}`);
  exigir(deSabado.every((i) => i.titulo.startsWith('Nº')), 'feed: edição de sábado com título fora do padrão "Nº"');
  exigir(deQuarta.every((i) => i.titulo.startsWith('AutonomIA')), 'feed: item da AutonomIA sem "AutonomIA" no início do título');
  exigir(itens.every((i) => !Number.isNaN(i.data.getTime())), 'feed: item sem data válida');
  exigir(itens.every((i, n) => n === 0 || itens[n - 1].data >= i.data), 'feed fora de ordem de data');
  for (const e of visiveis) {
    exigir(deQuarta.some((i) => i.link.endsWith(`/autonomia/${e.id}/`)), `feed: falta ${e.id}`);
  }
  for (const e of ocultas) {
    exigir(!rss.includes(e.id), `rascunho publicado: ${e.id} está no feed`);
  }
}

// --- Resultado --------------------------------------------------------------
const modo = comRascunhos ? 'com rascunhos' : 'produção';
if (falhas.length) {
  console.error(`checar-build-autonomia (${modo}): ${falhas.length} falha(s)`);
  falhas.forEach((f) => console.error(`  FALHA  ${f}`));
  process.exit(1);
}
console.log(`checar-build-autonomia (${modo}): ok — ${visiveis.length} edição(ões) visível(is), ${ocultas.length} rascunho(s) oculto(s).`);
