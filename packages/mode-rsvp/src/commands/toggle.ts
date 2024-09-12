import { type Command, getContext } from '@librereader/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';
import pausePlaybackCommand from './pause.ts';
import resumePlaybackCommand from './resume.ts';

function command(): Command {
	const resume = resumePlaybackCommand();
	const pause = pausePlaybackCommand();

	return {
		execute(execCtx) {
			const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);

			ctx.isPlaying ? pause.execute(execCtx) : resume.execute(execCtx);
		},
	};
}

export default command;
