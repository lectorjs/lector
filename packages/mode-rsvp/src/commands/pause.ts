import { type Command, updateContext } from '@librereader/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';

function command(): Command {
	return {
		execute({ render }) {
			updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
				isPlaying: false,
			}));

			render();
		},
	};
}

export default command;
