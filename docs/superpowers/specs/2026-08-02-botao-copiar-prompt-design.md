# Botão de copiar nos blocos de prompt

**Data:** 2026-08-02
**Site:** Condenados à Atualização em IA (crocodrila.netlify.app)
**Estado:** aprovado, aguardando implementação

## Problema

As páginas da seção Crocodrila publicam prompts inteiros em blocos de código, para o
leitor colar numa IA. Hoje ele precisa selecionar cinquenta linhas com o mouse, o que em
celular é especialmente ruim. O prompt é o produto dessas páginas, e copiá-lo é a ação
que a página existe para provocar.

## Escopo

**Entra:** botão de copiar nos blocos que contêm prompt.

**Não entra:** blocos de comando e blocos de exemplo de saída. O site tem 19 blocos de
código, dos quais **2 são prompt** (1 no Adapta-Receita, 1 no protocolo de prompt
injection) e 17 são Python, PowerShell, markdown de exemplo ou saída de programa. Estes
ficam como estão.

Verificado em 02/08: a página do protocolo tem dois blocos, mas só o segundo é prompt. O
primeiro mostra a resposta do modelo quando a varredura passa limpa, e não há o que copiar
ali.

A decisão foi consciente: um botão em tudo seria mais fácil de implementar, mas o valor
está em copiar o prompt, e marcar só o que é prompt mantém o gesto significativo.

## Decisões

| Decisão | Escolha | Por quê |
|---|---|---|
| Marcação | Cerca ` ```prompt ` no markdown | Fica no conteúdo, legível, e blocos futuros só precisam da cerca certa |
| Montagem do botão | Script no layout, no navegador | Sem JavaScript não há botão, que é exatamente quando ele não funcionaria |
| Rótulo | "Copiar prompt", virando "Copiado" | Nomeia a coisa para quem ainda não tem o vocabulário, que é parte do público |
| Visibilidade | Sempre visível | Celular não tem passar o mouse |

Abordagens descartadas: plugin rehype no build (botão viria pronto no HTML, mas se o
JavaScript falhasse o leitor veria um botão inerte, pior que botão nenhum); componente
com MDX (exigiria converter as sete páginas de ferramenta e mais uma integração,
desproporcional para um botão).

## Implementação

**Configuração.** Em `astro.config.mjs`, dentro de `shikiConfig`, declarar `prompt` como
apelido de texto puro (`langAlias: { prompt: 'text' }`), para o Shiki não tentar colorir
sintaxe que não existe nem falhar com linguagem desconhecida.

**Conteúdo.** Trocar a cerca de dois blocos:

- `src/content/crocodrila/adapta-receita.md` — bloco hoje sem linguagem
- `src/content/crocodrila/protocolo-prompt-injection.md` — o segundo bloco, hoje `text`.
  O primeiro, que mostra a saída do protocolo, permanece sem linguagem e sem botão.

**Layout.** `src/layouts/Base.astro` ganha um script que localiza os blocos marcados como
prompt e insere em cada um um `<button type="button">`. O clique copia o texto do bloco
via API de área de transferência e troca o rótulo por dois segundos.

**Aparência.** Paleta já existente do mascote: fundo no tom do ventre (`#f2e9d2`), texto no
verde escuro (`#1d2b24`), dourado (`#c49a3a`) no hover e no foco. Botão discreto, ancorado
no canto superior direito do bloco.

**Acessibilidade.** Botão real, alcançável por teclado, com foco visível. A troca para
"Copiado" é anunciada a leitor de tela.

## Casos de borda

**Cópia falha.** Fora de HTTPS ou com permissão negada, a API de área de transferência
recusa. O rótulo passa a dizer que não deu e pede cópia manual. Não fingir sucesso.

**Bloco longo.** O prompt do Adapta-Receita tem cinquenta linhas e o botão fica no topo,
saindo de vista na rolagem em telas pequenas. Aceito nesta versão. Botão que acompanha a
rolagem só se a leitura mostrar que incomoda.

**Página sem prompt.** O script não encontra nada e não faz nada. Nenhuma das outras
seções (edições, ensaios, hobbies, entrevistas) é afetada.

## Verificação

1. `npm run build` limpo, 42 páginas
2. No HTML gerado, exatamente os 2 blocos de prompt marcados, e nenhum bloco de Python,
   PowerShell, markdown ou saída de programa alterado
3. Teste no navegador com clique real, conferindo que o texto copiado é idêntico ao do
   bloco

## Pendências

**Confirmar os blocos do protocolo de prompt injection.** Resolvido em 02/08: só o segundo
bloco é prompt. Ver Escopo.

**Combinar com o Dennis.** Resolvido em 02/08: autorizado pela Adriana, que confirmou o
aval dele.
