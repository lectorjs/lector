import { defineCommand, getContext } from '@lectorjs/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';
import { pause } from './pause.ts';
import { resume } from './resume.ts';

export const toggle = defineCommand(() => {
    const resumeCommand = resume();
    const pauseCommand = pause();

    return {
        execute(execCtx) {
            const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);

            ctx.isPlaying ? pauseCommand.execute(execCtx) : resumeCommand.execute(execCtx);
        },
    };
});
