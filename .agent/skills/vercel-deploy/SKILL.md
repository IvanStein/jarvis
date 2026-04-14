---
name: vercel-deploy
description: Diretrizes de deploy, otimização de build, caching e edge network específicas para o ecossistema Vercel.
allowed-tools: Read, Write, Edit
version: 1.0
priority: HIGH
---

# Deploy e Integração Vercel

> **SKILL** - Práticas otimizadas para hospedar aplicações na Vercel (Next.js), focando em performance, caching, edge network e builds saudáveis.

---

## 1. Ambientes e Variáveis

| Ambiente | Propósito | Regras de `.env` |
|----------|-----------|------------------|
| **Local** | Desenvolvimento (`npm run dev`) | Mantenha um `.env.local` que não vai pro Git. |
| **Preview**| Validação Rápida via Pull Request | Variáveis injetadas automaticamente na Vercel, podem usar instâncias de "staging" do DB. |
| **Produção**| Ramo principal (Main/Master) | Variáveis fechadas e bloqueadas. NUNCA utilize `NEXT_PUBLIC_` para senhas ou chaves secretas puras (Server-only). |

---

## 2. Serverless vs Edge Functions
Compreender onde o código roda previne erros crônicos:
- **Node.js Serverless (Padrão)**: Executa no `us-east-1` (geralmente). Ideal se você usa ORMs pesados ou bibliotecas Node built-in (`fs`, `crypto` que não sejam Web Crypto). O Cold Start pode impactar se a função for enorme.
- **Edge Functions / Edge Middleware**: Executa globalmente na CDN próxima ao usuário.
  - Vantagem: Cold starts quase nulos. 
  - Restrição: Só roda Web APIs nativas e bibliotecas leves. *Não usar Node.js APIs puras*. 

---

## 3. Caching e Otimização de Performance
O maior trunfo da Vercel é o caching transparente:
- **Static Site Generation (SSG)**: Páginas compiladas durante o build formam a base mais rápida.
- **Incremental Static Regeneration (ISR)**: Use `revalidate: 60` no fetch do Next.js App Router em dados que atualizam frequentemente, gerando novos caches silenciosamente em background.
- **Evitar Cache Acidental**: Não cacheie dados referentes a `Auth` do usuário ou transações bancárias. Garanta que requisições Fetch dependentes do usuário declarem `cache: 'no-store'`.
- **Bundle Bloat**: Tenha cuidado ao importar pacotes massivos; use importações dinâmicas (`next/dynamic`) ou exporte funções server-only exclusivas para evitar inchar o Javascript do cliente.

---

## 4. Troubleshooting de Build na Vercel
1. **Case Sensitivity**: O Mac/Windows ignora sensibilidade de caixa, o Linux da Vercel **NÃO**. Se você invocar `./components/Card` e o nome da pasta for `card`, vai quebrar a build na Vercel, mesmo rodando bem local.
2. **Ignorar Tipagem Errada**: Durante a CI/CD, um erro de linting de Typescript quebra o deploy. Garanta que o `.agent/scripts/checklist.py` foi executado antes do Git Push.
3. Não ignore os limites de tempo limite em integrações pesadas da Vercel Cloud (Funções Serverless padrão encerram rápido nas contas de entrada).
