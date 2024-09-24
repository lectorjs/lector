import type { Command } from '@lectorjs/primitives';
import { updateContext } from '../context.ts';

export default function (): Command {
    return ({ render }) => {
        updateContext(() => ({ isPlaying: false }));

        render();
    };
}
