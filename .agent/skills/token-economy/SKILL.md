---
name: token-economy
description: Técnicas para redução do uso de tokens e gerenciamento eficiente de contexto para IAs.
allowed-tools: Read, Write, Edit
version: 1.0
priority: HIGH
---

# Economia de Tokens e Gerenciamento de Contexto LLM

> **SKILL** - Regras práticas para evitar inchaço no prompt, diminuir custos de inferência (Tokens) e aumentar o foco e a precisão das IAs ao programar.

---

## 1. Compressão do Output
Ao fornecer retornos ou respostas durante a orquestração ou manipulação de arquivos longos, siga as regras de economia:
- **Zero "Encheção de linguiça"**: Responda apenas com o que precisa ser alterado, não repita tudo de volta ao usuário.
- **Diffs em vez de arquivos completos**: Para substituições ou explicações, mostre as linhas alteradas e onde devem ser inseridas, em vez de reproduzir todo o arquivo apenas para imprimir "..."
- **Abreviação Racional**: Identificadores muito prolixos nas conversas podem ser substituídos por abreviações contextuais desde que não haja ambiguidade.

---

## 2. Tipos de Dados e Transferência
- Ao armazenar logs, históricos ou arquivos de contexto gerados por você: **Prefira YAML a JSON formatado (com espaçamento excessivo) ou texto solto longo**. YAML frequentemente ocupa 30 a 50% menos tokens que JSON graças à eliminação de chaves (`{}`) e aspas (`"`).
- Onde possível, remova espaços extras silenciosamente nos comandos. 

---

## 3. Gestão e Limpeza de Contexto
- **Memória Relevante**: Puxe *apenas* a memória necessária. Se um usuário pedir para resolver um bug no frontend, não injete o contexto nem o log das operações de deploy recentes, a não ser que tenha ligação direta.
- **Descartabilidade**: Ao analisar scripts utilitários ou de scraping, pule grandes quantidades de metadados inúteis.
- Ao fazer a leitura do DOM ou de código legado (HTML/CSS): Reduza o conteúdo removendo blocos idênticos não úteis (svg paths extensivos, atributos genéricos aos milhares). Leia apenas as *Assinaturas*, e se precisar de implementação interna, só lá busque.

---

## 4. O Efeito Token Bloat na Documentação Code
- Comentários de código óbvios incham a base que, ao ser lida pela IA (via plugins ou RAG), encarecem o processamento.
  `// define the user id variable` 
  `let userId = 1;` 
- Remova documentação não heurística onde o nome da variável por si só se explica.

> **Regra Ouro**: Todo caractere lido conta. Para economizar tokens sem sacrificar qualidade: Aumente a **densidade de informação**, diminua as repetições (redundâncias conversacionais).
