import type { Command } from '@lectorjs/primitives';
import { updateContext } from '../context.ts';

export default function (): Command {
    return ({ render }) => {
        updateContext(() => ({
            checkpoint: 0,
        }));

        render();
    };
}
