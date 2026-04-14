---
name: vanilla-js-expert
description: JavaScript moderno puro (ES6+), manipulação do DOM e Web APIs nativos otimizados.
allowed-tools: Read, Write, Edit
version: 1.0
priority: HIGH
---

# Vanilla JavaScript Expert

> **SKILL** - Uso de JavaScript limpo com padrões modernos de JS/Navegador puros. Total abstinência de UI Frameworks massivos.

---

## 1. Manipulação Sensata do DOM
- Utilize Web APIs nativas e enxutas: `document.querySelector` & `querySelectorAll`. Acesso direto e escalável.
- Cuidado ao lidar com classes de estilo: Em vez de sobrescrever a string `.className`, injete comportamentos sem atritos usando o método `classList.add()`, `remove()` ou `toggle()`.

## 2. Gestão Assíncrona & I/O
- Sem invenções obscuras, o moderno clama por encadeamento lógico: Favoreça uso estrito de escopos `async/await` encapsulando riscos via bloco `try/catch`. 
- Se disparar múltiplas "Promises" independentes (carregar um dado do backend na Navbar e um na Sidebar, simultâneos), não aguarde um atrás do outro num gargalo (Waterfall effect). Use imediatamente `const [rs1, rs2] = await Promise.all([req1, req2])`.

## 3. Event Delegation de Alta Precisão (Zero Lags)
- Evite alocar o `addEventListener("click")`, rodando um laço `For` por cima de centenas de cards gerados dinamicamente no frontend. Isto esgota a Memória do browser.
- **Abordagem Correta**: Insira o event listener EXCLUSIVAMENTE sobre The Parent Container e pegue a ação reativa usando `event.target.closest(".target-class")`.

## 4. Otimização do Runtime
- Evite criar "Vazamento" por referências globais que não morrem no garbage collector.
- Use `const` primeiro, desça pra `let` se inevitavelmente mutável. Abomine declarativas vindas no descontinuado `var`.
