---
titulo: "Transcritor Offline"
subtitulo: "Audiências, aulas e gravações viram texto sem que nada saia da sua máquina: reconhecimento de voz local, sem nuvem, à prova de segredo de justiça."
data: 2026-07-21
status: "em uso"
tags: ["offline", "Python", "Whisper", "transcrição"]
destaque: true
ordem: 5
pose: "microfone"
---

## O problema

Gravações se acumulam em qualquer trabalho: a audiência de instrução que precisa virar citação literal na sentença, a aula de pós-graduação que merece um fichamento, a ligação telefônica juntada como prova, o vídeo de uma palestra. O conteúdo está lá, mas trancado em áudio — e áudio não se busca com Ctrl+F, não se cita em minuta, não se cola em documento.

Existem dezenas de serviços online que transcrevem áudio. Todos funcionam do mesmo jeito: você envia o arquivo para o servidor de uma empresa, ela processa e devolve o texto. Para um vídeo de receita de bolo, ótimo. Para uma audiência sob segredo de justiça, impensável — o áudio de uma parte, de uma testemunha ou de uma criança em caso de família não pode passear por um servidor de terceiros, ainda que a empresa prometa apagar depois.

A saída é fazer o caminho contrário: em vez de levar o áudio até a inteligência artificial, trazer a inteligência artificial até o áudio. É isso que este projeto faz.

## Como funciona

O motor é o **Whisper**, modelo de reconhecimento de voz que a OpenAI liberou gratuitamente em 2022 — qualquer pessoa pode baixar o modelo inteiro e rodá-lo no próprio computador, sem conta, sem chave de API, sem internet. Ele foi treinado com centenas de milhares de horas de áudio em dezenas de idiomas e transcreve português brasileiro nativamente, com acentuação e pontuação.

Sobre ele, o projeto usa o **faster-whisper**, uma reimplementação otimizada que roda o mesmo modelo até quatro vezes mais rápido em processadores comuns — importante porque a máquina onde isso roda é um desktop modesto de escritório, sem placa de vídeo dedicada. Para vídeos, o **ffmpeg** (canivete suíço de conversão de mídia, também gratuito) extrai a trilha de áudio antes.

O fluxo completo: o arquivo entra (qualquer formato comum de áudio ou vídeo), o ffmpeg converte para o padrão que o modelo espera, o Whisper transcreve com detecção de silêncios (pausas longas de audiência não gastam processamento), e saem dois arquivos ao lado do original:

- **nome.txt** — o texto corrido, dividido em parágrafos pelas pausas da fala
- **nome_timestamps.txt** — o mesmo texto com marcas de tempo `[HH:MM:SS]` a cada trecho, para citar o momento exato de uma declaração

Depois do download inicial dos modelos, o computador pode estar sem internet: nada é enviado a lugar nenhum, nunca.

## Três jeitos de usar

**Arrastar e soltar** — Três atalhos na área de trabalho, um por tamanho de modelo. Arrasta-se o arquivo (ou uma pasta inteira) por cima do ícone e a transcrição começa. O atalho verde usa o modelo equilibrado do dia a dia; o índigo usa o modelo grande, mais preciso com termos técnicos e áudio ruim de telefone; o laranja usa o modelo pequeno, para rascunhos rápidos de gravações longas.

**Pasta vigiada** — Um quarto atalho liga o "vigia": um script que fica observando uma pasta específica. Qualquer áudio ou vídeo solto ali é transcrito automaticamente, sem mais nenhum clique. Útil quando os arquivos chegam ao longo do dia.

**Pelo assistente** — Dentro do Claude Code, um comando `/transcrever` chama o mesmo motor. A vantagem é o encadeamento: o assistente transcreve a aula e emenda direto no fichamento, ou transcreve a audiência e passa o texto pelo [anonimizador](/crocodrila/anonimizador-offline) (outro projeto desta toca) antes de qualquer uso.

