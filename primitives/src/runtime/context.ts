import { createDefu } from 'defu';
import type { DeepPartial } from '../internal/types.ts';
import type { ParsedData, ParsedMetadata } from '../parser.ts';

const globalContext = new Map<symbol, unknown>();

/**
 * The lector global context object.
 *
 * @template T The type of additional properties to include in the context.
 */
export type GlobalContext<T = unknown> = {
    parser: {
        data: ParsedData;
        metadata: ParsedMetadata;
        isParsing: boolean;
        isComplete: boolean;
    };
} & T;

/**
 * Returns the default global context values.
 */
export const defaultGlobalContext = (): GlobalContext => ({
    parser: {
        data: new Map(),
        metadata: {
            readingTimeInMs: 0,
        },
        isParsing: false,
        isComplete: false,
    },
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
 * The lector global context class. Allows storing and retrieving state from the global context object.
 */
export class Context<T> {
    #key: symbol;

    /**
     * Retrieves the number of keys in the global context.
     */
    static get size(): number {
        return globalContext.size;
    }

    /**
     * Retrieves all the context values.
     */
    static getAll(): Map<symbol, unknown> {
        return globalContext;
    }

    /**
     * Destroys all the context values.
     */
    static destroyAll(): void {
        globalContext.clear();
    }

    constructor(key: symbol, initialValue: T) {
        this.#key = key;

        if (!globalContext.has(key)) {
            globalContext.set(key, initialValue);
        }
    }

    /**
     * Checks whether a given key exists in the global context.
     */
    has(): boolean {
        return globalContext.has(this.#key);
    }

    /**
     * Retrieves the value associated with the current context key.
     */
    get(): Readonly<T> {
        if (!globalContext.has(this.#key)) {
            throw new Error(`Context '${String(this.#key)}' not found. It's possible that the context was destroyed.`);
        }

        return Object.freeze(globalContext.get(this.#key)) as T;
    }

    /**
     * Updates the value associated with the current context key.
     *
     * @param updater A function that takes the current context value and returns the updated value.
     */
    update(updater: (value: T) => DeepPartial<T>): void {
        const currentContext = globalContext.get(this.#key) as T;
        if (!currentContext) {
            throw new Error(`Context '${String(this.#key)}' not found. It's possible that the context was destroyed.`);
        }

        const updatedContext = updater(currentContext);

        if (updatedContext && typeof updatedContext === 'object') {
            globalContext.set(this.#key, mergeContext(updatedContext, currentContext));
        } else {
            globalContext.set(this.#key, updatedContext);
        }
    }

    /**
     * Removes the value associated with the current context key.
     */
    destroy(): void {
        globalContext.delete(this.#key);
    }
}
