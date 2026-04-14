---
name: agno-expert
description: Especialidade na construção e orquestração de Agentes IA modulares usando o framework Agno.
allowed-tools: Read, Write, Edit
version: 1.0
priority: HIGH
---

# Agno Framework Expert

> **SKILL** - Domínio do Framework Agno para orquestração de agentes Inteligentes, execução de ferramentas (Tools) locais e roteamento semântico.

---

## 1. Regras de Inicialização de Agentes
- Ao configurar a classe pai, divida fortemente do que o Agente FAZ (`instructions`) das permissões do que ele PODE VER/TOCAR (`tools`).
- Para debugar em ambiente de dev de terminal, sempre injete o parâmetro `show_tool_calls=True` na criação da classe para ver as chaves em tempo real.

## 2. Injeção de Tools Mínimas (Token Bloat Escape)
- **Não sobrecarregue agentes contextuais**: Se a tarefa exige ler o banco de dado SQLite 1 vez, passe apenas `setup_sqlite_tool`. Empurrar dez ferramentas genéricas sem necessidade faz "bloat" de tokens na descrição de system prompt enviada via payload para a LLM, prejudicando custo e piorando latência de resposta.
- Crie ou exporte funções Python puras contendo docstrings descritivas; Agno usa as docstrings da sua função normal como as *Tool Descriptions* para a IA entender.

## 3. Gestão e Controle de Memória
- Exija e controle os "Memory Stores". Conversas que não carregam `Session_ID` atado a um db acabam resetando todo o conhecimento em loop.
- Desvincule arquivos grandes transferindo seus vetores para bancos embutidos (RAG local com Qdrant localmente/Chroma) providos nativamente pelo Agno em vez de anexar como prompt solto.
