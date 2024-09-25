import type { Command } from '@lectorjs/primitives';
import { context } from '../context.ts';

export default function (): Command {
    return async () => {
        context.update((ctx) => ({
            checkpoint: Math.min(ctx.parser.data.size - 1, ctx.checkpoint + 1),
        }));
    };
}