## Expectativa honesta de velocidade

Reconhecimento de voz local em máquina sem placa de vídeo não é instantâneo. Os números reais, medidos num desktop de escritório com processador de quatro núcleos:

| Modelo | Tamanho | 1 hora de áudio leva | Para quê |
|--------|---------|----------------------|----------|
| base | ~140 MB | 15–25 min | Rascunho, triagem de gravações longas |
| small | ~460 MB | 30–50 min | Uso diário — boa qualidade em pt-BR |
| medium | ~1,5 GB | 1h30–2h30 | Citação literal, áudio ruim, termos técnicos |

Parece lento? O truque é que o tempo é da máquina, não seu: solta-se o arquivo na pasta vigiada e vai-se fazer outra coisa. E áudio com muitas pausas (audiências são cheias delas) transcreve bem mais rápido, porque os silêncios são pulados.

No primeiro teste real — uma ligação telefônica de 1min36s juntada como prova — o modelo equilibrado transcreveu em 48 segundos, metade da duração do áudio, capturando o diálogo completo: nome, CPF ditado dígito a dígito, perguntas e confirmações. Os únicos tropeços foram em trechos de fala acelerada, do tipo que também faria um estagiário pedir para repetir.

## Faça o seu

A versão mínima disso cabe em vinte linhas de Python e meia hora de paciência. O caminho:

### Passo 1 — Instale o Python e o motor

```
# instale o Python em python.org (marque "Add to PATH"), depois:
pip install faster-whisper
```

### Passo 2 — Instale o ffmpeg (para vídeos)

Baixe o executável em [gyan.dev/ffmpeg](https://www.gyan.dev/ffmpeg/builds/) (Windows) e deixe numa pasta conhecida. Se só for transcrever arquivos de áudio, dá para pular este passo.

### Passo 3 — O script mínimo

```python
from faster_whisper import WhisperModel
import sys

modelo = WhisperModel("small", device="cpu", compute_type="int8")
segmentos, info = modelo.transcribe(sys.argv[1], language="pt", vad_filter=True)

with open(sys.argv[1] + ".txt", "w", encoding="utf-8") as saida:
    for seg in segmentos:
        saida.write(seg.text.strip() + "\n")
        print(f"[{int(seg.start)//60:02d}:{int(seg.start)%60:02d}] {seg.text.strip()}")
```

Rode com `python transcrever.py gravacao.mp3`. Na primeira execução o modelo é baixado (~460 MB); nas seguintes, tudo é local. O parâmetro `compute_type="int8"` é o que torna viável rodar sem placa de vídeo — o modelo é comprimido para operar com números inteiros, muito mais leves para o processador.

### Passo 4 — O atalho de arrastar e soltar

Crie um arquivo `Transcrever.bat` na área de trabalho:

```
@echo off
chcp 65001 >nul
python C:\caminho\para\transcrever.py %1
pause
```

Arrastar um áudio por cima desse `.bat` passa o arquivo como argumento e a transcrição roda numa janela de console. O `chcp 65001` garante que os acentos apareçam corretos; o `pause` segura a janela aberta no final.

### Passo 5 (opcional) — Refinamentos

Daí em diante é lapidação, na ordem que fizer sentido: quebrar o texto em parágrafos pelas pausas da fala, gerar o arquivo paralelo com timestamps, aceitar pastas inteiras, pular o que já foi transcrito, extrair áudio de vídeo com o ffmpeg, e o vigia de pasta — um laço que verifica uma pasta a cada quinze segundos e transcreve o que encontrar.

---

## Princípio de projeto

Dado sensível não viaja. Serviço de nuvem é conveniente até o dia em que o contrato de confidencialidade, o sigilo profissional ou o segredo de justiça dizem que não pode — e nesse dia é tarde para descobrir que não havia alternativa. Ter o modelo dentro da máquina inverte a dependência: a conveniência continua, o dado fica.
