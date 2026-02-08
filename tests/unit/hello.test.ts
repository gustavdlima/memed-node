import { describe, it, expect } from 'vitest';
import { hello } from '../../src/index';

describe('hello', () => {
    it('should return greeting message', () => {
        const result = hello();
        expect(result).toBe('Hello from memed-node!');
    });

    it('should be a string', () => {
        const result = hello();
        expect(typeof result).toBe('string');
    });
});