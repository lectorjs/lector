import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultLectorContext, defineContext, destroyAllContexts, getAllContexts } from '../src/runtime/context.ts';

type MockContextState = {
    foo: number;
    bar: string;
    baz: boolean;
};

describe('context', () => {
    let getMockContext: ReturnType<typeof defineContext<MockContextState>>['getContext'];
    let updateMockContext: ReturnType<typeof defineContext<MockContextState>>['updateContext'];
    let subscribeMockContext: ReturnType<typeof defineContext<MockContextState>>['subscribeContext'];
    let destroyMockContext: ReturnType<typeof defineContext<MockContextState>>['destroyContext'];

    beforeEach(() => {
        const ctx = defineContext<MockContextState>(Symbol('mockContext'), {
            foo: 10,
            bar: 'hello',
            baz: true,
        });

        getMockContext = ctx.getContext;
        updateMockContext = ctx.updateContext;
        subscribeMockContext = ctx.subscribeContext;
        destroyMockContext = ctx.destroyContext;
    });

    afterEach(() => {
        destroyMockContext();
    });

    describe('defineContext', () => {
        it('creates a new lector context with default values', () => {
            expect(getMockContext()).toEqual({
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
            const { getContext } = defineContext<{ foo: number }>(key, { foo: value });
            expect(getContext()).toEqual(expect.objectContaining({ foo: value }));
        });
    });

    describe('getAllContexts', () => {
        beforeEach(() => {
            destroyAllContexts();

            for (let i = 0; i < 10; i++) {
                const key = Symbol(`foo${i}`);
                const value = i;
                defineContext<{ foo: number }>(key, { foo: value });
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
                defineContext<{ foo: number }>(key, { foo: value });
            }

            expect(getAllContexts().size).toBe(10);
            destroyAllContexts();
            expect(getAllContexts().size).toBe(0);
        });
    });

    describe('getContext', () => {
        it('throws an error when retrieving non-existent context', () => {
            destroyMockContext();
            expect(() => getMockContext()).toThrowError();
        });

        it('retrieves the current context', () => {
            expect(getMockContext()).toEqual(expect.objectContaining({ foo: 10 }));
        });

        it('ensures immutability of context values', () => {
            const ctx = getMockContext();

            expect(() => {
                // Attempts to modify the readonly context should throw an error
                // @ts-expect-error
                ctx.foo = 20;
            }).toThrowError();

            expect(ctx.foo).toBe(10);
        });

        it('retrieves the latest context value without having to call getContext every time', () => {
            const ctx = getMockContext();

            expect(ctx).toEqual(expect.objectContaining({ foo: 10 }));
            updateMockContext(() => ({ foo: 20 }));
            expect(ctx).toEqual(expect.objectContaining({ foo: 20 }));
        });
    });

    describe('updateContext', () => {
        it('throws an error when updating non-existent context', () => {
            destroyMockContext();
            expect(() => updateMockContext(() => ({ foo: 20 }))).toThrowError();
        });

        it('updates an existing context', () => {
            updateMockContext(() => ({ foo: 20 }));
            expect(getMockContext()).toEqual(expect.objectContaining({ foo: 20 }));
        });

        it('passes the current context value to the updater function', () => {
            updateMockContext((ctx) => {
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

            const { getContext, updateContext } = defineContext(testKey, initialObject);

            updateContext(() => updateObject);
            expect(getContext()).toEqual(expect.objectContaining(updateObject));
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

            const { getContext, updateContext } = defineContext(testKey, initialObject);

            updateContext(() => updateObject);
            expect(getContext()).toEqual(expect.objectContaining(updateObject));
        });

        // biome-ignore lint/suspicious/noSkippedTests: // TODO: https://github.com/unjs/defu/issues/95
        it.skip('handles updating with undefined values', () => {
            const testKey = Symbol('foo');
            const initialObject = { a: 1, b: 2, c: 3 };

            const { getContext, updateContext } = defineContext(testKey, initialObject);

            updateContext(() => ({
                b: undefined,
                d: 4,
            }));
            expect(getContext()).toEqual({ a: 1, b: undefined, c: 3, d: 4 });
        });

        it('preserves functions after update', () => {
            const testKey = Symbol('foo');
            const initialObject = {
                value: 10,
                double: function () {
                    return this.value * 2;
                },
            };

            const { getContext, updateContext } = defineContext(testKey, initialObject);

            updateContext(() => ({
                value: 20,
            }));

            const ctx = getContext();
            expect(ctx.value).toBe(20);
            expect(ctx.double()).toBe(40);
        });

        it('preserves RegExp instances after update', () => {
            const testKey = Symbol('regexpTest');
            const initialObject = {
                foo: /foo/g,
            };

            const { getContext, updateContext } = defineContext(testKey, initialObject);

            updateContext((ctx) => {
                ctx.foo.lastIndex = 0;
                return ctx;
            });

            const ctx = getContext();
            expect(ctx.foo.lastIndex).toBe(0);
        });

        it('preserves Map instances after update', () => {
            const testKey = Symbol('mapTest');
            const initialObject = {
                foo: new Map([
                    ['key1', 1],
                    ['key2', 2],
                ]),
            };

            const { getContext, updateContext } = defineContext(testKey, initialObject);

            updateContext((ctx) => {
                ctx.foo.set('key3', 3);
                return ctx;
            });

            const ctx = getContext();
            expect(ctx.foo.size).toBe(3);
            expect(ctx.foo.get('key1')).toBe(1);
            expect(ctx.foo.get('key2')).toBe(2);
            expect(ctx.foo.get('key3')).toBe(3);
        });

        it('preserves Set instances after update', () => {
            const testKey = Symbol('setTest');
            const initialObject = {
                foo: new Set([1, 2]),
            };

            const { getContext, updateContext } = defineContext(testKey, initialObject);

            updateContext((ctx) => {
                ctx.foo.add(3);
                return ctx;
            });

            const ctx = getContext();
            expect(ctx.foo.size).toBe(3);
            expect(ctx.foo.has(1)).toBe(true);
            expect(ctx.foo.has(2)).toBe(true);
            expect(ctx.foo.has(3)).toBe(true);
        });
    });

    describe('destroyContext', () => {
        it('destroys a specific context', () => {
            destroyMockContext();
            expect(() => getMockContext()).toThrowError();
        });
    });

    describe('subscribe', () => {
        it('allows subscribing to the context', () => {
            const mockSub = vi.fn();
            subscribeMockContext(mockSub);
            updateMockContext(() => ({ foo: 20 }));
            expect(mockSub).toHaveBeenCalledTimes(1);
        });

        it('allows unsubscribing from the context', () => {
            const mockSub = vi.fn();
            const unsubscribe = subscribeMockContext(mockSub);
            unsubscribe();
            updateMockContext(() => ({ foo: 20 }));
            expect(mockSub).toHaveBeenCalledTimes(0);
        });

        it('notifies subscriber with the latest context state', () => {
            const mockSub = vi.fn();
            subscribeMockContext(mockSub);
            updateMockContext(() => ({ foo: 20 }));
            expect(mockSub).toHaveBeenCalledWith(expect.objectContaining({ foo: 20 }));
        });

        it('notifies each subscriber individually', () => {
            const mockSub1 = vi.fn();
            const mockSub2 = vi.fn();
            subscribeMockContext(mockSub1);
            subscribeMockContext(mockSub2);
            updateMockContext(() => ({ foo: 20 }));
            expect(mockSub1).toHaveBeenCalledTimes(1);
            expect(mockSub2).toHaveBeenCalledTimes(1);
        });

        it('does not notify subscribers if the option is disabled', () => {
            const mockSub = vi.fn();
            subscribeMockContext(mockSub);
            updateMockContext(() => ({ foo: 20 }), { shouldNotifySubscribers: false });
            expect(mockSub).toHaveBeenCalledTimes(0);
        });
    });
});
