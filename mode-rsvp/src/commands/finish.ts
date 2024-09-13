import { defineCommand, updateContext } from '@lectorjs/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';

export const finish = defineCommand(() => ({
    execute({ render }) {
        updateContext<RsvpContext>(RSVP_CONTEXT_KEY, (ctx) => ({
            checkpoint: ctx.parser.data.size - 1,
        }));

        render();
    },
}));
