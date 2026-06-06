---
titulo: "MCPs de Jurisprudência"
subtitulo: "Servidores que conectam o assistente direto à pesquisa de precedentes dos tribunais."
data: 2026-04-25
status: "em uso"
tags: ["MCP", "jurisprudência", "scraping", "precedentes"]
destaque: true
ordem: 3
---

A maioria dos tribunais não tem API pública decente de jurisprudência — tem um
formulário web cheio de AJAX e JSF, feito pra gente clicar, não pra máquina consultar.
A gente fez a ponte: **servidores MCP** que falam com esses portais e devolvem
precedentes já estruturados pro assistente usar na hora de fundamentar.

## O que cobre

- Busca de acórdãos por tribunal, câmara, relator e data
- Resultados ranqueados por relevância e nível de autoridade (vinculante, repetitivo,
  súmula, orientativo)
- Descoberta automática da sintaxe booleana de cada portal — cada tribunal tem a sua,
  e ninguém documenta

## A parte difícil

Scraping de portal de tribunal é um esporte de contato. Sessão que expira, token
escondido em campo oculto, paginação que só funciona com o referer certo. Cada
servidor encapsula essas manhas pra que, do lado de fora, consultar o TJ seja tão
simples quanto fazer uma pergunta.

> A regra que a gente segue: precedente sem link pro inteiro teor não serve. Toda
> resposta aponta pra origem verificável.
