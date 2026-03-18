import { HttpClient } from '../client/HttpClient';
import { PrescritorResponse } from '../types/prescritor.types';
import {
    PrescricaoListOptions,
    PrescricaoAttributes,
    PrescricaoResponse,
    PrescricaoListResponse,
    PrescricaoListItem,
    PrescricaoDigitalLinkResponse,
    PrescricaoPdfUrlResponse,
    IngredienteSearchOptions,
    Ingrediente,
    IngredienteSearchResponse,
} from '../types/prescricao.types';

/**
 * Resource to manage prescriptions
 *
 * Methods that require a prescriber token resolve it automatically
 * via GET /sinapse-prescricao/usuarios/{prescritorId} before each call,
 * since the Memed token is not static.
 */
export class PrescricaoResource {
    constructor(private readonly http: HttpClient) {}

    /**
     * Fetches the latest valid token for a prescriber
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     */
    private async resolveToken(prescritorId: string): Promise<string> {
        const response: PrescritorResponse = await this.http.get<PrescritorResponse>(
            `/sinapse-prescricao/usuarios/${prescritorId}`
        );

        return response.data.attributes.token;
    }

    /**
     * List prescription history for a prescriber
     *
     * @param options - prescritorId (required) + filter/pagination options
     * @returns Array of prescription attributes
     */
    async list(options: PrescricaoListOptions): Promise<PrescricaoAttributes[]> {
        const token: string = await this.resolveToken(options.prescritorId);

        const params: Record<string, string | number | boolean> = { token };

        if (options.limit !== undefined) {
            params['page[limit]'] = options.limit;
        }

        if (options.offset !== undefined) {
            params['page[offset]'] = options.offset;
        }

        if (options.initialDate !== undefined) {
            params['initialDate'] = options.initialDate;
        }

        if (options.finalDate !== undefined) {
            params['finalDate'] = options.finalDate;
        }

        if (options.structuredDocuments !== undefined) {
            params['structuredDocuments'] = options.structuredDocuments;
        }

        const response: PrescricaoListResponse = await this.http.get<PrescricaoListResponse>(
            '/prescricoes',
            params
        );

        return response.data.map((item: PrescricaoListItem): PrescricaoAttributes => item.attributes);
    }

    /**
     * Get a single prescription by ID with structured documents
     *
     * Uses Authorization: Bearer header as required by Memed API.
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     * @param prescricaoId - Prescription ID
     * @param structuredDocuments - Include structured document data (default: true)
     */
    async get(
        prescritorId: string,
        prescricaoId: number,
        structuredDocuments: boolean = true
    ): Promise<PrescricaoAttributes> {
        const token: string = await this.resolveToken(prescritorId);

        const params: Record<string, string | number | boolean> = {};

        if (structuredDocuments) {
            params['structuredDocuments'] = true;
        }

        const response: PrescricaoResponse = await this.http.get<PrescricaoResponse>(
            `/prescricoes/${prescricaoId}`,
            params,
            token
        );

        return response.data.attributes;
    }

    /**
     * Delete a prescription
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     * @param prescricaoId - Prescription ID
     */
    async delete(prescritorId: string, prescricaoId: number): Promise<void> {
        const token: string = await this.resolveToken(prescritorId);
        await this.http.delete(`/prescricoes/${prescricaoId}`, { token });
    }

    /**
     * Get the digital prescription link (shareable)
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     * @param prescricaoId - Prescription ID
     * @returns Link and unlock code
     */
    async getDigitalLink(
        prescritorId: string,
        prescricaoId: number
    ): Promise<{ link: string; codigoDesbloqueio: string }> {
        const token: string = await this.resolveToken(prescritorId);

        const response: PrescricaoDigitalLinkResponse = await this.http.get<PrescricaoDigitalLinkResponse>(
            `/prescricoes/${prescricaoId}/get-digital-prescription-link`,
            { token }
        );

        return {
            link: response.data.attributes.link,
            codigoDesbloqueio: response.data.attributes.codigo_desbloqueio,
        };
    }

    /**
     * Get the PDF URL for a prescription
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     * @param prescricaoId - Prescription ID
     * @returns PDF download URL
     */
    async getPdfUrl(prescritorId: string, prescricaoId: number): Promise<string> {
        const token: string = await this.resolveToken(prescritorId);

        const response: PrescricaoPdfUrlResponse = await this.http.get<PrescricaoPdfUrlResponse>(
            `/prescricoes/${prescricaoId}/url-document/full`,
            { token }
        );

        return response.data.attributes.url;
    }

    /**
     * Search active ingredients (uses api-key/secret-key auth, no token needed)
     *
     * @param options - Search terms and pagination
     * @returns Array of ingredients
     */
    async searchIngredients(options: IngredienteSearchOptions): Promise<Ingrediente[]> {
        const params: Record<string, string | number | boolean> = {
            terms: options.terms,
        };

        if (options.limit !== undefined) {
            params['limit'] = options.limit;
        }

        if (options.orderField !== undefined) {
            params['order[field]'] = options.orderField;
        }

        if (options.orderSort !== undefined) {
            params['order[sort]'] = options.orderSort;
        }

        const response: IngredienteSearchResponse = await this.http.get<IngredienteSearchResponse>(
            '/drugs/ingredients',
            params
        );

        return response.data;
    }
}
