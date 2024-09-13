import {
    type Command,
    type Mode,
    type ModeHookOnParsedFinishContext,
    type ModeHookOnWordParsedContext,
    getContext,
    updateContext,
} from '@lectorjs/primitives';
import finish from './commands/finish.ts';
import next from './commands/next.ts';
import pause from './commands/pause.ts';
import prev from './commands/prev.ts';
import restart from './commands/restart.ts';
import resume from './commands/resume.ts';
import toggle from './commands/toggle.ts';
import { RSVP_CONTEXT_KEY, type RsvpContext } from './context.ts';

export type RsvpModeCommands = {
    prev: Command;
    next: Command;
    restart: Command;
    finish: Command;
    pause: Command;
    resume: Command;
    toggle: Command;
};

export class RsvpMode implements Mode<RsvpModeCommands> {
    get commands(): RsvpModeCommands {
        return {
            prev: prev(),
            next: next(),
            restart: restart(),
            finish: finish(),
            pause: pause(),
            resume: resume(),
            toggle: toggle(),
        };
    }

    render(): string {
        const ctx = getContext<RsvpContext>(RSVP_CONTEXT_KEY);
        const word = ctx.parser.data.get(ctx.checkpoint);
        if (!word) {
            return '';
        }

        return `<span>${word?.value}</span>`;
    }

    onWordParsed({ data, render }: ModeHookOnWordParsedContext): void {
        updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
            parser: { data },
        }));

        // Trigger a re-render on first available word.
        if (data.size === 1) {
            render();
        }
    }

    onParsedFinish({ metadata }: ModeHookOnParsedFinishContext): void {
        updateContext<RsvpContext>(RSVP_CONTEXT_KEY, () => ({
            parser: {
                metadata,
                isComplete: true,
            },
        }));
    }
}

export default () => new RsvpMode();
