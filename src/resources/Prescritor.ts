import { HttpClient } from '../client/HttpClient';
import {
    PrescritorCreateInput,
    PrescritorUpdateInput,
    PrescritorResponse,
    PrescritorListResponse,
    PrescritorAttributes,
} from '../types/prescritor.types';

/**
 * Resource to manage prescribers (doctors)
 */
export class PrescritorResource {
    constructor(private readonly http: HttpClient) {}

    /**
     * Register a new prescriber in Memed
     *
     * @param data - prescribers data
     * @returns Complete prescriber Data and Token (frontend)
     *
     */
    async create(data: PrescritorCreateInput): Promise<PrescritorAttributes> {
        const payload = this.buildPayload(data);

        const response = await this.http.post<PrescritorResponse>(
            '/sinapse-prescricao/usuarios',
            payload
        );

        return response.data.attributes;
    }

    /**
     * Retrieves prescriber data by external_id
     *
     * @param externalId - prescriber id from your system
     * @returns complete data from prescriber
     *
     */
    async get(externalId: string): Promise<PrescritorAttributes> {
        const response = await this.http.get<PrescritorResponse>(
            `/sinapse-prescricao/usuarios/${externalId}`
        );

        return response.data.attributes;
    }

    /**
     * List all registered prescribers
     *
     * @returns Array with all prescribers
     *
     */
    async list(): Promise<PrescritorAttributes[]> {
        const response = await this.http.get<PrescritorListResponse>(
            '/sinapse-prescricao/usuarios'
        );

        return response.data.map((item) => item.attributes);
    }

    /**
     * Update prescriber
     *
     * @param externalId - prescriber external id
     * @param data - data to update
     * @returns Updated data
     *
     */
    async update(
        externalId: string,
        data: PrescritorUpdateInput
    ): Promise<PrescritorAttributes> {
        const payload = this.buildPayload(data);

        const response = await this.http.patch<PrescritorResponse>(
            `/sinapse-prescricao/usuarios/${externalId}`,
            payload
        );

        return response.data.attributes;
    }

    /**
     * Delete a prescriber
     *
     * @param externalId - External Id from prescriber (Your system)
     *
     */
    async delete(externalId: string): Promise<void> {
        await this.http.delete(`/sinapse-prescricao/usuarios/${externalId}`);
    }

    /**
     * Build JSON:API format payload
     */
    private buildPayload(
        data: PrescritorCreateInput | PrescritorUpdateInput
    ): object {
        const { especialidade, cidade, ...attributes } = data;

        const payload: any = {
            data: {
                type: 'usuarios',
                attributes,
            },
        };

        if (especialidade || cidade) {
            payload.data.relationships = {};

            if (especialidade) {
                payload.data.relationships.especialidade = {
                    data: { id: especialidade.id },
                };
            }

            if (cidade) {
                payload.data.relationships.cidade = {
                    data: { id: cidade.id },
                };
            }
        }

        return payload;
    }
}