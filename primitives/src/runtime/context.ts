import { createDefu } from 'defu';
import type { DeepPartial } from '../internal/types.ts';
import type { ParsedData, ParsedMetadata } from '../parser.ts';

let __lector: {
    context: Map<symbol, unknown>;
};

/**
 * The lector global context object.
 *
 * @template T The type of additional properties to include in the context.
 */
export type Context<T> = {
    parser: {
        data: ParsedData;
        metadata: ParsedMetadata;
        isParsing: boolean;
        isComplete: boolean;
    };
} & T;

/**
 * Creates a new context object by merging the default context values with the provided additional properties.
 *
 * @template T The type of additional properties to include in the context.
 * @param extraDefaults Additional properties to add to the context.
 *
 * @returns A new `Context` object containing the default context values and the additional properties.
 */
export const initializeContext = <T>(extraDefaults: T): Context<T> => ({
    parser: {
        data: new Map(),
        metadata: {
            readingTimeInMs: 0,
        },
        isParsing: false,
        isComplete: false,
    },
    ...extraDefaults,
});

const mergeContext = createDefu((obj, key, value) => {
    // Don't merge arrays
    if (Array.isArray(value)) {
        obj[key] = value;
        return true;
    }

    // Don't skip nullish values (doesn't work - see https://github.com/unjs/defu/issues/95)
    if (value === undefined || value === null) {
        obj[key] = value;
        return true;
    }
});

/**
 * Checks whether a given key exists in the lector context.
 *
 * @param key The context key to check for existence.
 *
 * @returns `true` if the key exists, otherwise `false`.
 */
export function hasContext(key: symbol): boolean {
    return getOrInitContext().has(key);
}

/**
 * Retrieves the value associated with a given context key.
 *
 * @template T The expected type of the context value.
 * @param key The key of the context value to retrieve.
 *
 * @returns A read-only copy of the context value associated with the given key.
 */
export function getContext<T>(key: symbol): Readonly<T> {
    return Object.freeze(getOrInitContext().get(key)) as T;
}

/**
 * Retrieves all context entries.
 *
 * @returns A read-only copy of all context entries.
 */
export function getAllContexts(): ReadonlyMap<symbol, unknown> {
    return Object.freeze(getOrInitContext());
}

/**
 * Creates a new context value associated with the given key. If the key already exists, it will be overwritten.
 *
 * @template T The type of the context value.
 * @param key The key of the context value to store.
 * @param value The context value to store.
 */
export function createContext<T>(key: symbol, value: T): void {
    getOrInitContext().set(key, value);
}

/**
 * Updates an existing context entry with the given updater function.
 *
 * @template T The type of the context value.
 * @param key The key of the context value to update.
 * @param updater A function that updates the context value.
 *
 * @throws Error if the context value is not found.
 */
export function updateContext<T>(key: symbol, updater: (context: T) => DeepPartial<T>): void {
    const context = getOrInitContext().get(key) as T | undefined;
    if (!context) {
        throw new Error(`Context '${String(key)}' not found. Make sure to call createContext() first.`);
    }

    const updatedContext = updater(context);

    if (updatedContext && typeof updatedContext === 'object') {
        getOrInitContext().set(key, mergeContext(updatedContext, context));
    } else {
        getOrInitContext().set(key, updatedContext);
    }
}

/**
 * Delete the context entry associated with the given key.
 *
 * @param key The key of the context entry to delete.
 */
export function destroyContext(key: symbol): void {
    getOrInitContext().delete(key);
}

/**
 * Clears all context entries.
 */
export function destroyAllContexts(): void {
    getOrInitContext().clear();
}

/**
 * Returns or initializes the lector global context object.
 */
function getOrInitContext() {
    __lector ??= { context: new Map() };
    return __lector.context;
}
