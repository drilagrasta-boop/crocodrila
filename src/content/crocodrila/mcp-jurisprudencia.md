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

## Como montar o seu

Esse é o mais avançado dos três, mas o caminho é claro. Um **servidor MCP** nada mais é do
que um programinha que expõe "ferramentas" que o assistente pode chamar — aqui, uma busca.

**O que instalar**

1. **Python** + o SDK do MCP: `pip install mcp httpx beautifulsoup4`
2. Um cliente que fale MCP (o próprio Claude Desktop / Claude Code já falam).

**A forma**

Você declara uma ferramenta, e dentro dela faz a consulta ao portal do tribunal e devolve
o resultado já limpo:

```python
from mcp.server.fastmcp import FastMCP
import httpx
from bs4 import BeautifulSoup

mcp = FastMCP("jurisprudencia")

@mcp.tool()
def buscar(termo: str, tribunal: str = "TJSP") -> list[dict]:
    """Busca acórdãos e devolve título, data e link do inteiro teor."""
    html = httpx.get(URL_DE_BUSCA[tribunal], params={"q": termo}, timeout=30).text
    sopa = BeautifulSoup(html, "html.parser")
    return [
        {"titulo": a.get_text(strip=True), "link": a["href"]}
        for a in sopa.select(".resultado a")     # ajuste ao HTML do portal
    ]

mcp.run()
```

**A parte que dá trabalho** é o portal, não o MCP: sessão que expira, token escondido em
campo oculto, paginação com `referer`. O truque é abrir o **DevTools → aba Network**, fazer
uma busca na mão e copiar a requisição real (o HAR) — daí você reproduz no código. Um portal
de cada vez, e cada um vira uma ferramenta nova do mesmo servidor.
