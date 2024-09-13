import { defineCommand, updateContext } from '@lectorjs/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';

export const pause = defineCommand(() => ({
    execute({ render }) {
        updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
            isPlaying: false,
        }));

        render();
    },
}));
