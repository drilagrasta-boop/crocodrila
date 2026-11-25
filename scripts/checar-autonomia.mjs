// Verificador de estrutura de uma edição da AutonomIA.
//
// Confere a convenção de Markdown da seção (docs/superpowers/specs/2026-11-23-autonomia-design.md):
//   rubrica  = <p class="kicker">Nome</p>
//   nota     = "## título" até o próximo "##" ou a próxima rubrica
//   fato     = tudo na nota fora do bloco de citação
//   leitura  = bloco de citação que começa com "**Leitura.**"
//
// Erros impedem a publicação; avisos são tamanhos fora da faixa, para a editora decidir.
//
// Uso:  node scripts/checar-autonomia.mjs src/content/autonomia/<edição>.md
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// "Contraponto" é fixa desde o piloto (pedido da editora, 25/11/2026): o que a semana
// mostrou fora do avanço da IA. Leva nota, como as temáticas. Desde 25/11/2026 vem depois do
// Papo Amarelo e logo antes da Memória, como fecho da edição (pedido da editora).
export const RUBRICAS_FIXAS = ['Como IA dizendo...', 'Contraponto', 'Papo Amarelo', 'Memória'];
export const RUBRICAS_TEMATICAS = [
  'Poder e regras', 'Praça pública', 'Direitos', 'Soberania', 'Mercado',
  'Lado escuro', 'Clima', 'Ofício', 'Formação', 'Ciência e informação', 'Fé e razão',
  'Arte e cultura',
];
const [ABERTURA, CONTRAPONTO, PAPO, MEMORIA] = RUBRICAS_FIXAS;
const TODAS = [...RUBRICAS_FIXAS, ...RUBRICAS_TEMATICAS];

const NOTAS_MIN = 8, NOTAS_MAX = 12;
const PALAVRAS_NOTA_MIN = 80, PALAVRAS_NOTA_MAX = 150;
const PALAVRAS_ABERTURA_MAX = 150;

// Tolerante a aspas simples, espaços, outros atributos e outras classes: o navegador
// mostra tudo isso como rubrica, então o verificador também tem de enxergar.
const KICKER = /<p\s[^>]*class\s*=\s*["'][^"']*\bkicker\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/g;
const LINK = /\[[^\]]+\]\(https?:\/\/[^)\s]+\)/;

// Aproxima grafias: caixa, acento, reticências tipográficas e espaços.
const normalizar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/…/g, '...').replace(/\s+/g, ' ').trim().toLowerCase();

