---
titulo: "Anonimizador"
subtitulo: "Tira os dados pessoais de uma peça sem nada sair do seu computador."
data: 2026-05-10
tags: ["offline", "LGPD", "sigilo", "privacidade"]
credito: "Inspirado no Sistema Marmelstein, de George Marmelstein"
destaque: true
ordem: 2
pose: "tarja"
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

## Como montar o seu

A base é dois movimentos simples, ambos offline: **trocar por padrão** (os dados que têm
formato fixo) e **trocar por lista** (os nomes que você informa).

**O que instalar**

1. **Python** (versão 3.10 ou mais nova) — baixe em [python.org/downloads](https://www.python.org/downloads/).
   Na primeira tela do instalador, marque **"Add Python to PATH"**. É o passo que quase todo mundo
   esquece, e sem ele o computador não acha o programa depois. Só o Python já resolve a parte de
   tarjas (CPF, e-mail, telefone…), que é pura expressão regular.
2. **Opcional**, para pescar nomes que você esqueceu de listar: abra o Prompt de Comando (tecle
   Windows, digite `cmd`, Enter) e rode `pip install spacy`, depois
   `python -m spacy download pt_core_news_sm` — baixa uma vez. Trate o resultado automático como
   rascunho a conferir.

**O esqueleto**

```python
import re

# dados com formato fixo → tarja com rótulo
TARJAS = {
    r"\d{3}\.?\d{3}\.?\d{3}-?\d{2}": "[CPF]",
    r"[\w.+-]+@[\w-]+\.[\w.-]+":      "[EMAIL]",
    r"\(?\d{2}\)?\s?9?\d{4}-?\d{4}":  "[TELEFONE]",
}
texto = open("peca.txt", encoding="utf-8").read()
for padrao, rotulo in TARJAS.items():
    texto = re.sub(padrao, rotulo, texto)

# nomes das partes (o jeito confiável: você informa)
for nome in ["João Silva Souza", "Maria Lima"]:
    iniciais = "".join(p[0] for p in nome.split() if p[0].isupper()) 
    texto = texto.replace(nome, ".".join(iniciais) + ".")

open("peca_anon.txt", "w", encoding="utf-8").write(texto)
```

Depois é só somar padrões (RG, OAB, CNPJ, CEP) e, importante, **gerar um arquivo-mapa** do
que foi trocado — pra você conferir antes de usar, e guardar em segurança (esse mapa
re-identifica).

---

*Inspirado no **Sistema Marmelstein**, de [George Marmelstein](/entrevistas/2026-06-george-marmelstein) — nosso professor e orientador,
que disponibiliza seus prompts publicamente. A Crocodrila adaptou a ideia à sua rotina.*
