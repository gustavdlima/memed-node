/**
 * integration: test environment
 * production: prod environment
 */
export type Environment = 'integration' | 'production';

/**
 * memed client-side configuration
 */
export interface MemedConfig {
    apiKey: string;
    secretKey:string;
    environment: Environment;
    timeout?: number;
}

/**
 * API memed response structure
 */
export interface MemedResponse<T> {
    data: T;
    links?: {
        self: string;
    };
    meta?: {
        total?: number;
    }
}

/**
 * JSON:API structure
 */
export interface JsonApiRelationship<T = {id: number}> {
    data: T;
    links?: {
        self: string;
    };
}