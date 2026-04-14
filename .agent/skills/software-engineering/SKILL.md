---
name: software-engineering
description: Práticas, heurísticas fundamentais e regras de arquitetura e Engenharia de Software.
allowed-tools: Read, Write, Edit
version: 1.0
priority: CRITICAL
---

# Regras de Engenharia de Software

> **SKILL** - Diretrizes pragmáticas de organização arquitetural, Clean Architecture, DDD e boas práticas ao nível estrutural.

---

## 1. Princípios Básicos de Arquitetura

| Princípio | Descrição |
|-----------|-----------|
| **Alta Coesão** | Elementos de um mesmo módulo/componente devem estar fortemente interligados e pertencer ao mesmo contexto. |
| **Baixo Acoplamento**| Módulos não devem saber demais sobre o funcionamento interno de outros módulos. |
| **Encapsulamento**| Esconda o estado interno e exponha apenas os comportamentos (métodos) necessários. |
| **Isolamento Core** | A lógica de negócios não deve depender de frameworks, banco de dados ou UI. |

---

## 2. Abordagem de Design

### Domain-Driven Design (DDD) - Básico
- **Linguagem Ubíqua**: O código (classes, variáveis, pacotes) deve falar a mesma linguagem que o especialista de negócio.
- **Entidades vs Value Objects**: Se algo importa pela sua identidade exclusiva, é Entidade. Se só importam os valores, use Value Object (e faça-o imutável).
- **Agregados**: Agrupe Entidades/VOs em transações atômicas controladas por uma "Raiz de Agregado" (Aggregate Root).

### Clean Architecture
- **Dependency Rule**: Dependências de código-fonte devem apontar SEMPRE para dentro, em direção às políticas de alto nível (Core/Domain).
- **Camadas recomendadas**:
  1. *Domain*: Regras nativas de negócio, Entidades.
  2. *Use Cases / Application*: Lógica da aplicação, orquestração de Entidades.
  3. *Adapters / Interfaces*: Controllers, Presenters, Gateways.
  4. *Infrastructure*: Banco de dados, Frameworks web.

---

## 3. Gestão e Ciclo de Vida 

1. **DRY Cuidado**: (Don't Repeat Yourself). Excelente princípio, porém unificar dois códigos que incidentalmente são iguais *hoje*, mas poderão mudar por *motivos diferentes amanhã*, causa acoplamento acidental. Refatore se houver coerência.
2. **YAGNI** (You Aren't Gonna Need It): Não crie abstrações "para caso no futuro precisemos". Desenvolva apenas o que resolve o problema atual. O código extra é bagagem.
3. **Fail Fast**: Sempre falhe ou jogue exceptions no exato momento que algo der errado (ex: validação com Guard Clauses no começo da função), evitando falhas misteriosas mais para a frente.

---

## 4. Práticas de Resiliência e Segurança

- Valide as fronteiras: Toda entrada de APIs (Requests) ou de Banco de Dados deve ser sanitizada ou validada rigorosamente (usando bibliotecas como Zod/Joi, ou Data Transfer Objects).
- Log e Observabilidade: Imprima logs ricos com Contexto para falhas, não confie em `console.log("deu erro")`.

> **Mentalidade**: Pense não como um "digitador de código", mas como engenheiro. O objetivo é reduzir custo de manutenção e impacto de bugs em produção.
