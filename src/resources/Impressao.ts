import { HttpClient } from '../client/HttpClient';
import { PrescritorResponse } from '../types/prescritor.types';
import {
    ImpressaoConfigInput,
    ImpressaoAttributes,
    ImpressaoResponse,
    ImpressaoListResponse,
    ImpressaoListItem,
    ImpressaoUploadTemplateResponse,
} from '../types/impressao.types';

/**
 * Resource to manage prescription printing configuration
 *
 * When a user is created, 4 default themes are added (indices 1-4).
 * All methods use token auth (resolved automatically via prescritorId).
 */
export class ImpressaoResource {
    constructor(private readonly http: HttpClient) {}

    private async resolveToken(prescritorId: string): Promise<string> {
        const response: PrescritorResponse = await this.http.get<PrescritorResponse>(
            `/sinapse-prescricao/usuarios/${prescritorId}`
        );

        return response.data.attributes.token;
    }

    /**
     * Configure printing options for a prescriber
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     * @param config - Printing configuration (medicos_id and indice required)
     */
    async configure(
        prescritorId: string,
        config: ImpressaoConfigInput
    ): Promise<ImpressaoAttributes> {
        const token: string = await this.resolveToken(prescritorId);

        const payload = {
            data: {
                type: 'configuracoes-prescricao' as const,
                attributes: config,
            },
        };

        const response: ImpressaoResponse = await this.http.post<ImpressaoResponse>(
            '/opcoes-receituario',
            payload,
            { token }
        );

        return response.data.attributes;
    }

    /**
     * Retrieve current printing configurations for a prescriber
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     * @returns Array of printing configurations (up to 4 themes)
     */
    async get(prescritorId: string): Promise<ImpressaoAttributes[]> {
        const token: string = await this.resolveToken(prescritorId);

        const response: ImpressaoListResponse = await this.http.get<ImpressaoListResponse>(
            '/opcoes-receituario',
            { token }
        );

        return response.data.map((item: ImpressaoListItem): ImpressaoAttributes => item.attributes);
    }

    /**
     * Upload a PDF template to extract header/footer images
     *
     * The PDF is converted to an image and Memed automatically detects
     * where the header/footer starts and ends.
     *
     * Important:
     * - Template is applied to printing config index 1
     * - mostrar_cabecalho_rodape_simples and mostrar_cabecalho_rodape_especial
     *   must be set to 1 for images to display
     * - This needs to be done once per prescriber
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     * @param pdfFile - PDF file as Blob
     * @param filename - PDF filename
     * @returns Paths to the extracted header and/or footer images
     */
    async uploadTemplate(
        prescritorId: string,
        pdfFile: Blob,
        filename: string = 'template.pdf'
    ): Promise<{ headerImage?: string; footerImage?: string }> {
        const token: string = await this.resolveToken(prescritorId);

        const formData: FormData = new FormData();
        formData.append('template', pdfFile, filename);

        const response: ImpressaoUploadTemplateResponse = await this.http.postFormData<ImpressaoUploadTemplateResponse>(
            '/opcoes-receituario/upload-template',
            formData,
            { token }
        );

        return {
            headerImage: response.data.attributes.header_image,
            footerImage: response.data.attributes.footer_image,
        };
    }
}
