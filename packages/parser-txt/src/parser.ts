import { assessWordDifficulty } from '@lector/analyzer';
import { type ParsedMetadata, defineParser, defineWord, tokenize } from '@lector/primitives';

export default defineParser<string>((input) => {
	const metadata: ParsedMetadata = {
		readingTimeInMs: 0,
	};

	return {
		*getWord() {
			const words = tokenize(input);

			for (const [_, word] of words.entries()) {
				metadata.readingTimeInMs += 1;

				yield defineWord({
					value: word,
					insights: {
						difficulty: assessWordDifficulty(word),
					},
				});
			}
		},
		getMetadata() {
			return metadata;
		},
	};
});
