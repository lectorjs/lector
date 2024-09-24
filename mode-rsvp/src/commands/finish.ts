import type { Command } from '@lectorjs/primitives';
import { updateContext } from '../context.ts';

export default function (): Command {
    return ({ render }) => {
        updateContext((ctx) => ({
            checkpoint: ctx.parser.data.size - 1,
        }));

        render();
    };
}
