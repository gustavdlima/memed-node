/**
 * Medication item in a protocol
 *
 * Items WITH id are linked to Memed's catalog (medication or exam).
 * Items WITHOUT id are treated as free text (documents/attestations).
 *
 * Medication IDs must match the environment (integration or production).
 */
export interface ProtocoloMedicamento {
    /** Memed catalog ID. Omit for free text items */
    id?: string;
    nome: string;
    posologia?: string;
    quantidade?: number;
    composicao?: string;
    fabricante?: string;
    titularidade?: string;
    preco?: number;
}

/**
 * Data to create a new protocol
 *
 * The medicamentos array can contain:
 * - Medications: { id: "a1046...", nome, posologia, quantidade, ... }
 * - Exams: { id: "e10", nome, posologia? }
 * - Free text (documents): { nome, posologia } (no id)
 */
export interface ProtocoloCreateInput {
    nome: string;
    medicamentos: ProtocoloMedicamento[];
}

/**
 * Protocol attributes returned from API
 */
export interface ProtocoloAttributes {
    id: number;
    nome: string;
    medicamentos: ProtocoloMedicamento[];
    created_at: string;
    updated_at: string;
}

/**
 * Single protocol response (JSON:API format)
 */
export interface ProtocoloResponse {
    data: {
        type: 'protocolos';
        id: string;
        attributes: ProtocoloAttributes;
    };
}

/**
 * Protocol list item
 */
export interface ProtocoloListItem {
    type: 'protocolos';
    id: string;
    attributes: ProtocoloAttributes;
}

/**
 * Protocol list response (JSON:API format)
 */
export interface ProtocoloListResponse {
    data: ProtocoloListItem[];
}

/**
 * JSON:API payload for protocol creation
 */
export interface ProtocoloPayload {
    data: {
        type: 'protocolos';
        attributes: {
            nome: string;
            medicamentos: ProtocoloMedicamento[];
        };
    };
}
