/**
 * Specialty attributes returned from API
 */
export interface EspecialidadeAttributes {
    id: number;
    nome: string;
    grupo: string;
}

/**
 * Filter options for listing specialties
 */
export interface EspecialidadeFilterOptions {
    q?: string;
}

/**
 * Specialty list item (JSON:API format)
 */
export interface EspecialidadeListItem {
    type: 'especialidades';
    id: string;
    attributes: EspecialidadeAttributes;
    links: {
        self: string;
    };
}

/**
 * Specialty list response (JSON:API format)
 */
export interface EspecialidadeListResponse {
    data: EspecialidadeListItem[];
}
