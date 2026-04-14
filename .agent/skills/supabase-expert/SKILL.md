---
name: supabase-expert
description: Práticas recomendadas para integração Supabase, PostgreSQL, SSR e Row Level Security (RLS).
allowed-tools: Read, Write, Edit
version: 1.0
priority: HIGH
---

# Supabase Framework & Database

> **SKILL** - Organização, segurança (RLS), autenticação SSR e escalabilidade aplicáveis ao ecossistema Supabase Backend-as-a-Service trabalhando via banco Postgres.

---

## 1. Princípio Zero Trust (RLS)
NUNCA faça o dump do esquema exposto sem RLS. A API Data do Supabase torna suas tabelas alcançáveis pelo mundo fora (anon key) a menos que você as tranque.
- Habilite RLS (Row Level Security) em ABSOLUTAMENTE todas as tabelas criadas:
  `ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;`
- **Políticas (Policies)**: Escreva políticas exatas para as 4 operações (SELECT, INSERT, UPDATE, DELETE).
  Exemplo p/ usuários verem só os próprios dados:
  `CREATE POLICY "Users view own data" ON items FOR SELECT USING (auth.uid() = user_id);`

---

## 2. Server-Side Rendering Auth (`@supabase/ssr`)
No Next.js (App Router), dividimos as lógicas:
- **Server Components/Actions**: Use a função para instanciar o Server Client recuperando e definindo cookies (Server actions só podem mudar cookies, Server Components só podem ler).
- **Middleware**: Instancie um cliente edge para interceptar se a rota requer login antes de a Request sequer renderizar no servidor de origens. Renove a sessão ali.
- **Client Components**: Crie o Client nativo pelo `@supabase/ssr` se estiver se increvendo em canais Realtime ou reagindo em tempo real ao estado Auth.

---

## 3. Desempenho e Connection Pooling
Se sua aplicação tiver explosões de requisições, conectar-se diretamente ao Postgres via um ORM sem pool pode estourar as conexões máximas.
- **Data API via Fetch**: Em vez de invocar conexões Postgres tradicionais pesadas (`pg`, Prisma direto pro DB IP), o SDK do supabase age via REST ou Supavisor (um Connection Pooler moderno do ecossistema) para evitar falhas de esgotamento.
- Sempre construa indexes apropriados nas colunas onde a cláusula `WHERE` da sua query recai com mais frequência.

---

## 4. Realtime Channels
Ao consumir atualizações de WebSockets/Supabase Realtime num componente frontend (ex: React Next.js via useEffect):
- ATENÇÃO à Limpeza: Sempre guarde a referência do Channel e efetue um `.unsubscribe()` no momento que o componente desmontar (ou usar o cleanup do `useEffect`). 
- Vazamentos de canais inativos matam o servidor e incham o limite de conexões ativas na conta.

---

## 5. Abstrações vs SQL Direto
Embora o JS SDK do Supabase seja excelente, favoreça **RPC (Remote Procedure Calls)** e View Tables dentro do próprio Postgres-Dashboard para consultas SQL intensas e agregações (JOINs e Contas Múltiplas com permissões granulares), e depois apenas puxe a RPC de forma simples pelo Frontend/API. Isso poupa banda, tempo circular, e melhora a segurança e estabilidade da resposta.
