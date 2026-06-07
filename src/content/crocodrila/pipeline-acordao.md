---
titulo: "Pipeline de Acórdão"
subtitulo: "Vários agentes especializados que, juntos, levam um recurso da análise à minuta."
data: 2026-05-15
status: "em desenvolvimento"
tags: ["agentes", "pipeline", "redação jurídica"]
credito: "Inspirado no Sistema Marmelstein, de George Marmelstein"
destaque: false
ordem: 4
---

Elaborar um acórdão é trabalho de etapas: entender os fatos, checar admissibilidade, montar
o relatório, analisar a prova, pesquisar precedente, decidir, redigir. A gente quebrou isso
numa **linha de montagem de agentes**, cada um cuidando de uma etapa que domina, rodando em
paralelo onde dá.

## As etapas

- **FIRAC** — destrincha fatos, questões, regra, análise e conclusão
- **Admissibilidade** — checa os pressupostos recursais antes de gastar fôlego no mérito
- **Relatório** — monta a narrativa processual
- **Análise probatória** — cruza o que a prova efetivamente sustenta
- **Pesquisa jurisprudencial** — fixa os pontos controvertidos e busca precedente
- **Minuta** — costura tudo num texto que se sustenta

## A filosofia

Não é "a IA escreve a decisão". É o contrário: cada agente faz o trabalho braçal de levantar
e organizar, e o relator decide com tudo na mesa. A máquina garimpa; o humano julga.

## Como montar o seu

O segredo não é um prompt gigante que faz tudo — é **dividir** a tarefa em etapas pequenas,
dar a cada uma um agente com um único trabalho, e passar a saída de uma como entrada da
próxima. Você monta isso com qualquer ferramenta de IA que aceite instruções encadeadas.

**A receita**

1. **Liste as etapas** como um humano faria (foi o que fizemos acima). Cada etapa vira um
   agente com uma instrução curta e só uma responsabilidade.
2. **Encadeie**: a saída do FIRAC alimenta a admissibilidade; o relatório alimenta a análise;
   e assim por diante. Onde duas etapas não dependem uma da outra, rode em paralelo.
3. **Verifique no fim**: um último agente confere o que pode ter passado — o vício mais
   perigoso do modelo é a omissão silenciosa, então alguém precisa perguntar "o que falta?".
4. **Decida você.** A pipeline entrega a mesa posta; a sentença é sua.

Duas regras que economizam dor: peça a cada agente que **mostre a fonte** de cada afirmação
(senão ele inventa com confiança), e imponha um **guia de estilo** — nada de gerundismo,
palavra inflada ou aquele fechamento de assistente. Texto de gente.

---

*Inspirado no **Sistema Marmelstein**, de George Marmelstein — nosso professor e orientador,
que disponibiliza seus prompts publicamente. A Crocodrila adaptou a ideia à sua rotina.*
