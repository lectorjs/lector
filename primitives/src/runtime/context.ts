import { createDefu } from 'defu';
import type { DeepPartial } from '../internal/types.ts';
import type { ParsedData, ParsedMetadata } from '../parser.ts';

/**
 * The lector base global context object.
 *
 * @template T The type of additional properties to include in the context.
 */
export type LectorContext<T extends Record<string, unknown> = Record<string, unknown>> = {
    parser: {
        data: ParsedData;
        metadata: ParsedMetadata;
        isParsing: boolean;
        isComplete: boolean;
    };
} & T;

/**
 * Returns the default lector global context values.
 */
export const defaultLectorContext = (): LectorContext => ({
    parser: {
        data: new Map(),
        metadata: {
            readingTimeInMs: 0,
        },
        isParsing: false,
        isComplete: false,
    },
});

const globalContext = new Map<symbol, unknown>();

type ContextUpdateOptions = {
    /**
     * Whether to notify subscribers of the updated context.
     *
     * @default true
     */
    shouldNotifySubscribers?: boolean;
};

/**
 * The context interface.
 *
 * @template T The type of the context state.
 */
export type Context<T extends Record<string, unknown>> = {
    /**
     * Retrieves the latest immutable state of the context.
     *
     * @throws An error if the context is not found in the global context map.
     *
     * @returns The latest state of the context as a read-only object.
     */
    getContext: () => Readonly<LectorContext<T>>;

    /**
     * Updates the current context state with the provided updater.
     *
     * @param updater The updater function that updates the context state.
     * @param options Optional options for context update.
     *
     * @throws An error if the context is not found in the global context map.
     */
    updateContext: (
        updater: (value: LectorContext<T>) => DeepPartial<LectorContext<T>>,
        options?: ContextUpdateOptions,
    ) => void;

    /**
     * Subscribes to the context state changes.
     *
     * @param subscriber The subscriber function that receives the updated context state.
     *
     * @returns A function that unsubscribes from the context state changes.
     */
    subscribeContext: (subscriber: (ctx: LectorContext<T>) => void) => () => void;

    /**
     * Destroys the context.
     */
    destroyContext: () => void;
};

/**
 * Creates a new context instance with the given key and initial value.
 *
 * @template T The type of the context state.
 *
 * @param key The symbol that uniquely identifies the context.
 * @param initialValue The initial value of the context.
 *
 * @returns A new merged context instance with the default lector global context state and the provided initial value.
 */
export function defineContext<T extends Record<string, unknown>>(key: symbol, initialValue: T): Context<T> {
    const subscribers = new Set<(ctx: LectorContext<T>) => void>();

    if (!globalContext.has(key)) {
        globalContext.set(key, {
            ...defaultLectorContext(),
            ...initialValue,
        });
    }

    const notifySubscribers = () => {
        for (const notifySubscriber of subscribers) {
            notifySubscriber(globalContext.get(key) as LectorContext<T>);
        }
    };

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

    return {
        getContext: () => {
            if (!globalContext.has(key)) {
                throw new Error(
                    `Context '${String(key.description ?? key)}' not found. It's possible that the context was destroyed.`,
                );
            }

            return new Proxy(globalContext.get(key) as LectorContext<T>, {
                get: (_target, prop) => {
                    const latestCtx = globalContext.get(key) as LectorContext<T>;
                    return latestCtx[prop as keyof T];
                },
                set: () => {
                    throw new Error('Modification is prohibited. The context is immutable.');
                },
                deleteProperty: () => {
                    throw new Error('Property deletion is prohibited. The context is immutable.');
                },
                defineProperty: () => {
                    throw new Error('Defining new properties is prohibited. The context is immutable.');
                },
            });
        },
        updateContext: (updater, { shouldNotifySubscribers = true } = {}) => {
            if (!globalContext.has(key)) {
                throw new Error(
                    `Context '${String(key.description ?? key)}' not found. It's possible that the context was destroyed.`,
                );
            }

            const currentContext = globalContext.get(key) as LectorContext<T>;
            const updatedContext = updater(currentContext);
            if (updatedContext && typeof updatedContext === 'object') {
                globalContext.set(key, mergeContext(updatedContext, currentContext));
            } else {
                globalContext.set(key, updatedContext);
            }

            if (shouldNotifySubscribers) {
                notifySubscribers();
            }
        },

        subscribeContext: (subscriber) => {
            subscribers.add(subscriber);
            return () => subscribers.delete(subscriber);
        },
        destroyContext: () => {
            globalContext.delete(key);
        },
    };
}

/**
 * Gets a map of all contexts, where the key is the unique symbol identifier and the value is the context value.
 *
 * @returns A map of all contexts.
 */
export function getAllContexts(): Map<symbol, unknown> {
    return globalContext;
}

/**
 * Destroys all contexts.
 */
export function destroyAllContexts(): void {
    globalContext.clear();
}
