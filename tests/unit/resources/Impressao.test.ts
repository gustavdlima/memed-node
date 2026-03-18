import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpClient } from '../../../src/client/HttpClient';
import { ImpressaoResource } from '../../../src/resources/Impressao';
import { MemedError } from '../../../src/errors/MemedError';

describe('ImpressaoResource', () => {
    let http: HttpClient;
    let impressao: ImpressaoResource;

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

    beforeEach(() => {
        http = new HttpClient('https://api.test.com/v1', 'key', 'secret');
        impressao = new ImpressaoResource(http);
        vi.clearAllMocks();
    });

    describe('configure', () => {
        it('should send payload with type configuracoes-prescricao', async () => {
            const mockResponse = {
                data: {
                    type: 'configuracoes-prescricao',
                    id: '1',
                    attributes: {
                        medicos_id: 123456,
                        indice: 1,
                        fonte: 'Helvetica',
                        tamanho_fonte: 14,
                    },
                },
            };

            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPrescritorResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockResponse,
                });

            await impressao.configure('med-123', {
                medicos_id: 123456,
                indice: 1,
                fonte: 'Helvetica',
                tamanho_fonte: 14,
            });

            const body = JSON.parse((fetch as ReturnType<typeof vi.fn>).mock.calls[1][1].body);
            expect(body.data.type).toBe('configuracoes-prescricao');
            expect(body.data.attributes.medicos_id).toBe(123456);
            expect(body.data.attributes.indice).toBe(1);
        });

        it('should preserve boolean false values in special control flags', async () => {
            const mockResponse = {
                data: {
                    type: 'configuracoes-prescricao',
                    id: '1',
                    attributes: { medicos_id: 123456, indice: 1 },
                },
            };

            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPrescritorResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockResponse,
                });

            await impressao.configure('med-123', {
                medicos_id: 123456,
                indice: 1,
                imprimir_controle_especial: false,
                imprimir_controle_especial_antibioticos: true,
                imprimir_controle_especial_c4: false,
                imprimir_lme: false,
            });

            const body = JSON.parse((fetch as ReturnType<typeof vi.fn>).mock.calls[1][1].body);
            expect(body.data.attributes.imprimir_controle_especial).toBe(false);
            expect(body.data.attributes.imprimir_controle_especial_antibioticos).toBe(true);
            expect(body.data.attributes.imprimir_controle_especial_c4).toBe(false);
        });
    });

    describe('uploadTemplate', () => {
        it('should build FormData with template field containing the PDF blob', async () => {
            const mockUploadResponse = {
                data: {
                    type: 'configuracoes-prescricao',
                    id: '1',
                    attributes: {
                        header_image: 'parceiros/templates/header.jpeg',
                        footer_image: 'parceiros/templates/footer.jpeg',
                    },
                },
            };

            let capturedFormData: FormData | undefined;

            vi.spyOn(http, 'postFormData').mockImplementationOnce(
                async (_path: string, formData: FormData) => {
                    capturedFormData = formData;
                    return mockUploadResponse;
                }
            );

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockPrescritorResponse,
            });

            const pdfBlob: Blob = new Blob(['pdf-content'], { type: 'application/pdf' });
            const result = await impressao.uploadTemplate('med-123', pdfBlob, 'receituario.pdf');

            // Verify FormData contains 'template' field
            expect(capturedFormData).toBeDefined();
            const templateFile = capturedFormData!.get('template');
            expect(templateFile).toBeInstanceOf(Blob);

            // Verify returned paths
            expect(result.headerImage).toBe('parceiros/templates/header.jpeg');
            expect(result.footerImage).toBe('parceiros/templates/footer.jpeg');
        });

        it('should return only header when footer is not found in PDF', async () => {
            const mockUploadResponse = {
                data: {
                    type: 'configuracoes-prescricao',
                    id: '1',
                    attributes: {
                        header_image: 'parceiros/templates/header.jpeg',
                    },
                },
            };

            vi.spyOn(http, 'postFormData').mockResolvedValueOnce(mockUploadResponse);

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockPrescritorResponse,
            });

            const pdfBlob: Blob = new Blob(['pdf-content'], { type: 'application/pdf' });
            const result = await impressao.uploadTemplate('med-123', pdfBlob);

            expect(result.headerImage).toBe('parceiros/templates/header.jpeg');
            expect(result.footerImage).toBeUndefined();
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
                await impressao.get('inexistente');
                expect.unreachable('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(MemedError);
                expect((error as MemedError).statusCode).toBe(404);
            }
        });
    });
});
