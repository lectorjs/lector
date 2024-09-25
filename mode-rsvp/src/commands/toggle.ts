import type { Command } from '@lectorjs/primitives';
import { context } from '../context.ts';
import pauseCommand from './pause.ts';
import resumeCommand from './resume.ts';

export default function (): Command {
    const pause = pauseCommand();
    const resume = resumeCommand();

    return async () => {
        context.get().isPlaying ? await pause() : await resume();
    };
}
