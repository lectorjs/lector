import type { Command } from '@lectorjs/primitives';
import { context } from '../context.ts';

export default function (): Command {
    return async () => {
        context.update(() => ({
            checkpoint: 0,
        }));
    };
}
