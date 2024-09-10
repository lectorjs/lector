export type ReaderOptions = {
	renderTo: HTMLElement;
	sanitizer?: (html: string) => string;
};

class ReaderFactory<T extends ReaderOptions = ReaderOptions> {
	#options: T;

	constructor(options: T) {
		this.#options = options;
	}

	render() {
		this.#options.renderTo.innerHTML = 'Reader';
	}
}

export function createReader<T extends ReaderOptions = ReaderOptions>(options: T): ReaderFactory<T> {
	return new ReaderFactory(options);
}
