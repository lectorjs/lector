import { createContext, defineMode, getContext, updateContext } from '@librereader/primitives';
import finish from './commands/finish.ts';
import next from './commands/next.ts';
import pause from './commands/pause.ts';
import prev from './commands/prev.ts';
import restart from './commands/restart.ts';
import resume from './commands/resume.ts';
import toggle from './commands/toggle.ts';
import { RSVP_CONTEXT_KEY, type RsvpContext, defaultContext } from './context.ts';

const mode = defineMode(() => {
	createContext<RsvpContext>(RSVP_CONTEXT_KEY, defaultContext());

	return {
		commands: {
			prev: prev(),
			next: next(),
			restart: restart(),
			finish: finish(),
			pause: pause(),
			resume: resume(),
			toggle: toggle(),
		},
		render() {
			const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);
			const word = ctx.parser.data.get(ctx.checkpoint);
			if (!word) {
				return '';
			}

			return `<span>${word?.value}</span>`;
		},
		onParse({ data, render }) {
			updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
				parser: { data },
			}));

			// Trigger a re-render on first available word.
			if (data.size === 1) {
				render();
			}
		},
		onFinish(metadata) {
			updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
				parser: {
					metadata,
					isComplete: true,
				},
			}));
		},
	};
});

export default mode;
