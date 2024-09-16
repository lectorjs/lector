import type { Word } from "./word.ts";

/**
 * Represents a text parser that can provide words and metadata from a text input.
 */
export interface Parser {
    /**
     * Retrieves words from the parser.
     * @returns An iterable or async iterable of words.
     */
    getWord(): Iterable<Word> | AsyncIterable<Word>;

    /**
     * Retrieves metadata about the parsing operation.
     * @returns Metadata object containing parsing details.
     */
    getMetadata(): ParsedMetadata;
}

/**
 * Represents parsed data where the key is a unique identifier and the value is a word.
 */
export type ParsedData = Map<number, Word>;

/**
 * Metadata extracted from a parsing operation.
 *
 * @template T The type of the metadata object.
 */
export type ParsedMetadata<T = Record<string, unknown>> = T;
