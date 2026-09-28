# Vida em Ordem

> Organize sua vida. Simplifique sua rotina.

SaaS de organização pessoal que reúne **finanças, contas, cartões, assinaturas, metas, tarefas, rotina, hábitos, documentos, organização digital, checklists** e um **desafio gamificado de 7 dias** em uma única SPA moderna, responsiva e com tema claro/escuro.

Esta primeira versão funciona **100% sem backend**: os dados ficam no `localStorage`, isolados por usuário, atrás de uma camada de _services_ pronta para ser trocada por Supabase/PostgreSQL ou qualquer API.

---

## Começando

Requisitos: **Node.js 20.19+** (recomendado 22).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck (tsc -b) + build de produção em dist/
npm run preview   # serve o build localmente
npm run typecheck # apenas verificação de tipos
npm run lint      # oxlint
```

### Conta de demonstração

Na tela de login, clique em **"Entrar como demonstração"** para abrir imediatamente um painel completo com os dados fictícios da **Mariana Oliveira** (receitas de R$ 5.200, despesas de R$ 3.840, saldo de R$ 1.360, 8 assinaturas somando R$ 287/mês, metas, tarefas, hábitos a 78%, índice de organização de 72% etc.).

- Os dados de demonstração são **restaurados a cada acesso** e são gerados relativos à data atual (o painel sempre parece "vivo").
- A usuária demo tem papel `admin`, então também acessa o painel administrativo em **`/admin`**.
- Tudo é interativo: crie, edite, conclua e exclua itens à vontade.

Contas novas (`/cadastro`) começam vazias, passam pelo onboarding e podem carregar dados de exemplo em **Configurações → Privacidade → Seus dados**.

---

## Stack

| Camada        | Tecnologia                                          |
| ------------- | --------------------------------------------------- |
| UI            | React 19 + TypeScript (strict, sem `any`)           |
| Build         | Vite 8 (Rolldown) com code splitting por rota       |
| Rotas         | React Router DOM 7 (`createBrowserRouter` + `lazy`) |
| Estilo        | Tailwind CSS 4 com design tokens em CSS variables   |
| Estado global | Zustand (stores separados por domínio)              |
| Formulários   | React Hook Form + Zod                               |
| Gráficos      | Recharts                                            |
| Ícones        | Lucide React                                        |
| Datas         | date-fns (locale pt-BR)                             |
| Fontes        | Inter + Manrope (self-hosted via Fontsource)        |

---

## Arquitetura

```
src/
├── components/
│   ├── ui/            # Design system: Button, Input, Select, Modal, Card, Badge, Avatar,
│   │                  # ProgressBar, ProgressRing, Tabs, Dropdown, Tooltip, Toast, EmptyState,
│   │                  # LoadingState, ErrorState, DataTable, StatCard, ChartCard, PageHeader,
│   │                  # ConfirmDialog, CurrencyInput, SegmentedControl, Accordion…
│   ├── layout/        # AppLayout, Sidebar, Header, MobileNav, NotificationCenter, AdminLayout…
│   ├── charts/        # Gráficos Recharts (paleta validada para daltonismo)
│   ├── dashboard/ finance/ goals/ tasks/ habits/ routine/ documents/ checklists/ challenge/ …
├── pages/             # Uma pasta por rota (Landing, Auth, Onboarding, Dashboard, Finance, …, Admin)
├── routes/            # router (lazy), guards (ProtectedRoute, PublicOnlyRoute, AdminRoute), paths
├── hooks/             # useAuth, useFinance, useGoals, useTasks, useHabits, useNotifications, …
├── stores/            # Zustand: auth, tema, preferências, notificações, toasts, gamificação, dados
├── services/          # Camada de dados (mock/localStorage) — única parte a trocar por uma API
├── data/              # Dados mockados (mockUser, mockTransactions, mockGoals, mockTasks, …)
├── lib/               # storage seguro, hash de senha, schemas Zod, utilitários
├── utils/             # formatação pt-BR, datas, finanças, hábitos, gamificação, índice de organização
└── types/             # Tipos de domínio (User, Transaction, Account, CreditCard, Goal, Task, …)
```

Fluxo de dados: **componente → hook de domínio → store (Zustand) → service → storage**.

- Os **componentes** só conhecem hooks (`useTasks()`, `useFinance()`…), nunca o armazenamento.
- Os **hooks** derivam dados (resumos, séries, estatísticas) e dão feedback visual (toasts, pontos).
- Os **stores** mantêm cache em memória compartilhado entre páginas, com atualizações otimistas e rollback em caso de erro.
- Os **services** simulam latência de rede (para exercitar loading states) e persistem no `localStorage` sob `vo:u:<userId>:<coleção>`.

### Migrando para Supabase / API

1. Crie as tabelas equivalentes às coleções de `src/services/collections.ts` (`transactions`, `accounts`, `cards`, `goals`, `tasks`, `habits`, `habit_logs`, …) com RLS por `user_id`.
2. Reimplemente `createCollectionService` / `createDocumentService` (`src/services/collection.ts`) usando `supabase.from(tabela)`.
3. Reimplemente `src/services/authService.ts` com `supabase.auth.*` (signUp, signInWithPassword, signOut, getSession, resetPasswordForEmail).

Nenhum componente, hook ou store precisa mudar. Variáveis públicas previstas estão em `.env.example`.

Para pagamentos (Stripe ou outro gateway), a página de preços já está pronta; o checkout deve ser criado **no backend** (a secret key nunca vai para o frontend).

---

## Funcionalidades

- **Landing page** completa (hero com mockup do produto, problema, solução, recursos, showcases, desafio, benefícios, depoimentos, oferta, FAQ e CTA), navbar fixa e responsiva.
- **Autenticação** (login, cadastro com validação Zod e medidor de força de senha, recuperação de senha, demo), rotas protegidas e área admin restrita por papel.
- **Onboarding** em 3 etapas com respostas salvas no usuário.
- **Dashboard** com saldo do mês, maiores gastos, índice de organização (progress ring), foco de hoje, desafio, evolução financeira, contas próximas, tarefas, metas e hábitos — tudo interativo.
- **Finanças** com navegação por mês, cards com variação vs. mês anterior, despesas por categoria, evolução mensal e tabela filtrável/ordenável com paginação.
- **Contas, Cartões, Assinaturas, Metas, Tarefas, Rotina (dia/semana/mês), Hábitos (sequências + calendário), Documentos (apenas metadados), Organização digital, Checklists e Desafio 7 dias** com CRUD completo.
- **Gamificação**: pontos (tarefa +10, hábito +5, checklist +20, meta +50, desafio +100), 5 níveis e histórico, sem pontuação duplicada.
- **Central de notificações** com lido/não lido, filtros e exclusão.
- **Teste grátis e planos**: 7 dias grátis **sem cartão e sem cobrança automática**, contagem regressiva no cabeçalho, aviso nos últimos 3 dias (banner + notificação), página **Meu plano** (`/app/plano`) com planos Semanal, Mensal e Anual, cancelamento/reativação e tela de planos ao fim do teste — perfil, configurações, ajuda e exportação de dados continuam acessíveis (os dados nunca ficam presos). O checkout é simulado em `src/services/billingService.ts`, pronto para ser trocado pelo checkout hospedado do gateway (Stripe, Mercado Pago, Pagar.me…) com atualização do plano via webhook no backend.
- **Configurações**: tema claro/escuro/sistema, notificações, "ocultar valores", exportação de dados (JSON), restaurar/apagar dados e excluir conta.
- **Admin**: métricas, receita, planos, cadastros, funil do desafio e tabela de usuários.

---

## Qualidade

- **Responsivo**: sidebar fixa e recolhível (desktop), trilho de ícones + gaveta (tablet), gaveta + navegação inferior (mobile); tabelas viram cards no mobile; sem overflow horizontal.
- **Acessibilidade**: HTML semântico, labels ligados aos campos (`aria-describedby` para erros), `<dialog>` nativo com foco preso, menus e abas navegáveis por teclado, foco visível, link "pular para o conteúdo", `prefers-reduced-motion` respeitado e status sempre com ícone + texto.
- **Dark mode desenhado** a partir do Navy da marca (superfícies em camadas, bordas de baixo contraste, cores de estado recalibradas) — não é inversão de cores. Tema aplicado antes da primeira pintura (sem flash).
- **Performance**: todas as páginas e layouts com `React.lazy` + `Suspense`; Recharts, formulários e dados de demonstração só são baixados quando necessários; chunks de vendor estáveis para cache.
- **SEO**: title, meta description, Open Graph/Twitter com imagem, favicon, manifest, `robots.txt`, `sitemap.xml` e JSON-LD.

## Segurança (mesmo em modo mock)

- Senhas nunca em texto puro: **PBKDF2-SHA256 (120 mil iterações) com salt por usuário** via Web Crypto (fallback para SHA-256 iterado quando `crypto.subtle` não existe), comparação em tempo constante.
- Mensagens de erro genéricas no login e na recuperação de senha (não revelam se o e-mail existe).
- Sessão com expiração; dados de cada usuário em namespace próprio; caches em memória limpos ao sair.
- Nenhum secret no frontend; documentos armazenam apenas metadados (sem upload de arquivos sensíveis).
- Cabeçalhos de segurança e fallback de SPA configurados para Vercel (`vercel.json`) e Netlify (`public/_redirects`).

## Deploy

Qualquer hospedagem estática serve: gere `dist/` com `npm run build` e configure o fallback de SPA para `index.html` (já incluso para Vercel e Netlify).
