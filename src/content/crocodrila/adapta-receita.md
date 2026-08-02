---
titulo: "Adapta-Receita"
subtitulo: "Uma receita para duas pessoas vira uma para sete, sem que o sal, o forno e a panela sigam a mesma conta. É um prompt: você cola numa IA junto com a foto da receita."
data: 2026-08-01
status: "em uso"
tags: ["prompt", "cozinha", "sem instalação"]
ordem: 9
pose: "medidas"
---

## O problema

Toda receita foi escrita para um número de pessoas que não é o seu. A da avó rende quatro
e vêm sete; a do livro serve dez e você está sozinha. A conta parece trivial, multiplica
tudo por 1,75 e pronto, e é justamente aí que o jantar estraga.

Porque **nem tudo escala junto**. Dobrar o refogado não dobra o diâmetro da panela, e
comida amontoada cozinha no próprio vapor em vez de dourar. Triplicar o assado não
triplica o forno, que tem uma capacidade só. O tempo de redução de um molho depende da
área da superfície, não do volume. O sal escala menos do que o resto, porque o paladar não
é linear. E fermento, gelatina e agentes de liga têm faixas em que funcionam e faixas em
que falham.

Há ainda uma pergunta anterior a todas essas, que a receita também não faz: quanto cada um
come. A porção é unidade de quem escreveu, não medida do seu apetite, e o mesmo caldo verde
é uma coisa quando é o jantar inteiro e outra quando divide a mesa com mais quatro pratos.
Multiplicar porção por pessoa sem responder isso erra em alguma direção, quase sempre para
mais, às vezes para menos, porque quatro adolescentes à mesa comem bem mais do que quatro
lugares na conta. E há ainda o excesso que se sente antes de acabar o prato, a gordura e o
sabor forte que estavam equilibrados em quatro porções e pesam em dezesseis.

Nada disso está escrito na receita, porque quem escreveu não imaginava você multiplicando
por 1,75. Uma IA faz a aritmética em um segundo, mas, se ninguém pedir o contrário, ela
multiplica tudo por igual e devolve uma conta certa que dá num prato errado.

## Como funciona

Não tem programa para instalar nem conta para criar. É **um prompt**, um texto de
instruções que você cola numa IA junto com a receita, que pode ser uma foto do livro
aberto, um PDF, um link ou texto copiado.

O prompt faz cinco coisas que a conta simples não faz.

**Transcreve antes de calcular.** A receita original é reproduzida com fidelidade, sem
inventar ingrediente, etapa, tempo ou temperatura que não estejam na fonte. Se a foto
estiver cortada ou ilegível, ele diz qual dado falta em vez de preencher por suposição. É
a mesma regra que vale para documento jurídico: o que não está na fonte não entra. E
distingue o dado que falta do que a receita deixou a gosto de propósito, porque receita de
família se escreve assim, com azeite e salsinha sem medida, e isso não é lacuna.

**Pergunta quem vai comer.** Antes de calcular, estabelece o consumo por pessoa. Se o prato
é a refeição inteira ou parte de um menu, se quem come são adultos ou crianças, se é entrada
ou prato único. Quando não tem como perguntar, adota refeição completa para adultos e
declara a suposição, para você corrigir antes de ir ao mercado.

**Aceita âncora, não só porção.** O alvo pode ser o número de pessoas, mas também um
ingrediente que você já tem. "Tenho três morcillas e a receita pede duas" dá o fator de
escala por si, 3 dividido por 2, e o resto do prato se ajusta em volta.

**Separa o que escala do que não escala.** Ingredientes recebem o fator. Temperatura de
forno, tamanho de panela, ponto de sal e quantidade de alho, não. Gordura, embutido e
aromático potente, da linguiça e do bacon ao louro e à noz-moscada, escalam abaixo do
fator, pela mesma razão do sal, e o abatimento vem declarado. Fermento, gelatina e liga escalam com ressalva.
Arredondamento só quando a diferença some no prato, e sempre avisado. O acompanhamento que
a receita cita no modo de servir e não mede, o arroz, o pão, a massa, entra pela conta do
alvo e vem marcado como acréscimo da adaptação.

**Devolve num artefato de receita.** No Claude, a resposta sai como uma página interativa,
com as porções ajustadas, os ingredientes numerados e referenciados dentro dos passos, e
cronômetro nos passos que têm espera. Junto vem um campo de notas com os ajustes práticos
que a escala exige: dourar em levas, trocar a panela, contar mais tempo de redução, dividir
em duas assadeiras. Em outras IAs, sem esse recurso, a mesma estrutura sai em texto.

## Faça o seu

O prompt inteiro está abaixo. Copie, cole numa conversa nova com a IA de sua preferência,
anexe a receita e diga o alvo.

