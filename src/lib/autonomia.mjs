// Regras compartilhadas da seção AutonomIA (lista, página de leitura e feed).

// Texto fixo exibido na lista e no rodapé de cada edição.
export const AVISO_AUTONOMIA =
  'A AutonomIA trabalha com imprensa e com documentos oficiais, sempre com link. ' +
  'O relato dos fatos vem separado da leitura, que é opinião assinada. ' +
  'Nada aqui é recomendação de investimento.';

// Rascunho só aparece na prévia local: MOSTRAR_RASCUNHOS=1 npm run dev (ou build).
// Na Netlify a variável não existe, então rascunho nunca vai ao ar.
const mostrarRascunhos = () => process.env.MOSTRAR_RASCUNHOS === '1';

/** Edições que podem ser exibidas, da mais recente para a mais antiga. */
export function publicadas(entries) {
  return entries
    .filter((e) => mostrarRascunhos() || !e.data.rascunho)
    .sort((a, b) => b.data.numero - a.data.numero);
}

/** "nº 001", ou "edição piloto" para o número zero. */
export function rotuloNumero(numero) {
  return numero === 0 ? 'edição piloto' : `nº ${String(numero).padStart(3, '0')}`;
}

/** Título de item de lista e de feed: "AutonomIA nº 001 · Título" / "AutonomIA · edição piloto · Título". */
export function tituloItem(entry) {
  const { numero, titulo } = entry.data;
  return numero === 0
    ? `AutonomIA · edição piloto · ${titulo}`
    : `AutonomIA ${rotuloNumero(numero)} · ${titulo}`;
}

const dia = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', timeZone: 'UTC' });
const diaMes = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const diaMesAno = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "Semana de 18 a 24 de novembro de 2026" (ou "de 25 de novembro a 1 de dezembro de 2026"). */
export function semana(inicio, fim) {
  const mesmoMes = inicio.getUTCMonth() === fim.getUTCMonth() && inicio.getUTCFullYear() === fim.getUTCFullYear();
  return mesmoMes
    ? `Semana de ${dia.format(inicio)} a ${diaMesAno.format(fim)}`
    : `Semana de ${diaMes.format(inicio)} a ${diaMesAno.format(fim)}`;
}
