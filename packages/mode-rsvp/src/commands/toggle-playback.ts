import { defineCommand, getContext } from '@lector/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';
import pausePlaybackCommand from './pause-playback.ts';
import resumePlaybackCommand from './resume-playback.ts';

export default defineCommand(() => {
	const resume = resumePlaybackCommand();
	const pause = pausePlaybackCommand();

	return {
		execute(execCtx) {
			const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);

			ctx.isPlaying ? pause.execute(execCtx) : resume.execute(execCtx);
		},
	};
});
