---
titulo: "Anonimizador"
subtitulo: "Tira os dados pessoais de uma peça sem nada sair do seu computador."
data: 2026-05-10
status: "em uso"
tags: ["offline", "LGPD", "sigilo", "privacidade"]
credito: "Inspirado no Sistema Marmelstein, de George Marmelstein"
destaque: true
ordem: 2
---

Compartilhar uma decisão para estudo, mandar uma peça de exemplo, alimentar uma
ferramenta de IA — tudo isso esbarra no mesmo problema: o documento está cheio de **dado
pessoal** que não deveria circular. O anonimizador resolve isso **na sua máquina, sem
internet e sem gastar token**.

## O que ele faz

- **Nomes de pessoas viram iniciais** — "João Silva Souza" vira "J.S.S.". Ele ignora
  conectores ("da", "de") e pronomes de tratamento ("Dr.", "Exmo."), pra não embaralhar.
- **Dados estruturados ganham tarja com rótulo** — CPF, RG, CNPJ, OAB, CRM, telefone,
  e-mail e CEP viram `[CPF]`, `[RG]`, `[EMAIL]` e por aí vai.

## Como ele acha os nomes

Por dois caminhos, e a ordem importa:

1. **Por lista** — você informa os nomes das partes e eles são **sempre** trocados. É o
   método confiável; é assim que se garante o resultado.
2. **Automático** — um detector de nomes em português pega menções soltas que você não
   listou. Funciona como **rede de segurança**, não como rede principal: trata-se de um
   rascunho a conferir, e ele tropeça em nome escrito em CAIXA ALTA.

Cada arquivo gera um **mapa do que foi trocado**, para você conferir antes de usar. Esse
mapa permite re-identificar — então ele é tão sigiloso quanto o original: guarde em lugar
seguro ou apague depois da conferência.

## Por que importa

É o par natural do [Conversor PDF → TXT](/crocodrila/conversor-pdf-txt): primeiro você
extrai o texto sem ele sair da máquina, depois tira os dados pessoais — e só então o
material fica pronto para circular, virar exemplo de aula ou entrar numa ferramenta de IA,
sem ferir o sigilo nem a LGPD. Como o conversor, ele troca conveniência por uma garantia:
nada sai do computador.

---

*Inspirado no **Sistema Marmelstein**, de George Marmelstein — nosso professor e orientador,
que disponibiliza seus prompts publicamente. A Crocodrila adaptou a ideia à sua rotina.*
