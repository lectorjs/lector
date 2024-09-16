import { type Mocked, vi } from "vitest";
import type { Parser } from "../../src/parser.ts";

export function createMockParser(words: string[]): Mocked<Parser> {
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
            foo: "bar",
            baz: "qux",
        }),
    };
}
