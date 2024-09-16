import type { Command, Mode, ModeHookOnParsedFinishContext, ModeHookOnWordParsedContext } from '@lectorjs/primitives';
import finish from './commands/finish.ts';
import next from './commands/next.ts';
import pause from './commands/pause.ts';
import prev from './commands/prev.ts';
import restart from './commands/restart.ts';
import resume from './commands/resume.ts';
import toggle from './commands/toggle.ts';
import { context } from './context.ts';

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
        const ctx = context.get();
        const word = ctx.parser.data.get(ctx.checkpoint);
        if (!word) {
            return '';
        }

        return `<span>${word?.value}</span>`;
    }

    onWordParsed({ data, render }: ModeHookOnWordParsedContext): void {
        context.update(() => ({
            parser: { data },
        }));

        // Trigger a re-render on first available word.
        if (data.size === 1) {
            render();
        }
    }

    onParsedFinish({ metadata }: ModeHookOnParsedFinishContext): void {
        context.update(() => ({
            parser: {
                metadata,
                isComplete: true,
            },
        }));
    }
}

export default () => new RsvpMode();
