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
- [Prescrição (Receitas Médicas)](#prescrição-receitas-médicas)
  - [Buscar Prescrição por ID](#buscar-prescrição-por-id)
  - [Listar Prescrições](#listar-prescrições)
  - [Deletar Prescrição](#deletar-prescrição)
  - [Link Digital](#link-digital)
  - [URL do PDF](#url-do-pdf)
  - [Buscar Princípios Ativos](#buscar-princípios-ativos)
- [Protocolo (Templates de Prescrição)](#protocolo-templates-de-prescrição)
  - [Por Prescritor](#por-prescritor)
  - [Por Parceiro (Instituição)](#por-parceiro-instituição)
- [Impressão (Configuração de Layout)](#impressão-configuração-de-layout)
  - [Configurar Impressão](#configurar-impressão)
  - [Recuperar Configurações](#recuperar-configurações)
  - [Upload de Template PDF](#upload-de-template-pdf)
- [Especialidades e Cidades](#especialidades-e-cidades)
  - [Especialidades](#especialidades)
  - [Cidades](#cidades)
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

## Prescrição (Receitas Médicas)

A API de prescrições permite consultar o histórico de receitas, obter links digitais e PDFs. A criação de prescrições é feita pelo módulo frontend da Memed (widget/iframe).

> **Token automático:** Todos os métodos que precisam do token do prescritor o resolvem automaticamente via `GET /sinapse-prescricao/usuarios/{id}`, já que o token da Memed não é estático.

### Buscar Prescrição por ID

Busca uma prescrição específica com documentos estruturados. Usa `Authorization: Bearer` como a API da Memed exige.

```typescript
// Com documentos estruturados (padrão)
const prescricao = await memed.prescricao.get('seu-external-id', 42);

// Sem documentos estruturados
const prescricao = await memed.prescricao.get('seu-external-id', 42, false);
```

### Listar Prescrições

Lista o histórico de prescrições de um prescritor. Retorna as últimas 10 por padrão.

```typescript
// Listagem simples
const prescricoes = await memed.prescricao.list({
  prescritorId: 'seu-external-id',
});

// Com filtros e paginação
const prescricoes = await memed.prescricao.list({
  prescritorId: 'seu-external-id',
  limit: 50,
  offset: 0,
  initialDate: '2026-01-01',  // YYYY-MM-DD
  finalDate: '2026-03-01',
  structuredDocuments: true,
});
```

#### Opções de Filtro

| Propriedade | Tipo | Obrigatório | Observações |
|---|---|---|---|
| `prescritorId` | string | Sim | CPF, external_id ou registro+UF |
| `limit` | number | | Máximo 100 |
| `offset` | number | | Para paginação |
| `initialDate` | string | | Formato YYYY-MM-DD |
| `finalDate` | string | | Formato YYYY-MM-DD |
| `structuredDocuments` | boolean | | Incluir documentos estruturados |

### Deletar Prescrição

Remove uma prescrição pelo ID.

```typescript
await memed.prescricao.delete('seu-external-id', 42);
```

### Link Digital

Obtém o link digital compartilhável de uma prescrição e o código de desbloqueio.

```typescript
const { link, codigoDesbloqueio } = await memed.prescricao.getDigitalLink(
  'seu-external-id',
  42
);

console.log('Link:', link);
console.log('Código:', codigoDesbloqueio);
```

### URL do PDF

Obtém a URL para download do PDF de uma prescrição.

```typescript
const pdfUrl = await memed.prescricao.getPdfUrl('seu-external-id', 42);
console.log('PDF:', pdfUrl);
```

### Buscar Princípios Ativos

Busca princípios ativos (ingredientes) na base da Memed. Este método usa autenticação via api-key/secret-key, não precisa de prescritor.

```typescript
// Busca simples
const ingredientes = await memed.prescricao.searchIngredients({
  terms: 'dipirona',
});

// Com opções
const ingredientes = await memed.prescricao.searchIngredients({
  terms: 'paracetamol',
  limit: 10,
  orderField: 'nome',
  orderSort: 'ASC',
});

console.log(ingredientes[0].nome);  // Nome do ingrediente
console.log(ingredientes[0].slug);  // Slug do ingrediente
```

---

## Protocolo (Templates de Prescrição)

Protocolos são templates reutilizáveis de prescrição com medicamentos pré-definidos. A API tem dois escopos:

- **Por prescritor**: protocolos individuais do profissional (usa token, resolvido automaticamente)
- **Por parceiro**: protocolos institucionais compartilhados (usa api-key/secret-key)

### Tipos de Item

O array `medicamentos` aceita 3 tipos de item:

| Tipo | `id` | Campos | Exemplo |
|---|---|---|---|
| **Medicamento** | obrigatório (ex: `a1046...`) | nome, posologia, quantidade, composicao, fabricante, etc | Dipirona 500mg |
| **Exame** | obrigatório (ex: `e10`) | nome, posologia (opcional) | Hemograma |
| **Texto livre** | **sem id** | nome, posologia (aceita HTML) | Atestado médico |

> Itens sem `id` são tratados como texto livre na prescrição.
> IDs devem corresponder ao ambiente (integração ou produção).

### Por Prescritor

```typescript
// Criar protocolo com medicamento, exame e texto livre
const protocolo = await memed.protocolo.create('seu-external-id', {
  nome: 'Gripe comum',  // máximo 500 caracteres
  medicamentos: [
    // Medicamento
    {
      id: 'a1046503030027106379',
      nome: 'Dipirona 500mg',
      posologia: '1 comprimido de 6 em 6 horas',
      quantidade: 20,
    },
    // Exame
    {
      id: 'e10',
      nome: 'Hemograma',
      posologia: 'Jejum de 8 a 10 horas',
    },
    // Texto livre (documento)
    {
      nome: 'Atestado',
      posologia: '<p>ATESTADO<br>Paciente sob meus cuidados...</p>',
    },
  ],
});

// Listar protocolos do prescritor
const protocolos = await memed.protocolo.list('seu-external-id');

// Deletar protocolo
await memed.protocolo.delete('seu-external-id', protocolo.id);

// Criar múltiplos protocolos (nome máx 250 caracteres)
const multiplo = await memed.protocolo.createMultiple('seu-external-id', {
  nome: 'Infecção urinária',
  medicamentos: [
    { nome: 'Norfloxacino 400mg', posologia: '1 comprimido 12/12h por 7 dias' },
  ],
});
```

### Por Parceiro (Instituição)

Protocolos institucionais compartilhados entre todos os prescritores do parceiro. Não precisam de prescritor.

```typescript
// Criar protocolo institucional (requer id do medicamento)
const protocolo = await memed.protocolo.createForPartner({
  nome: 'Protocolo institucional',
  medicamentos: [
    { id: '12345', nome: 'Medicamento A', posologia: '1x ao dia' },
  ],
});

// Listar protocolos do parceiro
const protocolos = await memed.protocolo.listForPartner();

// Buscar protocolo específico
const detalhe = await memed.protocolo.getForPartner(protocolo.id);

// Deletar protocolo do parceiro
await memed.protocolo.deleteForPartner(protocolo.id);
```

> **Importante:** O ID do medicamento deve ser do ambiente correspondente (integração ou produção).

---

## Impressão (Configuração de Layout)

Quando um prescritor é criado, a Memed adiciona 4 temas padrão (índices 1-4). Esses temas podem ser customizados via API.

### Configurar Impressão

Personaliza margens, fontes, cabeçalho, rodapé e opções de controle especial.

```typescript
await memed.impressao.configure('seu-external-id', {
  medicos_id: 123456,
  indice: 1,

  // Fonte
  fonte: 'Helvetica',
  tamanho_fonte: 14,

  // Margens (cm)
  margem_esquerda: 1.5,
  margem_direita: 1.5,
  margem_superior: 1,
  margem_inferior: 1,

  // Papel (cm)
  largura_papel: 21,
  altura_papel: 29.7,

  // Cabeçalho
  titulo: 'Dr. José Silva',
  titulo_fonte: 'Droid Serif Italic',
  titulo_tamanho_fonte: 22,
  titulo_cor: '#20afd6',
  subtitulo: 'CRM: 12345SP - Clínica Geral',
  subtitulo_cor: '#8c8c8c',

  // Rodapé
  rodape: 'Rua Exemplo, 100 - São Paulo/SP',
  rodape_cor: '#8c8c8c',

  // Dados do prescritor no layout
  nome_medico: 'José Silva',
  endereco_medico: 'Rua Exemplo, 100',
  cidade_medico: 'São Paulo - SP',
  telefone_medico: '(11) 99999-9999',

  // Controle especial
  imprimir_controle_especial: false,
  imprimir_controle_especial_antibioticos: true,

  // Cabeçalho/rodapé visíveis
  mostrar_cabecalho_rodape_simples: 1,
  mostrar_cabecalho_rodape_especial: 1,
});
```

### Recuperar Configurações

Retorna as configurações de impressão atuais (até 4 temas).

```typescript
const configs = await memed.impressao.get('seu-external-id');

configs.forEach(config => {
  console.log(`Tema ${config.indice}: ${config.fonte} ${config.tamanho_fonte}pt`);
});
```

### Upload de Template PDF

Importa cabeçalho/rodapé de um PDF. A Memed converte para imagem e detecta automaticamente os limites do cabeçalho/rodapé.

```typescript
import { readFile } from 'fs/promises';

const pdfBuffer = await readFile('./receituario.pdf');
const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

const { headerImage, footerImage } = await memed.impressao.uploadTemplate(
  'seu-external-id',
  pdfBlob,
  'receituario.pdf'
);

console.log('Header:', headerImage);
console.log('Footer:', footerImage);
```

> **Importante:**
> - O template é aplicado à configuração de índice 1
> - `mostrar_cabecalho_rodape_simples` e `mostrar_cabecalho_rodape_especial` devem ser `1` para as imagens aparecerem
> - O processo precisa ser feito uma única vez por prescritor
> - Verifique se `tamanho_cabecalho` e `tamanho_rodape` têm espaço suficiente para as imagens

---

## Especialidades e Cidades

Endpoints públicos (não precisam de autenticação) para consultar especialidades médicas e cidades. Usados para obter os IDs necessários no cadastro de prescritores.

> **Dica:** Consulte essas APIs previamente e armazene os IDs mais utilizados em cache no seu sistema.

### Especialidades

```typescript
// Listar todas
const especialidades = await memed.especialidade.list();

// Filtrar por nome
const generalistas = await memed.especialidade.list({ q: 'Generalista' });

console.log(generalistas[0].id);    // ID para usar no cadastro
console.log(generalistas[0].nome);  // "Clínica Geral / Generalista"
console.log(generalistas[0].grupo); // Grupo/categoria
```

### Cidades

```typescript
// Listar todas
const cidades = await memed.cidade.list();

// Filtrar por nome
const campinas = await memed.cidade.list({ q: 'Campinas' });

// Filtrar por estado
const cidadesRJ = await memed.cidade.list({ uf: 'RJ' });

// Combinar filtros
const niteroi = await memed.cidade.list({ q: 'Niterói', uf: 'RJ' });

console.log(niteroi[0].id);   // ID para usar no cadastro
console.log(niteroi[0].nome); // "Niterói"
console.log(niteroi[0].uf);   // "RJ"
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
│   │   ├── Prescritor.ts        # API de prescritores
│   │   ├── Prescricao.ts        # API de prescrições
│   │   ├── Protocolo.ts         # API de protocolos
│   │   ├── Impressao.ts         # API de impressão
│   │   ├── Especialidade.ts     # API de especialidades
│   │   └── Cidade.ts            # API de cidades
│   ├── types/
│   │   ├── common.types.ts      # Tipos comuns
│   │   ├── prescritor.types.ts  # Tipos de prescritor
│   │   ├── prescricao.types.ts  # Tipos de prescrição
│   │   ├── protocolo.types.ts   # Tipos de protocolo
│   │   ├── impressao.types.ts   # Tipos de impressão
│   │   ├── especialidade.types.ts # Tipos de especialidade
│   │   └── cidade.types.ts      # Tipos de cidade
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
