import { type Mocked, vi } from 'vitest';
import type { Mode } from '../../src/mode.ts';

export function createMockMode(): Mocked<Mode> {
    return {
        commands: {
            foo: {
                execute: vi.fn(),
            },
            bar: {
                execute: vi.fn(),
            },
            baz: {
                execute: vi.fn(),
            },
        },
        render: vi.fn().mockReturnValue('<span>foo</span>'),
        onWordParsed: vi.fn(),
        onParsedFinish: vi.fn(),
    };
}
