import { type Command, getContext } from '@lectorjs/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';
import pauseCommand from './pause.ts';
import resumeCommand from './resume.ts';

export default function (): Command {
    const pause = pauseCommand();
    const resume = resumeCommand();

    return (execCtx) => {
        const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);

        ctx.isPlaying ? pause(execCtx) : resume(execCtx);
    };
}
