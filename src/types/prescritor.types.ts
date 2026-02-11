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
 * Single item in prescriber list response
 */
export interface PrescritorListItem {
    type: 'usuarios';
    id: string;
    attributes: PrescritorAttributes;
}

/**
 * Api return to prescriber list
 */
export interface PrescritorListResponse {
    data: PrescritorListItem[];
    links: {
        self: string;
    };
    meta: {
        total: number;
    };
}

/**
 * Attributes without relationships for payload
 */
export type PrescritorPayloadAttributes = Omit<PrescritorCreateInput | PrescritorUpdateInput, 'especialidade' | 'cidade'>;

/**
 * Relationship reference with id
 */
export interface RelationshipRef {
    data: { id: number };
}

/**
 * JSON:API payload structure for prescriber requests
 */
export interface PrescritorPayload {
    data: {
        type: 'usuarios';
        attributes: PrescritorPayloadAttributes;
        relationships?: {
            especialidade?: RelationshipRef;
            cidade?: RelationshipRef;
        };
    };
}