---
name: python-expert
description: Regras avançadas e idiomáticas de Python (PEP 8, Type Hints, AsyncIO, Generators).
allowed-tools: Read, Write, Edit
version: 1.0
priority: HIGH
---

# Python Expert

> **SKILL** - Práticas modernas, performáticas e "Pythonic" para o desenvolvimento usando Python nativo puro.

---

## 1. Type Hints (Tipagem Estática)
- Tipagem não é opcional em projetos sérios. Use type hints em todas as assinaturas de métodos e retornos invariavelmente:
  `def process_data(data: dict[str, Any]) -> list[int]:`
- Torna o código autodocumentado e prepara a esteira para linters eficientes (Mypy).

## 2. Abordagens "Pythonic" (Comprehensions e Iterators)
- Prefira **List Comprehensions** a blocos complexos de `for` e `.append()`:
  `squares = [x**2 for x in range(10)]`
- Caso a lista seja astronômica (problemas de Memória RAM), crie **Generator Expressions**:
  `huge_squares = (x**2 for x in range(1M))`
- Evite getters/setters desenfreados (padrão Java). Em Python, use a anotação `@property` apenas quando precisar embutir uma lógica na visualização daquele objeto de forma nativa.

## 3. Manipulação Assíncrona Inteligente
- Funções pesadas de Rede (I/O) ou Banco de Dados: use sempre rotinas assíncronas (`async def` e `await`) com o módulo `asyncio`.
- Utilize `asyncio.gather()` para rodar múltiplas tarefas independentes de forma simultânea.

## 4. Gestão do Ambiente Virtual
- Isolar o pacote é crucial. Sempre tenha um `requirements.txt` explícito.
- Cuidado com imports globais (wildcards: `from module import *`). Eles causam colisão de namespace silenciosa. Importe apenas o exato método em uso.
