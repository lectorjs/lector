import { defineCommand, updateContext } from '@librereader/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';

export default defineCommand(() => ({
	execute({ render }) {
		updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
			checkpoint: 0,
		}));

		render();
	},
}));
