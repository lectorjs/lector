import { type Command, type CommandExecutionContext, getContext, updateContext } from '@librereader/primitives';
import { RSVP_CONTEXT_KEY, type RsvpContext } from '../context.ts';
import nextCommand from './next.ts';

function command(): Command {
	const next = nextCommand();

	const playNextWord = (execCtx: CommandExecutionContext) => {
		const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);
		const shouldStop = ctx.checkpoint === ctx.parser.data.size - 1 || !ctx.isPlaying;
		if (shouldStop) {
			stopPlayback();
			return;
		}

		next.execute(execCtx);
	};

	const stopPlayback = () => {
		updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
			isPlaying: false,
		}));

		interval && clearInterval(interval);
	};

	const startPlayback = (execCtx: CommandExecutionContext) => {
		updateContext<RsvpContext>(RSVP_CONTEXT_KEY, (ctx) => ({
			isPlaying: true,
			checkpoint: ctx.checkpoint === ctx.parser.data.size - 1 ? 0 : ctx.checkpoint,
		}));

		playNextWord(execCtx);

		interval = setInterval(() => playNextWord(execCtx), 300);
	};

	let interval: NodeJS.Timer | null = null;

	return {
		execute(execCtx) {
			const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);
			if (ctx.isPlaying) {
				return;
			}

			startPlayback(execCtx);
		},
	};
}

export default command;
