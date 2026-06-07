---
titulo: "Crocodrila Prompta"
subtitulo: "Um atalho global abre uma paleta, você busca o prompt, preenche as variáveis, e ele cola na janela aberta. Deu nome à toca e ao bicho."
data: 2026-04-01
status: "em uso"
tags: ["prompts", "AutoHotkey", "launcher", "produtividade"]
destaque: true
ordem: 0
---

Este foi o primeiro bicho da toca. Antes do conversor, antes dos MCPs, a gente já
acumulava prompt bom em arquivo solto, conversa de WhatsApp, print perdido. Toda vez
que um deles funcionava, sumia. A **Crocodrila Prompta** nasceu pra isso não acontecer:
uma pasta de prompts que virou um aplicativo de verdade, com atalho global e busca,
para chamar qualquer um deles em dois segundos sem caçar arquivo.

O nome é um trocadilho que pegou. Prompt vira "prompta", no feminino, porque a coisa
está sempre **pronta** pra usar. De brincadeira virou marca, e a marca pediu um bicho.

## Por que um jacaré

O jacaré é o animal que ninguém escolheria pra símbolo de tecnologia, e por isso mesmo
ele serve. Ele está aqui há mais de 200 milhões de anos não porque correu atrás de cada
novidade, mas porque mudou só o que precisava mudar e ignorou o resto. Sobreviveu à
extinção que levou dinossauro por ser eficiente, paciente e seletivo. É exatamente o que
a gente tenta ser com IA: não engolir todo lançamento, e sim guardar o que funciona.

Tem também a parte menos nobre. Jacaré fica horas parado, submerso, parecendo preguiça
pura, e quando a presa chega é o bicho mais rápido do brejo. Uma boa biblioteca de
prompt é assim. Fica quieta até a hora, e na hora resolve antes de você terminar de
pensar no problema.

Daí o resto veio sozinho. A Crocodrila virou a mascote da newsletter, e o lugar onde
guardamos as ferramentas virou **a toca dela**, esta página que você está lendo.

## O que ela é, por baixo

Não é site nem extensão de navegador. É um **app residente em AutoHotkey v2** que roda
em segundo plano no Windows, com ícone na bandeja. Instância única, sempre vivo,
esperando um atalho. Nenhuma chamada de rede: tudo acontece na sua máquina, lendo
arquivos e conversando com a área de transferência.

Cada prompt é um **arquivo `.yaml`** dentro de `prompts\`. O cabeçalho traz `name`,
`description` e `tags`; o corpo, depois de `prompt: |`, é o texto em si. A **categoria
vem da pasta**: a primeira subpasta é a área, a segunda é a tarefa, e a paleta mostra
isso como "jurídico > redação", "acadêmico > escrita". Hoje são quatro áreas grandes
(jurídico, acadêmico, geral, conferência) e perto de noventa prompts.

## Como funciona, do atalho à colagem

Você aperta **Ctrl+Shift+Espaço** de qualquer lugar. Sobe uma paleta escura, sem barra
de título, sempre no topo: um campo de busca e uma lista de duas colunas, nome e
categoria. Conforme digita, a lista filtra; a busca quebra o que você escreveu em
palavras e casa todas contra nome, descrição, categoria e tags. Setas pra navegar,
Enter pra escolher, Esc pra fechar.

Se o prompt tiver `{variáveis}`, entra um segundo formulário, um campo por variável,
com rótulo e valor padrão quando o arquivo define. Você preenche, e cada `{nome}` é
trocado pelo que você digitou.

A entrega é o pulo do gato. A ferramenta **guarda o que estava na sua área de
transferência**, põe o prompt montado no lugar, manda um Ctrl+V na janela que estava em
foco, e **devolve o conteúdo anterior do clipboard**. O texto aparece dentro do Word, do
chat, de onde você estiver, sem bagunçar o que você tinha copiado antes.

Na bandeja, três opções: recarregar os prompts, abrir a pasta, sair. O **Ctrl+Shift+F5**
relê a pasta sem reiniciar o app, então prompt novo entra na hora, sem fechar nada.

## Como montar a sua

Você não precisa de nada sofisticado. Precisa de **disciplina de guardar** e de um
lançador que cole onde você está.

1. **Um prompt, um arquivo.** Texto puro com um cabeçalho mínimo: nome, descrição, tags.
   Pastas viram categorias de graça, então organize por pasta em vez de inventar um campo.
2. **Marque os buracos com `{variáveis}`.** Onde o prompt muda a cada uso (o nome da
   parte, o número do processo, o tema), deixe um espaço nomeado. O lançador pergunta na
   hora.
3. **Coloque atrás de um atalho global.** No Windows, AutoHotkey resolve; em outros
   sistemas, qualquer lançador que rode script serve. O ganho é não recolar bloco de mil
   palavras na unha, nem perder o que você já tinha copiado.
4. **Recarregue sem reiniciar.** Editar prompt tem que ser barato. Um atalho que relê a
   pasta mantém o acervo vivo, porque guardar deixa de dar trabalho.

A regra de ouro é a mesma da casa: prompt que faz a máquina inventar com confiança é
prompt ruim. Peça sempre a fonte, imponha o guia de estilo, e confira a saída antes de
confiar nela.
