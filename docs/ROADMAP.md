# Roadmap - memed-node

> Planejamento de features e evolução da biblioteca

[← Voltar ao README principal](../README.md)

## Status Atual

**Versão:** 1.0.0
**Última atualização:** Março 2026

---

## Implementado (v1.0.0)

### Core
- [x] Cliente HTTP base com fetch nativo
- [x] Suporte a Node.js 18+
- [x] Tipagem TypeScript completa
- [x] Exports ESM e CommonJS
- [x] Configuração de ambientes (integration/production)
- [x] Timeout configurável
- [x] Suporte a Bearer token (Authorization header)
- [x] Suporte a multipart/form-data (upload de arquivos)

### API - Prescritor
- [x] Criar prescritor (`create`)
- [x] Buscar prescritor (`get`)
- [x] Listar prescritores (`list`)
- [x] Atualizar prescritor (`update`)
- [x] Deletar prescritor (`delete`)
- [x] Suporte a múltiplos conselhos (CRM, CRO, COREN, etc)

### API - Prescrição
- [x] Buscar prescrição por ID (`get`) com documentos estruturados
- [x] Listar prescrições (`list`) com paginação e filtros de data
- [x] Deletar prescrição (`delete`)
- [x] Link digital da prescrição (`getDigitalLink`)
- [x] URL do PDF da prescrição (`getPdfUrl`)
- [x] Buscar princípios ativos (`searchIngredients`)
- [x] Resolução automática de token do prescritor

### API - Protocolo
- [x] Criar protocolo por prescritor (`create`)
- [x] Listar protocolos por prescritor (`list`)
- [x] Deletar protocolo por prescritor (`delete`)
- [x] Criar múltiplos protocolos (`createMultiple`)
- [x] Criar protocolo institucional (`createForPartner`)
- [x] Listar protocolos institucionais (`listForPartner`)
- [x] Buscar protocolo institucional (`getForPartner`)
- [x] Deletar protocolo institucional (`deleteForPartner`)
- [x] Suporte a medicamentos, exames e texto livre

### API - Impressão
- [x] Configurar impressão (`configure`)
- [x] Recuperar configurações (`get`)
- [x] Upload de template PDF (`uploadTemplate`)

### API - Especialidades e Cidades
- [x] Listar especialidades com filtro (`especialidade.list`)
- [x] Listar cidades com filtro por nome e UF (`cidade.list`)

### Tratamento de Erros
- [x] Classe `MemedError` customizada
- [x] Mensagens de erro em português
- [x] Helpers para tipos de erro (`isAuthError`, `isValidationError`, etc)
- [x] Serialização JSON de erros

### Qualidade de Código
- [x] ESLint v9 configurado
- [x] Prettier configurado
- [x] Testes unitários com Vitest
- [x] Build com tsup (CJS + ESM + tipos)

---

## Planejado (Futuro)

### Validações
- [ ] Validação de CPF
- [ ] Validação de datas
- [ ] Validação de conselho profissional
- [ ] Validação de telefone
- [ ] Helper de formatação

### Integrações
- [ ] Plugin para Express.js
- [ ] Plugin para Fastify
- [ ] Plugin para NestJS
- [ ] Middleware de autenticação

### Performance
- [ ] Cache de tokens
- [ ] Cache de especialidades/cidades
- [ ] Retry automático em erros 5xx

### Qualidade
- [ ] Testes de integração com API real
- [ ] Testes E2E
- [ ] Cobertura de testes > 90%

---

## Como Sugerir Features

Tem uma ideia? [Abra uma issue](https://github.com/gustavdlima/memed-node/issues/new) com:

- **Título claro**: ex: "Feature: Suporte a webhooks"
- **Descrição do problema** que a feature resolve
- **Proposta de solução** com exemplos de uso
- **Benefícios** para outros usuários

---

## Links

- [← Voltar ao README principal](../README.md)
- [Documentação](./README.md)
- [Reportar bugs](https://github.com/gustavdlima/memed-node/issues/new)
- [Sugerir features](https://github.com/gustavdlima/memed-node/issues/new)

---

**Última atualização:** Março 2026
**Mantenedores:** [@gustavdlima](https://github.com/gustavdlima)
