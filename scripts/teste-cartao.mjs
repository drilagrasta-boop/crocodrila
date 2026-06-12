import { gerarCartao, gerarSelo } from '../src/lib/og/cartao.mjs';
import { CROCODRILA, svgDataUri } from '../src/lib/og/artes.mjs';

const cartao = await gerarCartao({ rotulo: 'A Toca da Crocodrila', titulo: 'Teste de cartão', subtitulo: 'subtítulo de teste', arte: { dataUri: svgDataUri(CROCODRILA), largura: 326, altura: 120 } });
if (cartao.readUInt32BE(16) !== 1200 || cartao.readUInt32BE(20) !== 630) throw new Error('cartao com dimensões erradas');

const selo = await gerarSelo(3, svgDataUri(CROCODRILA));
if (selo.readUInt32BE(16) !== 800 || selo.readUInt32BE(20) !== 800) throw new Error('selo com dimensões erradas');

console.log('OK cartao 1200x630 + selo 800x800');
