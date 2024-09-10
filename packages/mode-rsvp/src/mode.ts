import { createContext, defineMode, getContext, updateContext } from '@lector/primitives';
import finish from './commands/finish.ts';
import next from './commands/next.ts';
import pausePlayback from './commands/pause-playback.ts';
import previous from './commands/previous.ts';
import restart from './commands/restart.ts';
import resumePlayback from './commands/resume-playback.ts';
import togglePlayback from './commands/toggle-playback.ts';
import { RSVP_CONTEXT_KEY, type RsvpContext, defaultContext } from './context.ts';

export default defineMode({
	commands: {
		previous: previous(),
		next: next(),
		restart: restart(),
		finish: finish(),
		pausePlayback: pausePlayback(),
		resumePlayback: resumePlayback(),
		togglePlayback: togglePlayback(),
	},
	setup() {
		createContext<RsvpContext>(RSVP_CONTEXT_KEY, defaultContext);
	},
	onWordParsed(data) {
		updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
			parser: { data },
		}));
	},
	onParsingFinished(metadata) {
		updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
			parser: {
				metadata,
				isComplete: true,
			},
		}));
	},
	render() {
		const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);
		const word = ctx.parser.data.get(ctx.checkpoint);
		if (!word) {
			return '';
		}

		return `<span>${word?.value}</span>`;
	},
});
