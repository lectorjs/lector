import type { Command } from './command.ts';
import type { ParsedData, ParsedMetadata } from './parser.ts';
import type { Word } from './word.ts';

export interface Mode {
	commands?: Record<string, Command>;
	render?(): string;
	onParse?: (data: ParsedData, word: Word) => void;
	onFinish?: (metadata: ParsedMetadata) => void;
}

export type ModeConfigFactory<T extends Mode> = () => T;
export type ModeConfigFactoryAsync<T extends Mode> = (input: T) => Promise<T>;
export type ModeConfigInput<T extends Mode> = T | Promise<T> | ModeConfigFactory<T> | ModeConfigFactoryAsync<T>;

/**
 * Create a `Mode` instance from a given configuration object or factory.
 *
 * @template T The type of the mode. Since the mode needs to be inferred from the `T` type for commands to be type safe.
 * @param config An object or factory function that takes an input of type `T` and returns a `Mode` instance.
 *
 * @returns A defined `Mode` instance.
 */
export function defineMode<T extends Mode>(config: T): T;
export function defineMode<T extends Mode>(config: Promise<T>): Promise<T>;
export function defineMode<T extends Mode>(config: ModeConfigFactory<T>): ModeConfigFactory<T>;
export function defineMode<T extends Mode>(config: ModeConfigFactoryAsync<T>): ModeConfigFactoryAsync<T>;
export function defineMode<T extends Mode>(config: ModeConfigInput<T>) {
	return config;
}
