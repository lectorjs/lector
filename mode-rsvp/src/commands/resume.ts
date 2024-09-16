import type { Command, CommandExecutionContext } from '@lectorjs/primitives';
import { context } from '../context.ts';
import nextCommand from './next.ts';

export default function (): Command {
    const next = nextCommand();

    const playNextWord = (execCtx: CommandExecutionContext) => {
        const ctx = context.get();
        const isPaused = !ctx.isPlaying;
        const isFinished = ctx.checkpoint === ctx.parser.data.size - 1;

        if (isFinished) {
            context.update(() => ({
                isFinished: true,
            }));
        }

        if (isPaused || isFinished) {
            stopPlayback();
            return;
        }

        next(execCtx);
    };

    const stopPlayback = () => {
        context.update(() => ({
            isFinished: false,
        }));

        interval && clearInterval(interval);
    };

    const startPlayback = (execCtx: CommandExecutionContext) => {
        context.update((ctx) => ({
            isPlaying: true,
            checkpoint: ctx.checkpoint === ctx.parser.data.size - 1 ? 0 : ctx.checkpoint,
        }));

        playNextWord(execCtx);

        interval = setInterval(() => playNextWord(execCtx), 300);
    };

    let interval: NodeJS.Timer | null = null;

    return (execCtx) => {
        if (context.get().isPlaying) {
            return;
        }

        startPlayback(execCtx);
    };
}
