import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpClient } from '../../../src/client/HttpClient';
import { ProtocoloResource } from '../../../src/resources/Protocolo';
import { MemedError } from '../../../src/errors/MemedError';

describe('ProtocoloResource', () => {
    let http: HttpClient;
    let protocolo: ProtocoloResource;

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

    const mockProtocoloResponse = {
        data: {
            type: 'protocolos',
            id: '10',
            attributes: {
                id: 10,
                nome: 'Gripe comum',
                medicamentos: [
                    { id: 'a1046503030027106379', nome: 'Dipirona 500mg', posologia: '1 comprimido 6/6h', quantidade: 20 },
                ],
                created_at: '2026-03-01',
                updated_at: '2026-03-01',
            },
        },
    };

    beforeEach(() => {
        http = new HttpClient('https://api.test.com/v1', 'key', 'secret');
        protocolo = new ProtocoloResource(http);
        vi.clearAllMocks();
    });

    describe('payload with mixed item types (medicamento, exame, texto livre)', () => {
        it('should send medications, exams, and free text in the same payload', async () => {
            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPrescritorResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockProtocoloResponse,
                });

            await protocolo.create('med-123', {
                nome: 'Protocolo misto',
                medicamentos: [
                    // Medicamento (com id tipo 'a...')
                    { id: 'a1046503030027106379', nome: 'Dipirona 500mg', posologia: '1 comprimido 6/6h', quantidade: 20 },
                    // Exame (com id tipo 'e...')
                    { id: 'e10', nome: 'Hemograma', posologia: 'Jejum de 8 a 10 horas' },
                    // Texto livre / documento (sem id)
                    { nome: 'Atestado', posologia: '<p>ATESTADO<br>Paciente sob meus cuidados...</p>' },
                ],
            });

            const body = JSON.parse((fetch as ReturnType<typeof vi.fn>).mock.calls[1][1].body);
            const meds = body.data.attributes.medicamentos;

            expect(meds).toHaveLength(3);

            // Medicamento — has id, all fields
            expect(meds[0].id).toBe('a1046503030027106379');
            expect(meds[0].quantidade).toBe(20);

            // Exame — has id, minimal fields
            expect(meds[1].id).toBe('e10');
            expect(meds[1].nome).toBe('Hemograma');

            // Texto livre — no id
            expect(meds[2].id).toBeUndefined();
            expect(meds[2].nome).toBe('Atestado');
            expect(meds[2].posologia).toContain('ATESTADO');
        });
    });

    describe('prescriber-level vs partner-level auth', () => {
        it('should resolve token for prescriber operations', async () => {
            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPrescritorResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockProtocoloResponse,
                });

            await protocolo.create('med-123', {
                nome: 'Protocolo',
                medicamentos: [{ nome: 'Med', posologia: '1x/dia' }],
            });

            const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
            expect(calls).toHaveLength(2);
            expect(calls[0][0]).toContain('/sinapse-prescricao/usuarios/med-123');
            expect(calls[1][0]).toContain(`token=${MOCK_TOKEN}`);
        });

        it('should NOT resolve token for partner operations', async () => {
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockProtocoloResponse,
            });

            await protocolo.createForPartner({
                nome: 'Protocolo institucional',
                medicamentos: [{ id: 'a123', nome: 'Med A', posologia: '1x/dia' }],
            });

            expect(fetch).toHaveBeenCalledTimes(1);
            const url: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
            expect(url).toContain('/protocolos/parceiros');
            expect(url).not.toContain('token=');
        });
    });

    describe('error handling', () => {
        it('should propagate error when prescritor not found', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 404,
                text: async () => JSON.stringify({ message: 'Recurso não encontrado.' }),
            });

            try {
                await protocolo.list('inexistente');
                expect.unreachable('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(MemedError);
                expect((error as MemedError).statusCode).toBe(404);
            }
        });
    });

    describe('endpoint routing', () => {
        it('should use /protocolos/multiplos for createMultiple', async () => {
            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPrescritorResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockProtocoloResponse,
                });

            await protocolo.createMultiple('med-123', {
                nome: 'Protocolo múltiplo',
                medicamentos: [{ nome: 'Med A', posologia: '1x/dia' }],
            });

            const url: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[1][0];
            expect(url).toContain('/protocolos/multiplos');
        });

        it('should use /protocolos/parceiros/{id} for getForPartner', async () => {
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockProtocoloResponse,
            });

            await protocolo.getForPartner(10);

            const url: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
            expect(url).toContain('/protocolos/parceiros/10');
        });
    });
});
