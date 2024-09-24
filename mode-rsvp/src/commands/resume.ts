import type { Command } from '@lectorjs/primitives';
import { getContext, updateContext } from '../context.ts';
import nextCommand from './next.ts';

export default function (): Command {
    const next = nextCommand();

    return async (execCtx) => {
        const ctx = getContext();

        if (ctx.isPlaying) {
            return;
        }

        updateContext(() => ({
            isPlaying: true,
            isFinished: false,
            checkpointd: ctx.checkpoint === ctx.parser.data.size - 1 ? 0 : ctx.checkpoint,
        }));

        while (ctx.isPlaying && !ctx.isFinished) {
            await next(execCtx);

            await new Promise((resolve) => {
                setTimeout(resolve, 200);
            });

            if (ctx.checkpoint === ctx.parser.data.size - 1) {
                updateContext(() => ({
                    isPlaying: false,
                    isFinished: true,
                }));
            }
        }
    };
}
