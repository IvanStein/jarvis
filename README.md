# 🧠 AURA — Assistente Universal Responsivo Autônomo

Assistente inteligente estilo Jarvis, com memória, RAG, skills e integração com Gemini.

## 🚀 Estrutura do Projeto

- `web/`: Frontend em Next.js.
- `api/`: Rotas serverless.
- `core/`: Lógica central do agente.
- `memory/`: Persistência de memória (Supabase).
- `rag/`: Recuperação de conhecimento.
- `tools/`: Skills e ferramentas.

## 🛠️ Tecnologias

- **Frontend**: Next.js
- **Backend**: Node.js
- **LLM**: Google Gemini
- **Banco de Dados**: Supabase (PostgreSQL + pgvector)

## ⚙️ Setup

1. Instale as dependências: `npm install`
2. Configure as variáveis de ambiente no arquivo `.env`.
3. Rode o projeto: `npm run dev`
