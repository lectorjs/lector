import { type Mocked, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CommandExecutionContext } from '../src/command.ts';
import type { Mode } from '../src/mode.ts';
import type { Parser } from '../src/parser.ts';
import { createReader } from '../src/reader.ts';
import { createMockMode } from './__mocks__/mode.mock.ts';
import { createMockParser } from './__mocks__/parser.mock.ts';

const MOCK_WORDS = ['word1', 'word2', 'word3', 'word4', 'word5'];

describe('reader', () => {
    let parser: Mocked<Parser>;
    let mode: Mocked<Mode>;
    let renderTo: HTMLElement;

    beforeEach(() => {
        parser = createMockParser(MOCK_WORDS);
        mode = createMockMode();
        renderTo = document.createElement('div');
    });

    describe('initialization', () => {
        it('throws an error when no parser is provided', () => {
            expect(() =>
                createReader({
                    parser: undefined as unknown as Parser,
                    mode: mode,
                    renderTo,
                }),
            ).toThrow(/valid parser/g);
        });

        it('throws an error when no mode is provided', () => {
            expect(() =>
                createReader({
                    parser,
                    mode: undefined as unknown as Mode,
                    renderTo,
                }),
            ).toThrow(/valid reading mode/g);
        });

        it('throws an error when no render target is provided', () => {
            expect(() =>
                createReader({
                    parser,
                    mode: mode,
                    renderTo: undefined as unknown as HTMLElement,
                }),
            ).toThrow(/valid render target/g);
        });

        it('warns about missing sanitizer during development', () => {
            const consoleSpy = vi.spyOn(console, 'warn');
            process.env.NODE_ENV = 'development';

            createReader({
                parser,
                mode: mode,
                renderTo,
            });

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('provide a sanitizer'));
        });

        it('does not warn about missing sanitizer during production', () => {
            const consoleSpy = vi.spyOn(console, 'warn');
            process.env.NODE_ENV = 'production';

            createReader({
                parser,
                mode: mode,
                renderTo,
            });

            expect(consoleSpy).not.toHaveBeenCalled();
        });
    });

    describe('parsing', () => {
        it('streams parser data and triggers mode hooks', async () => {
            createReader({
                parser,
                mode,
                renderTo,
            });

            await new Promise(setImmediate);

            expect(mode.onWordParsed).toHaveBeenCalledTimes(MOCK_WORDS.length);
            for (const _word of MOCK_WORDS) {
                expect(mode.onParsedFinish).toHaveBeenCalledWith(expect.any(Object));
            }

            expect(mode.onParsedFinish).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('rendering', () => {
        it('renders raw HTML if no sanitizer is provided', () => {
            createReader({
                parser,
                mode,
                renderTo,
            }).render();

            expect(mode.render).toHaveBeenCalled();
            expect(renderTo.innerHTML).toBe('<span>foo</span>');
        });

        it('renders sanitized HTML if a sanitizer is provided', () => {
            mode = {
                ...mode,
                render: vi.fn().mockReturnValue('<script>console.log("I\'m injected evil code")</script>'),
            };

            createReader({
                parser,
                mode,
                renderTo,
                sanitizer: (html) =>
                    html.replace(/<script[^>]*>/g, '').replace(`console.log("I'm injected evil code")`, 'nice try'),
            }).render();

            expect(mode.render).toHaveBeenCalled();
            expect(renderTo.innerHTML).toBe('nice try');
        });
    });

    describe('commands', () => {
        it('executes a valid command without interfering with other commands', async () => {
            const cmd1 = vi.fn();
            const cmd2 = vi.fn();
            const cmd3 = vi.fn();

            const newMode = {
                ...mode,
                commands: {
                    foo: {
                        execute: cmd1,
                    },
                    bar: {
                        execute: cmd2,
                    },
                    baz: {
                        execute: cmd3,
                    },
                },
            };

            const reader = createReader({
                parser,
                mode: newMode,
                renderTo,
            });

            await reader.executeCommand('foo');
            expect(cmd1).toHaveBeenCalled();
            expect(cmd2).not.toHaveBeenCalled();
            expect(cmd3).not.toHaveBeenCalled();
            vi.clearAllMocks();

            await reader.executeCommand('bar');
            expect(cmd2).toHaveBeenCalled();
            expect(cmd1).not.toHaveBeenCalled();
            expect(cmd3).not.toHaveBeenCalled();
            vi.clearAllMocks();

            await reader.executeCommand('baz');
            expect(cmd3).toHaveBeenCalled();
            expect(cmd1).not.toHaveBeenCalled();
            expect(cmd2).not.toHaveBeenCalled();
            vi.clearAllMocks();
        });

        it('has a valid execution context that can be used to interact with the reader', () => {
            const cmd1 = vi.fn();

            const newMode = {
                ...mode,
                commands: {
                    foo: {
                        execute: cmd1,
                    },
                },
            };

            createReader({
                parser,
                mode: newMode,
                renderTo,
            }).executeCommand('foo');

            expect(cmd1).toHaveBeenCalledWith(
                expect.objectContaining({ render: expect.any(Function) } satisfies CommandExecutionContext),
            );
        });

        it('throws an error when executing an invalid command', async () => {
            const reader = createReader({
                parser,
                mode: mode,
                renderTo,
            });

            // @ts-expect-error command does not exist
            await expect(reader.executeCommand('doSomething')).rejects.toThrowError(/not found/g);
        });
    });
});
