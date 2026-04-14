---
name: design-patterns
description: Core principles and pragmatic application of GoF Design Patterns, Architectural Patterns, and SOLID principles.
allowed-tools: Read, Write, Edit
version: 1.0
priority: HIGH
---

# Design Patterns & Architecture Guidelines

> **SKILL** - Apply structural, creational, and behavioral patterns intelligently, without over-engineering.

---

## 1. SOLID Principles
Antes de aplicar qualquer pattern complexo, garanta o básico:
- **(S)ingle Responsibility**: Uma classe ou módulo tem apenas um motivo para mudar.
- **(O)pen/Closed**: Módulos abertos para extensão, fechados para modificação.
- **(L)iskov Substitution**: Classes derivadas devem ser substituíveis por suas classes base sem quebrar o sistema.
- **(I)nterface Segregation**: Muitas interfaces específicas são melhores que uma interface geral gorda.
- **(D)ependency Inversion**: Dependa de abstrações, não de implementações concretas.

---

## 2. Gang of Four (GoF) Patterns Comuns

### Padrões Criacionais
| Padrão | Quando Usar | Cuidado |
|--------|-------------|---------|
| **Factory Method** | Quando a lógica de instanciação é complexa ou precisa de abstração. | Não crie fábricas para tudo. Se for simples, instancie diretamente. |
| **Singleton** | Quando deve existir apenas UMA instância (ex: Logger, DB Pool). | É um anti-pattern se usado como variável global. Evite mutação de estado. |
| **Builder** | Construção de objetos complexos paso a passo. | Útil em testes (Test Data Builders). |

### Padrões Estruturais
| Padrão | Quando Usar | Cuidado |
|--------|-------------|---------|
| **Decorator** | Adicionar comportamento em tempo de execução. | Pode criar muitas pequenas classes. |
| **Adapter** | Fazer interfaces incompatíveis trabalharem juntas. | Use para isolar APIs externas e bibliotecas de terceiros. |
| **Facade** | Fornecer interface simplificada para sistema complexo. | Facade não deve conter regra de negócio. |

### Padrões Comportamentais
| Padrão | Quando Usar | Cuidado |
|--------|-------------|---------|
| **Strategy** | Alternar algoritmos em tempo de execução (ex: métódos de pagamento). | Aumenta o número de interfaces. |
| **Observer** | Subscribe/Publish para reagir a mudanças de estado. | Vazamento de memória se não fizer unsubscribe. |
| **Command** | Encapsular uma requisição como objeto (undo/redo). | Overhead de código, use só quando necessário. |

---

## 3. Composição > Herança

Favoreça a composição sobre a herança de classes. 
- Herança gera forte acoplamento e estruturas rígidas.
- Composição permite misturar comportamentos dinamicamente e de maneira testável.

---

## 4. Regras Mágicas
- **Não force padrões**: O pior código não é o que falta padrão, é o que tem padrão onde não precisava (Over-engineering).
- **Refatoração primeiro**: Aplique patterns ao *refatorar* código que se mostrou repetitivo, e não enquanto *esboça* a primeira versão, a menos que o domínio exija imediatamente.
