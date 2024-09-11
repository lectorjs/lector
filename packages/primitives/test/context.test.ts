import { beforeEach, describe, expect, it } from 'bun:test';
import {
	createContext,
	destroyAllContexts,
	destroyContext,
	getAllContexts,
	getContext,
	hasContext,
	updateContext,
} from '../src/context.ts';

describe('context', () => {
	beforeEach(() => {
		destroyAllContexts();
	});

	describe('hasContext', () => {
		it('returns false if the context does not exist', () => {
			expect(hasContext(Symbol('nonExistentKey'))).toBe(false);
		});

		it('returns true when context exists', () => {
			const testKey = Symbol('foo');
			const testValue = 10;
			createContext(testKey, testValue);
			expect(hasContext(testKey)).toBe(true);
		});
	});

	describe('getContext', () => {
		it('retrieves a context by key', () => {
			const testKey = Symbol('foo');
			const testValue = 10;
			createContext(testKey, testValue);
			expect(getContext<number>(testKey)).toBe(testValue);
		});

		it('returns undefined for non-existent contexts', () => {
			expect(getContext(Symbol('nonExistentKey'))).toBeUndefined();
		});

		it('ensures immutability of context values for complex objects', () => {
			const testKey = Symbol('foo');
			const testValue = { foo: 'bar' };
			createContext(testKey, testValue);

			const ctx = getContext<typeof testValue>(testKey);

			expect(() => {
				// Attempts to modify the readonly context should throw an error
				// @ts-expect-error
				ctx.foo = 'baz';
			}).toThrow(TypeError);

			expect(testValue.foo).toBe('bar');
		});
	});

	describe('getAllContexts', () => {
		beforeEach(() => {
			for (let i = 0; i < 10; i++) {
				const testKey = Symbol(`foo${i}`);
				const testValue = `bar${i}`;
				createContext(testKey, testValue);
			}
		});

		it('retrieves all contexts', () => {
			const allContexts = getAllContexts();
			expect(allContexts).not.toBeFalsy();
			expect(allContexts.size).toBe(10);
		});

		it('retrieves contexts independently', () => {
			const testKey = Symbol('foo');
			createContext(testKey, 'extraValue');
			expect(getContext<string>(testKey)).toBe('extraValue');
			expect(getAllContexts().size).toBe(11);
		});
	});

	describe('createContext', () => {
		it.each([
			[Symbol('context1'), 100],
			[Symbol('context2'), 200],
			[Symbol('context3'), 300],
		])('creates context for %s with value %d', (key, value) => {
			createContext(key, value);
			expect(getContext<number>(key)).toBe(value);
		});

		it('overwrites an existing context', () => {
			const testKey = Symbol('foo');
			const testValue = 10;
			const newValue = 20;

			createContext(testKey, testValue);
			createContext(testKey, newValue);

			expect(getContext<number>(testKey)).toBe(newValue);
		});
	});

	describe('updateContext', () => {
		it('throws an error when updating non-existent context', () => {
			expect(() => updateContext(Symbol('nonExistent'), () => 20)).toThrowError();
		});

		it('updates an existing context', () => {
			const testKey = Symbol('foo');
			const testValue = 10;
			createContext(testKey, testValue);

			const newValue = 20;
			updateContext(testKey, () => newValue);
			expect(getContext<number>(testKey)).toBe(newValue);
		});

		it('passes the current context value to the updater function', () => {
			const testKey = Symbol('foo');
			const testInitialValue = 10;
			createContext(testKey, testInitialValue);
			updateContext(testKey, (ctx) => {
				expect(ctx).toBe(testInitialValue);
				return 20;
			});
		});

		it('works with complex objects in the updater function', () => {
			const testKey = Symbol('foo');
			const initialObject = { a: 1, b: 2 };

			createContext(testKey, initialObject);

			updateContext<typeof initialObject>(testKey, () => ({ b: 3 }));

			expect(getContext(testKey)).toEqual({ a: 1, b: 3 });
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

			createContext(testKey, initialObject);
			updateContext(testKey, () => updateObject);
			expect(getContext(testKey)).toEqual(updateObject);
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

			createContext(testKey, initialObject);
			updateContext(testKey, () => updateObject);
			expect(getContext(testKey)).toEqual(updateObject);
		});

		// TODO: https://github.com/unjs/defu/issues/95
		// biome-ignore lint/suspicious/noSkippedTests: <explanation>
		it.skip('handles updating with undefined values', () => {
			const testKey = Symbol('foo');
			const initialObject = { a: 1, b: 2, c: 3 };

			createContext(testKey, initialObject);

			updateContext(testKey, () => ({
				b: undefined,
				d: 4,
			}));

			expect(getContext(testKey)).toEqual({ a: 1, b: undefined, c: 3, d: 4 });
		});

		it('preserves functions after update', () => {
			const testKey = Symbol('foo');
			const initialObject = {
				value: 10,
				double: function () {
					return this.value * 2;
				},
			};

			createContext(testKey, initialObject);

			updateContext<typeof initialObject>(testKey, () => ({
				value: 20,
			}));

			const updatedObject = getContext<typeof initialObject>(testKey);
			expect(updatedObject.value).toBe(20);
			expect(updatedObject.double()).toBe(40);
		});

		it('preserves RegExp instances after update', () => {
			const testKey = Symbol('regexpTest');
			const initialRegExp = {
				foo: /foo/g,
			};

			createContext(testKey, initialRegExp);

			updateContext<typeof initialRegExp>(testKey, (ctx) => {
				ctx.foo.lastIndex = 0;
				return ctx;
			});

			const updatedRegExp = getContext<typeof initialRegExp>(testKey);
			expect(updatedRegExp.foo.lastIndex).toBe(0);
		});

		it('preserves Map instances after update', () => {
			const testKey = Symbol('mapTest');
			const initialMap = {
				foo: new Map([
					['key1', 1],
					['key2', 2],
				]),
			};

			createContext(testKey, initialMap);

			updateContext<typeof initialMap>(testKey, (ctx) => {
				ctx.foo.set('key3', 3);
				return ctx;
			});

			const updatedMap = getContext<typeof initialMap>(testKey);
			expect(updatedMap.foo.size).toBe(3);
			expect(updatedMap.foo.get('key1')).toBe(1);
			expect(updatedMap.foo.get('key2')).toBe(2);
			expect(updatedMap.foo.get('key3')).toBe(3);
		});

		it('preserves Set instances after update', () => {
			const testKey = Symbol('setTest');
			const initialSet = {
				foo: new Set([1, 2]),
			};

			createContext(testKey, initialSet);

			updateContext<typeof initialSet>(testKey, (ctx) => {
				ctx.foo.add(3);
				return ctx;
			});

			const updatedSet = getContext<typeof initialSet>(testKey);
			expect(updatedSet.foo.size).toBe(3);
			expect(updatedSet.foo.has(1)).toBe(true);
			expect(updatedSet.foo.has(2)).toBe(true);
			expect(updatedSet.foo.has(3)).toBe(true);
		});
	});

	describe('destroyContext', () => {
		it('destroys a specific context', () => {
			const testKey = Symbol('foo');
			const testValue = 10;
			createContext(testKey, testValue);
			destroyContext(testKey);
			expect(getContext<number>(testKey)).toBeUndefined();
		});
	});

	describe('destroyAllContexts', () => {
		it('destroys all contexts', () => {
			for (let i = 0; i < 10; i++) {
				createContext(Symbol(`key${i}`), i);
			}
			expect(getAllContexts().size).toBe(10);
			destroyAllContexts();
			expect(getAllContexts().size).toBe(0);
		});
	});
});
