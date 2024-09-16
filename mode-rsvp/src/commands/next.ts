import type { Command } from '@lectorjs/primitives';
import { context } from '../context.ts';

export default function (): Command {
    return ({ render }) => {
        context.update((ctx) => ({
            checkpoint: Math.min(ctx.parser.data.size - 1, ctx.checkpoint + 1),
        }));

        render();
    };
}
