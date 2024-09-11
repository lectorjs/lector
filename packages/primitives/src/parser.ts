import type { Word } from './word.ts';

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

export type ParserConfigFactory<T> = (input: T) => Parser;
export type ParserConfigFactoryAsync<T> = (input: T) => Promise<Parser>;
export type ParserConfigInput<T> = ParserConfigFactory<T> | ParserConfigFactoryAsync<T>;

/**
 * Create a `Parser` instance from a given configuration factory.
 *
 * @template T The input type that the parser will process.
 * @param config A factory function that takes an input of type `T` and returns a `Parser` instance.
 *
 * @returns A defined `Parser` instance.
 */
export function defineParser<T>(config: ParserConfigFactory<T>): ParserConfigFactory<T>;
export function defineParser<T>(config: ParserConfigFactoryAsync<T>): ParserConfigFactoryAsync<T>;
export function defineParser<T>(config: ParserConfigInput<T>) {
	return config;
}
