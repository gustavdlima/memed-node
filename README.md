## ROADMAP COMPLETO DE IMPLEMENTAÇÃO

#### **O QUE ESTAMOS CONSTRUÍNDO??**

Uma biblioteca cliente (client library) que:
- Abstrai chamadas HTTP para a API da Memed
- Trata erros de forma amigável
- Valida dados antes de enviar
- É fácil de usar e manter

### **FASE 1: Setup**
```
1.1. Configurar projeto Node.js/TypeScript
1.2. Configurar build (tsup)
1.3. Configurar linting (eslint + prettier)
1.4. Configurar testes (vitest)
1.5. Criar estrutura de pastas
1.6. Implementar HttpClient (abstração do fetch)
1.7. Implementar MemedError (erros customizados)
1.8. Implementar MemedClient (classe principal)
```

### **FASE 2: Resource Prescritor (MVP)**
```
2.1. Definir tipos TypeScript para Prescritor
2.2. Implementar PrescritorResource
     - create() - cadastrar médico
     - get() - buscar por external_id
     - list() - listar todos
     - update() - atualizar dados
     - delete() - remover
2.3. Escrever testes unitários
2.4. Criar exemplo de uso
2.5. Testar contra API real (integration tests)
```

### **FASE 3: Resource Prescrição**
```
3.1. Definir tipos para Prescrição
3.2. Implementar PrescricaoResource
     - list() - listar prescrições do médico
     - get() - buscar por ID
     - getLink() - obter link para paciente
     - getPdf() - baixar PDF
     - delete() - remover prescrição
3.3. Testes
```

### **FASE 4: Resource Protocolo**
```
4.1. Definir tipos para Protocolo
4.2. Implementar ProtocoloResource
     - create() - criar protocolo (template)
     - get() - buscar protocolo
     - list() - listar protocolos
     - update() - atualizar
     - delete() - remover
     - createMultiple() - cadastro em lote
4.3. Testes
```

### **FASE 5: Resource Impressão**
```
5.1. Definir tipos para configurações de impressão
5.2. Implementar ImpressaoResource
     - getConfig() - obter configurações
     - updateConfig() - atualizar configurações
5.3. Testes
```

### **FASE 6: Validações e Helpers**
```
6.1. Validador de CPF
6.2. Validador de CRM
6.3. Formatadores de data (DD/MM/YYYY)
6.4. Helper para construir medicamentos (array complexo)
6.5. Testes das validações
```

### **FASE 7: Tratamento de Erros**
```
7.1. Mapear códigos de erro da API
7.2. Mensagens em português
7.3. Retry automático em erros 5xx
7.4. Rate limiting (se necessário)
```

### **FASE 8: Documentação**
```
8.1. README detalhado com exemplos
8.2. JSDoc em todos os métodos públicos
8.3. Guia de migração (se alguém usa fetch direto)
8.4. Exemplos práticos (pasta examples/)
8.5. CHANGELOG.md
```

### **FASE 9: Publicação**
```
9.1. Configurar npm package
9.2. Semantic versioning
9.3. GitHub Actions (CI/CD)
     - Rodar testes em PRs
     - Build automático
     - Publicação automática no npm
9.4. Publicar v0.1.0 no npm
```

### **FASE 10: Extras (Opcional)**
```
10.1. Suporte a Memed Bridge
10.2. Webhooks/eventos
10.3. Cache de tokens
10.4. Logs/debugging
```

---

## Estrutura Final de Arquivos
```
memed-node/
├── src/
│   ├── client/
│   │   ├── HttpClient.ts
│   │   └── MemedClient.ts
│   ├── resources/
│   │   ├── Prescritor.ts
│   │   ├── Prescricao.ts
│   │   ├── Protocolo.ts
│   │   └── Impressao.ts
│   ├── types/
│   │   ├── common.types.ts
│   │   ├── prescritor.types.ts
│   │   ├── prescricao.types.ts
│   │   ├── protocolo.types.ts
│   │   └── impressao.types.ts
│   ├── errors/
│   │   └── MemedError.ts
│   ├── utils/
│   │   ├── validators.ts 
│   │   ├── formatters.ts
│   │   └── helpers.ts
│   └── index.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── helpers/
├── examples/
│   ├── basic.ts
│   ├── complete.ts
│   └── error-handling.ts
├── .github/
│   └── workflows/
│       ├── test.yml
│       └── publish.yml
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── README.md
├── CHANGELOG.md
└── LICENSE
```
