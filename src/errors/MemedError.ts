/**
 * API Memed Custom errors
 */
export class MemedError extends Error {

    public readonly statusCode?: number;
    public readonly response?: unknown;
    public readonly timestamp: Date;

    constructor(message: string, statusCode?: number, response?: unknown) {
        super(message);

        this.name = 'MemedError';

        this.statusCode = statusCode;
        this.response = response;
        this.timestamp = new Date();

        Object.setPrototypeOf(this, MemedError.prototype);
    }

    isAuthError(): boolean {
        return this.statusCode === 401;
    }

    isValidationError(): boolean {
        return this.statusCode === 400 || this.statusCode === 422;
    }

    isServerError(): boolean {
        return this.statusCode !== undefined && this.statusCode >=500;
    }

    toJSON(): {
        name: string;
        message: string;
        statusCode: number | undefined;
        timestamp: string;
        response: unknown;
    } {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            timestamp: this.timestamp.toISOString(),
            response: this.response,
        }
    }
}