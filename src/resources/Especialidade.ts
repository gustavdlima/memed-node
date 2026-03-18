import { HttpClient } from '../client/HttpClient';
import {
    EspecialidadeAttributes,
    EspecialidadeFilterOptions,
    EspecialidadeListResponse,
    EspecialidadeListItem,
} from '../types/especialidade.types';

/**
 * Resource to query medical specialties
 *
 * No authentication required. Used to get specialty IDs
 * for prescriber registration.
 */
export class EspecialidadeResource {
    constructor(private readonly http: HttpClient) {}

    /**
     * List available specialties
     *
     * @param filter - Optional filter by name (e.g. "Generalista")
     */
    async list(filter?: EspecialidadeFilterOptions): Promise<EspecialidadeAttributes[]> {
        const params: Record<string, string | number | boolean> = {};

        if (filter?.q !== undefined) {
            params['filter[q]'] = filter.q;
        }

        const response: EspecialidadeListResponse = await this.http.get<EspecialidadeListResponse>(
            '/especialidades',
            params
        );

        return response.data.map((item: EspecialidadeListItem): EspecialidadeAttributes => item.attributes);
    }
}
