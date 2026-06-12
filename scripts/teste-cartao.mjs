import { gerarArte, gerarSelo } from '../src/lib/og/cartao.mjs';
import { CROCODRILA, svgDataUri } from '../src/lib/og/artes.mjs';

const arte = await gerarArte(svgDataUri(CROCODRILA), 680, 250);
if (arte.readUInt32BE(16) !== 800 || arte.readUInt32BE(20) !== 800) throw new Error('arte com dimensões erradas');

const selo = await gerarSelo(3, svgDataUri(CROCODRILA));
if (selo.readUInt32BE(16) !== 800 || selo.readUInt32BE(20) !== 800) throw new Error('selo com dimensões erradas');

const logo = await gerarSelo(null, svgDataUri(CROCODRILA));
if (logo.readUInt32BE(16) !== 800 || logo.readUInt32BE(20) !== 800) throw new Error('logo com dimensões erradas');

console.log('OK arte + selo + logo 800x800');
