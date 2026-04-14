# 🧠 Jarvis Command Center
> Sistema Avançado de Assistência Pedagógica e Centro de Comando IA

Bem-vindo ao **Jarvis**! Este documento é o seu ponto de partida para compreender a arquitetura, o design system e como começar a trabalhar na base de código.

---

## 🎯 Visão Geral do Projeto

Jarvis não é apenas um assistente virtual convencional. É um sistema multi-agente projetado para atuar como tutor pedagógico e centro de comando de conhecimento, persistindo memória de longo prazo e organizando contexto.

**Stack Tecnológico Principal:**
- **Frontend / Framework:** Next.js (App Router) + Turbopack
- **Backend / IA:** Integração com Gemini 2.0 Flash Lite
- **Banco de Dados / Auth:** Supabase (PostgreSQL para persistência de conversas e vetores)
- **Design System:** Tonal Layering / Vercel-like Aesthetic
- **Agent Toolkit:** Antigravity Kit (via diretório `.agent/`)

---

## ⚡ Quick Start

### 1. Pré-requisitos
- Node.js v18+
- Chaves API configuradas (Google Gemini, Supabase)

### 2. Instalação
```bash
npm install
```

### 3. Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com as seguintes chaves essenciais:

```env
NEXT_PUBLIC_SUPABASE_URL="seu_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_supabase_anon_key"
GEMINI_API_KEY="sua_chave_gemini"
```

### 4. Rodando o Projeto Localmente
```bash
npm run dev
```
Acesse `http://localhost:3000` para abrir o Command Center.

---

## 🎨 Design System: Kinetic Cyber-Minimalism

A interface visual do Jarvis segue regras estritas estabelecidas no arquivo [`DESIGN.md`](./DESIGN.md). Algumas das regras de ouro incluem:

1. **The "No-Line" Rule:** Proibido o uso de bordas de `1px solid` para divisão. Utilize contrastes de fundo (ex: `#0e0e0e` para o global e `#131313` para contêineres).
2. **Tipografia de Alta Precisão:** `Space Grotesk` para títulos e `Inter` para leitura de formulários e UI funcional.
3. **Sinais Dinâmicos (Neon Green):** Use verde vibrante (`#8eff71`) como sinal funcional e progress bars, nunca apenas como decoração sem função.

---

## 🤖 O Ecossistema de Agentes (Antigravity Kit)

O Jarvis foi impulsionado com o módulo **Antigravity Kit**, que vive na pasta `.agent/`. Esta engrenagem molda o comportamento da IA integrada no VSCode / Cursor.

- **Regras Fundamentais:** Verifique o arquivo `GEMINI.md` para entender as diretrizes absolutas.
- **Ecossistema:** Use os **Slash Commands** para evocar rotinas (ex: `/brainstorm` antes de criar uma feature inteira ou `/test` para auditar seu código).

### 🛡️ Master Scripts (Checklist de Deploy)
Antes de realizar qualquer commit para produção, assegure-se de passar pelas checagens:

```bash
# Roda a checagem rápida de lint, tipagem e testes
python .agent/scripts/checklist.py .

# Roda o check total para ambiente de pré-deploy (inclui Lighthouse & E2E)
python .agent/scripts/verify_all.py . --url http://localhost:3000
```

---

## 📁 Estrutura de Documentação do Projeto

Para se aprofundar nas decisões do projeto, consulte:

- 🎨 **[DESIGN.md](./DESIGN.md)** - Manifesto visual e diretrizes completas de UI/UX.
- 🏗️ **[.agent/ARCHITECTURE.md](./.agent/ARCHITECTURE.md)** - Mapa de organização dos agentes e sub-skills.
- ⚙️ **[.agent/GEMINI.md](./.agent/GEMINI.md)** - Comportamento base da inteligência artificial dentro deste repositório.

---

**Equipe Jarvis** | *Construído para escalar, projetado para durar.*
