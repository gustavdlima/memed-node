/**
 * Filter options for listing prescriptions
 */
export interface PrescricaoListOptions {
    prescritorId: string;
    limit?: number;
    offset?: number;
    initialDate?: string;
    finalDate?: string;
    structuredDocuments?: boolean;
}

/**
 * Prescription attributes returned from API
 */
export interface PrescricaoAttributes {
    id: number;
    data: string;
    horario: string;
    medicamentos: PrescricaoMedicamento[];
    paciente: PrescricaoPaciente;
    observacoes?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

/**
 * Medication within a prescription
 */
export interface PrescricaoMedicamento {
    id: number;
    nome: string;
    posologia: string;
    quantidade: number;
    composicao?: string;
    fabricante?: string;
    titularidade?: string;
}

/**
 * Patient data within a prescription
 */
export interface PrescricaoPaciente {
    id: number;
    nome: string;
    cpf?: string;
    telefone?: string;
}

/**
 * Single prescription response (JSON:API format)
 */
export interface PrescricaoResponse {
    data: {
        type: 'prescricoes';
        id: string;
        attributes: PrescricaoAttributes;
        links: {
            self: string;
        };
    };
}

/**
 * List item in prescription list response
 */
export interface PrescricaoListItem {
    type: 'prescricoes';
    id: string;
    attributes: PrescricaoAttributes;
}

/**
 * Prescription list response (JSON:API format)
 */
export interface PrescricaoListResponse {
    data: PrescricaoListItem[];
    links: {
        self: string;
    };
    meta: {
        total: number;
    };
}

/**
 * Digital prescription link response
 */
export interface PrescricaoDigitalLinkResponse {
    data: {
        type: 'prescricoes';
        id: string;
        attributes: {
            link: string;
            codigo_desbloqueio: string;
        };
    };
}

/**
 * Prescription PDF URL response
 */
export interface PrescricaoPdfUrlResponse {
    data: {
        type: 'prescricoes';
        id: string;
        attributes: {
            url: string;
        };
    };
}

/**
 * Active ingredient returned from drugs/ingredients endpoint
 */
export interface Ingrediente {
    id: number;
    nome: string;
    slug: string;
    unii?: string;
}

/**
 * Filter options for searching active ingredients
 */
export interface IngredienteSearchOptions {
    terms: string;
    limit?: number;
    orderField?: string;
    orderSort?: 'ASC' | 'DESC';
}

/**
 * Ingredients search response
 */
export interface IngredienteSearchResponse {
    data: Ingrediente[];
}
