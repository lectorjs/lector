export interface Word {
    readonly value: string;
    readonly insights: WordInsights;
}

export type WordInsights = {
    difficulty: number;
};
