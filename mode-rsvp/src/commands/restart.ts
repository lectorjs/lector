import { defineCommand, updateContext } from '@lectorjs/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';

export const restart = defineCommand(() => ({
    execute({ render }) {
        updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
            checkpoint: 0,
        }));

        render();
    },
}));
