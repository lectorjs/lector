import { type Command, updateContext } from '@lectorjs/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';

function command(): Command {
	return {
		execute({ render }) {
			updateContext<RsvpContext>(RSVP_CONTEXT_KEY, (ctx) => ({
				checkpoint: Math.max(0, ctx.checkpoint - 1),
			}));

			render();
		},
	};
}

export default command;
