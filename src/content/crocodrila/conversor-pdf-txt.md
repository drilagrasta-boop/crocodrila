---
titulo: "Conversor PDF → TXT"
subtitulo: "Extrai o texto de PDFs judiciais na sua própria máquina — nada sai para a nuvem."
data: 2026-04-10
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

1. **PyMuPDF** — usado quando a página tem texto digital de verdade (pelo menos uma
   centena de caracteres). Extração instantânea e perfeita; resolve a maioria. Os
   carimbos que o tribunal grava em toda folha ("Para conferir o original...", "fls. 12")
   não entram nessa conta, porque aparecem até na página escaneada.
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

## Baixe o kit pronto

Se você usa Windows e prefere não montar do zero, a gente empacotou a versão que usamos no
dia a dia. A ideia veio do Sistema Marmelstein; o código deste kit foi escrito pela
Crocodrila. Vem tudo junto: o **conversor**, o [**anonimizador**](/crocodrila/anonimizador-offline)
e uma terceira ferramenta, **Limpar Metadados**, que apaga do documento final os dados
ocultos (autor, datas, revisões) antes de você enviar.

- [**Baixar o kit** (conversor-anonimizador-offline.zip, 17 MB)](/crocodrila/conversor-pdf-txt/conversor-anonimizador-offline.zip)

**Atualizado em 7 de outubro de 2026.** A versão anterior do kit tinha um defeito sério
com autos do e-SAJ. O tribunal grava em toda folha, inclusive na escaneada, um carimbo de
texto com o código de conferência e o número da folha. O conversor achava que esse carimbo
era o conteúdo da página, pulava o OCR e a folha escaneada saía vazia no .txt, sem nenhum
aviso. Agora o carimbo é descontado antes da decisão e a folha passa pelo OCR. Se você
baixou o kit antes dessa data, baixe de novo, rode o instalador outra vez e reconverta os
autos do e-SAJ que tinham páginas escaneadas.

Para instalar, clique com o botão direito no ZIP, escolha **Extrair tudo** e abra o
arquivo `COMECE-AQUI.txt`: são seis passos, do Python aos atalhos na Área de Trabalho. A
instalação precisa de internet uma única vez (baixa o Tesseract e um modelo de português
de uns 550 MB); depois, tudo roda offline. O Windows pode avisar que o arquivo veio da
internet; o roteiro mostra como seguir.

**Bônus para quem usa o Claude Code.** Dentro do kit, a pasta `para-o-claude` traz uma
skill que ensina o seu Claude a chamar este conversor, com OCR, quando você pedir
"converte esse PDF". Com documento sigiloso, ela segue a ordem segura: converte e
anonimiza na sua máquina antes de ler qualquer linha. O tutorial está na mesma pasta.

## Ou monte o seu

A técnica é padrão e você monta a sua versão com ferramentas livres. O esqueleto cabe em
vinte linhas.

**O que instalar**

1. **Python** (versão 3.10 ou mais nova) — baixe em [python.org/downloads](https://www.python.org/downloads/).
   Na primeira tela do instalador, marque **"Add Python to PATH"**; sem isso o computador não acha
   o Python depois, e é o tropeço número um de quem começa.
2. **As bibliotecas** — abra o Prompt de Comando (tecle Windows, digite `cmd`, Enter) e rode:
   `pip install pymupdf pytesseract pillow`
3. **O Tesseract OCR**, com o idioma português — no Windows, use o
   [instalador do UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki) e marque
   **"Portuguese"** na lista de idiomas. É ele que lê as páginas escaneadas.

**A lógica (página a página)**

Tente o texto digital primeiro; se a página vier quase vazia, é imagem — aí renderize em
300 DPI e passe no OCR. Um cuidado que aprendemos apanhando: desconte os carimbos do
tribunal antes de medir, senão a folha escaneada com carimbo passa por digital. Tudo local:

```python
import fitz, io, re, pytesseract
from PIL import Image

# carimbos que o e-SAJ grava em toda folha, até na escaneada
CARIMBO = re.compile(r"Para conferir o original.*?código \S+|Este documento é cópia"
                     r" do original.*?sob o número \d+|^\s*fls\. \d+\s*$", re.S | re.M)

doc = fitz.open("processo.pdf")
paginas = []
for page in doc:
    texto = page.get_text().strip()
    if len(CARIMBO.sub("", texto).strip()) < 100:   # pouca letra = página escaneada
        pix = page.get_pixmap(dpi=300)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        texto = pytesseract.image_to_string(img, lang="por")
    paginas.append(texto)

open("processo.txt", "w", encoding="utf-8").write("\n\n".join(paginas))
```

A partir daí é refinar: ajustar o limite que decide "isto é imagem", incluir os carimbos de
outros sistemas (o e-proc, por exemplo, põe "Evento 1, Página 1" no rodapé), varrer uma
pasta inteira de uma vez. Mas o coração é
esse — e repare que **nada saiu da sua máquina**.

---

*Inspirado no **Sistema Marmelstein**, de [George Marmelstein](/entrevistas/2026-06-george-marmelstein) — nosso professor e orientador,
que disponibiliza seus prompts publicamente. A Crocodrila adaptou a ideia à sua rotina.*
