
-- 🔥 SCHEMA DEFINITIVO JARVIS (AURA) — COPIE E COLE NO SUPABASE SQL EDITOR

-- 1. Habilitar pgvector (ESSA LINHA DEVE VIR PRIMEIRO!)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Tabela de Histórico de Conversas
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    conversation_id TEXT DEFAULT 'default'
);

-- 3. Tabela de Fatos sobre o Usuário (Memória de Longo Prazo)
CREATE TABLE IF NOT EXISTS public.user_facts (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT NOT NULL,
    fact TEXT NOT NULL
);

-- 4. Tabela de Configuração de Especialistas
CREATE TABLE IF NOT EXISTS public.specialists_config (
    id TEXT PRIMARY KEY, -- Ex: 'SYNTAX', 'ORACLE'
    name TEXT,
    description TEXT,
    instruction TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Documentos (Base de Conhecimento RAG)
CREATE TABLE IF NOT EXISTS public.documents (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    embedding VECTOR(1536) 
);

-- 🛡️ POLÍTICAS DE ACESSO (Opcional, mas para o Anon Key funcionar)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso total mensagens" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.user_facts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso total fatos" ON public.user_facts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.specialists_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso total config" ON public.specialists_config FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso total docs" ON public.documents FOR ALL USING (true) WITH CHECK (true);
