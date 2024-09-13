import { type CommandExecutionContext, defineCommand, getContext, updateContext } from '@lectorjs/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';
import { next } from './next.ts';

export const resume = defineCommand(() => {
    const nextCommand = next();

    const playNextWord = (execCtx: CommandExecutionContext) => {
        const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);
        const shouldStop = ctx.checkpoint === ctx.parser.data.size - 1 || !ctx.isPlaying;
        if (shouldStop) {
            stopPlayback();
            return;
        }

        nextCommand.execute(execCtx);
    };

    const stopPlayback = () => {
        updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
            isPlaying: false,
        }));

        interval && clearInterval(interval);
    };

    const startPlayback = (execCtx: CommandExecutionContext) => {
        updateContext<RsvpContext>(RSVP_CONTEXT_KEY, (ctx) => ({
            isPlaying: true,
            checkpoint: ctx.checkpoint === ctx.parser.data.size - 1 ? 0 : ctx.checkpoint,
        }));

        playNextWord(execCtx);

        interval = setInterval(() => playNextWord(execCtx), 300);
    };

    let interval: NodeJS.Timer | null = null;

    return {
        execute(execCtx) {
            const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);
            if (ctx.isPlaying) {
                return;
            }

            startPlayback(execCtx);
        },
    };
});
