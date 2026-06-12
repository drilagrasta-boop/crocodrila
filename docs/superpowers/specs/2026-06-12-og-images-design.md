# Imagens de compartilhamento e ilustrações por seção

Data: 2026-06-12 · Status: aprovado pela Adriana

## Objetivo

Cada conteúdo do site ganha uma imagem própria, usada em dois lugares: no preview de
compartilhamento (og:image, cartão 1200x630) e na própria página/card da seção.
Hoje todas as páginas usam o olho do jacaré (favicon-512), exceto as entrevistas
com foto (já resolvido em 9d7e5c8).

## Mapa de arte por seção

| Seção | Arte | Campo no frontmatter |
|---|---|---|
| Edições | Selo-carimbo do crocodilo com "VOL. 00N" (número dinâmico) | nenhum (usa `numero`) |
| Projetos da Toca | Pose temática da crocodrila | `pose:` (novo, opcional) |
| Hobbies | Line-art do hobby | `arte:` (novo, opcional) |
| Entrevistas | Foto real do entrevistado, sem cartão composto (comportamento atual) | `foto` (já existe) |
| Home e índices | Cartão genérico com o mascote | — |

Poses planejadas (uma por projeto): pensando (Prompta), digitando (Criação de Sites),
lupa (Protocolo Prompt Injection), carregando papéis (Conversor PDF→TXT), tarja/máscara
(Anonimizador), balança (MCPs de Jurisprudência), martelo (Pipeline de Acórdão),
caderno (Fichamento de Aulas). Item sem pose/arte definida usa o mascote padrão.

Todas as artes são SVG line-art no estilo do mascote atual (`src/components/Crocodrila.astro`),
desenhadas pelo Claude e committadas no repositório (`src/assets/og/`).

## Gerador de cartões (decisão: geração automática no build)

- Endpoint Astro `src/pages/og/[...].png.ts` gera, no `npm run build`, um PNG 1200x630
  por edição, projeto e hobby, mais os cartões genéricos (home/índices).
- Bibliotecas: `satori` + `@resvg/resvg-js` (JS/WASM puro; compatível com o build Node 20
  do Netlify). Fontes Fraunces e JetBrains Mono em TTF, em `src/assets/fonts/`.
- Layout do cartão (estética "dossiê"): fundo bege `#f2e9d2`, rótulo da seção em
  JetBrains Mono dourado `#c49a3a` no topo, título em Fraunces, arte à direita,
  filete e "Condenados à Atualização em IA" no rodapé.
- Alternativa rejeitada: cartões PNG committados à mão (perde a automação semanal);
  função serverless (complexidade desnecessária em site estático).

## Integração

- Cada página passa `/og/<colecao>/<id>.png` para a prop `image` do `Base.astro`
  (prop criada em 9d7e5c8; SVG continua vetado como og:image).
- No site: selo de volume no cabeçalho da edição; pose no card e no topo da página
  do projeto; desenho no card do hobby.
- Retrato do Claude: converter `public/mascote/claude-retrato.svg` para PNG e
  preencher `foto:` com o PNG (a página pode continuar exibindo o SVG).

## Riscos

Build do Netlify com dependências novas é o único risco real; mitigado pela escolha
de libs sem binário nativo. Rollback: remover o endpoint devolve o site ao estado
atual (artes e campos novos continuam válidos e inofensivos).

## Critérios de aceite

1. `npm run build` local gera os PNGs em `dist/og/` com 1200x630.
2. Página de edição publicada serve og:image com o selo e o número correto.
3. WhatsApp mostra o cartão (testar com `?v=N` por causa do cache).
4. Edição nova futura ganha cartão sem nenhum passo manual além do `.md`.

## Ordem de entrega

1. Gerador + cartão das edições com selo de volume
2. Poses dos projetos da Toca
3. Desenho do hobby (Desenho de observação)
4. Retrato PNG do Claude + cartões da home/índices
