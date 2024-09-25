import { type Context, type Word, defineContext } from '@lectorjs/primitives';

const DEFAULT_PRECEDING_CHUNK_SIZE = 10;
const DEFAULT_SUCCEEDING_CHUNK_SIZE = 10;

type PrecedingWordsOptions = {
    chunkSize?: number;
    overrideCheckpoint?: number;
};

type SucceedingWordsOptions = {
    chunkSize?: number;
    overrideCheckpoint?: number;
};

export type RsvpContext = {
    get firstWord(): () => Word | undefined;
    get lastWord(): () => Word | undefined;
    get currentValue(): () => string;
    get currentProgress(): () => number;
    get precedingWords(): (options?: PrecedingWordsOptions) => Word[];
    get succeedingWords(): (options?: SucceedingWordsOptions) => Word[];
    checkpoint: number;
    isPlaying: boolean;
    isFinished: boolean;
    options: {
        wordsPerMinute: number;
        wordsPerCycle: number;
    };
};

export const defaultContext = (): RsvpContext => ({
    firstWord() {
        return context.get().parser.data.get(0);
    },
    lastWord() {
        return context.get().parser.data.get(context.get().parser.data.size - 1);
    },
    currentValue() {
        const ctx = context.get();

        let value = '';

        for (let idx = 0; idx < ctx.options.wordsPerCycle; idx++) {
            const word = ctx.parser.data.get(ctx.checkpoint + idx);
            if (word) {
                value += `${word.value} `;
            }
        }

        return value.trim();
    },
    currentProgress() {
        const ctx = context.get();

        if (ctx.parser.data.size === 0) {
            return 0;
        }

        return (ctx.checkpoint / (ctx.parser.data.size - 1)) * 100;
    },
    precedingWords(options) {
        const ctx = context.get();

        const { chunkSize = DEFAULT_PRECEDING_CHUNK_SIZE, overrideCheckpoint = ctx.checkpoint } = options ?? {};

        const start = 1;
        const end = start + chunkSize;
        const chunks: Word[] = [];

        for (let idx = start; idx < end; idx++) {
            const word = ctx.parser.data.get(overrideCheckpoint - idx);
            if (!word) {
                break;
            }

            chunks.unshift(word);
        }

        return chunks;
    },
    succeedingWords(options) {
        const ctx = context.get();

        const { chunkSize = DEFAULT_SUCCEEDING_CHUNK_SIZE, overrideCheckpoint = ctx.checkpoint } = options ?? {};

        const start = Math.max(0, Math.min(overrideCheckpoint, ctx.parser.data.size - 1)) + ctx.options.wordsPerCycle;
        const end = start + chunkSize;
        const chunks: Word[] = [];

        for (let idx = start; idx < end; idx++) {
            const word = ctx.parser.data.get(idx);
            if (!word) {
                break;
            }

            chunks.push(word);
        }

        return chunks;
    },
    checkpoint: 0,
    isPlaying: false,
    isFinished: false,
    options: {
        wordsPerMinute: 300,
        wordsPerCycle: 2,
    },
});

export const context: Context<RsvpContext> = defineContext<RsvpContext>(Symbol('rsvp'));
