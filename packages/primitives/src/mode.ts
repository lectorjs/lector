import type { Command } from './command.ts';
import type { ParsedData, ParsedMetadata } from './parser.ts';
import type { Word } from './word.ts';

export type ModeHooks = {
	onWordParsed?: (data: ParsedData, word: Word) => void;
	onParsingFinished?: (metadata: ParsedMetadata) => void;
};

export type Mode = {
	commands?: Record<string, Command>;
	setup?: () => void;
	render: () => string;
} & ModeHooks;

export function defineMode<T extends Mode>(def: T): T {
	return def;
}
