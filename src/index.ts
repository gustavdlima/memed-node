export { MemedClient } from './client/MemedClient';

export type { MemedConfig, Environment } from './types/common.types';

export type {
    PrescritorCreateInput,
    PrescritorUpdateInput,
    PrescritorAttributes,
    Sexo,
    PrescritorStatus,
    BoardCode,
    ProfessionalBoard
} from './types/prescritor.types';

// ============================================
// ERRORS
// ============================================
export { MemedError } from './errors/MemedError';

// ============================================
// RESOURCES (não exportar - acessar via client)
// ============================================
// Os resources não são exportados diretamente.
// Usuários acessam via: memed.prescritor.create()