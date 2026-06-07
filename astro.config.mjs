// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

// Endereço oficial do site (usado em canonical, sitemap e RSS).
// Troque quando registrar um domínio próprio (ex.: https://condenadosia.com.br).
const SITE = process.env.SITE_URL || 'https://crocodrila.netlify.app';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
    // Links para fontes externas abrem em nova aba, com segurança.
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
});
