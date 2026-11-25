import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ligarChamadas, nomeDaChamada, secoesDoMarkdown } from './chamadas.mjs';

const secoes = [
  { titulo: 'GPT-6.2 Astra e Astra for Law: a OpenAI barateia o topo', corpo: 'O Astra custa menos.' },
  { titulo: 'Impacto prático', corpo: 'Hipótese de Riemann citada de passagem.' },
  { titulo: 'Hipótese de Riemann: a prova chega sem texto para ler', corpo: 'Levent Alpöge.' },
  { titulo: 'Outros modelos da semana', corpo: 'O Gemini 4 Neon custa 3 dólares. Gemini 4 Neon fica em terceiro.' },
  { titulo: 'IA aplicada ao direito', corpo: 'Estudo em tribunais federais.' },
  { titulo: 'Brasil', corpo: 'O Elos IA, do TJBA.' },
];

test('nome da chamada é o que vem antes dos dois-pontos', () => {
  assert.equal(nomeDaChamada('Hipótese de Riemann: Levent Alpöge diz acreditar'), 'Hipótese de Riemann');
});

test('liga pelo título da seção', () => {
  assert.deepEqual(ligarChamadas(['Hipótese de Riemann: Levent Alpöge diz acreditar', 'Brasil: o Elos IA encontra', 'Direito: estudo acha a marca'], secoes), [2, 5, 4]);
});

test('subtítulo genérico nunca é destino', () => {
  const r = ligarChamadas(['Impacto prático: o que muda'], secoes);
  assert.deepEqual(r, [null]);
});

test('sem título que sirva, liga pelo corpo quando o nome aparece numa só seção', () => {
  assert.deepEqual(ligarChamadas(['Gemini 4 Neon: terceiro no índice'], secoes), [3]);
});

test('na dúvida, fica sem link', () => {
  const duas = [{ titulo: 'Brasil', corpo: '' }, { titulo: 'Brasil', corpo: '' }];
  assert.deepEqual(ligarChamadas(['Brasil: algo'], duas), [null]);
  assert.deepEqual(ligarChamadas(['Assunto que não existe: nada'], secoes), [null]);
});

test('divide o Markdown em seções de nível 2 e 3, ignorando cercas de código', () => {
  const md = 'intro\n## Um\ntexto um\n### Um ponto um\nmais\n```\n## não é título\n```\n## Dois\nfim\n';
  const s = secoesDoMarkdown(md);
  assert.deepEqual(s.map((x) => [x.nivel, x.titulo]), [[2, 'Um'], [3, 'Um ponto um'], [2, 'Dois']]);
  assert.match(s[1].corpo, /não é título/);
});
