import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    type Context,
    defaultLectorContext,
    defineContext,
    destroyAllContexts,
    getAllContexts,
} from '../../src/runtime/context.ts';

type MockContextState = {
    foo: number;
    bar: string;
    baz: boolean;
};

describe('context', () => {
    let context: Context<MockContextState>;

    beforeEach(() => {
        context = defineContext<MockContextState>(Symbol('mockContext'));

        context.create({
            foo: 10,
            bar: 'hello',
            baz: true,
        });
    });

    afterEach(() => {
        context.destroy();
    });

    describe('defineContext', () => {
        it('creates a new lector context with default values', () => {
            expect(context.get()).toEqual({
                ...defaultLectorContext(),
                foo: 10,
                bar: 'hello',
                baz: true,
            });
        });

        it.each([
            [Symbol('context1'), 100],
            [Symbol('context2'), 200],
            [Symbol('context3'), 300],
        ])('creates a new context for %s with value %d', (key, value) => {
            const ctx = defineContext<{ foo: number }>(key);
            ctx.create({ foo: value });
            expect(ctx.get()).toEqual(expect.objectContaining({ foo: value }));
        });
    });

    describe('getAllContexts', () => {
        beforeEach(() => {
            destroyAllContexts();

            for (let i = 0; i < 10; i++) {
                const key = Symbol(`foo${i}`);
                const value = i;
                const ctx = defineContext<{ foo: number }>(key);
                ctx.create({ foo: value });
            }
        });

        it('retrieves all contexts', () => {
            const allContexts = getAllContexts();
            expect(allContexts).not.toBeFalsy();
            expect(allContexts.size).toBe(10);
        });
    });

    describe('destroyAllContexts', () => {
        beforeEach(() => {
            destroyAllContexts();
        });

        it('destroys all contexts', () => {
            for (let i = 0; i < 10; i++) {
                const key = Symbol(`foo${i}`);
                const value = i;
                const ctx = defineContext<{ foo: number }>(key);
                ctx.create({ foo: value });
            }

            expect(getAllContexts().size).toBe(10);
            destroyAllContexts();
            expect(getAllContexts().size).toBe(0);
        });
    });

    describe('create', () => {
        beforeEach(() => {
            destroyAllContexts();
        });

        it('creates a new context with default values', () => {
            context.create({
                foo: 10,
                bar: 'hello',
                baz: true,
            });

            expect(context.get()).toEqual({
                ...defaultLectorContext(),
                foo: 10,
                bar: 'hello',
                baz: true,
            });
        });
    });

    describe('get', () => {
        it('throws an error when retrieving non-existent context', () => {
            context.destroy();
            expect(() => context.get()).toThrowError();
        });

        it('retrieves the current context', () => {
            expect(context.get()).toEqual(expect.objectContaining({ foo: 10 }));
        });

        it('ensures immutability of context values', () => {
            const ctx = context.get();

            expect(() => {
                // Attempts to modify the readonly context should throw an error
                // @ts-expect-error
                ctx.foo = 20;
            }).toThrowError();

            expect(ctx.foo).toBe(10);
        });

        it('retrieves the latest context value without having to call getContext every time', () => {
            const ctx = context.get();

            expect(ctx).toEqual(expect.objectContaining({ foo: 10 }));
            context.update(() => ({ foo: 20 }));
            expect(ctx).toEqual(expect.objectContaining({ foo: 20 }));
        });
    });

    describe('update', () => {
        it('throws an error when updating non-existent context', () => {
            context.destroy();
            expect(() => context.update(() => ({ foo: 20 }))).toThrowError();
        });

        it('updates an existing context', () => {
            context.update(() => ({ foo: 20 }));
            expect(context.get()).toEqual(expect.objectContaining({ foo: 20 }));
        });

        it('passes the current context value to the updater function', () => {
            context.update((ctx) => {
                expect(ctx).toEqual(expect.objectContaining({ foo: 10 }));
                return { foo: 20 };
            });
        });

        it('updates nested properties of complex objects', () => {
            const testKey = Symbol('foo');
            const initialObject = {
                a: 1,
                b: {
                    c: 2,
                    d: {
                        e: 3,
                    },
                },
            };
            const updateObject = {
                a: 2,
                b: {
                    c: 3,
                    d: {
                        e: 4,
                    },
                },
            };

            const ctx = defineContext(testKey);

            ctx.create(initialObject);
            ctx.update(() => updateObject);
            expect(ctx.get()).toEqual(expect.objectContaining(updateObject));
        });

        it('replaces arrays in complex objects', () => {
            const testKey = Symbol('foo');
            const initialObject = {
                items: [1, 2, 3],
                nested: {
                    moreItems: ['a', 'b', 'c'],
                },
            };

            const updateObject = {
                items: [4, 5],
                nested: {
                    moreItems: ['d', 'e'],
                },
            };

            const ctx = defineContext(testKey);

            ctx.create(initialObject);
            ctx.update(() => updateObject);
            expect(ctx.get()).toEqual(expect.objectContaining(updateObject));
        });

        // biome-ignore lint/suspicious/noSkippedTests: // TODO: https://github.com/unjs/defu/issues/95
        it.skip('handles updating with undefined values', () => {
            const testKey = Symbol('foo');
            const initialObject = { a: 1, b: 2, c: 3 };

            const ctx = defineContext(testKey);

            ctx.create(initialObject);
            ctx.update(() => ({ b: undefined, d: 4 }));
            expect(ctx.get()).toEqual({ a: 1, b: undefined, c: 3, d: 4 });
        });

        it('preserves functions after update', () => {
            const testKey = Symbol('foo');
            const initialObject = {
                value: 10,
                double: function () {
                    return this.value * 2;
                },
            };

            const ctx = defineContext<typeof initialObject>(testKey);

            ctx.create(initialObject);
            ctx.update(() => ({ value: 20 }));

            expect(ctx.get().value).toBe(20);
            expect(ctx.get().double()).toBe(40);
        });

        it('preserves RegExp instances after update', () => {
            const testKey = Symbol('regexpTest');
            const initialObject = {
                foo: /foo/g,
            };

            const ctx = defineContext<typeof initialObject>(testKey);

            ctx.create(initialObject);
            ctx.update((ctx) => {
                ctx.foo.lastIndex = 0;
                return ctx;
            });

            expect(ctx.get().foo.lastIndex).toBe(0);
        });

        it('preserves Map instances after update', () => {
            const testKey = Symbol('mapTest');
            const initialObject = {
                foo: new Map([
                    ['key1', 1],
                    ['key2', 2],
                ]),
            };

            const ctx = defineContext<typeof initialObject>(testKey);

            ctx.create(initialObject);
            ctx.update((ctx) => {
                ctx.foo.set('key3', 3);
                return ctx;
            });

            expect(ctx.get().foo.size).toBe(3);
            expect(ctx.get().foo.get('key1')).toBe(1);
            expect(ctx.get().foo.get('key2')).toBe(2);
            expect(ctx.get().foo.get('key3')).toBe(3);
        });

        it('preserves Set instances after update', () => {
            const testKey = Symbol('setTest');
            const initialObject = {
                foo: new Set([1, 2]),
            };

            const ctx = defineContext<typeof initialObject>(testKey);

            ctx.create(initialObject);
            ctx.update((ctx) => {
                ctx.foo.add(3);
                return ctx;
            });

            expect(ctx.get().foo.size).toBe(3);
            expect(ctx.get().foo.has(1)).toBe(true);
            expect(ctx.get().foo.has(2)).toBe(true);
            expect(ctx.get().foo.has(3)).toBe(true);
        });
    });

    describe('destroy', () => {
        it('destroys a specific context', () => {
            context.destroy();
            expect(() => context.get()).toThrowError();
        });
    });

    describe('subscribe', () => {
        it('allows subscribing to the context', () => {
            const mockSub = vi.fn();
            context.subscribe(mockSub);
            context.update(() => ({ foo: 20 }));
            expect(mockSub).toHaveBeenCalledTimes(1);
        });

        it('allows unsubscribing from the context', () => {
            const mockSub = vi.fn();
            const unsubscribe = context.subscribe(mockSub);
            unsubscribe();
            context.update(() => ({ foo: 20 }));
            expect(mockSub).toHaveBeenCalledTimes(0);
        });

        it('notifies subscriber with the latest context state', () => {
            const mockSub = vi.fn();
            context.subscribe(mockSub);
            context.update(() => ({ foo: 20 }));
            expect(mockSub).toHaveBeenCalledWith(expect.objectContaining({ foo: 20 }));
        });

        it('notifies each subscriber individually', () => {
            const mockSub1 = vi.fn();
            const mockSub2 = vi.fn();
            context.subscribe(mockSub1);
            context.subscribe(mockSub2);
            context.update(() => ({ foo: 20 }));
            expect(mockSub1).toHaveBeenCalledTimes(1);
            expect(mockSub2).toHaveBeenCalledTimes(1);
        });

        it('does not notify subscribers if the option is disabled', () => {
            const mockSub = vi.fn();
            context.subscribe(mockSub);
            context.update(() => ({ foo: 20 }), { shouldNotifySubscribers: false });
            expect(mockSub).toHaveBeenCalledTimes(0);
        });
    });
});
