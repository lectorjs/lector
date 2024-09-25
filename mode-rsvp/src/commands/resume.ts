import type { Command } from '@lectorjs/primitives';
import { context } from '../context.ts';
import nextCommand from './go-forward.ts';

export default function (): Command {
    const next = nextCommand();

    return async () => {
        const ctx = context.get();

        if (ctx.isPlaying) {
            return;
        }

        context.update((ctx) => ({
            isPlaying: true,
            isFinished: false,
            checkpoint: ctx.isFinished ? 0 : ctx.checkpoint,
        }));

        while (ctx.isPlaying && !ctx.isFinished) {
            await next();

            await new Promise((resolve) => {
                setTimeout(resolve, calculateWaitTimeInMs(ctx.options.wordsPerMinute, ctx.options.wordsPerCycle));
            });

            if (ctx.checkpoint === ctx.parser.data.size - 1) {
                context.update(() => ({
                    isPlaying: false,
                    isFinished: true,
                }));
            }
        }
    };
}

function calculateWaitTimeInMs(wordsPerMinute: number, wordsPerCycle: number): number {
    return (wordsPerCycle / wordsPerMinute) * 60 * 1000;
}
