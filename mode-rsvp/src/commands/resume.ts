import { type Command, type CommandExecutionContext, getContext, updateContext } from '@lectorjs/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';
import nextCommand from './next.ts';

export default function (): Command {
    const next = nextCommand();

    const playNextWord = (execCtx: CommandExecutionContext) => {
        const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);
        const isPaused = !ctx.isPlaying;
        const isFinished = ctx.checkpoint === ctx.parser.data.size - 1;

        if (isFinished) {
            updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
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

    return (execCtx) => {
        const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);
        if (ctx.isPlaying) {
            return;
        }

        startPlayback(execCtx);
    };
}
