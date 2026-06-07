<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/rss/channel">
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="title"/> — Feed RSS</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="crossorigin"/>
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&amp;family=Newsreader:ital,opsz@0,6..72;1,6..72&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
        <style>
          :root { --paper:#f7efdd; --ink:#1d2b24; --soft:#3a4a40; --faint:#6f7a6e; --line:#ddcfa9; --jacare:#3c5a45; --gold:#9c7a26; }
          * { box-sizing: border-box; }
          body { margin:0; background:var(--paper); color:var(--ink); font-family:'Newsreader',Georgia,serif; font-size:1.1rem; line-height:1.6; background-image: radial-gradient(circle at 1px 1px, rgba(29,43,36,.022) 1px, transparent 0); background-size:4px 4px; }
          main { max-width:46rem; margin:0 auto; padding:clamp(1.5rem,5vw,4rem) clamp(1.1rem,4vw,2rem); }
          .eyebrow { font-family:'JetBrains Mono',monospace; font-size:.72rem; letter-spacing:.18em; text-transform:uppercase; color:var(--gold); }
          h1 { font-family:'Fraunces',serif; font-weight:600; font-size:clamp(2rem,1.4rem+2.5vw,3.2rem); line-height:1.05; letter-spacing:-.015em; margin:.5rem 0 0; }
          .lead { color:var(--soft); margin-top:.8rem; }
          .howto { margin-top:1.6rem; padding:1rem 1.2rem; background:#fffdf6; border:1px solid var(--line); border-left:3px solid var(--jacare); border-radius:2px; font-size:.98rem; }
          .howto code { font-family:'JetBrains Mono',monospace; font-size:.85em; background:var(--paper); padding:.15em .4em; border-radius:2px; word-break:break-all; }
          h2 { font-family:'Fraunces',serif; font-weight:600; font-size:1.4rem; margin-top:2.6rem; padding-bottom:.4rem; border-bottom:2px solid var(--ink); }
          ul { list-style:none; padding:0; margin:0; }
          li { padding:1.3rem 0; border-bottom:1px solid var(--line); }
          .item-title { font-family:'Fraunces',serif; font-size:1.3rem; font-weight:600; text-decoration:none; color:var(--ink); background-image:linear-gradient(var(--jacare),var(--jacare)); background-size:100% 1.5px; background-position:0 100%; background-repeat:no-repeat; }
          .item-title:hover { color:var(--jacare); }
          .date { font-family:'JetBrains Mono',monospace; font-size:.72rem; color:var(--faint); text-transform:uppercase; letter-spacing:.08em; margin:.3rem 0 .5rem; }
          .desc { color:var(--soft); font-size:1rem; }
          .back { margin-top:2.4rem; font-family:'JetBrains Mono',monospace; font-size:.85rem; }
          .back a { color:var(--jacare); }
          ::selection { background:var(--jacare); color:var(--paper); }
        </style>
      </head>
      <body>
        <main>
          <p class="eyebrow">Feed RSS · atualização automática</p>
          <h1><xsl:value-of select="title"/></h1>
          <p class="lead"><xsl:value-of select="description"/></p>
          <div class="howto">
            <strong>Isto é um feed, não uma página.</strong> Para acompanhar sem depender de e-mail ou rede social, copie o endereço desta página e cole no seu leitor de RSS preferido (Feedly, Inoreader, NetNewsWire, ou a extensão de RSS do seu navegador). Cada edição nova aparece lá sozinha, assim que sai.
          </div>
          <h2>Edições publicadas</h2>
          <ul>
            <xsl:for-each select="item">
              <li>
                <a class="item-title" href="{link}"><xsl:value-of select="title"/></a>
                <div class="date"><xsl:value-of select="pubDate"/></div>
                <p class="desc"><xsl:value-of select="description"/></p>
              </li>
            </xsl:for-each>
          </ul>
          <p class="back"><a href="/">← voltar ao site</a></p>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
