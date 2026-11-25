// Testes do verificador de estrutura da AutonomIA.
// Rodar: node --test scripts/checar-autonomia.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checarEdicao } from './checar-autonomia.mjs';

const FRONT = `---
numero: 1
titulo: "Teste"
data: 2026-11-25
periodo_inicio: 2026-11-18
periodo_fim: 2026-11-24
resumo: "Resumo."
---
`;

const palavras = (n) => Array.from({ length: n }, (_, i) => `palavra${i}`).join(' ');
const kicker = (nome) => `<p class="kicker">${nome}</p>\n\n`;

// Uma nota válida: fato com link (100 palavras) e bloco de Leitura.
const nota = (titulo, { fato, leitura } = {}) =>
  `## ${titulo}\n\n${fato ?? `${palavras(100)} segundo o [Veículo](https://exemplo.org/a), em 19 de novembro.`}\n\n` +
  (leitura === null ? '' : `${leitura ?? '> **Leitura.** Uma frase da editora.'}\n\n`);

const abertura = (n = 60) => `${kicker('Como IA dizendo...')}${palavras(n)}\n\n`;
const memoria = () =>
  `${kicker('Memória')}- Registro novo, a cobrar em 10/12, com [fonte](https://exemplo.org/m).\n`;

// Monta uma edição: `tematicas` é lista de [rubrica, [notas...]]; `papo` é a lista de notas do Papo Amarelo.
// `contra` é a lista de notas do Contraponto (null tira a rubrica); `ordem` desloca blocos.
function montar({ ab = abertura(), tematicas, papo, contra = [nota('Nota de contraponto')], mem = memoria(), ordem } = {}) {
  const blocosTematicos = tematicas.map(([r, notas]) => kicker(r) + notas.join('')).join('');
  const blocoContra = contra === null ? '' : kicker('Contraponto') + contra.join('');
  const blocoPapo = kicker('Papo Amarelo') + papo.join('');
  const corpo = ordem === 'memoria-antes'
    ? ab + blocosTematicos + blocoPapo + mem + '\n' + blocoContra
    : ordem === 'contraponto-antes'
      ? ab + blocoContra + blocosTematicos + blocoPapo + mem
      : ordem === 'contraponto-antes-do-papo'
        ? ab + blocosTematicos + blocoContra + blocoPapo + mem
        : ab + blocosTematicos + blocoPapo + blocoContra + mem;
  return FRONT + '\n' + corpo;
}

// n notas no total: n-2 em "Mercado", 1 no Contraponto, 1 no Papo Amarelo.
const edicaoValida = (n) => montar({
  tematicas: [['Mercado', Array.from({ length: n - 2 }, (_, i) => nota(`Nota ${i + 1}`))]],
  papo: [nota('Nota brasileira')],
});

// Contraponto: rubrica fixa (pedido da editora em 25/11/2026). Desde 25/11/2026 vem depois do
// Papo Amarelo e logo antes da Memória, como fecho da edição (pedido da editora).
test('falta o Contraponto: é erro', () => {
  const md = montar({
    tematicas: [['Mercado', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [nota('Nota brasileira')],
    contra: null,
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Contraponto')), checarEdicao(md).erros.join(' | '));
});

test('Contraponto antes do Papo Amarelo (a ordem antiga) é erro', () => {
  const md = montar({
    tematicas: [['Mercado', Array.from({ length: 7 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [nota('Nota brasileira')],
    ordem: 'contraponto-antes-do-papo',
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Contraponto')), checarEdicao(md).erros.join(' | '));
});

test('Contraponto fora do lugar é erro: ele vem logo depois do Papo Amarelo', () => {
  const md = montar({
    tematicas: [['Mercado', Array.from({ length: 7 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [nota('Nota brasileira')],
    ordem: 'contraponto-antes',
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Contraponto')), checarEdicao(md).erros.join(' | '));
});

test('Contraponto sem nota é erro', () => {
  const md = montar({
    tematicas: [['Mercado', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [nota('Nota brasileira')],
    contra: [],
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Contraponto')), checarEdicao(md).erros.join(' | '));
});

test('edição válida não tem erros', () => {
  const r = checarEdicao(edicaoValida(9));
  assert.deepEqual(r.erros, []);
  assert.equal(r.notas, 9);
});

test('falta rubrica fixa', () => {
  const md = edicaoValida(9).replace(kicker('Papo Amarelo'), '');
  const r = checarEdicao(md);
  assert.ok(r.erros.some((e) => e.includes('Papo Amarelo')), r.erros.join(' | '));
});

test('ordem das fixas: abertura primeiro, Papo Amarelo e Memória por último', () => {
  const md = montar({
    tematicas: [['Mercado', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [nota('Nota brasileira')],
    ordem: 'memoria-antes',
  });
  assert.ok(checarEdicao(md).erros.length > 0);
});

test('rubrica com grafia variante é erro que nomeia a encontrada', () => {
  const trocas = [
    ['Memória', 'Memoria'],
    ['Papo Amarelo', 'Papo amarelo'],
    ['Como IA dizendo...', 'Como IA dizendo…'],
    ['Mercado', 'mercado'],
  ];
  for (const [certa, variante] of trocas) {
    const md = edicaoValida(9).replace(kicker(certa), kicker(variante));
    const r = checarEdicao(md);
    assert.ok(r.erros.some((e) => e.includes(`"${variante}"`) && e.includes(`"${certa}"`)), `${variante}: ${r.erros.join(' | ')}`);
  }
});

test('rubrica desconhecida é erro', () => {
  const md = edicaoValida(9).replace(kicker('Mercado'), kicker('Fofocas'));
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Fofocas')));
});

test('rubrica temática sem nota é erro', () => {
  const md = montar({
    tematicas: [['Mercado', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))], ['Clima', []]],
    papo: [nota('Nota brasileira')],
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Clima')));
});

test('Papo Amarelo sem nota é erro', () => {
  const md = montar({
    tematicas: [['Mercado', Array.from({ length: 9 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [],
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Papo Amarelo')));
});

test('nota sem link no fato é erro, mesmo com link na Leitura', () => {
  const ruim = nota('Nota X', {
    fato: `${palavras(100)} sem fonte nenhuma.`,
    leitura: '> **Leitura.** Vide [isto](https://exemplo.org/l).',
  });
  const md = montar({
    tematicas: [['Mercado', [ruim, ...Array.from({ length: 7 }, (_, i) => nota(`Nota ${i + 1}`))]]],
    papo: [nota('Nota brasileira')],
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Nota X')));
});

test('nota sem Leitura é erro', () => {
  const md = montar({
    tematicas: [['Mercado', [nota('Nota Y', { leitura: null }), ...Array.from({ length: 7 }, (_, i) => nota(`Nota ${i + 1}`))]]],
    papo: [nota('Nota brasileira')],
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Nota Y')));
});

test('abertura não pode ter título de nota', () => {
  const md = montar({
    ab: kicker('Como IA dizendo...') + nota('Título indevido'),
    tematicas: [['Mercado', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [nota('Nota brasileira')],
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Como IA dizendo...')));
});

test('Memória sem item com link é erro', () => {
  const md = montar({
    tematicas: [['Mercado', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [nota('Nota brasileira')],
    mem: `${kicker('Memória')}- Registro sem fonte.\n`,
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Memória')));
});

test('tamanhos fora da faixa são avisos, não erros', () => {
  const poucas = checarEdicao(edicaoValida(5));
  assert.deepEqual(poucas.erros, []);
  assert.ok(poucas.avisos.some((a) => a.includes('8 a 12')));

  const longa = checarEdicao(montar({
    tematicas: [['Mercado', [
      nota('Nota longa', { fato: `${palavras(300)} segundo o [Veículo](https://exemplo.org/a).` }),
      ...Array.from({ length: 7 }, (_, i) => nota(`Nota ${i + 1}`)),
    ]]],
    papo: [nota('Nota brasileira')],
  }));
  assert.deepEqual(longa.erros, []);
  assert.ok(longa.avisos.some((a) => a.includes('Nota longa') && a.includes('80 a 150')));

  const ab = checarEdicao(montar({
    ab: abertura(200),
    tematicas: [['Mercado', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [nota('Nota brasileira')],
  }));
  assert.deepEqual(ab.erros, []);
  assert.equal(ab.palavrasAbertura, 200);
  assert.ok(ab.avisos.some((x) => x.includes('150')));
});

test('edição dentro das faixas não gera avisos', () => {
  assert.deepEqual(checarEdicao(edicaoValida(9)).avisos, []);
});

test('frontmatter é ignorado na contagem', () => {
  assert.equal(checarEdicao(edicaoValida(8)).notas, 8);
});

test('quebra de linha do Windows não muda o resultado', () => {
  const r = checarEdicao(edicaoValida(9).replace(/\n/g, '\r\n'));
  assert.deepEqual(r.erros, []);
  assert.equal(r.notas, 9);
});

test('Formação é rubrica temática da casa', () => {
  const md = edicaoValida(9).replace(kicker('Mercado'), kicker('Formação'));
  assert.deepEqual(checarEdicao(md).erros, []);
});

// --- Achados da revisão final: Markdown realista que o verificador lia errado ---

test('kicker com marcação variante ainda é reconhecido como rubrica', () => {
  const variantes = [
    `<p class='kicker'>Clima</p>\n\n`,
    `<p class="kicker" >Clima</p>\n\n`,
    `<p class="kicker" id="x">Clima</p>\n\n`,
    `<p  class="kicker destaque">Clima</p>\n\n`,
  ];
  for (const v of variantes) {
    // rubrica Clima aberta sem nenhuma nota: tem de ser erro, não silêncio
    const md = edicaoValida(9).replace(kicker('Papo Amarelo'), v + kicker('Papo Amarelo'));
    const r = checarEdicao(md);
    assert.ok(r.erros.some((e) => e.includes('Clima')), `${v.trim()}: ${r.erros.join(' | ')}`);
  }
  const errada = edicaoValida(9).replace(kicker('Mercado'), `<p class='kicker'>Mercados</p>\n\n`);
  assert.ok(checarEdicao(errada).erros.some((e) => e.includes('Mercados')));
});

test('Leitura quebrada em duas linhas continua sendo Leitura: link nela não vale como fonte do fato', () => {
  const ruim = nota('Nota Z', {
    fato: `${palavras(100)} sem fonte nenhuma.`,
    leitura: '> **Leitura.** Uma opinião longa que quebra de linha\ne continua aqui com [link](https://exemplo.org/l).',
  });
  const md = montar({
    tematicas: [['Mercado', [ruim, ...Array.from({ length: 7 }, (_, i) => nota(`Nota ${i + 1}`))]]],
    papo: [nota('Nota brasileira')],
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Nota Z') && e.includes('link')));
});

test('fato em dois parágrafos, com o link no segundo, é aceito', () => {
  const boa = nota('Nota W', {
    fato: `${palavras(50)} primeiro parágrafo.\n\n${palavras(50)} segundo o [Veículo](https://exemplo.org/w).`,
  });
  const md = montar({
    tematicas: [['Mercado', [boa, ...Array.from({ length: 7 }, (_, i) => nota(`Nota ${i + 1}`))]]],
    papo: [nota('Nota brasileira')],
  });
  assert.deepEqual(checarEdicao(md).erros, []);
});

test('registro de Memória em duas linhas, com o link na segunda, é aceito', () => {
  const md = montar({
    tematicas: [['Mercado', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [nota('Nota brasileira')],
    mem: `${kicker('Memória')}- Registro longo que quebra de linha,\n  a cobrar em 10/12, com [fonte](https://exemplo.org/m).\n- Outro registro curto, com [fonte](https://exemplo.org/n).\n`,
  });
  assert.deepEqual(checarEdicao(md).erros, []);
});

test('registro de Memória em duas linhas sem link continua sendo erro', () => {
  const md = montar({
    tematicas: [['Mercado', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [nota('Nota brasileira')],
    mem: `${kicker('Memória')}- Registro longo que quebra de linha,\n  e segue sem fonte.\n`,
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Memória')));
});

test('Fé e razão é rubrica temática da casa', () => {
  const md = edicaoValida(9).replace(kicker('Mercado'), kicker('Fé e razão'));
  assert.deepEqual(checarEdicao(md).erros, []);
});

test('Fé e razão com grafia variante é erro que nomeia a esperada', () => {
  const md = edicaoValida(9).replace(kicker('Mercado'), kicker('Fé e Razão'));
  const r = checarEdicao(md);
  assert.ok(r.erros.some((e) => e.includes('"Fé e Razão"') && e.includes('"Fé e razão"')), r.erros.join(' | '));
});

// "Ciência e informação": rubrica temática pedida pela editora em 25/11/2026 (sugestão de
// leitor): matemática, ciência da informação e o fazer científico diante da IA.
test('Ciência e informação é rubrica temática da casa', () => {
  const md = edicaoValida(9).replace(kicker('Mercado'), kicker('Ciência e informação'));
  assert.deepEqual(checarEdicao(md).erros, []);
});

test('Ciência e informação com grafia variante é erro que nomeia a esperada', () => {
  const md = edicaoValida(9).replace(kicker('Mercado'), kicker('Ciência e Informação'));
  const r = checarEdicao(md);
  assert.ok(r.erros.some((e) => e.includes('"Ciência e Informação"') && e.includes('"Ciência e informação"')), r.erros.join(' | '));
});
