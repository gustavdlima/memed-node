/**
 * Printing configuration attributes
 *
 * When a user is created, 4 default themes are added.
 * These can be customized via API.
 */
export interface ImpressaoAttributes {
    medicos_id: number;
    indice: number;

    // Patient label
    mostrar_label_nome_paciente?: boolean;
    mostrar_label_paciente_especial?: number;

    // Date display
    mostrar_data?: number;
    mostrar_data_controle_especial?: number;

    // Font
    fonte?: string;
    tamanho_fonte?: number;
    espacamento?: number;

    // Medication display
    mostrar_unidades?: boolean;
    mostrar_unidades_especial?: boolean;
    separar_por_uso?: boolean;
    mostrar_nome_fabricante?: boolean;
    separador_uso?: number;
    separador_medicamento?: number;

    // Paper dimensions (cm)
    largura_papel?: number;
    altura_papel?: number;

    // Margins (cm)
    margem_esquerda?: number;
    margem_direita?: number;
    margem_superior?: number;
    margem_inferior?: number;

    // Header title
    titulo_fonte?: string;
    titulo_tamanho_fonte?: number;
    titulo?: string;
    titulo_cor?: string;

    // Header subtitle
    subtitulo_fonte?: string;
    subtitulo_tamanho_fonte?: number;
    subtitulo?: string;
    subtitulo_cor?: string;
    tamanho_cabecalho?: number;

    // Footer
    rodape_fonte?: string;
    rodape_tamanho_fonte?: number;
    rodape?: string;
    rodape_cor?: string;
    tamanho_rodape?: number;
    modelo_cabecalho_rodape?: number;
    modelo_rodape?: number;

    // State
    ativo?: boolean;

    // Special control printing
    imprimir_controle_especial?: boolean;
    imprimir_controle_especial_antibioticos?: boolean;
    imprimir_controle_especial_c4?: boolean;
    imprimir_lme?: boolean;

    // Prescriber info in header/footer
    nome_medico?: string;
    endereco_medico?: string;
    cidade_medico?: string;
    telefone_medico?: string;

    // Header/footer visibility
    mostrar_cabecalho_rodape_simples?: number;
    mostrar_cabecalho_rodape_especial?: number;

    // Logo
    logo_nome?: string;
    logo_src?: string;
    width_logo?: number;
    height_logo?: number;
    zoom_logo?: number;

    // Template images (from PDF upload)
    header_image?: string;
    footer_image?: string;

    // LME copies
    number_of_lme_copies?: number;
}

/**
 * Input for configuring printing options
 * Same as ImpressaoAttributes — all fields optional except medicos_id and indice
 */
export type ImpressaoConfigInput = ImpressaoAttributes;

/**
 * Single printing config response (JSON:API format)
 */
export interface ImpressaoResponse {
    data: {
        type: 'configuracoes-prescricao';
        id: string;
        attributes: ImpressaoAttributes;
    };
}

/**
 * List of printing configs response
 */
export interface ImpressaoListItem {
    type: 'configuracoes-prescricao';
    id: string;
    attributes: ImpressaoAttributes;
}

export interface ImpressaoListResponse {
    data: ImpressaoListItem[];
}

/**
 * Upload template response with header/footer image paths
 */
export interface ImpressaoUploadTemplateResponse {
    data: {
        type: 'configuracoes-prescricao';
        id: string;
        attributes: {
            header_image?: string;
            footer_image?: string;
        };
    };
}
