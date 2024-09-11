export type WordDifficultyLevel = 'easy' | 'medium' | 'hard' | 'very-hard';

export function assessWordDifficulty(_word: string): WordDifficultyLevel {
	return 'medium';
}