const contarPalavras = (texto) => texto
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')   // link: fica só o texto
  .replace(/\*\*Leitura\.\*\*/g, '')
  .replace(/^\s*(>|-|#+)\s?/gm, '')
  .split(/\s+/).filter(Boolean).length;

function semFrontmatter(markdown) {
  const m = markdown.match(/^---\n[\s\S]*?\n---\n?/);
  return m ? markdown.slice(m[0].length) : markdown;
}

// Divide o corpo em rubricas: [{ nome, texto }]
function rubricasDe(corpo) {
  const marcas = [...corpo.matchAll(KICKER)];
  return marcas.map((m, i) => ({
    nome: m[1].trim(),
    texto: corpo.slice(m.index + m[0].length, marcas[i + 1]?.index ?? corpo.length),
  }));
}

// Divide o texto de uma rubrica em notas: [{ titulo, fato, leitura }]
function notasDe(texto) {
  return texto.split(/^## +/m).slice(1).map((bloco) => {
    const [titulo, ...resto] = bloco.split('\n');
    // No Markdown, a linha não vazia logo depois de uma linha de citação continua a
    // citação ("continuação preguiçosa"), mesmo sem o ">" na frente.
    const citacao = [];
    const fato = [];
    let dentroDaCitacao = false;
    for (const l of resto) {
      if (l.trimStart().startsWith('>')) dentroDaCitacao = true;
      else if (l.trim() === '') dentroDaCitacao = false;
      (dentroDaCitacao ? citacao : fato).push(l);
    }
    return { titulo: titulo.trim(), fato: fato.join('\n'), citacao: citacao.join('\n') };
  });
}

export function checarEdicao(markdown) {
  const erros = [];
  const avisos = [];
  const corpo = semFrontmatter(markdown.replace(/\r\n/g, '\n'));
  const rubricas = rubricasDe(corpo);
  const nomes = rubricas.map((r) => r.nome);

  // 1. Nomes de rubrica: só os da casa, com a grafia exata.
  for (const nome of nomes) {
    if (TODAS.includes(nome)) continue;
    const parecida = TODAS.find((t) => normalizar(t) === normalizar(nome));
    erros.push(parecida
      ? `Rubrica "${nome}" com grafia diferente da casa: o esperado é "${parecida}".`
      : `Rubrica "${nome}" não existe na AutonomIA.`);
  }
  for (const nome of TODAS) {
    if (nomes.filter((n) => n === nome).length > 1) erros.push(`Rubrica "${nome}" aparece mais de uma vez.`);
  }

  // 2. As fixas, na ordem: abertura primeiro; Papo Amarelo, Contraponto e Memória no fim.
  for (const fixa of RUBRICAS_FIXAS) {
    if (!nomes.includes(fixa)) erros.push(`Falta a rubrica fixa "${fixa}".`);
  }
  if (RUBRICAS_FIXAS.every((f) => nomes.includes(f))) {
    if (nomes[0] !== ABERTURA) erros.push(`"${ABERTURA}" deve ser a primeira rubrica.`);
    if (nomes.at(-2) !== CONTRAPONTO || nomes.at(-1) !== MEMORIA) {
      erros.push(`"${CONTRAPONTO}" e "${MEMORIA}" devem ser as duas últimas rubricas, nessa ordem.`);
    }
    if (nomes.at(-3) !== PAPO) {
      erros.push(`"${CONTRAPONTO}" deve vir logo depois de "${PAPO}".`);
    }
  }

  // 3. Conteúdo de cada rubrica.
  let notas = 0;
  let palavrasAbertura = 0;
  for (const { nome, texto } of rubricas) {
    const lista = notasDe(texto);

    if (nome === ABERTURA) {
      if (lista.length > 0) erros.push(`"${ABERTURA}" é abertura assinada e não leva título de nota (##).`);
      palavrasAbertura = contarPalavras(texto);
      if (palavrasAbertura === 0) erros.push(`"${ABERTURA}" está vazia.`);
      if (palavrasAbertura > PALAVRAS_ABERTURA_MAX) {
        avisos.push(`Abertura com ${palavrasAbertura} palavras; o limite da casa é ${PALAVRAS_ABERTURA_MAX}.`);
      }
      continue;
    }

    if (nome === MEMORIA) {
      // Um registro pode ocupar mais de uma linha: a continuação se junta ao item.
      const itens = [];
      let aberto = false;
      for (const l of texto.split('\n')) {
        if (/^\s*-\s+/.test(l)) { itens.push(l); aberto = true; }
        else if (l.trim() === '') aberto = false;
        else if (aberto) itens[itens.length - 1] += ` ${l.trim()}`;
      }
      if (itens.length === 0) erros.push(`"${MEMORIA}" precisa de ao menos um registro em lista.`);
      itens.filter((i) => !LINK.test(i)).forEach((i) =>
        erros.push(`"${MEMORIA}": registro sem link para a fonte: ${i.trim().slice(0, 60)}`));
      continue;
    }

    if (!TODAS.includes(nome)) continue; // já apontada no passo 1
    if (lista.length === 0) erros.push(`Rubrica "${nome}" está sem nenhuma nota.`);

    for (const n of lista) {
      notas += 1;
      if (!LINK.test(n.fato)) erros.push(`Nota "${n.titulo}": o fato não tem link para a fonte.`);
      if (!/^\s*>\s*\*\*Leitura\.\*\*/m.test(n.citacao)) {
        erros.push(`Nota "${n.titulo}": falta o bloco de Leitura (> **Leitura.** ...).`);
      }
      const p = contarPalavras(`${n.fato}\n${n.citacao}`);
      if (p < PALAVRAS_NOTA_MIN || p > PALAVRAS_NOTA_MAX) {
        avisos.push(`Nota "${n.titulo}" com ${p} palavras; a faixa da casa é ${PALAVRAS_NOTA_MIN} a ${PALAVRAS_NOTA_MAX}.`);
      }
    }
  }

  if (notas < NOTAS_MIN || notas > NOTAS_MAX) {
    avisos.push(`Edição com ${notas} notas; a faixa da casa é ${NOTAS_MIN} a ${NOTAS_MAX}.`);
  }

  return { erros, avisos, notas, palavrasAbertura };
}

// Linha de comando
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arquivo = process.argv[2];
  if (!arquivo) {
    console.error('Uso: node scripts/checar-autonomia.mjs <arquivo.md>');
    process.exit(2);
  }
  const r = checarEdicao(readFileSync(arquivo, 'utf8'));
  console.log(`${arquivo}: ${r.notas} notas, abertura com ${r.palavrasAbertura} palavras.`);
  r.erros.forEach((e) => console.log(`ERRO   ${e}`));
  r.avisos.forEach((a) => console.log(`aviso  ${a}`));
  if (r.erros.length === 0) console.log('Estrutura conferida, sem erros.');
  process.exit(r.erros.length ? 1 : 0);
}
