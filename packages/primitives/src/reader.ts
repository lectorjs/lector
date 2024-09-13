import type { Mode } from './mode.ts';
import type { ParsedData, Parser } from './parser.ts';

/**
 * Represents a reader instance that acts as a bridge between a text parser and a reading mode.
 *
 * @template T The type of the reading mode used to infer all the available commands.
 */
export interface Reader<T extends Mode> {
	/**
	 * Renders the parsed data of the reader based on the rendering strategy defined by a specific reading mode.
	 *
	 * @remarks
	 * - This function should be called whenever the reader needs to be re-rendered.
	 * - This function may be used internally by some commands to trigger a re-render.
	 */
	render(): void;

	/**
	 * Executes a command from the current reading mode, dynamically invoking the corresponding function.
	 *
	 * @param name The name of the command to execute. This is inferred from the `commands` object of the reading mode.
	 * @param args Arguments to pass to the command function.
	 *
	 * @returns A promise that is resolved when the command has been executed, or rejected if an error occurs.
	 *
	 * @example
	 * ```ts
	 * reader.executeCommand('nextPage');
	 * reader.executeCommand('goToPage', 5);
	 * reader.executeCommand('highlightText', {
	 *   text: 'The quick brown fox jumps over the lazy dog.',
	 *   color: 'red',
	 *   caseInsensitive: true,
	 * });
	 * ```
	 */
	// TODO: Infer the type of args
	executeCommand(name: keyof T['commands'], ...args: unknown[]): Promise<void>;
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

		if (!options.sanitizer && process.env.NODE_ENV === 'development') {
			console.warn(
				'Lector accepts third-party plugins that can render raw HTML. Make sure to provide a sanitizer function to prevent XSS vulnerabilities. Learn more in https://lector.page.dev/docs/primitives/reader#sanitizer',
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

	async executeCommand(name: keyof T['commands']): Promise<void> {
		const cmd = this.#mode.commands?.[name as string];
		if (!cmd) {
			throw new Error(`Command '${String(cmd)}' not found. Make sure to execute a valid command.`);
		}

		await cmd.execute({ render: this.render.bind(this) });
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
 * import parser from '@lectorjs/parser-txt';
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
