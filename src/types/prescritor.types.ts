import { JsonApiRelationship } from './common.types';

export type Sexo = 'M' | 'F';
export type PrescritorStatus = 'Ativo' | 'Inativo' | 'Em análise';
export type BoardCode =
    | 'CRM'    // Conselho Regional de Medicina
    | 'CRO'    // Conselho Regional de Odontologia
    | 'COREN'  // Conselho Regional de Enfermagem
    | 'CRMV'   // Conselho Regional de Medicina Veterinária
    | 'CRF'    // Conselho Regional de Farmácia
    | 'CRN'    // Conselho Regional de Nutrição
    | 'CREFITO' // Conselho Regional de Fisioterapia e Terapia Ocupacional
    | 'CRP'    // Conselho Regional de Psicologia
    | 'CRFa'   // Conselho Regional de Fonoaudiologia
    | 'CREF';  // Conselho Regional de Educação Física

export interface ProfessionalBoard {
    board_code: BoardCode;
    board_number: string;
    board_state: string;
}

/**
 * data to create a new prescriber
 */
export interface PrescritorCreateInput {
    external_id: string;

    nome: string;

    sobrenome: string;

    /** DD/MM/YYYY */
    data_nascimento: string;

    cpf: string;

    sexo: Sexo;

    board?: ProfessionalBoard;

    email?: string;

    avatar?: string;

    especialidade?: {
        id: number;
    };

    /** ID from Memed base (opcional) */
    cidade?: {
        id: number;
    };
}

/**
 * Data to update an prescriber
 */
export interface PrescritorUpdateInput {
    external_id?: string;
    nome?: string;
    sobrenome?: string;
    data_nascimento?: string;
    cpf?: string;
    sexo?: Sexo;
    board?: ProfessionalBoard;
    email?: string;
    avatar?: string;
    especialidade?: {
        id: number;
    };
    cidade?: {
        id: number;
    };
}

/**
 * Full data returned from API (prescriber)
 */
export interface PrescritorAttributes {
    id: number;
    external_id: string;
    nome: string;
    sobrenome: string;
    data_nascimento: string;
    cpf: string;
    sexo: Sexo;
    email?: string;
    avatar?: string;
    board: ProfessionalBoard;

    /** token to use on memed frontend */
    token: string;

    /** Registration status (validated by CFM on production) */
    status: PrescritorStatus;

    created_at: string;
    updated_at: string;
}

/**
 * API return to unique prescriber (JSON:API format)
 */
export interface PrescritorResponse {
    data: {
        type: 'usuarios';
        id: string;
        attributes: PrescritorAttributes;
        relationships?: {
            especialidade?: JsonApiRelationship;
            cidade?: JsonApiRelationship;
        };
        links: {
            self: string;
        };
    };
}

/**
 * Api return to prescriber list
 */
export interface PrescritorListResponse {
    data: Array<{
        type: 'usuarios';
        id: string;
        attributes: PrescritorAttributes;
    }>;
    links: {
        self: string;
    };
    meta: {
        total: number;
    };
}