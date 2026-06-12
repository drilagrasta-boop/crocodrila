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
export const POSES = {};       // preenchido na Task 5
export const ARTES_HOBBY = {}; // preenchido na Task 6
