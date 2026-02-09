import { describe, it, expect } from 'vitest';
import { MemedError } from '../../src/errors/MemedError';

describe('MemedError', () => {
    it('should create error with message', () => {
        const error = new MemedError('Algo deu errado');

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(MemedError);
        expect(error.message).toBe('Algo deu errado');
        expect(error.name).toBe('MemedError');
    });

    it('should store status code and response', () => {
        const response = { error: 'Invalid data' };
        const error = new MemedError('Erro de validação', 400, response);

        expect(error.statusCode).toBe(400);
        expect(error.response).toEqual(response);
    });

    it('should identify auth errors', () => {
        const error = new MemedError('Não autorizado', 401);

        expect(error.isAuthError()).toBe(true);
        expect(error.isValidationError()).toBe(false);
        expect(error.isServerError()).toBe(false);
    });

    it('should identify validation errors', () => {
        const error400 = new MemedError('Bad request', 400);
        const error422 = new MemedError('Unprocessable', 422);

        expect(error400.isValidationError()).toBe(true);
        expect(error422.isValidationError()).toBe(true);
    });

    it('should identify server errors', () => {
        const error500 = new MemedError('Internal error', 500);
        const error503 = new MemedError('Service unavailable', 503);

        expect(error500.isServerError()).toBe(true);
        expect(error503.isServerError()).toBe(true);
    });

    it('should convert to JSON', () => {
        const error = new MemedError('Test error', 400, { test: true });
        const json = error.toJSON();

        expect(json.name).toBe('MemedError');
        expect(json.message).toBe('Test error');
        expect(json.statusCode).toBe(400);
        expect(json.response).toEqual({ test: true });
        expect(json.timestamp).toBeDefined();
    });
});