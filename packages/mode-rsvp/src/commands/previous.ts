import { defineCommand, updateContext } from '@lector/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';

export default defineCommand(() => ({
	execute({ render }) {
		updateContext<RsvpContext>(RSVP_CONTEXT_KEY, (ctx) => ({
			checkpoint: Math.max(0, ctx.checkpoint - 1),
		}));

		render();
	},
}));
