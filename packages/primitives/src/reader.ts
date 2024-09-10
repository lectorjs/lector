import type { Mode } from './mode.ts';
import type { ParsedData, Parser } from './parser.ts';

export type ReaderOptions = {
	parser: Parser;
	modes: Record<string, Mode>;

	/**
	 * The DOM element where the reader's content will be rendered.
	 */
	renderTo: HTMLElement;

	/**
	 * Optional sanitizer function to process HTML content before rendering.
	 * Useful to prevent XSS (Cross-Site Scripting) vulnerabilities.
	 *
	 * You can provide your own algorithm or use a library like [DOMPurify](https://github.com/cure53/DOMPurify).
	 *
	 * @param html The HTML string to sanitize.
	 * @returns The sanitized HTML string.
	 *
	 * @example
	 * ```ts
	 * const reader = createReader({
	 *   renderTo: document.getElementById('reader'),
	 *   sanitizer: (html) => {
	 *     // Example sanitizer that removes any <script> tags
	 *     return html.replace(/<script[^>]*>.*?<\/script>/gi, '');
	 *   }
	 * });
	 *
	 * reader.render(); // Renders the content with sanitized HTML
	 * ```
	 */
	sanitizer?: (html: string) => string;
};

type RegisteredMode = keyof ReaderOptions['modes'];

/**
 * Factory class to manage reader instances and provide rendering functionality.
 *
 * @template T The type extending `ReaderOptions`. Defaults to `ReaderOptions`.
 */
class ReaderFactory<T extends ReaderOptions = ReaderOptions> {
	#options: T;
	#registeredModes: RegisteredMode[];
	#currentMode: RegisteredMode;
	#data: ParsedData;

	get modes(): RegisteredMode[] {
		return this.#registeredModes;
	}

	get mode(): RegisteredMode {
		return this.#currentMode;
	}

	constructor(options: T) {
		if (Object.keys(options?.modes).length === 0) {
			throw new Error('You must provide at least one reading mode to create a reader.');
		}

		if (!options.sanitizer && process.env.NODE_ENV === 'development') {
			console.warn(
				'Lector accepts third-party plugins that can render raw HTML. Make sure to provide a sanitizer function to prevent XSS vulnerabilities. Learn more in https://lector.page.dev/docs/primitives/reader#sanitizer',
			);
		}

		this.#options = options;
		this.#registeredModes = Object.keys(options.modes);
		this.#currentMode = this.#registeredModes[0];
		this.#data = new Map();

		this.#setupModes();
		this.#setupParsingStreaming().catch(console.error);
	}

	switchMode(mode: RegisteredMode): void {
		if (!this.#options.modes[mode]) {
			throw new Error(`Mode '${String(mode)}' not found`);
		}

		this.#currentMode = mode;

		this.render();
	}

	async executeCommand<M extends keyof T['modes'], C extends keyof T['modes'][M]['commands']>(
		mode: M,
		command: C,
	): Promise<void> {
		if (mode !== this.#currentMode) {
			throw new Error(
				`Cannot execute command '${String(command)}' in mode '${String(mode)}' while currently being in mode '${String(this.#currentMode)}'. Make sure to call switchMode(mode) before executing commands that belong to other reading modes.`,
			);
		}

		const commandConfig = this.#options.modes[this.#currentMode].commands?.[command as string];
		if (!commandConfig) {
			throw new Error(`Command '${String(command)}' not found in mode '${String(mode)}'`);
		}

		await Promise.resolve(
			commandConfig.execute({
				render: this.render.bind(this),
			}),
		);
	}

	/**
	 * Renders the reader content to the target DOM element specified in the options.
	 * If a `sanitizer` function is provided, it sanitizes the HTML before rendering.
	 */
	render() {
		const { renderTo, modes, sanitizer } = this.#options;
		const currentMode = modes[this.#currentMode];
		const html = currentMode?.render?.() ?? '';

		renderTo.innerHTML = sanitizer ? sanitizer(html) : html;
	}

	#setupModes() {
		for (const modeName of this.#registeredModes) {
			this.#options.modes[modeName as string].setup?.();
		}
	}

	async #setupParsingStreaming() {
		let idx = 0;

		for await (const word of this.#options.parser.getWord()) {
			this.#data.set(idx, word);

			for (const modeName of this.#registeredModes) {
				this.#options.modes[modeName as string].onWordParsed?.(this.#data, word);
			}

			idx++;

			// Trigger a re-render after the first word is available
			if (idx === 1) {
				this.render();
			}
		}

		const metadata = this.#options.parser.getMetadata();
		for (const modeName of this.#registeredModes) {
			this.#options.modes[modeName as string].onParsingFinished?.(metadata);
		}
	}
}

/**
 * Factory function to create a new `ReaderFactory` instance.
 *
 * @template T The type extending `ReaderOptions`. Defaults to `ReaderOptions`.
 *
 * @param options Configuration options for the reader instance.
 * @returns A new instance of `ReaderFactory`.
 */
export function createReader<T extends ReaderOptions = ReaderOptions>(options: T) {
	return new ReaderFactory(options);
}
