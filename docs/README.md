# Documentação - memed-node

> Guia completo de uso da biblioteca memed-node

[← Voltar ao README principal](../README.md)

## Índice

- [Configuração](#configuração)
- [Prescritor (Profissionais de Saúde)](#prescritor-profissionais-de-saúde)
  - [Criar Prescritor](#criar-prescritor)
  - [Buscar Prescritor](#buscar-prescritor)
  - [Listar Prescritores](#listar-prescritores)
  - [Atualizar Prescritor](#atualizar-prescritor)
  - [Deletar Prescritor](#deletar-prescritor)
  - [Tipos de Conselho Suportados](#tipos-de-conselho-suportados)
- [Tratamento de Erros](#tratamento-de-erros)
- [Desenvolvimento](#desenvolvimento)
- [Contribuindo](#contribuindo)

---

## Configuração

### Interface MemedConfig

```typescript
interface MemedConfig {
  /** Chave de API fornecida pela Memed */
  apiKey: string;

  /** Chave secreta fornecida pela Memed */
  secretKey: string;

  /** Ambiente (padrão: 'integration') */
  environment?: 'integration' | 'production';

  /** Timeout em ms (padrão: 30000) */
  timeout?: number;
}
```

### Exemplo de Configuração

```typescript
import { MemedClient } from 'memed-node';

// Configuração básica
const memed = new MemedClient({
  apiKey: process.env.MEMED_API_KEY,
  secretKey: process.env.MEMED_SECRET_KEY,
});

// Configuração para produção
const memedProd = new MemedClient({
  apiKey: process.env.MEMED_API_KEY,
  secretKey: process.env.MEMED_SECRET_KEY,
  environment: 'production',
  timeout: 60000,
});
```

---

## Prescritor (Profissionais de Saúde)

A API de prescritores permite gerenciar profissionais de saúde (médicos, dentistas, enfermeiros, etc) que utilizarão o sistema de prescrição digital da Memed.

### Criar Prescritor

Cria um novo profissional de saúde no sistema.

```typescript
const prescritor = await memed.prescritor.create({
  external_id: 'seu-id-interno',
  nome: 'João',
  sobrenome: 'Silva',
  data_nascimento: '01/01/1980',
  cpf: '12345678900',
  sexo: 'M',
  board: {
    board_code: 'CRM',
    board_number: '54321',
    board_state: 'SP',
  },
  email: 'joao@exemplo.com',
  especialidade: {
    id: 123, // ID da especialidade na base da Memed
  },
  cidade: {
    id: 456, // ID da cidade na base da Memed
  },
});

console.log(prescritor.id);       // ID na Memed
console.log(prescritor.token);    // Token para usar no frontend
console.log(prescritor.status);   // Status de validação
```

#### Campos Obrigatórios

- `external_id`: ID único do prescritor no seu sistema
- `nome`: Primeiro nome
- `sobrenome`: Último nome
- `data_nascimento`: Data no formato DD/MM/YYYY
- `cpf`: CPF (apenas números)
- `board`: Dados do conselho profissional (CRM, CRO, etc)

#### Campos Opcionais

- `sexo`: 'M' ou 'F'
- `email`: E-mail do profissional
- `especialidade`: Especialidade médica (requer ID da base Memed)
- `cidade`: Cidade de atuação (requer ID da base Memed)

### Buscar Prescritor

Busca um prescritor pelo `external_id`.

```typescript
const prescritor = await memed.prescritor.get('seu-id-interno');

console.log(prescritor.nome);
console.log(prescritor.token);
console.log(prescritor.status);
```

### Listar Prescritores

Lista todos os prescritores cadastrados.

```typescript
const prescritores = await memed.prescritor.list();

console.log(`Total: ${prescritores.length}`);

const medicos = prescritores.filter(p => p.board.board_code === 'CRM');
const dentistas = prescritores.filter(p => p.board.board_code === 'CRO');
const enfermeiros = prescritores.filter(p => p.board.board_code === 'COREN');

const ativos = prescritores.filter(p => p.status === 'Ativo');
const emAnalise = prescritores.filter(p => p.status === 'Em análise');
```

### Atualizar Prescritor

Atualiza dados de um prescritor existente. **Apenas os campos fornecidos serão atualizados.**

```typescript
const atualizado = await memed.prescritor.update('seu-id-interno', {
  email: 'novoemail@exemplo.com',
});

const atualizado2 = await memed.prescritor.update('seu-id-interno', {
  email: 'novoemail@exemplo.com',
  board: {
    board_code: 'CRM',
    board_number: '99999',
    board_state: 'RJ',
  },
});
```

**Importante:** Todos os campos são opcionais no update, permitindo atualizações parciais.

### Deletar Prescritor

Remove um prescritor do sistema.

```typescript
await memed.prescritor.delete('seu-id-interno');
```

⚠️ **Atenção:** Esta operação é irreversível.

### Tipos de Conselho Suportados

```typescript
type BoardCode =
  | 'CRM'     // Conselho Regional de Medicina
  | 'CRO'     // Conselho Regional de Odontologia
  | 'COREN'   // Conselho Regional de Enfermagem
  | 'CRMV'    // Conselho Regional de Medicina Veterinária
  | 'CRF'     // Conselho Regional de Farmácia
  | 'CRN'     // Conselho Regional de Nutrição
  | 'CREFITO' // Conselho Regional de Fisioterapia e Terapia Ocupacional
  | 'CRP'     // Conselho Regional de Psicologia
  | 'CRFa'    // Conselho Regional de Fonoaudiologia
  | 'CREF';   // Conselho Regional de Educação Física
```

#### Exemplo de Uso por Tipo de Profissional

```typescript
// Médico
const medico = await memed.prescritor.create({
  // ... outros campos
  board: {
    board_code: 'CRM',
    board_number: '123456',
    board_state: 'SP',
  },
});

// Dentista
const dentista = await memed.prescritor.create({
  // ... outros campos
  board: {
    board_code: 'CRO',
    board_number: '78910',
    board_state: 'RJ',
  },
});

// Enfermeiro
const enfermeiro = await memed.prescritor.create({
  // ... outros campos
  board: {
    board_code: 'COREN',
    board_number: '456789',
    board_state: 'MG',
  },
});
```

---

## Tratamento de Erros

A biblioteca fornece a classe `MemedError` com métodos auxiliares para identificar tipos de erro.

### Exemplo Completo

```typescript
import { MemedError } from 'memed-node';

try {
  const prescritor = await memed.prescritor.create({
    external_id: 'med-123',
    nome: 'João',
    sobrenome: 'Silva',
    data_nascimento: '01/01/1980',
    cpf: '12345678900',
    sexo: 'M',
  });

  console.log('✅ Prescritor criado:', prescritor.id);

} catch (error) {
  if (error instanceof MemedError) {
    console.error('❌ Erro Memed:', error.message);
    console.error('Status HTTP:', error.statusCode);
    console.error('Resposta:', error.response);
    console.error('Timestamp:', error.timestamp);

    if (error.isAuthError()) {
      console.log('🔒 Problema de autenticação');
      console.log('Verifique suas credenciais (API Key e Secret Key)');
    }

    if (error.isValidationError()) {
      console.log('⚠️ Dados inválidos');
      console.log('Verifique os campos obrigatórios e formatos');
    }

    if (error.isServerError()) {
      console.log('🔧 Erro no servidor Memed');
      console.log('Tente novamente em alguns instantes');
    }

    const errorJson = error.toJSON();
    console.log('Log estruturado:', JSON.stringify(errorJson, null, 2));
  } else {
    console.error('Erro desconhecido:', error);
  }
}
```

### Métodos Auxiliares de MemedError

```typescript
class MemedError extends Error {
  statusCode?: number;
  response?: unknown;
  timestamp: Date;

  isAuthError(): boolean;

  isValidationError(): boolean;

  isServerError(): boolean;

  toJSON(): object;
}
```

### Códigos de Status Comuns

| Status | Significado | Helper |
|--------|-------------|--------|
| 400 | Requisição inválida | `isValidationError()` |
| 401 | Não autorizado | `isAuthError()` |
| 403 | Acesso negado | - |
| 404 | Recurso não encontrado | - |
| 422 | Dados inválidos | `isValidationError()` |
| 429 | Muitas requisições | - |
| 500 | Erro interno | `isServerError()` |
| 503 | Serviço indisponível | `isServerError()` |

---

## Desenvolvimento

### Requisitos

- Node.js >= 18.0.0
- npm ou yarn

### Setup do Projeto

```bash
git clone https://github.com/seu-usuario/memed-node.git
cd memed-node

npm install

npm test

npm run build

npm run example
```

### Scripts Disponíveis

```bash
npm run build          # Build para produção (CJS + ESM + tipos)
npm run dev            # Build em watch mode

# Testes
npm test              # Rodar testes em watch mode
npm run test:ui       # Testes com interface visual
npm run test:run      # Rodar testes uma vez (CI)
npm run test:coverage # Cobertura de testes

# Qualidade de código
npm run lint          # Rodar ESLint
npm run lint:fix      # Corrigir erros de lint automaticamente
npm run format        # Formatar código com Prettier
npm run format:check  # Verificar formatação
npm run typecheck     # Verificar tipos TypeScript
npm run check         # Rodar todas as verificações (type + lint + test)
```

### Estrutura do Projeto

```
memed-node/
├── src/
│   ├── client/
│   │   ├── HttpClient.ts        # Cliente HTTP base
│   │   └── MemedClient.ts       # Cliente principal
│   ├── resources/
│   │   └── PrescritorResource.ts # API de prescritores
│   ├── types/
│   │   ├── common.types.ts      # Tipos comuns
│   │   └── prescritor.types.ts  # Tipos de prescritor
│   ├── errors/
│   │   └── MemedError.ts        # Classe de erro customizada
│   └── index.ts                 # Exports públicos
├── tests/
│   ├── unit/                    # Testes unitários
│   └── setup.ts                 # Setup global dos testes
├── docs/
│   └── README.md                # Documentação completa
├── examples/                    # Exemplos de uso
├── dist/                        # Build (gerado)
└── README.md                    # README principal
```

### Rodando os Testes

```bash
npm test

# Com interface visual
npm run test:ui

# Uma vez (CI)
npm run test:run

# Com cobertura
npm run test:coverage
```

---

## Contribuindo

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nova funcionalidade
fix: correção de bug
docs: apenas documentação
style: formatação, ponto e vírgula, etc (sem mudança de código)
refactor: refatoração de código (sem correção ou feature)
perf: melhoria de performance
test: adicionar ou corrigir testes
chore: atualizações de build, configs, dependências
```

**Exemplos:**
```bash
git commit -m "feat: adiciona método list() para prescritores"
git commit -m "fix: corrige validação de CPF"
git commit -m "docs: atualiza exemplos no README"
git commit -m "test: adiciona testes para MemedError"
git commit -m "chore: atualiza dependências"
```

### Diretrizes de Código

- ✅ Use TypeScript com tipagem forte
- ✅ Siga o style guide do ESLint/Prettier (roda automaticamente)
- ✅ Escreva testes para novas funcionalidades
- ✅ Documente métodos públicos com JSDoc
- ✅ Mantenha a cobertura de testes acima de 80%
- ✅ Evite dependências externas

### Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/seu-usuario/memed-node/issues/new) com:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Versão do Node.js e da biblioteca
- Código de exemplo (se possível)

### Sugerir Features

Tem uma ideia? [Abra uma issue](https://github.com/seu-usuario/memed-node/issues/new) descrevendo:

- O problema que a feature resolve
- Como você imagina a API/uso
- Exemplos de uso
- Benefícios para outros usuários

---

## Links Úteis

- [← Voltar ao README principal](../README.md)
- [Documentação oficial da Memed](https://doc.memed.com.br/)
- [Credenciais de teste](https://doc.memed.com.br/docs/primeiros-passos)
- [Issues](https://github.com/seu-usuario/memed-node/issues)
- [Roadmap](../ROADMAP.md)

---

**Dúvidas?** Abra uma [issue](https://github.com/seu-usuario/memed-node/issues) ou consulte a [documentação oficial da Memed](https://doc.memed.com.br/)**.**
