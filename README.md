# memed-node

> Cliente Node.js não-oficial para a API da Memed de prescrição digital

[![npm version](https://img.shields.io/npm/v/memed-node.svg)](https://www.npmjs.com/package/memed-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## Sobre

`memed-node` é uma biblioteca cliente **não-oficial** que simplifica a integração com a API da Memed, plataforma de prescrição digital no Brasil.

- **Tipagem forte**: Autocomplete e validação em tempo de desenvolvimento
- **API intuitiva**: Métodos simples e bem documentados
- **Tratamento de erros**: Mensagens amigáveis em português
- **Zero dependências**: Usa fetch nativo do Node.js 18+
- **ESM e CommonJS**: Suporte a ambos os formatos de módulo
- **Múltiplos profissionais**: Suporte a CRM, CRO, COREN, CRF, e mais

## Instalação

```bash
npm install memed-node
```

**Requisitos:**
- Node.js >= 18.0.0

## Uso Rápido

```typescript
import { MemedClient } from 'memed-node';

const memed = new MemedClient({
  apiKey: process.env.MEMED_API_KEY,
  secretKey: process.env.MEMED_SECRET_KEY,
  environment: 'integration', // ou 'production'
});

// Criar prescritor
const medico = await memed.prescritor.create({
  external_id: 'med-123',
  nome: 'Maria',
  sobrenome: 'Santos',
  data_nascimento: '15/03/1985',
  cpf: '12345678900',
  sexo: 'F',
  board: {
    board_code: 'CRM',
    board_number: '98765',
    board_state: 'RJ',
  },
  email: 'maria@exemplo.com',
});

console.log(medico.token); // Token para usar no frontend da Memed

// Listar prescrições (token resolvido automaticamente)
const prescricoes = await memed.prescricao.list({
  prescritorId: 'med-123',
  initialDate: '2026-01-01',
  limit: 50,
});

// Buscar princípios ativos
const ingredientes = await memed.prescricao.searchIngredients({
  terms: 'dipirona',
});
```

## Documentação

Para documentação detalhada, exemplos avançados e guias, acesse:

**[📚 Documentação →](./docs/README.md)**

Incluindo:
- [Configuração e inicialização](./docs/README.md#configuração)
- [API de Prescritores - CRUD completo](./docs/README.md#prescritor-profissionais-de-saúde)
- [API de Prescrições - Histórico e documentos](./docs/README.md#prescrição-receitas-médicas)
- [API de Protocolos - Templates de prescrição](./docs/README.md#protocolo-templates-de-prescrição)
- [API de Impressão - Configuração de layout](./docs/README.md#impressão-configuração-de-layout)
- [Tratamento de erros](./docs/README.md#tratamento-de-erros)
- [Guia de desenvolvimento](./docs/README.md#desenvolvimento)
- [Como contribuir](./docs/README.md#contribuindo)

## Recursos

### Implementados

- [x] **Prescritor** - CRUD completo para profissionais de saúde
- [x] **Prescrição** - Histórico, link digital, PDF e busca de ingredientes
- [x] **Protocolo** - Templates de prescrição (por prescritor e por instituição)
- [x] **Impressão** - Configuração de layout, margens, cabeçalho/rodapé e upload de template PDF
- [x] Suporte a múltiplos conselhos (CRM, CRO, COREN, etc)
- [x] Resolução automática de token do prescritor
- [x] Tratamento de erros customizado
- [x] Timeout configurável
- [x] Ambientes (integration/production)

### Em Desenvolvimento
- [ ] Validações (CPF, datas, etc)
- [ ] Retry automático em erros 5xx
- [ ] Cache de tokens

## Links Úteis

- [📚 Documentação Completa](./docs/README.md)
- [🗺️ Roadmap & Futuras Features](./docs/ROADMAP.md)
- [📝 Exemplos de Uso](./examples)
- [📋 Changelog](./CHANGELOG.md)
- [🐛 Reportar Issues](https://github.com/seu-usuario/memed-node/issues)
- [📖 Documentação oficial da Memed](https://doc.memed.com.br/)

## Contribuindo

Contribuições são bem-vindas! Veja o [guia de contribuição](./docs/README.md#contribuindo) para mais detalhes.

## Licença

[MIT](./LICENSE) © [gustavo martins]

---

**Aviso Legal:** Esta biblioteca não é oficialmente mantida pela Memed. Para suporte oficial, consulte a [documentação da Memed](https://doc.memed.com.br/).
