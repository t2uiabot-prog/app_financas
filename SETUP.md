# Minhas Finanças — Setup

## Pré-requisitos
- Node.js 18+ (https://nodejs.org)

## 1. Instalar dependências
```bash
npm install
```

## 2. Variáveis de ambiente
O arquivo `.env.local` já está configurado com o Supabase do projeto.

## 3. Rodar em desenvolvimento
```bash
npm run dev
```
Abra http://localhost:3000

## 4. Deploy na Vercel
1. Push para um repositório GitHub
2. Importe o repo na Vercel (vercel.com)
3. Adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático

## Estrutura de arquivos
```
src/
├── app/
│   ├── (auth)/login/      # Página de login
│   ├── (auth)/signup/     # Página de cadastro
│   ├── (app)/dashboard/   # Dashboard principal
│   ├── (app)/transacoes/  # Lista de transações
│   └── layout.tsx
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── auth/              # Formulários de auth
│   ├── dashboard/         # Cards, gráfico, recent
│   ├── layout/            # Sidebar, mobile header
│   └── transactions/      # Form, list, delete dialog
├── lib/
│   ├── supabase/          # Client e server clients
│   └── utils.ts
├── types/index.ts
└── middleware.ts           # Proteção de rotas
```

## Supabase
- Projeto: minhas-financas
- Região: sa-east-1 (São Paulo)
- Auth: email/senha habilitado
- Tabela: transactions (com RLS ativo)
