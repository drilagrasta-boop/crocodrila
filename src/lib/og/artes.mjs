export const svgDataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

// CORPO = conteúdo interno do SVG do mascote (de src/components/Crocodrila.astro)
const CORPO = `<path
    d="M10,64 L58,60 L70,46 L82,56 L92,52 L100,40 L108,52 L118,38 L128,52
       L140,36 L152,52 L166,40 L182,50 L210,40 L240,30 L262,18
       L244,42 L214,52 L188,62 L176,64
       L178,90 L170,96 L162,90 L160,66
       L120,68
       L100,68 L102,92 L94,98 L86,92 L84,70
       L44,70 L12,72 Z"
    fill="#3c5a45"
  />
  <polyline
    points="100,40 118,38 140,36 166,40 210,40 240,30 262,18"
    fill="none" stroke="#c49a3a" stroke-width="2.4"
    stroke-linejoin="round" stroke-linecap="round" opacity="0.92"
  />
  <g fill="#f2e9d2" stroke="#1d2b24" stroke-width="0.6">
    <path d="M16,64 L19,71 L22,64 Z" /><path d="M23,64 L26,71 L29,64 Z" />
    <path d="M30,64 L33,71 L36,64 Z" /><path d="M37,64 L40,71 L43,64 Z" />
    <path d="M44,64 L47,71 L50,64 Z" /><path d="M51,64 L54,70 L57,64 Z" />
  </g>
  <path d="M12,64 L60,62" fill="none" stroke="#1d2b24" stroke-width="1.6" stroke-linecap="round" />
  <ellipse cx="16" cy="60" rx="2.6" ry="1.8" fill="#1d2b24" />
  <circle cx="66" cy="49" r="5.4" fill="#c49a3a" />
  <circle cx="66.5" cy="49.5" r="2.3" fill="#1d2b24" />
  <circle cx="64.6" cy="47.4" r="1" fill="#f2e9d2" />`;

const wrap = (extras = '') =>
  `<svg width="272" height="100" viewBox="0 8 272 100" fill="none" xmlns="http://www.w3.org/2000/svg">${CORPO}${extras}</svg>`;

