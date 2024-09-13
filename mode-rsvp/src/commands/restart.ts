import { type Command, updateContext } from '@lectorjs/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';

export default function (): Command {
    return ({ render }) => {
        updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
            checkpoint: 0,
        }));

        render();
    };
}
