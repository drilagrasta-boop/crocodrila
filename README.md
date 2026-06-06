# Condenados à Atualização em IA

Site da newsletter semanal + a toca da **Crocodrila** (projetos) + **Entrevistas** mensais.
Feito com [Astro](https://astro.build) — site estático, hospedagem gratuita, conteúdo em Markdown.

---

## Como rodar na sua máquina

```bash
npm install        # só na primeira vez
npm run dev        # abre em http://localhost:4321 e recarrega ao salvar
```

Para gerar a versão final (o que vai pro ar):

```bash
npm run build      # gera a pasta dist/
npm run preview    # confere o resultado final em http://localhost:4321
```

---

## ✍️ Publicar uma edição nova (toda semana)

1. Crie um arquivo em `src/content/edicoes/` com nome no padrão
   `AAAA-MM-DD-edicao-NNN.md` (ex.: `2026-06-06-edicao-004.md`).
2. Cole o modelo abaixo e preencha. O texto vai em **Markdown** (veja o guia no fim).
3. Salve, confira com `npm run dev`, e faça o deploy (seção lá embaixo).

### Modelo de edição (copie e cole)

```markdown
---
numero: 4
titulo: "O título lavrado da semana"
data: 2026-06-06
dateline: "Lavrado em 6 de junho de 2026, com efeitos retroativos a 30 de maio"
resumo: "Uma ou duas frases que resumem a edição (aparece na home e na lista)."
destaques:
  - "Primeiro destaque"
  - "Segundo destaque"
  - "Terceiro destaque"
editores:
  - "Dennis Martins"
  - "Adriana Aneli"
---

<p class="kicker">Modelo proprietário</p>

## Título da primeira matéria

Texto da matéria. Fontes entram entre parênteses (Anthropic), como na newsletter.

| Benchmark | Score | O que mede |
| --- | --- | --- |
| SWE-Bench Pro | 69,2% | Descrição curta. |

<blockquote class="pull">Uma citação de destaque.<cite>Fonte da citação</cite></blockquote>

### O que isso desbloqueia na prática

Mais texto.

<p class="kicker">Ferramenta</p>

## Próxima matéria
...
```

**Truques de formatação desta newsletter** (já estilizados):

| Você escreve | Vira |
| --- | --- |
| `<p class="kicker">Modelo open-source</p>` | a etiqueta dourada de categoria |
| `## Título` | título de matéria |
| `### Subtítulo` | os blocos "O que desbloqueia", "Impacto prático" etc. |
| tabela Markdown | tabela de benchmark (score em dourado) |
| `<blockquote class="pull">…<cite>…</cite></blockquote>` | a citação-carimbo |

> Para esconder uma edição (rascunho), adicione `rascunho: true` no topo.

**Links para as fontes primárias** (essenciais nesta newsletter): no texto, escreva o
nome da fonte assim — `[Anthropic](https://www.anthropic.com/news/...)`. O site abre
todos os links externos em nova aba automaticamente. Quando a edição vier de um **PDF**,
os links já vêm embutidos nele; peça ao Claude para extrair texto **e** hyperlinks do PDF
e montar o Markdown com os links no lugar.

---

## 🐊 Adicionar um projeto na Crocodrila

Crie um arquivo em `src/content/crocodrila/` (ex.: `meu-projeto.md`):

```markdown
---
titulo: "Nome do projeto"
subtitulo: "Uma linha dizendo o que é."
data: 2026-06-01
status: "em uso"          # em uso | em desenvolvimento | experimento | aposentado
tags: ["MCP", "Python"]
repo: "https://github.com/..."   # opcional
demo: "https://..."              # opcional
destaque: true            # aparece na home
ordem: 1                  # menor = aparece primeiro
---

Descrição completa do projeto em Markdown.
```

---

## 🎙️ Adicionar a entrevista do mês

Crie um arquivo em `src/content/entrevistas/` (ex.: `2026-06-joana-silva.md`):

```markdown
---
convidado: "Joana Silva"
papel: "pesquisadora em PLN, USP"
titulo: "“A frase de efeito da entrevista”"
data: 2026-06-15
resumo: "Resumo de uma ou duas frases."
foto: "/mascote/..."     # opcional; senão aparecem as iniciais
---

**Pergunta do entrevistador em negrito?**

Resposta do convidado.

**Outra pergunta?**

Outra resposta.
```

---

## 🚀 Colocar no ar (deploy gratuito — Cloudflare Pages)

> **Pré-requisito:** o `git` precisa estar instalado nesta máquina (hoje não está —
> veja a última seção). O deploy é feito conectando este projeto ao Cloudflare via GitHub.

1. **Crie um repositório** no GitHub (pode ser privado) e suba este projeto:
   ```bash
   git init
   git add .
   git commit -m "Site da newsletter"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/condenados-ia.git
   git push -u origin main
   ```
2. Entre em **dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git**
   e escolha o repositório.
3. Configuração de build:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Save and Deploy.** Em ~1 min o site sobe num endereço `*.pages.dev`.

A partir daí, **toda vez que você der `git push`, o Cloudflare republica sozinho**.
O fluxo semanal vira: criar o `.md` da edição → `git add/commit/push` → no ar.

### Domínio próprio (opcional, ~R$40/ano)

No painel do projeto no Cloudflare → **Custom domains** → adicione `condenadosia.com.br`
(ou o que registrar). Se registrar o domínio na própria Cloudflare, o apontamento é
automático. Depois, troque a linha `SITE` em `astro.config.mjs` para o domínio final.

---

## ⚠️ Instalar o git (pendência nesta máquina)

O Node já está instalado; falta o git. No PowerShell:

```powershell
winget install --id Git.Git -e
```

Feche e reabra o terminal depois. Confira com `git --version`.

---

## Estrutura do projeto

```
src/
  content/
    edicoes/        ← as edições da newsletter (.md)
    crocodrila/     ← os projetos (.md)
    entrevistas/    ← as entrevistas mensais (.md)
  content.config.ts ← define os campos de cada tipo de conteúdo
  pages/            ← as páginas e rotas do site
  layouts/Base.astro
  components/       ← Header, Footer, Crocodrila (mascote)
  styles/global.css ← paleta da marca e tipografia
public/
  mascote/          ← ícones oficiais da Crocodrila
  favicon.svg
```
