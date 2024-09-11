import type { Mode } from './mode.ts';
import type { ParsedData, Parser } from './parser.ts';

export interface ReaderConfig<T extends Mode> {
	parser: Parser;
	mode: T;
	renderTo: HTMLElement;
	sanitizer?: (html: string) => string;
}

export interface Reader<T extends Mode> {
	render(): void;
	executeCommand(name: keyof T['commands']): Promise<void>;
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
				'LibreReader accepts third-party plugins that can render raw HTML. Make sure to provide a sanitizer function to prevent XSS vulnerabilities. Learn more in https://librereader.page.dev/docs/primitives/reader#sanitizer',
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

		await Promise.resolve(
			cmd.execute({
				render: this.render.bind(this),
			}),
		);
	}

	async #streamParserData(): Promise<void> {
		let idx = 0;

		for await (const word of this.#parser.getWord()) {
			this.#data.set(idx++, word);

			this.#mode.onParse?.(this.#data, word);

			// Trigger a re-render after the first word is available
			if (idx === 1) {
				this.render();
			}
		}

		this.#mode.onFinish?.(this.#parser.getMetadata());
	}
}

export function createReader<T extends Mode>(config: ReaderConfig<T>): Reader<T> {
	return new ReaderFactory(config);
}
