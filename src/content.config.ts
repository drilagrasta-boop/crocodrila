import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ---------------------------------------------------------------------------
// EDIÇÕES — a newsletter semanal.
// Cada edição é um arquivo em src/content/edicoes/ (ex.: 2026-06-08-edicao-12.md)
// ---------------------------------------------------------------------------
const edicoes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/edicoes' }),
  schema: z.object({
    numero: z.number(),                 // 1, 2, 3...
    titulo: z.string(),                 // o título "lavrado" da semana (pode ser uma tirada jurídica)
    data: z.coerce.date(),              // AAAA-MM-DD
    dateline: z.string().optional(),    // ex.: "Lavrado em 30 de maio de 2026, com efeitos retroativos a 23 de maio"
    resumo: z.string(),                 // chamada de 1–2 frases (aparece na lista e no preview)
    destaques: z.array(z.string()).default([]), // bullets do "nesta edição"
    pdf: z.string().optional(),                 // caminho do PDF original em /public (ex.: /relatorios/...pdf)
    editores: z.array(z.string()).default([]),  // curadoria e edição (assina o rodapé da edição)
    rascunho: z.boolean().default(false),       // true = não publica
  }),
});

// ---------------------------------------------------------------------------
// CROCODRILA — vitrine dos projetos de vocês.
// Cada projeto é um arquivo em src/content/crocodrila/ (ex.: conversor-pdf-txt.md)
// ---------------------------------------------------------------------------
const crocodrila = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/crocodrila' }),
  schema: z.object({
    titulo: z.string(),
    subtitulo: z.string(),
    data: z.coerce.date(),
    status: z.enum(['em uso', 'em desenvolvimento', 'experimento', 'aposentado']).default('em uso'),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),  // link do código, se houver
    demo: z.string().url().optional(),  // link de demonstração, se houver
    credito: z.string().optional(),     // autoria/crédito (ex.: "George Marmelstein · Sistema Marmelstein")
    destaque: z.boolean().default(false), // aparece em destaque na home
    ordem: z.number().default(99),       // ordena os cards (menor = primeiro)
  }),
});

// ---------------------------------------------------------------------------
// ENTREVISTAS — conversa com um convidado que entende de IA (sem periodicidade fixa).
// Cada entrevista é um arquivo em src/content/entrevistas/ (ex.: 2026-06-joana-silva.md)
// ---------------------------------------------------------------------------
const entrevistas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entrevistas' }),
  schema: z.object({
    convidado: z.string(),              // nome do entrevistado
    papel: z.string(),                  // quem é / o que faz (ex.: "pesquisadora em PLN, USP")
    titulo: z.string(),                 // título/chamada da entrevista
    data: z.coerce.date(),
    resumo: z.string(),                 // 1–2 frases
    foto: z.string().optional(),        // caminho de uma foto em /public (opcional)
    foto_legenda: z.string().optional(),// legenda da foto (ex.: "Autorretrato")
    rascunho: z.boolean().default(false),
  }),
});

// ---------------------------------------------------------------------------
// HABEAS HOBBY — o contrapeso humano. Um hobby sugerido por mês, para resguardar
// o que a máquina não faz por você. Arquivos em src/content/hobbies/
// ---------------------------------------------------------------------------
const hobbies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hobbies' }),
  schema: z.object({
    titulo: z.string(),                 // o hobby do mês (ex.: "Desenho de observação")
    categoria: z.string().optional(),   // ex.: "Desenho", "Culinária", "Música"
    data: z.coerce.date(),
    resumo: z.string(),
    desafio: z.string().optional(),     // o convite do mês, em uma frase
    materiais: z.array(z.string()).default([]), // o que basta para começar
    tags: z.array(z.string()).default([]),
    rascunho: z.boolean().default(false),
  }),
});

export const collections = { edicoes, crocodrila, entrevistas, hobbies };
