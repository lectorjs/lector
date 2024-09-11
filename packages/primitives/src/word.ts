import { type WordDifficultyLevel, assessWordDifficulty } from './analyzer/assess-word-difficulty.ts';

export interface Word {
	readonly value: string;
}

export interface WordWithInsights extends Word {
	readonly insights: WordInsights;
}

export type WordInsights = {
	difficulty: WordDifficultyLevel;
};

/**
 * Create a `WordWithInsights` instance from a given configuration object and automatically populates the word insights.
 *
 * @param config An object containing the word properties.
 *
 * @returns A defined `WordWithInsights` instance.
 */
export function defineWord(config: Word): WordWithInsights {
	return {
		...config,
		insights: {
			difficulty: assessWordDifficulty(config.value),
		},
	};
}
