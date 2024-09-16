import { beforeEach, describe, expect, it } from 'vitest';
import { Context } from '../src/runtime/context.ts';

describe('context', () => {
    let context: Context<number>;

    beforeEach(() => {
        Context.destroyAll();

        context = new Context(Symbol('foo'), 10);
    });

    describe('constructor', () => {
        it.each([
            [Symbol('context1'), 100],
            [Symbol('context2'), 200],
            [Symbol('context3'), 300],
        ])('creates a new context for %s with value %d', (key, value) => {
            const ctx = new Context(key, value);
            expect(ctx.get()).toBe(value);
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            Context.destroyAll();

            for (let i = 0; i < 10; i++) {
                const testKey = Symbol(`foo${i}`);
                const testValue = i;
                new Context(testKey, testValue);
            }
        });

        it('retrieves all contexts', () => {
            const allContexts = Context.getAll();
            expect(allContexts).not.toBeFalsy();
            expect(allContexts.size).toBe(10);
        });
    });

    describe('destroyAll', () => {
        beforeEach(() => {
            Context.destroyAll();
        });

        it('destroys all contexts', () => {
            for (let i = 0; i < 10; i++) {
                new Context(Symbol(`key${i}`), i);
            }
            expect(Context.size).toBe(10);
            Context.destroyAll();
            expect(Context.size).toBe(0);
        });
    });

    describe('has', () => {
        it('returns true when context exists', () => {
            expect(context.has()).toBe(true);
        });

        it('returns false if the context does not exist', () => {
            context.destroy();
            expect(context.has()).toBe(false);
        });
    });

    describe('get', () => {
        it('throws an error when retrieving non-existent context', () => {
            context.destroy();
            expect(() => context.get()).toThrowError();
        });

        it('retrieves the current context', () => {
            expect(context.get()).toBe(10);
        });

        it('ensures immutability of context values for complex objects', () => {
            const complexContext = new Context<{ foo: string }>(Symbol('foo'), {
                foo: 'bar',
            });

            const ctx = complexContext.get();

            expect(() => {
                // Attempts to modify the readonly context should throw an error
                // @ts-expect-error
                ctx.foo = 'baz';
            }).toThrow(TypeError);

            expect(ctx.foo).toBe('bar');
        });
    });

    describe('update', () => {
        it('throws an error when updating non-existent context', () => {
            context.destroy();
            expect(() => context.update(() => 20)).toThrowError();
        });

        it('updates an existing context', () => {
            const newValue = 20;
            context.update(() => newValue);
            expect(context.get()).toBe(newValue);
        });

        it('passes the current context value to the updater function', () => {
            context.update((ctx) => {
                expect(ctx).toBe(10);
                return 20;
            });
        });

        it('works with complex objects in the updater function', () => {
            const testKey = Symbol('foo');
            const initialObject = { a: 1, b: 2 };
            const complexContext = new Context(testKey, initialObject);

            complexContext.update(() => ({ b: 3 }));

            expect(complexContext.get()).toEqual({ a: 1, b: 3 });
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

            const complexContext = new Context(testKey, initialObject);

            complexContext.update(() => updateObject);

            expect(complexContext.get()).toEqual(updateObject);
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

            const complexContext = new Context(testKey, initialObject);

            complexContext.update(() => updateObject);

            expect(complexContext.get()).toEqual(updateObject);
        });

        // biome-ignore lint/suspicious/noSkippedTests: // TODO: https://github.com/unjs/defu/issues/95
        it.skip('handles updating with undefined values', () => {
            const testKey = Symbol('foo');
            const initialObject = { a: 1, b: 2, c: 3 };

            const complexContext = new Context(testKey, initialObject);

            complexContext.update(() => ({
                b: undefined,
                d: 4,
            }));

            expect(complexContext.get()).toEqual({ a: 1, b: undefined, c: 3, d: 4 });
        });

        it('preserves functions after update', () => {
            const testKey = Symbol('foo');
            const initialObject = {
                value: 10,
                double: function () {
                    return this.value * 2;
                },
            };

            const complexContext = new Context(testKey, initialObject);

            complexContext.update(() => ({
                value: 20,
            }));

            const updatedObject = complexContext.get();
            expect(updatedObject.value).toBe(20);
            expect(updatedObject.double()).toBe(40);
        });

        it('preserves RegExp instances after update', () => {
            const testKey = Symbol('regexpTest');
            const initialObject = {
                foo: /foo/g,
            };

            const complexContext = new Context(testKey, initialObject);

            complexContext.update((ctx) => {
                ctx.foo.lastIndex = 0;
                return ctx;
            });

            const updatedObject = complexContext.get();
            expect(updatedObject.foo.lastIndex).toBe(0);
        });

        it('preserves Map instances after update', () => {
            const testKey = Symbol('mapTest');
            const initialObject = {
                foo: new Map([
                    ['key1', 1],
                    ['key2', 2],
                ]),
            };

            const complexContext = new Context(testKey, initialObject);

            complexContext.update((ctx) => {
                ctx.foo.set('key3', 3);
                return ctx;
            });

            const updatedObject = complexContext.get();
            expect(updatedObject.foo.size).toBe(3);
            expect(updatedObject.foo.get('key1')).toBe(1);
            expect(updatedObject.foo.get('key2')).toBe(2);
            expect(updatedObject.foo.get('key3')).toBe(3);
        });

        it('preserves Set instances after update', () => {
            const testKey = Symbol('setTest');
            const initialObject = {
                foo: new Set([1, 2]),
            };

            const complexContext = new Context(testKey, initialObject);

            complexContext.update((ctx) => {
                ctx.foo.add(3);
                return ctx;
            });

            const updatedObject = complexContext.get();
            expect(updatedObject.foo.size).toBe(3);
            expect(updatedObject.foo.has(1)).toBe(true);
            expect(updatedObject.foo.has(2)).toBe(true);
            expect(updatedObject.foo.has(3)).toBe(true);
        });
    });

    describe('destroy', () => {
        it('destroys a specific context', () => {
            context.destroy();
            expect(context.has()).toBe(false);
        });
    });
});
