---
name: google-integration
description: Integração com o ecossistema Google, incluindo Auth (Login), Calendar e NotebookLM.
allowed-tools: Read, Write, Edit
version: 1.0
priority: HIGH
---

# Integração Google Workspace & NotebookLM

> **SKILL** - Diretrizes para autenticação e interação com ferramentas Google, com foco especial no uso do NotebookLM via MCP.

---

## 1. Autenticação e Login (OAuth2)
Para integrar o login do Google no Jarvis:
- **Fluxo Recomendado**: Use OpenID Connect (OIDC) via Google Identity Services.
- **Backend (Python)**: Utilize `google-auth` e `google-auth-oauthlib`.
- **Segurança**: Nunca armazene `client_secret` no frontend. Utilize variáveis de ambiente seguras e redirecionamento via backend.
- **Escopos**: Solicite apenas o mínimo necessário (`openid`, `email`, `profile`).

---

## 2. Google Calendar API
Para manipulação de agenda:
- **Biblioteca**: `google-api-python-client`.
- **Principais Recursos**:
  - `list_events`: Listar compromissos com filtros de tempo.
  - `insert_event`: Criar novos eventos com suporte a Google Meet.
  - `watch`: Webhooks para notificações em tempo real de mudanças na agenda.
- **Dica**: Use o `Primary` calendar ID para a agenda principal do usuário autenticado.

---

## 3. NotebookLM (via MCP)
O Jarvis utiliza o protocolo MCP para interagir com o NotebookLM.

### Autenticação MCP
Se houver erros de auth, o comando de recuperação é:
```bash
notebooklm-mcp-auth
```

### Fluxos de Trabalho NotebookLM:
1. **Criação de Notebook**: Comece sempre criando um notebook temático para o contexto do usuário.
2. **Adição de Fontes**: URLs, YouTube, PDFs ou Texto puro.
3. **Deep Research**: Utilize o `research_start` para buscas profundas e importe os resultados.
4. **Studio Artificats**: Gere Resumos de Áudio, Vídeo ou Infográficos para apresentações rápidas.

---

## 4. Regras de Ouro
- **Token Management**: Refresh tokens devem ser armazenados de forma criptografada (ex: Supabase Vault ou variáveis de ambiente seguras).
- **Rate Limiting**: APIs do Google possuem limites estritos. Implemente lógica de retry com exponential backoff.
- **UX**: Sempre informe ao usuário quais dados estão sendo acessados durante o fluxo de login.
