import { HttpClient } from './HttpClient';
import { MemedConfig, Environment } from '../types/common.types';
import { PrescritorResource } from '../resources/Prescritor';

/**
 * Base URls for each environment
 */
const BASE_URLS: Record<Environment, string> = {
    integration: 'https://integrations.api.memed.com.br/v1',
    production: 'https://api.memed.com.br/v1',
}

/**
 * Main client
 *
 */
export class MemedClient {
    private readonly httpClient: HttpClient;

    public readonly prescritor: PrescritorResource;

    // TODO: Adicionar outros resources
    // public readonly prescricao: PrescricaoResource;
    // public readonly protocolo: ProtocoloResource;
    // public readonly impressao: ImpressaoResource;

    constructor(config: MemedConfig) {
        this.validateConfig(config);

        const {
            apiKey,
            secretKey,
            environment = 'integration',
            timeout = 30000,
        } = config;

        const baseUrl = BASE_URLS[environment];
        this.httpClient = new HttpClient(baseUrl, apiKey, secretKey, timeout);
        this.prescritor = new PrescritorResource(this.httpClient);
    }

    private validateConfig(config: MemedConfig) {
        if (!config.apiKey || config.apiKey.trim() === '') {
            throw new Error('MemedClient: apiKey é obrigatório')
        }

        if (!config.secretKey || config.secretKey.trim() === '') {
            throw new Error('MemedClient: secretKey é obrigatório')
        }

        if (config.environment && !['integration', 'production'].includes(config.environment)) {
            throw new Error(
                'MemedClient: environment deve ser "integration" ou "production"'
            );
        }

        if (config.timeout !== undefined && config.timeout <= 0) {
            throw new Error('MemedClient: timeout deve ser maior que 0');
        }
    }

    public getInfo(): {
        environment: Environment;
        baseUrl: string;
    } {
        const environment = (Object.keys(BASE_URLS) as Environment[]).find(
            (env) => BASE_URLS[env] === (this.httpClient as any).baseUrl)!;

        return {
            environment,
            baseUrl: BASE_URLS[environment]
        };
    }
}