export const CROCODRILA = wrap();
export const POSES = {
  pensando:  wrap(`<circle cx="78" cy="30" r="3" fill="none" stroke="#1d2b24" stroke-width="2"/><circle cx="90" cy="22" r="5" fill="none" stroke="#1d2b24" stroke-width="2"/><ellipse cx="112" cy="14" rx="14" ry="9" fill="none" stroke="#1d2b24" stroke-width="2"/>`),
  site:      wrap(`<rect x="18" y="18" width="46" height="36" rx="3.5" fill="#fffdf6" stroke="#1d2b24" stroke-width="2"/><line x1="18" y1="27" x2="64" y2="27" stroke="#1d2b24" stroke-width="1.6"/><circle cx="24" cy="22.5" r="1.7" fill="#9c4a2e"/><circle cx="30" cy="22.5" r="1.7" fill="#c49a3a"/><circle cx="36" cy="22.5" r="1.7" fill="#3c5a45"/><rect x="23" y="32" width="36" height="7" rx="1.5" fill="#3c5a45"/><g stroke="#c49a3a" stroke-width="1.6" stroke-linecap="round"><line x1="23" y1="44.5" x2="51" y2="44.5"/><line x1="23" y1="49.5" x2="44" y2="49.5"/></g><g stroke="#1d2b24" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="74,21 69,27 74,33"/><polyline points="83,21 88,27 83,33"/></g><line x1="80.5" y1="20" x2="76.5" y2="34" stroke="#c49a3a" stroke-width="1.8" stroke-linecap="round"/>`),
  lupa:      wrap(`<circle cx="34" cy="34" r="13" fill="none" stroke="#1d2b24" stroke-width="2.6"/><line x1="43" y1="43" x2="56" y2="56" stroke="#1d2b24" stroke-width="3" stroke-linecap="round"/><circle cx="34" cy="34" r="7" fill="none" stroke="#c49a3a" stroke-width="1.4"/>`),
  medidas:   wrap(`<path d="M16,20 h40 l-5,28 a7,7 0 0 1 -7,6 h-16 a7,7 0 0 1 -7,-6 Z" fill="#fffdf6" stroke="#1d2b24" stroke-width="2.2" stroke-linejoin="round"/><path d="M56,25 a10,9 0 0 1 0,15" fill="none" stroke="#1d2b24" stroke-width="2.2" stroke-linecap="round"/><g stroke="#c49a3a" stroke-width="1.8" stroke-linecap="round"><line x1="21" y1="29" x2="33" y2="29"/><line x1="22" y1="37" x2="31" y2="37"/><line x1="23" y1="45" x2="33" y2="45"/></g>`),
  papeis:    wrap(`<g fill="#fffdf6" stroke="#1d2b24" stroke-width="1.8"><rect x="18" y="20" width="26" height="34" rx="2" transform="rotate(-6 31 37)"/><rect x="26" y="16" width="26" height="34" rx="2" transform="rotate(4 39 33)"/></g><g stroke="#c49a3a" stroke-width="1.4"><line x1="31" y1="26" x2="46" y2="26"/><line x1="31" y1="32" x2="46" y2="32"/><line x1="31" y1="38" x2="42" y2="38"/></g>`),
  tarja:     wrap(`<rect x="52" y="42" width="28" height="13" fill="#1d2b24" transform="rotate(-4 66 48)"/>`),
  balanca:   wrap(`<g transform="translate(60 0)" stroke="#1d2b24" stroke-width="2" fill="none"><line x1="36" y1="14" x2="36" y2="48"/><line x1="16" y1="20" x2="56" y2="20"/><path d="M8,34 a8,8 0 0 0 16,0 M10,20 L8,34 M22,20 L24,34"/><path d="M48,34 a8,8 0 0 0 16,0 M50,20 L48,34 M62,20 L64,34"/></g>`),
  martelo:   wrap(`<g transform="rotate(-30 40 32)"><rect x="28" y="22" width="24" height="11" rx="2.5" fill="#3c5a45" stroke="#1d2b24" stroke-width="1.6"/><rect x="38" y="33" width="5" height="26" rx="2" fill="#c49a3a" stroke="#1d2b24" stroke-width="1.2"/></g>`),
  caderno:   wrap(`<rect x="20" y="20" width="32" height="40" rx="3" fill="#fffdf6" stroke="#1d2b24" stroke-width="2"/><line x1="26" y1="20" x2="26" y2="60" stroke="#c49a3a" stroke-width="1.6"/><g stroke="#1d2b24" stroke-width="1.3"><line x1="31" y1="30" x2="46" y2="30"/><line x1="31" y1="37" x2="46" y2="37"/><line x1="31" y1="44" x2="46" y2="44"/></g>`),
  microfone: wrap(`<rect x="16" y="18" width="16" height="26" rx="8" fill="#c49a3a" stroke="#1d2b24" stroke-width="1.2"/><path d="M10,34 a14,14 0 0 0 28,0" fill="none" stroke="#3c5a45" stroke-width="2.4" stroke-linecap="round"/><line x1="24" y1="48" x2="24" y2="54" stroke="#3c5a45" stroke-width="2.4" stroke-linecap="round"/><g stroke="#c49a3a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.75"><path d="M40,24 q6,7 0,14"/><path d="M47,20 q10,11 0,22"/><path d="M54,16 q14,15 0,30"/></g>`),
  grafo:     wrap(`<g stroke="#1d2b24" stroke-width="1.5" opacity="0.55"><line x1="50" y1="34" x2="26" y2="22"/><line x1="50" y1="34" x2="72" y2="20"/><line x1="50" y1="34" x2="78" y2="46"/><line x1="50" y1="34" x2="44" y2="56"/><line x1="50" y1="34" x2="22" y2="46"/><line x1="26" y1="22" x2="72" y2="20"/><line x1="78" y1="46" x2="44" y2="56"/></g><g stroke="#1d2b24" stroke-width="1.4"><circle cx="26" cy="22" r="4" fill="#3c5a45"/><circle cx="72" cy="20" r="4" fill="#c49a3a"/><circle cx="78" cy="46" r="4" fill="#9c4a2e"/><circle cx="44" cy="56" r="4" fill="#3c5a45"/><circle cx="22" cy="46" r="4" fill="#c49a3a"/></g><circle cx="50" cy="34" r="6" fill="#c49a3a" stroke="#1d2b24" stroke-width="1.6"/><circle cx="50" cy="34" r="2.4" fill="#1d2b24"/>`),
};
// Comemorativa da décima edição: jacaré de chapéu de festa, com bolo e vela.
export const ARTE_ANIVERSARIO = wrap(`
  <g>
    <path d="M75,19 L63,44 L87,44 Z" fill="#c49a3a" stroke="#1d2b24" stroke-width="2" stroke-linejoin="round"/>
    <path d="M71,28 L82,28 M67,36 L86,36" stroke="#9c4a2e" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="75" cy="14" r="4" fill="#f2e9d2" stroke="#1d2b24" stroke-width="1.8"/>
  </g>
  <g>
    <line x1="8" y1="56" x2="54" y2="56" stroke="#1d2b24" stroke-width="2" stroke-linecap="round"/>
    <rect x="12" y="35" width="38" height="21" rx="2.5" fill="#f2e9d2" stroke="#1d2b24" stroke-width="2.2"/>
    <path d="M12,35 h38 v-4 a2,2 0 0 0 -2,-2 h-34 a2,2 0 0 0 -2,2 Z" fill="#9c4a2e" stroke="#1d2b24" stroke-width="2.2" stroke-linejoin="round"/>
    <g fill="#1d2b24">
      <rect x="22" y="40" width="4" height="12" rx="1"/>
      <path d="M17,43 L22,39 L22,43 Z"/>
    </g>
    <ellipse cx="38" cy="46" rx="6" ry="6.4" fill="none" stroke="#1d2b24" stroke-width="3.4"/>
    <rect x="29.5" y="17" width="3" height="12" rx="1.5" fill="#fffdf6" stroke="#1d2b24" stroke-width="1.5"/>
    <path d="M31,16 q-3,-4 0,-7 q3,4 0,7 Z" fill="#c49a3a" stroke="#1d2b24" stroke-width="1.2"/>
  </g>
`);

