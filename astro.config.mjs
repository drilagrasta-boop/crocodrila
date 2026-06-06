// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

// Troque para o seu domínio final quando registrar (ex.: https://condenadosia.com.br).
// Por enquanto vale o subdomínio gratuito do Cloudflare Pages.
const SITE = process.env.SITE_URL || 'https://condenados-ia.pages.dev';

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
