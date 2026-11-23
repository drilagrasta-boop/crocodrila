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
function montar({ ab = abertura(), tematicas, papo, mem = memoria(), ordem } = {}) {
  const blocosTematicos = tematicas.map(([r, notas]) => kicker(r) + notas.join('')).join('');
  const blocoPapo = kicker('Papo Amarelo') + papo.join('');
  const corpo = ordem === 'memoria-antes'
    ? ab + blocosTematicos + mem + '\n' + blocoPapo
    : ab + blocosTematicos + blocoPapo + mem;
  return FRONT + '\n' + corpo;
}

// n notas no total: n-1 em "Dinheiro", 1 no Papo Amarelo.
const edicaoValida = (n) => montar({
  tematicas: [['Dinheiro', Array.from({ length: n - 1 }, (_, i) => nota(`Nota ${i + 1}`))]],
  papo: [nota('Nota brasileira')],
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
    tematicas: [['Dinheiro', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
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
    ['Dinheiro', 'dinheiro'],
  ];
  for (const [certa, variante] of trocas) {
    const md = edicaoValida(9).replace(kicker(certa), kicker(variante));
    const r = checarEdicao(md);
    assert.ok(r.erros.some((e) => e.includes(`"${variante}"`) && e.includes(`"${certa}"`)), `${variante}: ${r.erros.join(' | ')}`);
  }
});

test('rubrica desconhecida é erro', () => {
  const md = edicaoValida(9).replace(kicker('Dinheiro'), kicker('Fofocas'));
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Fofocas')));
});

test('rubrica temática sem nota é erro', () => {
  const md = montar({
    tematicas: [['Dinheiro', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))], ['Clima', []]],
    papo: [nota('Nota brasileira')],
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Clima')));
});

test('Papo Amarelo sem nota é erro', () => {
  const md = montar({
    tematicas: [['Dinheiro', Array.from({ length: 9 }, (_, i) => nota(`Nota ${i + 1}`))]],
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
    tematicas: [['Dinheiro', [ruim, ...Array.from({ length: 7 }, (_, i) => nota(`Nota ${i + 1}`))]]],
    papo: [nota('Nota brasileira')],
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Nota X')));
});

test('nota sem Leitura é erro', () => {
  const md = montar({
    tematicas: [['Dinheiro', [nota('Nota Y', { leitura: null }), ...Array.from({ length: 7 }, (_, i) => nota(`Nota ${i + 1}`))]]],
    papo: [nota('Nota brasileira')],
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Nota Y')));
});

test('abertura não pode ter título de nota', () => {
  const md = montar({
    ab: kicker('Como IA dizendo...') + nota('Título indevido'),
    tematicas: [['Dinheiro', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
    papo: [nota('Nota brasileira')],
  });
  assert.ok(checarEdicao(md).erros.some((e) => e.includes('Como IA dizendo...')));
});

test('Memória sem item com link é erro', () => {
  const md = montar({
    tematicas: [['Dinheiro', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
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
    tematicas: [['Dinheiro', [
      nota('Nota longa', { fato: `${palavras(300)} segundo o [Veículo](https://exemplo.org/a).` }),
      ...Array.from({ length: 7 }, (_, i) => nota(`Nota ${i + 1}`)),
    ]]],
    papo: [nota('Nota brasileira')],
  }));
  assert.deepEqual(longa.erros, []);
  assert.ok(longa.avisos.some((a) => a.includes('Nota longa') && a.includes('80 a 150')));

  const ab = checarEdicao(montar({
    ab: abertura(200),
    tematicas: [['Dinheiro', Array.from({ length: 8 }, (_, i) => nota(`Nota ${i + 1}`))]],
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
  const md = edicaoValida(9).replace(kicker('Dinheiro'), kicker('Formação'));
  assert.deepEqual(checarEdicao(md).erros, []);
});
