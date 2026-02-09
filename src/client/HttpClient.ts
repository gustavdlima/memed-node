import { MemedError} from "../errors/MemedError";
import { clearTimeout } from "node:timers";

/**
 * HTTP client
 * Abstract Fetch calls and automatically handle errors
 */
export class HttpClient {
    constructor (
        private readonly baseUrl: string,
        private readonly apiKey: string,
        private readonly secretKey: string,
        private readonly timeout : number = 30000
    ) {}

    private buildUrl(path: string, params?: Record<string, unknown>): string {
        const cleanPath = path.startsWith("/") ? path.slice(1) : path;
        const url = new URL(cleanPath, this.baseUrl);

        url.searchParams.append("api-key", this.apiKey);
        url.searchParams.append('secret-key', this.secretKey);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            })
        }

        return url.toString();
    }

    /**
     * Start an HTTP requisition
     */
    private async request<T>(
        method: string,
        path: string,
        body?: unknown,
        params?: Record<string, unknown>,
    ): Promise<T> {
        const url = this.buildUrl(path, params);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.api+json',
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                await this.handleErrorResponse(response);
            }

            return (await response.json()) as T;
        } catch (error) {
            if (error instanceof MemedError) {
                throw error;
            }

            if (error instanceof Error && error.name === 'AbortError') {
                throw new MemedError(
                `Timeout: requisição excedeu ${this.timeout}ms`,
                undefined,
                error
                );
            }

            throw new MemedError(
                'Erro de conexão com a API da Memed',
                undefined,
                error
            );
        }
    }

    private async handleErrorResponse(response: Response): Promise<never> {
        let errorData: unknown;

        try {
            const text = await response.text();

            try {
                errorData = JSON.parse(text);
            } catch {
                errorData = text;
            }
        } catch {
            errorData = {};
        }

        const message = this.getErrorMessage(response.status, errorData);

        throw new MemedError(message, response.status, errorData);
    }

    private getErrorMessage(status: number, data: unknown): string {
        if (data && typeof data === 'object' && 'message' in data) {
            return String(data.message);
        }

        switch (status) {
            case 400:
                return 'Requisição inválida. Verifique os dados enviados.';
            case 401:
                return 'Não autorizado. Verifique suas credenciais (API Key e Secret Key).';
            case 403:
                return 'Acesso negado. Você não tem permissão para este recurso.';
            case 404:
                return 'Recurso não encontrado.';
            case 422:
                return 'Dados inválidos. Verifique os campos obrigatórios.';
            case 429:
                return 'Muitas requisições. Aguarde antes de tentar novamente.';
            case 500:
                return 'Erro interno do servidor Memed.';
            case 503:
                return 'Serviço temporariamente indisponível.';
            default:
                return `Erro na requisição (status ${status})`;
        }
    }

    async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
        return this.request<T>('GET', path, undefined, params);
    }

    async post<T>(
        path: string,
        body: unknown,
        params?: Record<string, unknown>
    ): Promise<T> {
        return this.request<T>('POST', path, body, params);
    }

    async patch<T>(
        path: string,
        body: unknown,
        params?: Record<string, unknown>
    ): Promise<T> {
        return this.request<T>('PATCH', path, body, params);
    }

    async delete<T>(path: string, params?: Record<string, unknown>): Promise<T> {
        return this.request<T>('DELETE', path, undefined, params);
    }
}