```prompt
Recebo uma receita (foto, PDF, link ou texto colado) e um alvo de adaptação
(nº de porções, quantidade de um ingrediente-âncora, restrição ou substituição).

O que fazer:

1. Transcrever a receita original com fidelidade. Não inventar ingrediente,
   etapa, tempo ou temperatura que não estejam na fonte. Separar dois casos
   de quantidade não escrita, que não são a mesma coisa:
   - dado ausente que impede a conta (a carne, o tomate, o rendimento, a
     temperatura do forno): dizer qual falta, e não completar por suposição;
   - quantidade deixada a gosto por quem escreveu (sal, azeite, ervas,
     tempero, "um pouco de", "a gosto"): é escolha da receita, não lacuna.
     Não listar como dado faltante. Apenas dizer se acompanha a escala ou
     não, e seguir.

2. Estabelecer o consumo por pessoa antes de escalar. Perguntar, se não
   estiver dito: o prato é a refeição completa ou parte de um menu com
   outros pratos; quem come são adultos, crianças ou mistura; é entrada,
   prato único ou acompanhamento. Sem resposta, adotar refeição completa
   para adultos, declarar a suposição e seguir. Não tomar a porção da
   receita como medida de apetite.

3. Calcular o fator de escala a partir do alvo e desse consumo. Se o alvo
   for um ingrediente-âncora (ex.: "três morcillas" numa receita de duas),
   o fator sai dele: 3 ÷ 2 = 1,5.

4. Aplicar o fator a todos os ingredientes. Arredondar só quando a diferença
   for irrelevante no prato, e avisar quando arredondar. Não escalar
   linearmente: temperatura de forno, tamanho da panela, ponto de sal e
   quantidade de alho. O alho não acompanha o fator de jeito nenhum: manter
   a quantidade da receita original e deixar o ajuste a gosto, porque satura
   rápido e passa a dominar o prato.
   Gordura, embutido e aromático potente (linguiça, bacon, anchova, pimenta,
   louro, cravo, noz-moscada) escalam abaixo do fator quando ele passa de 2,
   ponto de partida em torno de três quartos, com o abatimento sempre
   declarado. Fermento, gelatina e agentes de liga escalam, mas com
   ressalva.

   Acompanhamento citado no modo de servir e não medido (espaguete, arroz,
   pão) entra na conta pelo alvo, marcado como acréscimo da adaptação e não
   da receita. Se a preparação tiver de ser dividida em duas panelas ou
   assadeiras, dividir também o aromático e o tempero entre elas, sem
   repetir a dose cheia em cada uma.

5. Entregar no widget de receita, com:
   - porções ajustadas, e quanto rende por pessoa
   - ingredientes com id, referenciados dentro dos passos
   - passos com título curto e timer quando houver espera
   - campo de notas com os ajustes práticos que a escala exige
     (área da panela, tempo de redução, dourar em levas, capacidade do forno)

6. Encerrar com uma linha em prosa dizendo o que mudou. Sem lista repetindo
   o que o widget já mostra.

Regras de estilo: PT-BR, unidades métricas, medidas caseiras brasileiras
preservadas como no original (xícara, colher de café, colher de sopa).
Sem juridiquês, sem estrangeirismo desnecessário, sem elogio à receita.
Manter a atribuição da fonte (livro, página, restaurante) quando existir.
```

Três coisas valem ser notadas nesse texto, porque servem para qualquer prompt que você
escreva depois.

**A proibição vale mais que a permissão.** "Não inventar ingrediente, etapa, tempo ou
temperatura que não estejam na fonte" é a linha que impede o resultado mais perigoso, que
é a receita plausível e falsa. Sem ela, o modelo completa o que faltou na foto e você só
descobre na hora de servir.

**Pedir o aviso é diferente de pedir o acerto.** "Avisar quando arredondar" e "com
ressalva" transformam o resultado em algo conferível. Sem isso, o número volta limpo e
você não tem como saber onde ele foi ajustado.

**O estilo entra no pedido.** Medidas caseiras preservadas, sem estrangeirismo, sem elogio
à receita. Modelo elogia por padrão, e elogio ocupa espaço que a nota prática deveria ter.

## Princípio de projeto

Conta certa não é prato certo. O que o prompt faz não é calcular melhor, porque
multiplicar é a parte fácil e a máquina nunca erra nisso. O que ele faz é obrigar a máquina
a declarar onde a multiplicação não vale, que é exatamente o saber que a receita não
escreveu porque quem cozinhava já tinha no corpo. E, antes disso, obrigá-la a perguntar o
que o alvo quer dizer, porque "para sete pessoas" não é um número, é uma cena, com hora do
dia, apetite e o que mais vai ter na mesa.

Vale para além da cozinha. Escalar qualquer coisa, uma equipe, um orçamento, um prazo, tem
partes que crescem junto e partes que não crescem. Pedir à IA a conta é fácil; o trabalho é
pedir que ela aponte o que a conta não alcança.

---

Este projeto nasceu do [hobby de agosto](/hobbies/2026-08-cozinhar), que traz quatro
receitas de família, todas escritas para um número de pessoas que provavelmente não é o
seu.
