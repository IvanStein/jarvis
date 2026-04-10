# 🔐 Task: Implementação de Autenticação e Banco de Dados (Supabase)

Implementar o fluxo de autenticação (Login/Registro) e a conexão com o banco de dados Supabase no projeto Jarvis/AURA usando Next.js 15.

## 🚀 Passos da Implementação

### 1. Preparação do Ambiente
- [ ] Instalar dependências: `@supabase/ssr @supabase/supabase-js`.
- [ ] Configurar variáveis no `.env` e `.env.example`.

### 2. Configuração do Cliente Supabase (Next.js SSR)
- [ ] Criar `web/utils/supabase/server.js`: Cliente para Server Components/Actions.
- [ ] Criar `web/utils/supabase/client.js`: Cliente para Client Components.
- [ ] Criar `web/utils/supabase/middleware.js`: Lógica de atualização de sessão.

### 3. Middleware de Autenticação
- [ ] Implementar `web/middleware.js` para proteger rotas e gerenciar cookies de auth.

### 4. Interface de Autenticação (Aura Style)
- [ ] Desenvolver `web/app/login/page.js`: Interface premium de login.
- [ ] Criar Server Actions para Login, Registro e Logout.

### 5. Banco de Dados (Schema Inicial)
- [ ] Script SQL para criar tabela `profiles` (estendendo `auth.users`).
- [ ] Script SQL para criar tabela `memories` (preparação para RAG).

## ✅ Critérios de Aceite
- [ ] Usuário consegue se registrar e logar.
- [ ] Sessão persiste após refresh (via cookies).
- [ ] Rotas protegidas redirecionam usuários não logados.
- [ ] Conexão com Supabase DB validada.