export const ARTE_ENSAIOS = `<svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="56" y="24" width="104" height="116" rx="6" fill="#f2e9d2" stroke="#1d2b24" stroke-width="2" opacity="0.55"/>
  <rect x="44" y="18" width="104" height="116" rx="6" fill="#fffdf6" stroke="#1d2b24" stroke-width="2.4"/>
  <g fill="#c49a3a" stroke="#1d2b24" stroke-width="1.8" stroke-linejoin="round">
    <path d="M62,40 a9,9 0 1 1 12,8 q1,9 9,13 l-5,7 q-16,-8 -16,-28 Z"/>
    <path d="M92,40 a9,9 0 1 1 12,8 q1,9 9,13 l-5,7 q-16,-8 -16,-28 Z"/>
  </g>
  <g stroke="#3c5a45" stroke-width="3" stroke-linecap="round">
    <line x1="58" y1="86" x2="134" y2="86"/>
    <line x1="58" y1="98" x2="134" y2="98"/>
    <line x1="58" y1="110" x2="118" y2="110"/>
  </g>
  <line x1="58" y1="122" x2="86" y2="122" stroke="#9c4a2e" stroke-width="3" stroke-linecap="round"/>
</svg>`;

// Arte própria de cada ensaio (padrão da casa: todo ensaio novo ganha a sua).
// A chave entra no frontmatter do ensaio como `arte`.
export const ARTES_ENSAIO = {
  // "Inteligência artificial e uma reflexão..." (Alessandro Trovato): a escada
  // dos quatro níveis — do chat gratuito (balão no chão) à bandeira no topo,
  // com a linha dourada do lombo do jacaré subindo os degraus.
  'escada-de-niveis': `<svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="140" x2="188" y2="140" stroke="#1d2b24" stroke-width="2" stroke-linecap="round"/>
    <g fill="#fffdf6" stroke="#1d2b24" stroke-width="2.2" stroke-linejoin="round">
      <rect x="28" y="116" width="36" height="24"/>
      <rect x="64" y="92" width="36" height="48"/>
      <rect x="100" y="68" width="36" height="72"/>
      <rect x="136" y="44" width="36" height="96"/>
    </g>
    <polyline points="28,116 64,116 64,92 100,92 100,68 136,68 136,44 172,44"
      fill="none" stroke="#c49a3a" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
    <g>
      <line x1="154" y1="44" x2="154" y2="16" stroke="#1d2b24" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M154,16 L176,22 L154,28 Z" fill="#9c4a2e" stroke="#1d2b24" stroke-width="1.8" stroke-linejoin="round"/>
    </g>
    <g>
      <rect x="14" y="98" width="26" height="17" rx="5" fill="#3c5a45" stroke="#1d2b24" stroke-width="1.8"/>
      <path d="M22,115 L20,122 L29,115 Z" fill="#3c5a45" stroke="#1d2b24" stroke-width="1.8" stroke-linejoin="round"/>
      <g stroke="#f2e9d2" stroke-width="1.6" stroke-linecap="round">
        <line x1="19" y1="104" x2="35" y2="104"/>
        <line x1="19" y1="109" x2="30" y2="109"/>
      </g>
    </g>
    <g stroke="#c49a3a" stroke-width="2" stroke-linecap="round">
      <line x1="184" y1="24" x2="184" y2="34"/>
      <line x1="179" y1="29" x2="189" y2="29"/>
    </g>
  </svg>`,
  // "A máquina leu ou só concordou?" (Adriana Aneli): o livro aberto sob a lupa,
  // com a citação conferida em dourado — a leitura que se deixa provar.
  'leitura-provada': `<svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="16" y1="128" x2="184" y2="128" stroke="#1d2b24" stroke-width="2" stroke-linecap="round"/>
    <g fill="#fffdf6" stroke="#1d2b24" stroke-width="2.4" stroke-linejoin="round">
      <path d="M100,48 Q66,38 30,48 L30,114 Q66,104 100,114 Z"/>
      <path d="M100,48 Q134,38 170,48 L170,114 Q134,104 100,114 Z"/>
    </g>
    <line x1="100" y1="48" x2="100" y2="114" stroke="#1d2b24" stroke-width="2"/>
    <g stroke="#3c5a45" stroke-width="2.6" stroke-linecap="round">
      <line x1="40" y1="62" x2="88" y2="58"/>
      <line x1="40" y1="74" x2="88" y2="70"/>
      <line x1="40" y1="86" x2="76" y2="83"/>
    </g>
    <g stroke="#3c5a45" stroke-width="2.6" stroke-linecap="round">
      <line x1="112" y1="58" x2="160" y2="62"/>
      <line x1="112" y1="82" x2="148" y2="85"/>
    </g>
    <line x1="112" y1="70" x2="160" y2="74" stroke="#c49a3a" stroke-width="3" stroke-linecap="round"/>
    <circle cx="138" cy="72" r="21" fill="none" stroke="#1d2b24" stroke-width="2.8"/>
    <circle cx="138" cy="72" r="13" fill="none" stroke="#c49a3a" stroke-width="1.6"/>
    <line x1="153" y1="87" x2="172" y2="106" stroke="#1d2b24" stroke-width="3.4" stroke-linecap="round"/>
    <polyline points="129,72 136,80 149,63" fill="none" stroke="#9c4a2e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

export const ARTES_HOBBY = {
  'desenho-observacao': `<svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="40" width="120" height="90" rx="6" fill="#fffdf6" stroke="#1d2b24" stroke-width="2.4"/>
    <line x1="36" y1="40" x2="36" y2="130" stroke="#c49a3a" stroke-width="2"/>
    <path d="M50,100 Q70,70 90,95 T125,85" fill="none" stroke="#3c5a45" stroke-width="2.4" stroke-linecap="round"/>
    <g transform="rotate(38 150 70)"><rect x="142" y="30" width="14" height="64" rx="3" fill="#c49a3a" stroke="#1d2b24" stroke-width="1.8"/><path d="M142,94 L149,110 L156,94 Z" fill="#f2e9d2" stroke="#1d2b24" stroke-width="1.8"/><circle cx="149" cy="106" r="2.2" fill="#1d2b24"/></g>
    <circle cx="60" cy="62" r="6" fill="none" stroke="#9c4a2e" stroke-width="1.6"/>
  </svg>`,
  'modelar-com-as-maos': `<svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="131" x2="182" y2="131" stroke="#1d2b24" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="150" cy="107" rx="24" ry="22" fill="#3c5a45" stroke="#1d2b24" stroke-width="2.2" transform="rotate(-5 150 107)"/>
    <path d="M138,96 q7,-6 15,-3" fill="none" stroke="#f2e9d2" stroke-width="2" stroke-linecap="round" opacity="0.55"/>
    <ellipse cx="62" cy="104" rx="31" ry="27" fill="#9c4a2e" stroke="#1d2b24" stroke-width="2.2" transform="rotate(4 62 104)"/>
    <path d="M46,108 q7,6 15,1" fill="none" stroke="#1d2b24" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>
    <ellipse cx="59" cy="63" rx="23" ry="21" fill="#c49a3a" stroke="#1d2b24" stroke-width="2.2" transform="rotate(-6 59 63)"/>
    <circle cx="52" cy="60" r="2.7" fill="#1d2b24"/>
    <circle cx="66" cy="58.5" r="2.2" fill="#1d2b24"/>
    <path d="M53,70 q7,5 14,-0.5" fill="none" stroke="#1d2b24" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="44" y="124" width="13" height="13" rx="4.5" fill="#3c5a45" stroke="#1d2b24" stroke-width="1.8"/>
    <rect x="70" y="124" width="13" height="8" rx="4" fill="#3c5a45" stroke="#1d2b24" stroke-width="1.8"/>
  </svg>`,
  'cozinhar-de-vo': `<svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="16" y1="136" x2="184" y2="136" stroke="#1d2b24" stroke-width="2" stroke-linecap="round"/>
    <g stroke="#c49a3a" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7">
      <path d="M78,52 q-7,-11 0,-21 q7,-10 0,-20"/>
      <path d="M100,48 q-7,-12 0,-23 q7,-11 0,-21"/>
      <path d="M122,52 q-7,-11 0,-21 q7,-10 0,-20"/>
    </g>
    <rect x="34" y="76" width="26" height="11" rx="5.5" fill="#3c5a45" stroke="#1d2b24" stroke-width="2.2"/>
    <rect x="140" y="76" width="26" height="11" rx="5.5" fill="#3c5a45" stroke="#1d2b24" stroke-width="2.2"/>
    <path d="M56,66 h88 l-9,62 a8,8 0 0 1 -8,7 h-54 a8,8 0 0 1 -8,-7 Z" fill="#3c5a45" stroke="#1d2b24" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M60,92 q40,12 80,0" fill="none" stroke="#f2e9d2" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
    <rect x="46" y="60" width="108" height="10" rx="5" fill="#c49a3a" stroke="#1d2b24" stroke-width="2.2"/>
    <g transform="rotate(19 168 96)">
      <rect x="163" y="52" width="9" height="62" rx="4" fill="#9c4a2e" stroke="#1d2b24" stroke-width="1.8"/>
      <ellipse cx="167.5" cy="118" rx="12" ry="14" fill="#9c4a2e" stroke="#1d2b24" stroke-width="1.8"/>
    </g>
  </svg>`,
  'plantar-e-esperar': `<svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="16" y1="136" x2="184" y2="136" stroke="#1d2b24" stroke-width="2" stroke-linecap="round"/>
    <circle cx="162" cy="38" r="12" fill="#c49a3a" stroke="#1d2b24" stroke-width="2"/>
    <g stroke="#c49a3a" stroke-width="2.2" stroke-linecap="round">
      <line x1="162" y1="15" x2="162" y2="21"/>
      <line x1="162" y1="55" x2="162" y2="61"/>
      <line x1="139" y1="38" x2="145" y2="38"/>
      <line x1="179" y1="38" x2="185" y2="38"/>
      <line x1="146" y1="22" x2="150" y2="26"/>
      <line x1="174" y1="50" x2="178" y2="54"/>
      <line x1="178" y1="22" x2="174" y2="26"/>
      <line x1="150" y1="50" x2="146" y2="54"/>
    </g>
    <path d="M40,62 q5,8 0,12 q-5,-4 0,-12" fill="#c49a3a" stroke="#1d2b24" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M86,60 Q70,58 61,44 Q79,41 87,55 Z" fill="#3c5a45" stroke="#1d2b24" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M88,58 Q103,54 110,40 Q92,38 86,53 Z" fill="#3c5a45" stroke="#1d2b24" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M85,88 q-2,-16 2,-30" fill="none" stroke="#3c5a45" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="52" y="86" width="66" height="12" rx="4" fill="#9c4a2e" stroke="#1d2b24" stroke-width="2.2"/>
    <path d="M59,98 h52 l-7,38 h-38 Z" fill="#9c4a2e" stroke="#1d2b24" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M67,106 q18,6 36,0" fill="none" stroke="#f2e9d2" stroke-width="1.8" stroke-linecap="round" opacity="0.4"/>
    <g transform="rotate(-12 140 130)">
      <ellipse cx="140" cy="130" rx="9" ry="5.5" fill="#9c4a2e" stroke="#1d2b24" stroke-width="1.8"/>
      <path d="M136,128 q3,-2 6,0" fill="none" stroke="#f2e9d2" stroke-width="1.4" stroke-linecap="round"/>
    </g>
  </svg>`,
};
