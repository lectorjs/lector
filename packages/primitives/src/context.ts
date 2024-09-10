import { defu } from 'defu';
import type { ParsedData, ParsedMetadata } from './parser.ts';
import type { DeepPartial } from './types.ts';

export type LectorContext<T = Record<string, unknown>> = Readonly<{
	parser: {
		data: ParsedData;
		metadata: ParsedMetadata;
		isComplete: boolean;
	};
}> &
	Readonly<T>;

export const defaultLectorContext = <T = Record<string, unknown>>(extraDefaults: T = {} as T): LectorContext<T> => ({
	parser: {
		data: new Map(),
		metadata: {
			readingTimeInMs: 0,
		},
		isComplete: false,
	},
	...extraDefaults,
});

type ContextDataStore = Record<symbol, unknown>;

declare global {
	var __lectorContext: ContextDataStore | undefined;
}

export function createContext<T extends ContextDataStore>(mode: symbol, initializer: () => T) {
	if (!mode || typeof mode !== 'symbol') {
		throw new Error('A valid reading mode must be provided in order to create a Lector context.');
	}

	globalThis.__lectorContext = globalThis.__lectorContext || {};

	if (!globalThis.__lectorContext[mode]) {
		globalThis.__lectorContext[mode] = initializer();
	}
}

export function getContext<T extends ContextDataStore>(mode: symbol): T {
	if (!globalThis.__lectorContext) {
		throw new Error(
			`No Lector context has been created for the "${String(mode)}" reading mode. Make sure to call createContext(mode) first.`,
		);
	}

	return globalThis.__lectorContext[mode] as T;
}

export function updateContext<T extends ContextDataStore>(mode: symbol, updater: (context: T) => DeepPartial<T>) {
	if (!globalThis.__lectorContext) {
		throw new Error(
			`No Lector context has been created for the "${String(mode)}" reading mode. Make sure to call createContext(mode) first.`,
		);
	}

	const ctx = getContext<T>(mode);
	const updatedCtx = updater(ctx);

	globalThis.__lectorContext[mode] = defu(updatedCtx, ctx);
}

export function destroyContext(mode: symbol) {
	if (globalThis.__lectorContext) {
		delete globalThis.__lectorContext[mode];
	}
}

export function destroyAllContexts() {
	if (globalThis.__lectorContext) {
		globalThis.__lectorContext = undefined;
	}
}
