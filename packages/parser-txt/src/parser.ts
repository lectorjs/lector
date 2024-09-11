import { defineParser, defineWord, tokenize } from '@librereader/primitives';

export default defineParser<string>((input) => {
	const words = tokenize(input);
	const metadata = {};

	return {
		*getWord() {
			for (const word of words) {
				yield defineWord({ value: word });
			}
		},
		getMetadata: () => metadata,
	};
});
