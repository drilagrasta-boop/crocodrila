// Liga cada chamada do quadro "Nesta edição" à seção do texto que trata dela.
//
// As edições de sábado chegam prontas, com as chamadas como frases soltas. Para não mexer
// no formato delas, a ligação é deduzida: primeiro pelo título da seção, depois pelo corpo.
// Na dúvida, a chamada fica sem link: link errado é pior que link nenhum.

// Subtítulos que se repetem em toda matéria e não identificam assunto.
const GENERICOS = new Set([
  'comparacao com a geracao anterior',
  'o que isso desbloqueia na pratica',
  'impacto pratico',
]);

const VAZIAS = new Set([
  'a', 'o', 'as', 'os', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'no', 'na', 'nos', 'nas',
  'por', 'para', 'com', 'que', 'se', 'ao', 'aos', 'ia',
]);

const limpar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const palavras = (s) => limpar(s).split(/[^a-z0-9.]+/).map((p) => p.replace(/^\.+|\.+$/g, '')).filter((p) => p && !VAZIAS.has(p));

/** O "nome" da chamada: o que vem antes dos dois-pontos, ou as primeiras palavras. */
export function nomeDaChamada(texto) {
  const antes = texto.split(':')[0];
  const base = antes.length < texto.length && antes.trim().split(/\s+/).length <= 7 ? antes : texto;
  return base.trim().split(/\s+/).slice(0, 7).join(' ');
}

/**
 * @param {string[]} chamadas  frases do quadro
 * @param {{titulo: string, corpo: string}[]} secoes  seções do texto, na ordem
 * @returns {(number|null)[]}  índice da seção de cada chamada, ou null
 */
export function ligarChamadas(chamadas, secoes) {
  const uteis = secoes.map((s, i) => ({ ...s, i })).filter((s) => !GENERICOS.has(limpar(s.titulo).trim()));
  return chamadas.map((texto) => {
    const nome = palavras(nomeDaChamada(texto));
    if (nome.length === 0) return null;

    // 1) pelo título: todas as palavras do nome aparecem no título da seção
    const porTitulo = uteis.filter((s) => {
      const t = new Set(palavras(s.titulo));
      return nome.every((p) => t.has(p));
    });
    if (porTitulo.length === 1) return porTitulo[0].i;
    if (porTitulo.length > 1) return null;

    // 2) pelo texto: o começo do nome, por extenso, aparece numa única seção (ou muito mais
    //    numa do que nas outras). Tenta o nome inteiro e vai encurtando até três palavras;
    //    ocorrência no título vale por três.
    const ocorrencias = (onde, frase) => (' ' + palavras(onde).join(' ') + ' ').split(' ' + frase + ' ').length - 1;
    for (let k = nome.length; k >= Math.min(3, nome.length); k--) {
      if (k < 2) break;
      const frase = nome.slice(0, k).join(' ');
      const contagens = uteis
        .map((s) => ({ i: s.i, n: 3 * ocorrencias(s.titulo, frase) + ocorrencias(s.corpo, frase) }))
        .filter((c) => c.n > 0).sort((a, b) => b.n - a.n);
      if (contagens.length === 1) return contagens[0].i;
      if (contagens.length > 1) return contagens[0].n >= 2 * contagens[1].n ? contagens[0].i : null;
    }
    return null;
  });
}

/** Divide o Markdown de uma edição em seções (títulos de nível 2 e 3), na ordem. */
export function secoesDoMarkdown(markdown) {
  const secoes = [];
  let atual = null;
  let emCodigo = false;
  for (const linha of markdown.replace(/\r\n/g, '\n').split('\n')) {
    if (/^```/.test(linha)) emCodigo = !emCodigo;
    const m = !emCodigo && linha.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (m) {
      atual = { nivel: m[1].length, titulo: m[2], corpo: '' };
      secoes.push(atual);
    } else if (atual) {
      atual.corpo += linha + '\n';
    }
  }
  return secoes;
}
