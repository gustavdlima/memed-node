/**
 * City attributes returned from API
 */
export interface CidadeAttributes {
    id: number;
    nome: string;
    uf: string;
}

/**
 * Filter options for listing cities
 */
export interface CidadeFilterOptions {
    q?: string;
    uf?: string;
}

/**
 * City list item (JSON:API format)
 */
export interface CidadeListItem {
    type: 'cidades';
    id: string;
    attributes: CidadeAttributes;
    links: {
        self: string;
    };
}

/**
 * City list response (JSON:API format)
 */
export interface CidadeListResponse {
    data: CidadeListItem[];
}
