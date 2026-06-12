---
titulo: "Conversor PDF → TXT"
subtitulo: "Extrai o texto de PDFs judiciais na sua própria máquina — nada sai para a nuvem."
data: 2026-04-10
status: "em uso"
tags: ["offline", "OCR", "sigilo", "Python"]
credito: "Inspirado no Sistema Marmelstein, de George Marmelstein"
destaque: true
ordem: 1
pose: "papeis"
---

PDF de processo é um inimigo conhecido: uns têm texto limpo embutido, outros são só
imagem escaneada torta, e os piores misturam os dois na mesma peça — cabeçalho digital,
miolo escaneado. É o ponto cego que derruba quase todo conversor. Este aqui decide
**página a página** qual técnica usar, e roda **inteiro no seu computador**.

## Como funciona

1. **PyMuPDF** — usado quando a página tem texto digital de verdade (e ele desconta o
   carimbo "cópia do original assinado digitalmente" antes de medir, pra não se enganar).
   Extração instantânea e perfeita; resolve a maioria.
2. **Tesseract** (OCR local, 300 DPI) — quando a página é imagem, ele renderiza e lê ali
   mesmo, recuperando o que a extração digital ignora. Sem conexão, sem mandar nada para fora.

Cada página só sobe de degrau se o anterior não der conta. Rápido no caso fácil, teimoso
no difícil — e **offline do começo ao fim**.

## E o modo online?

Existe um terceiro degrau possível: uma **leitura por IA de visão**, que decifra até a
página escaneada mais sofrível. Mas ela fica **de fora da versão offline**, de propósito —
e a razão é o ponto inteiro da ferramenta. Esse degrau roda na nuvem: manda a imagem da
página para um servidor de terceiros. Ora, não faz sentido prometer que o documento não
sai da máquina e, justamente na página mais difícil, mandar essa página para fora. A regra
fica honesta: ou o material é sigiloso e **tudo permanece local** — aceitando que uma
página rara talvez não seja lida —, ou não é sigiloso, e aí o degrau online pode entrar.

## Por que importa

Quase tudo que a gente faz com decisão judicial — fichamento, pesquisa, anonimização —
começa com texto limpo. Este conversor é a **etapa zero**, e ser offline é o que permite
usá-lo com material sob sigilo sem mandar o processo do cliente para o servidor de ninguém.

> Nasceu de uma dor real: uma pasta com dezenas de milhares de decisões em PDF que
> ninguém ia transcrever na mão.

## Como montar o seu

Não distribuímos o nosso código (a base é do George — veja o crédito abaixo), mas a técnica
é padrão e você monta a sua versão com ferramentas livres. O esqueleto cabe em vinte linhas.

**O que instalar**

1. **Python** (3.10 ou mais novo).
2. As bibliotecas: `pip install pymupdf pytesseract pillow`
3. O **Tesseract OCR** e o idioma português (no Windows, o instalador oficial; marque
   "Portuguese" na lista de idiomas).

**A lógica (página a página)**

Tente o texto digital primeiro; se a página vier quase vazia, é imagem — aí renderize em
300 DPI e passe no OCR. Tudo local:

```python
import fitz, io, pytesseract
from PIL import Image

doc = fitz.open("processo.pdf")
paginas = []
for page in doc:
    texto = page.get_text().strip()
    if len(texto) < 100:                      # pouca letra = página escaneada
        pix = page.get_pixmap(dpi=300)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        texto = pytesseract.image_to_string(img, lang="por")
    paginas.append(texto)

open("processo.txt", "w", encoding="utf-8").write("\n\n".join(paginas))
```

A partir daí é refinar: ajustar o limite que decide "isto é imagem", descontar carimbos de
assinatura digital antes de medir, varrer uma pasta inteira de uma vez. Mas o coração é
esse — e repare que **nada saiu da sua máquina**.

---

*Inspirado no **Sistema Marmelstein**, de George Marmelstein — nosso professor e orientador,
que disponibiliza seus prompts publicamente. A Crocodrila adaptou a ideia à sua rotina.*
