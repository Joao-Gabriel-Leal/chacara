# Chacara Hub

Aplicacao web premium para organizar um evento entre amigos em uma chacara, com visual moderno, area autenticada, financeiro, galeria, enquetes, jogos, mural e painel administrativo.

## Stack

- Next.js 16 com App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Supabase Auth, Database e Storage
- PostgreSQL
- React Hook Form + Zod
- TanStack Query
- Framer Motion
- Lucide Icons

## O que ja vem pronto

- Landing page com countdown e hero premium
- Login, cadastro por convite e recuperacao de senha
- Dashboard individual com financeiro, quarto, fotos, avisos e ranking
- Perfil editavel com React Hook Form + Zod
- Financeiro com barra de arrecadacao, tabela de participantes e envio de comprovante
- Galeria em 3 camadas: app, album completo e curadoria
- Organizacao do evento por abas
- Divisao de quartos
- Enquetes com resultados
- Jogos com ranking
- Mural interno
- Painel admin unificado
- Migrations iniciais com RLS
- Seed SQL e script para seed de usuarios no Supabase Auth
- Smoke test com Playwright

## Requisitos

- Node.js 20+ recomendado
- npm 11+
- Projeto Supabase criado

## Como rodar localmente

1. Instale as dependencias:

```bash
npm install
```

2. Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_EVENT_DATE=2026-12-12T12:00:00-03:00
NEXT_PUBLIC_EVENT_LOCATION=Chacara Horizonte, Mairinque - SP
```

3. Rode o app:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Sem variaveis do Supabase, a UI continua navegavel em modo demo com dados mockados.

## Setup do Supabase

1. Crie um projeto no Supabase.
2. Configure os buckets:
   - `avatars`
   - `gallery`
   - `payment-proofs`
3. Rode a migration em `supabase/migrations/20260409204000_init.sql`.
4. Rode o seed SQL em `supabase/seed.sql`.
5. Gere os usuarios demo:

```bash
npm run seed:demo
```

## Contas e dados que voce precisa ter

- 1 conta/projeto no Supabase
- Opcional: SMTP configurado no Supabase para recovery real
- Para colocar em producao com dados reais, substitua os placeholders por:
  - nome oficial do evento
  - data/hora
  - local
  - custo total e valor por pessoa
  - chave/instrucoes PIX
  - admin principal
  - quartos e capacidade
  - links dos albuns externos
  - itens reais de organizacao

## Estrutura do projeto

```text
src/
  app/
    (public)/
    (authenticated)/
  components/
  features/
  lib/
  types/
supabase/
  migrations/
  seed.sql
scripts/
tests/
```

## Testes

Lint:

```bash
npm run lint
```

Smoke E2E:

```bash
npm run test:e2e
```

## Observacoes

- O projeto foi estruturado para evoluir os dados mockados para queries reais do Supabase sem retrabalho grande.
- As telas ja seguem um design system consistente, dark mode e responsividade.
- Os fluxos de mutacao hoje estao prontos visualmente e parcialmente integrados; a persistencia completa depende de conectar as actions/queries ao seu projeto Supabase.
