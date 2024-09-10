import type { Word } from './word.ts';

export type Parser = {
	getWord(): Iterable<Word> | AsyncIterable<Word>;
	getMetadata(): ParsedMetadata;
};

export type ParsedData = Map<number, Word>;

export type ParsedMetadata = {
	readingTimeInMs: number;
};

export function defineParser<T = unknown>(def: (input: T) => Parser) {
	return def;
}
