# 🧠 AURA — Assistente Universal Responsivo Autônomo

## 🎯 Objetivo
Construir um assistente inteligente estilo Jarvis, com memória, RAG, skills e integração com Gemini, rodando com frontend na Vercel.

---

# 🏗️ Arquitetura Geral

```
[Vercel - Frontend]
        ↓
[API Node.js - Agent]
        ↓
├── LLM (Gemini)
├── Memória (Supabase)
├── RAG (pgvector)
└── Skills (tools)
```

---

# 📂 Estrutura do Projeto

```
project-root/
├── .agents/
│   └── tasks/
│       └── build_aura.md
│
├── web/                # Next.js (Vercel)
├── api/                # Rotas serverless
├── core/               # Lógica do agente
├── memory/
├── rag/
├── tools/
├── config/
└── docs/
```

---

# ⚙️ FASE 1 — Setup

## Tarefas
- Inicializar projeto Node.js
- Instalar dependências

```
npm init -y
npm install next react react-dom
npm install axios dotenv
npm install @supabase/supabase-js
```

---

# ⚙️ FASE 2 — Integração com Gemini

## Arquivo
`core/llm.js`

## Objetivo
Criar função para chamada da API Gemini

---

# ⚙️ FASE 3 — Memória

## Arquivo
`memory/memory.js`

## Funções
- saveMessage
- getLastMessages
- saveMemory
- retrieveMemory

## Banco
Supabase

---

# ⚙️ FASE 4 — RAG

## ingest.js
- quebrar texto em chunks
- gerar embeddings
- salvar no banco

## retriever.js
- buscar contexto relevante

---

# ⚙️ FASE 5 — Skills

## Estrutura
```
tools/
├── calculator.js
├── http.js
├── file.js
```

## runner.js
Responsável por executar tools dinamicamente

---

# ⚙️ FASE 6 — Agente

## Arquivo
`core/agent.js`

## Fluxo
1. Recebe input
2. Busca memória
3. Busca contexto
4. Decide tool
5. Chama Gemini
6. Retorna resposta
7. Salva memória

---

# ⚙️ FASE 7 — API

## Endpoint
`/api/chat`

Entrada:
```
{
  "userId": "123",
  "message": "..."
}
```

Saída:
```
{
  "response": "..."
}
```

---

# ⚙️ FASE 8 — Frontend

## Requisitos
- Chat UI
- Input
- Histórico
- Mobile friendly

---

# ⚙️ FASE 9 — Upload de arquivos

- Upload PDF
- Converter para texto
- Enviar para RAG

---

# ⚙️ FASE 10 — Deploy

## Vercel
- Configurar variáveis:
  - GEMINI_API_KEY
  - SUPABASE_URL
  - SUPABASE_KEY

---

# 🧠 Prompt Base

```
Você é AURA, um assistente inteligente pessoal.

Regras:
- Seja direto
- Use contexto disponível
- Use tools quando necessário
- Aprenda com o usuário
```

---

# 🔥 Checklist Final

## Essencial
- [ ] Gemini funcionando
- [ ] Memória persistente
- [ ] RAG ativo
- [ ] API funcional

## Avançado
- [ ] Skills dinâmicas
- [ ] Integração Google
- [ ] Autenticação

---

# 🚀 Evolução futura

- Voz
- Automação
- Multi-agentes
- Integração com Gmail
- Integração com Google Sheets

---

# 🧠 Conceito Final

AURA não é um chatbot.

É um sistema modular composto por:

```
LLM + Memória + RAG + Skills + Orquestração
```

