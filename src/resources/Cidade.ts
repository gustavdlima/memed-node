import { HttpClient } from '../client/HttpClient';
import {
    CidadeAttributes,
    CidadeFilterOptions,
    CidadeListResponse,
    CidadeListItem,
} from '../types/cidade.types';

/**
 * Resource to query Brazilian cities
 *
 * No authentication required. Used to get city IDs
 * for prescriber registration.
 */
export class CidadeResource {
    constructor(private readonly http: HttpClient) {}

    /**
     * List available cities
     *
     * @param filter - Optional filter by name and/or state (UF)
     */
    async list(filter?: CidadeFilterOptions): Promise<CidadeAttributes[]> {
        const params: Record<string, string | number | boolean> = {};

        if (filter?.q !== undefined) {
            params['filter[q]'] = filter.q;
        }

        if (filter?.uf !== undefined) {
            params['filter[uf]'] = filter.uf;
        }

        const response: CidadeListResponse = await this.http.get<CidadeListResponse>(
            '/cidades',
            params
        );

        return response.data.map((item: CidadeListItem): CidadeAttributes => item.attributes);
    }
}
