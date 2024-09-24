import type { Command } from '@lectorjs/primitives';
import { updateContext } from '../context.ts';

export default function (): Command {
    return ({ render }) => {
        updateContext((ctx) => ({
            checkpoint: Math.max(0, ctx.checkpoint - 1),
        }));

        render();
    };
}
