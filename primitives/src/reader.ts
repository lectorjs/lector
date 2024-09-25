import { isDev } from './internal/flags.ts';
import type { Mode } from './mode.ts';
import type { ParsedData, Parser } from './parser.ts';

/**
 * Represents a reader instance that acts as a bridge between a text parser and a reading mode.
 *
 * @template T The type of the reading mode used to infer all the available commands.
 */
export interface Reader<T extends Mode> {
    /**
     * The commands available in the current reading mode.
     */
    commands: T['commands'];

    /**
     * Renders the parsed data of the reader based on the rendering strategy defined by a specific reading mode.
     *
     * @remarks
     * - This function should be called whenever the reader needs to be re-rendered.
     * - This function may be used internally by some commands to trigger a re-render.
     */
    render(): void;
}

export interface ReaderConfig<T extends Mode> {
    /**
     * The `Parser` instance used to parse the content.
     * @see {@link Parser}
     */
    parser: Parser;

    /**
     * The `Mode` instance used to give capabilities to the reader.
     * @see {@link Mode}
     */
    mode: T;

    /**
     * The HTML element to render the parsed data to.
     */
    renderTo: HTMLElement;

    /**
     * An optional function to sanitize HTML content before rendering.
     *
     * @param html The HTML content to sanitize.
     *
     * @returns The sanitized HTML content.
     *
     * @example
     * ```ts
     * createReader({
     *   // ...
     *   sanitizer: (html) => html.replace(/<script[^>]*>/g, ''),
     * });
     * ```
     *
     * @example
     * ```ts
     * import DOMPurify from 'dompurify';
     *
     * createReader({
     *   // ...
     *   sanitizer: (html) => DOMPurify.sanitize(html),
     * });
     * ```
     */
    sanitizer?: (html: string) => string;
}

class ReaderFactory<T extends Mode> implements Reader<T> {
    #parser: ReaderConfig<T>['parser'];
    #mode: ReaderConfig<T>['mode'];
    #renderTo: ReaderConfig<T>['renderTo'];
    #sanitizer?: ReaderConfig<T>['sanitizer'];

    #data: ParsedData = new Map();

    get commands(): T['commands'] {
        return this.#mode.commands;
    }

    constructor(options: ReaderConfig<T>) {
        if (!options.parser) {
            throw new Error('You must provide a valid parser in order to create a reader.');
        }

        if (!options.mode) {
            throw new Error('You must provide a valid reading mode in order to create a reader.');
        }

        if (!options.renderTo) {
            throw new Error('You must provide a valid render target in order to create a reader.');
        }

        if (!options.sanitizer && isDev()) {
            console.warn(
                'Lector accepts third-party plugins that can render raw HTML. Make sure to provide a sanitizer function to prevent XSS vulnerabilities.',
            );
        }

        this.#parser = options.parser;
        this.#mode = options.mode;
        this.#renderTo = options.renderTo;
        this.#sanitizer = options.sanitizer;

        this.#streamParserData().catch(console.error);
    }

    render(): void {
        const html = this.#mode.render?.() ?? '';
        this.#renderTo.innerHTML = this.#sanitizer ? this.#sanitizer(html) : html;
    }

    /**
     * Lazily streams the parsed data from the provided `Parser` instance to the provided
     * reading mode. This allows custom modes to apply custom logic and rendering per parsed word
     * or when all words have been parsed.
     */
    async #streamParserData(): Promise<void> {
        let idx = 0;

        for await (const word of this.#parser.getWord()) {
            this.#data.set(idx++, word);

            this.#mode.onWordParsed?.({
                data: this.#data,
                word,
                render: this.render.bind(this),
            });
        }

        this.#mode.onParsedFinish?.({
            metadata: this.#parser.getMetadata(),
            render: this.render.bind(this),
        });
    }
}

/**
 * Creates a new `Reader` instance based on the provided configuration.
 *
 * This function takes a `ReaderConfig` object and returns a fully initialized `Reader` instance.
 * The `Reader` instance interacts with a `Parser` to parse text material and a `Mode` to define its behavior and rendering strategy.
 *
 * @template T The type of the reading mode.
 *
 * @param config The configuration object for the reader.
 *
 * @throws An error if any required configuration property is missing or invalid.
 *
 * @returns A new `Reader` instance that is ready to use.
 *
 * @example
 * ```ts
 * import { createReader } from 'lector';
 * import parser from '@lectorjs/parser-text';
 * import rsvp from '@lectorjs/mode-rsvp';
 *
 * const reader = createReader({
 *   parser: parser('Hello, World!'),
 *   mode: rsvp(),
 *   renderTo: document.getElementById('reader-display'),
 * });
 *
 * reader.render(); // Renders the initial state based on the rendering strategy provided by the reading mode.
 *
 * reader.executeCommand('next'); // Type-safely executes the `next` command provided by `rsvp`.
 * ```
 */
export function createReader<T extends Mode>(config: ReaderConfig<T>): Reader<T> {
    return new ReaderFactory(config);
}
