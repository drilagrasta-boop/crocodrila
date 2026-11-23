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
const home = ler(join(DIST, 'index.html'));
exigir(home?.includes('href="/autonomia"'), 'o menu da home não tem link para /autonomia');

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
  exigir(lista?.includes(`/autonomia/${e.id}`), `${e.id}: não está na lista da seção`);
}
for (const e of ocultas) {
  exigir(!existsSync(join(DIST, 'autonomia', e.id, 'index.html')), `rascunho publicado: ${e.id} tem página`);
  exigir(!sitemap.includes(e.id), `rascunho publicado: ${e.id} está no sitemap`);
  exigir(!lista?.includes(e.id), `rascunho publicado: ${e.id} está na lista da seção`);
}

// --- Resultado --------------------------------------------------------------
const modo = comRascunhos ? 'com rascunhos' : 'produção';
if (falhas.length) {
  console.error(`checar-build-autonomia (${modo}): ${falhas.length} falha(s)`);
  falhas.forEach((f) => console.error(`  FALHA  ${f}`));
  process.exit(1);
}
console.log(`checar-build-autonomia (${modo}): ok — ${visiveis.length} edição(ões) visível(is), ${ocultas.length} rascunho(s) oculto(s).`);
