# Roadmap - memed-node

> Planejamento de features e evolução da biblioteca

[← Voltar ao README principal](../README.md)

## Status Atual

**Versão:** 0.0.1 (Beta)
**Última atualização:** Fevereiro 2025

---

## Implementado (v0.1.0)

### Core
- [x] Cliente HTTP base com fetch nativo
- [x] Suporte a Node.js 18+
- [x] Tipagem TypeScript completa
- [x] Exports ESM e CommonJS
- [x] Configuração de ambientes (integration/production)
- [x] Timeout configurável

### API - Prescritor
- [x] Criar prescritor (`create`)
- [x] Buscar prescritor (`get`)
- [x] Listar prescritores (`list`)
- [x] Atualizar prescritor (`update`)
- [x] Deletar prescritor (`delete`)
- [x] Suporte a múltiplos conselhos (CRM, CRO, COREN, etc)

### Tratamento de Erros
- [x] Classe `MemedError` customizada
- [x] Mensagens de erro em português
- [x] Helpers para tipos de erro (`isAuthError`, `isValidationError`, etc)
- [x] Serialização JSON de erros

### Documentação
- [x] README principal
- [x] Documentação completa em `/docs`
- [x] Exemplos de uso
- [x] Guia de contribuição

### Qualidade de Código
- [x] ESLint v9 configurado
- [x] Prettier configurado
- [x] Testes unitários com Vitest
- [x] Build com tsup (CJS + ESM + tipos)

---

## Em Desenvolvimento

### v0.2.0 - API de Prescrição
**Prioridade:** Alta
**Previsão:** Q1 2025

- [ ] Criar prescrição
- [ ] Buscar prescrição
- [ ] Listar prescrições
- [ ] Atualizar prescrição
- [ ] Deletar prescrição
- [ ] Adicionar medicamentos
- [ ] Adicionar exames
- [ ] Imprimir prescrição

**Tipos a adicionar:**
```typescript
interface PrescricaoCreateInput {
  prescritor_external_id: string;
  paciente: {
    nome: string;
    cpf?: string;
    idade?: number;
  };
  medicamentos: Medicamento[];
  observacoes?: string;
}
```

### v0.3.0 - API de Pacientes
**Prioridade:** Alta
**Previsão:** Q2 2025

- [ ] Criar paciente
- [ ] Buscar paciente
- [ ] Listar pacientes
- [ ] Atualizar paciente
- [ ] Deletar paciente
- [ ] Vincular paciente a prescritor

### v0.4.0 - Validações
**Prioridade:** Média
**Previsão:** Q2 2025

- [ ] Validação de CPF
- [ ] Validação de datas
- [ ] Validação de conselho profissional
- [ ] Validação de CEP
- [ ] Validação de telefone
- [ ] Helper de formatação

---

## Planejado (Futuro)

### API - Protocolos
**Prioridade:** Baixa

- [ ] Criar protocolo (template de prescrição)
- [ ] Buscar protocolo
- [ ] Listar protocolos
- [ ] Atualizar protocolo
- [ ] Deletar protocolo
- [ ] Aplicar protocolo a prescrição

### Integrações
**Prioridade:** Baixa

- [ ] Plugin para Express.js
- [ ] Plugin para Fastify
- [ ] Plugin para NestJS
- [ ] Middleware de autenticação

### Performance
**Prioridade:** Baixa

- [ ] Connection pooling
- [ ] Request batching
- [ ] Cache persistente (Redis, arquivo)
- [ ] Compressão de requests

### Qualidade
**Prioridade:** Alta (contínuo)

- [ ] Cobertura de testes > 90%
- [ ] Testes de integração com API real
- [ ] Testes E2E
- [ ] Benchmarks de performance

---

## Priorização

### Critérios
1. **Impacto no usuário** - Quantos usuários se beneficiam?
2. **Complexidade** - Quanto esforço é necessário?
3. **Dependências** - Bloqueia outras features?
4. **Feedback** - Quantas solicitações recebemos?

### Como Sugerir Features

Tem uma ideia? [Abra uma issue](https://github.com/seu-usuario/memed-node/issues/new) com:

- **Título claro**: ex: "Feature: Suporte a webhooks"
- **Descrição do problema** que a feature resolve
- **Proposta de solução** com exemplos de uso
- **Benefícios** para outros usuários
- **Alternativas** consideradas

---

## Links

- [← Voltar ao README principal](../README.md)
- [Documentação](./README.md)
- [Reportar bugs](https://github.com/seu-usuario/memed-node/issues/new)
- [Sugerir features](https://github.com/seu-usuario/memed-node/issues/new)

---

**Última atualização:** Fevereiro 2025
**Mantenedores:** [@gustavdlima](https://github.com/seu-usuario)
