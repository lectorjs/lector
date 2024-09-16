import { type Mocked, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CommandExecutionContext } from '../src/command.ts';
import type { Mode } from '../src/mode.ts';
import type { Parser } from '../src/parser.ts';
import { createReader } from '../src/reader.ts';
import { MockMode } from './__mocks__/mode.mock.ts';
import { createMockParser } from './__mocks__/parser.mock.ts';

const MOCK_WORDS = ['word1', 'word2', 'word3', 'word4', 'word5'];

describe('reader', () => {
    let parser: Mocked<Parser>;
    let renderTo: HTMLElement;

    beforeEach(() => {
        parser = createMockParser(MOCK_WORDS);
        renderTo = document.createElement('div');
    });

    describe('initialization', () => {
        it('throws an error when no parser is provided', () => {
            expect(() =>
                createReader({
                    mode: new MockMode(),
                    parser: undefined as unknown as Parser,
                    renderTo,
                }),
            ).toThrow(/valid parser/g);
        });

        it('throws an error when no mode is provided', () => {
            expect(() =>
                createReader({
                    mode: undefined as unknown as Mode,
                    parser,
                    renderTo,
                }),
            ).toThrow(/valid reading mode/g);
        });

        it('throws an error when no render target is provided', () => {
            expect(() =>
                createReader({
                    mode: new MockMode(),
                    parser,
                    renderTo: undefined as unknown as HTMLElement,
                }),
            ).toThrow(/valid render target/g);
        });

        it('warns about missing sanitizer during development', () => {
            const consoleSpy = vi.spyOn(console, 'warn');
            process.env.NODE_ENV = 'development';

            createReader({
                mode: new MockMode(),
                parser,
                renderTo,
            });

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('provide a sanitizer'));
        });

        it('does not warn about missing sanitizer during production', () => {
            const consoleSpy = vi.spyOn(console, 'warn');
            process.env.NODE_ENV = 'production';

            createReader({
                mode: new MockMode(),
                parser,
                renderTo,
            });

            expect(consoleSpy).not.toHaveBeenCalled();
        });
    });

    describe('parsing', () => {
        it('streams parser data and triggers mode hooks', async () => {
            const mockMode = new MockMode();

            createReader({
                mode: mockMode,
                parser,
                renderTo,
            });

            await new Promise(setImmediate);

            expect(mockMode.onWordParsed).toHaveBeenCalledTimes(MOCK_WORDS.length);
            for (const _word of MOCK_WORDS) {
                expect(mockMode.onParsedFinish).toHaveBeenCalledWith(expect.any(Object));
            }

            expect(mockMode.onParsedFinish).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('rendering', () => {
        it('renders raw HTML if no sanitizer is provided', () => {
            const mockMode = new MockMode();

            createReader({
                mode: mockMode,
                parser,
                renderTo,
            }).render();

            expect(mockMode.render).toHaveBeenCalled();
            expect(renderTo.innerHTML).toBe('<span>foo</span>');
        });

        it('renders sanitized HTML if a sanitizer is provided', () => {
            const mockMode = {
                ...new MockMode(),
                render: vi.fn().mockReturnValue('<script>console.log("I\'m injected evil code")</script>'),
            };

            createReader({
                mode: mockMode,
                parser,
                renderTo,
                sanitizer: (html) =>
                    html.replace(/<script[^>]*>/g, '').replace(`console.log("I'm injected evil code")`, 'nice try'),
            }).render();

            expect(mockMode.render).toHaveBeenCalled();
            expect(renderTo.innerHTML).toBe('nice try');
        });
    });

    describe('commands', () => {
        it('executes a valid command without interfering with other commands', async () => {
            const mockMode = new MockMode();

            const reader = createReader({
                mode: mockMode,
                parser,
                renderTo,
            });

            await reader.executeCommand('foo');
            expect(mockMode.commands.foo).toHaveBeenCalled();
            expect(mockMode.commands.bar).not.toHaveBeenCalled();
            expect(mockMode.commands.baz).not.toHaveBeenCalled();
            vi.clearAllMocks();

            await reader.executeCommand('bar');
            expect(mockMode.commands.bar).toHaveBeenCalled();
            expect(mockMode.commands.foo).not.toHaveBeenCalled();
            expect(mockMode.commands.baz).not.toHaveBeenCalled();
            vi.clearAllMocks();

            await reader.executeCommand('baz');
            expect(mockMode.commands.baz).toHaveBeenCalled();
            expect(mockMode.commands.foo).not.toHaveBeenCalled();
            expect(mockMode.commands.bar).not.toHaveBeenCalled();
            vi.clearAllMocks();
        });

        it('has a valid execution context that can be used to interact with the reader', () => {
            const mockMode = new MockMode();

            createReader({
                parser,
                mode: mockMode,
                renderTo,
            }).executeCommand('foo');

            expect(mockMode.commands.foo).toHaveBeenCalledWith(
                expect.objectContaining({ render: expect.any(Function) } satisfies CommandExecutionContext),
            );
        });

        it('throws an error when executing an invalid command', async () => {
            const reader = createReader({
                mode: new MockMode(),
                parser,
                renderTo,
            });

            // @ts-expect-error command does not exist
            await expect(reader.executeCommand('doSomething')).rejects.toThrowError(/not found/g);
        });
    });
});
