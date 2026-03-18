import { HttpClient } from '../client/HttpClient';
import { PrescritorResponse } from '../types/prescritor.types';
import {
    ProtocoloCreateInput,
    ProtocoloAttributes,
    ProtocoloResponse,
    ProtocoloListResponse,
    ProtocoloListItem,
    ProtocoloPayload,
} from '../types/protocolo.types';

/**
 * Resource to manage protocols (prescription templates)
 *
 * Two scopes:
 * - Prescriber-level: uses token (resolved automatically via prescritorId)
 * - Partner-level (institution): uses api-key/secret-key (already in HttpClient)
 */
export class ProtocoloResource {
    constructor(private readonly http: HttpClient) {}

    private async resolveToken(prescritorId: string): Promise<string> {
        const response: PrescritorResponse = await this.http.get<PrescritorResponse>(
            `/sinapse-prescricao/usuarios/${prescritorId}`
        );

        return response.data.attributes.token;
    }

    private buildPayload(data: ProtocoloCreateInput): ProtocoloPayload {
        return {
            data: {
                type: 'protocolos',
                attributes: {
                    nome: data.nome,
                    medicamentos: data.medicamentos,
                },
            },
        };
    }

    // ========================
    // Prescriber-level (token)
    // ========================

    /**
     * Create a protocol for a prescriber
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     * @param data - Protocol name (max 500 chars) and medications
     */
    async create(
        prescritorId: string,
        data: ProtocoloCreateInput
    ): Promise<ProtocoloAttributes> {
        const token: string = await this.resolveToken(prescritorId);
        const payload: ProtocoloPayload = this.buildPayload(data);

        const response: ProtocoloResponse = await this.http.post<ProtocoloResponse>(
            '/protocolos',
            payload,
            { token }
        );

        return response.data.attributes;
    }

    /**
     * List all protocols for a prescriber
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     */
    async list(prescritorId: string): Promise<ProtocoloAttributes[]> {
        const token: string = await this.resolveToken(prescritorId);

        const response: ProtocoloListResponse = await this.http.get<ProtocoloListResponse>(
            '/protocolos',
            { token }
        );

        return response.data.map((item: ProtocoloListItem): ProtocoloAttributes => item.attributes);
    }

    /**
     * Delete a prescriber's protocol
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     * @param protocoloId - Protocol ID
     */
    async delete(prescritorId: string, protocoloId: number): Promise<void> {
        const token: string = await this.resolveToken(prescritorId);
        await this.http.delete(`/protocolos/${protocoloId}`, { token });
    }

    /**
     * Create multiple protocols for a prescriber at once
     *
     * @param prescritorId - CPF, external_id, or registro+UF
     * @param data - Protocol name (max 250 chars) and medications
     */
    async createMultiple(
        prescritorId: string,
        data: ProtocoloCreateInput
    ): Promise<ProtocoloAttributes> {
        const token: string = await this.resolveToken(prescritorId);
        const payload: ProtocoloPayload = this.buildPayload(data);

        const response: ProtocoloResponse = await this.http.post<ProtocoloResponse>(
            '/protocolos/multiplos',
            payload,
            { token }
        );

        return response.data.attributes;
    }

    // ================================
    // Partner-level (api-key/secret-key)
    // ================================

    /**
     * Create a protocol for the partner (institution-level)
     *
     * @param data - Protocol name and medications (requires medication id)
     */
    async createForPartner(data: ProtocoloCreateInput): Promise<ProtocoloAttributes> {
        const payload: ProtocoloPayload = this.buildPayload(data);

        const response: ProtocoloResponse = await this.http.post<ProtocoloResponse>(
            '/protocolos/parceiros',
            payload
        );

        return response.data.attributes;
    }

    /**
     * List all protocols for the partner
     */
    async listForPartner(): Promise<ProtocoloAttributes[]> {
        const response: ProtocoloListResponse = await this.http.get<ProtocoloListResponse>(
            '/protocolos/parceiros'
        );

        return response.data.map((item: ProtocoloListItem): ProtocoloAttributes => item.attributes);
    }

    /**
     * Get a specific partner protocol
     *
     * @param protocoloId - Protocol ID
     */
    async getForPartner(protocoloId: number): Promise<ProtocoloAttributes> {
        const response: ProtocoloResponse = await this.http.get<ProtocoloResponse>(
            `/protocolos/parceiros/${protocoloId}`
        );

        return response.data.attributes;
    }

    /**
     * Delete a partner protocol
     *
     * @param protocoloId - Protocol ID
     */
    async deleteForPartner(protocoloId: number): Promise<void> {
        await this.http.delete(`/protocolos/parceiros/${protocoloId}`);
    }
}
