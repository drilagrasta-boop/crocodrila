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
  digitando: wrap(`<rect x="20" y="84" width="64" height="14" rx="3" fill="none" stroke="#1d2b24" stroke-width="2"/><g stroke="#1d2b24" stroke-width="1.4"><line x1="30" y1="88" x2="30" y2="94"/><line x1="40" y1="88" x2="40" y2="94"/><line x1="50" y1="88" x2="50" y2="94"/><line x1="60" y1="88" x2="60" y2="94"/><line x1="70" y1="88" x2="70" y2="94"/></g>`),
  lupa:      wrap(`<circle cx="34" cy="34" r="13" fill="none" stroke="#1d2b24" stroke-width="2.6"/><line x1="43" y1="43" x2="56" y2="56" stroke="#1d2b24" stroke-width="3" stroke-linecap="round"/><circle cx="34" cy="34" r="7" fill="none" stroke="#c49a3a" stroke-width="1.4"/>`),
  papeis:    wrap(`<g fill="#fffdf6" stroke="#1d2b24" stroke-width="1.8"><rect x="18" y="20" width="26" height="34" rx="2" transform="rotate(-6 31 37)"/><rect x="26" y="16" width="26" height="34" rx="2" transform="rotate(4 39 33)"/></g><g stroke="#c49a3a" stroke-width="1.4"><line x1="31" y1="26" x2="46" y2="26"/><line x1="31" y1="32" x2="46" y2="32"/><line x1="31" y1="38" x2="42" y2="38"/></g>`),
  tarja:     wrap(`<rect x="52" y="42" width="28" height="13" fill="#1d2b24" transform="rotate(-4 66 48)"/>`),
  balanca:   wrap(`<g stroke="#1d2b24" stroke-width="2" fill="none"><line x1="36" y1="14" x2="36" y2="48"/><line x1="16" y1="20" x2="56" y2="20"/><path d="M8,34 a8,8 0 0 0 16,0 M10,20 L8,34 M22,20 L24,34"/><path d="M48,34 a8,8 0 0 0 16,0 M50,20 L48,34 M62,20 L64,34"/></g>`),
  martelo:   wrap(`<g transform="rotate(-30 40 32)"><rect x="28" y="22" width="24" height="11" rx="2.5" fill="#3c5a45" stroke="#1d2b24" stroke-width="1.6"/><rect x="38" y="33" width="5" height="26" rx="2" fill="#c49a3a" stroke="#1d2b24" stroke-width="1.2"/></g>`),
  caderno:   wrap(`<rect x="20" y="20" width="32" height="40" rx="3" fill="#fffdf6" stroke="#1d2b24" stroke-width="2"/><line x1="26" y1="20" x2="26" y2="60" stroke="#c49a3a" stroke-width="1.6"/><g stroke="#1d2b24" stroke-width="1.3"><line x1="31" y1="30" x2="46" y2="30"/><line x1="31" y1="37" x2="46" y2="37"/><line x1="31" y1="44" x2="46" y2="44"/></g>`),
};
export const ARTES_HOBBY = {}; // preenchido na Task 6
