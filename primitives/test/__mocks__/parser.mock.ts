import { type Mocked, vi } from 'vitest';
import type { Parser } from '../../src/parser.ts';
import { tokenize } from '../../src/tokenizer.ts';

export function createMockParser(text: string): Mocked<Parser> {
    const words = tokenize(text);

    return {
        getWord: vi.fn(function* () {
            for (const word of words) {
                yield {
                    value: word,
                    insights: {
                        difficulty: 1,
                    },
                };
            }
        }),
        getMetadata: vi.fn().mockResolvedValue({
            foo: 'bar',
            baz: 'qux',
        }),
    };
}
