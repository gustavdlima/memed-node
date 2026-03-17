import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpClient } from '../../../src/client/HttpClient';
import { PrescricaoResource } from '../../../src/resources/Prescricao';
import { MemedError } from '../../../src/errors/MemedError';

describe('PrescricaoResource', () => {
    let http: HttpClient;
    let prescricao: PrescricaoResource;

    const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.mock-token';

    const mockPrescritorResponse = {
        data: {
            type: 'usuarios',
            id: '1',
            attributes: {
                id: 1,
                external_id: 'med-123',
                nome: 'José',
                sobrenome: 'Silva',
                token: MOCK_TOKEN,
                status: 'Ativo',
            },
        },
    };

    const mockEmptyList = {
        data: [],
        links: { self: '' },
        meta: { total: 0 },
    };

    beforeEach(() => {
        http = new HttpClient('https://api.test.com/v1', 'key', 'secret');
        prescricao = new PrescricaoResource(http);
        vi.clearAllMocks();
    });

    describe('automatic token resolution', () => {
        it('should fetch a fresh token before every request', async () => {
            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPrescritorResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockEmptyList,
                });

            await prescricao.list({ prescritorId: 'med-123' });

            const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
            expect(calls).toHaveLength(2);
            expect(calls[0][0]).toContain('/sinapse-prescricao/usuarios/med-123');
            expect(calls[1][0]).toContain(`token=${MOCK_TOKEN}`);
        });

        it('should propagate MemedError when prescritor is not found', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 404,
                text: async () => JSON.stringify({ message: 'Recurso não encontrado.' }),
            });

            try {
                await prescricao.list({ prescritorId: 'inexistente' });
                expect.unreachable('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(MemedError);
                expect((error as MemedError).statusCode).toBe(404);
                expect((error as MemedError).message).toBe('Recurso não encontrado.');
            }
        });

        it('should propagate auth error when credentials are invalid', async () => {
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: false,
                status: 401,
                text: async () => JSON.stringify({ message: 'Não autorizado' }),
            });

            try {
                await prescricao.list({ prescritorId: 'med-123' });
                expect.unreachable('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(MemedError);
                expect((error as MemedError).isAuthError()).toBe(true);
            }
        });

        it('should resolve token using CPF as identifier', async () => {
            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPrescritorResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockEmptyList,
                });

            await prescricao.list({ prescritorId: '12345678900' });

            const tokenUrl: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
            expect(tokenUrl).toContain('/sinapse-prescricao/usuarios/12345678900');
        });

        it('should resolve token using registro+UF as identifier', async () => {
            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPrescritorResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockEmptyList,
                });

            await prescricao.list({ prescritorId: '54321SP' });

            const tokenUrl: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
            expect(tokenUrl).toContain('/sinapse-prescricao/usuarios/54321SP');
        });
    });

    describe('list', () => {
        it('should pass all filter params to the API', async () => {
            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPrescritorResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockEmptyList,
                });

            await prescricao.list({
                prescritorId: 'med-123',
                limit: 50,
                offset: 10,
                initialDate: '2026-01-01',
                finalDate: '2026-03-01',
                structuredDocuments: true,
            });

            const listUrl: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[1][0];
            expect(listUrl).toContain('page%5Blimit%5D=50');
            expect(listUrl).toContain('page%5Boffset%5D=10');
            expect(listUrl).toContain('initialDate=2026-01-01');
            expect(listUrl).toContain('finalDate=2026-03-01');
            expect(listUrl).toContain('structuredDocuments=true');
        });

        it('should return mapped attributes from list items', async () => {
            const mockPrescricoes = {
                data: [
                    {
                        type: 'prescricoes',
                        id: '1',
                        attributes: {
                            id: 1,
                            data: '2026-01-15',
                            horario: '10:00',
                            medicamentos: [{ id: 1, nome: 'Dipirona', posologia: '1x ao dia', quantidade: 1 }],
                            paciente: { id: 1, nome: 'Paciente Teste' },
                            status: 'ativa',
                            created_at: '2026-01-15',
                            updated_at: '2026-01-15',
                        },
                    },
                    {
                        type: 'prescricoes',
                        id: '2',
                        attributes: {
                            id: 2,
                            data: '2026-02-20',
                            horario: '14:00',
                            medicamentos: [],
                            paciente: { id: 2, nome: 'Outro Paciente' },
                            status: 'ativa',
                            created_at: '2026-02-20',
                            updated_at: '2026-02-20',
                        },
                    },
                ],
                links: { self: '' },
                meta: { total: 2 },
            };

            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPrescritorResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPrescricoes,
                });

            const result = await prescricao.list({ prescritorId: 'med-123' });

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(1);
            expect(result[0].medicamentos[0].nome).toBe('Dipirona');
            expect(result[1].paciente.nome).toBe('Outro Paciente');
        });
    });

    describe('searchIngredients', () => {
        it('should NOT resolve token (uses api-key/secret-key only)', async () => {
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: [{ id: 1, nome: 'Dipirona', slug: 'dipirona' }] }),
            });

            const result = await prescricao.searchIngredients({ terms: 'dipirona' });

            expect(fetch).toHaveBeenCalledTimes(1);
            const url: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
            expect(url).toContain('/drugs/ingredients');
            expect(url).not.toContain('/sinapse-prescricao/usuarios');
            expect(result[0].nome).toBe('Dipirona');
        });

        it('should pass optional search params', async () => {
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: [] }),
            });

            await prescricao.searchIngredients({
                terms: 'paracetamol',
                limit: 5,
                orderField: 'nome',
                orderSort: 'ASC',
            });

            const url: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
            expect(url).toContain('terms=paracetamol');
            expect(url).toContain('limit=5');
            expect(url).toContain('order%5Bfield%5D=nome');
            expect(url).toContain('order%5Bsort%5D=ASC');
        });
    });
});
