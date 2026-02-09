import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpClient } from '../../../src/client/HttpClient';
import { MemedError } from '../../../src/errors/MemedError';

describe('HttpClient', () => {
    let client: HttpClient;
    const BASE_URL = 'https://api.test.com/v1';
    const API_KEY = 'test-key';
    const SECRET_KEY = 'test-secret';

    beforeEach(() => {
        client = new HttpClient(BASE_URL, API_KEY, SECRET_KEY);
        vi.clearAllMocks();
    });

    describe('buildUrl', () => {
        it('should build URL with credentials', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ data: 'test' }),
            });

            await client.get('/test');

            expect(fetch).toHaveBeenCalled();
            // @ts-ignore
            const callUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
            expect(callUrl).toContain('api-key=test-key');
            expect(callUrl).toContain('secret-key=test-secret');
        });

        it('should add query params', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ data: 'test' }),
            });

            await client.get('/test', { page: 1, limit: 10 });

            // @ts-ignore
            const callUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
            expect(callUrl).toContain('page=1');
            expect(callUrl).toContain('limit=10');
        });
    });

    describe('error handling', () => {
        it('should throw MemedError on 401', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 401,
                json: async () => ({ message: 'Não Autorizado' }),
            });

            await expect(client.get('/test')).rejects.toThrow(MemedError);
            await expect(client.get('/test')).rejects.toThrow('Não Autorizado');
        });

        it('should throw MemedError on network error', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            await expect(client.get('/test')).rejects.toThrow(MemedError);
            await expect(client.get('/test')).rejects.toThrow(
                'Erro de conexão com a API da Memed'
            );
        });
    });

    describe('HTTP methods', () => {
        it('should make GET request', async () => {
            const mockData = { data: { id: 1, name: 'Test' } };
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockData,
            });

            const result = await client.get('/users/1');

            expect(result).toEqual(mockData);
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/users/1'),
                expect.objectContaining({ method: 'GET' })
            );
        });

        it('should make POST request with body', async () => {
            const mockData = { data: { id: 1 } };
            const body = { name: 'New User' };

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockData,
            });

            const result = await client.post('/users', body);

            expect(result).toEqual(mockData);
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(body),
                })
            );
        });
    });
});