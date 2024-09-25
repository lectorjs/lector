import type { Command, Mode, ModeHookOnParsedFinishContext, ModeHookOnWordParsedContext } from '@lectorjs/primitives';
import goBackward from './commands/go-backward.ts';
import goForward from './commands/go-forward.ts';
import goToEnd from './commands/go-to-end.ts';
import goToStart from './commands/go-to-start.ts';
import pause from './commands/pause.ts';
import resume from './commands/resume.ts';
import toggle from './commands/toggle.ts';
import { context, defaultContext } from './context.ts';

export type RsvpModeCommands = {
    goToStart: Command;
    goToEnd: Command;
    goBackward: Command;
    goForward: Command;
    pause: Command;
    resume: Command;
    toggle: Command;
};

export class RsvpMode implements Mode<RsvpModeCommands> {
    get commands(): RsvpModeCommands {
        return {
            goToStart: goToStart(),
            goToEnd: goToEnd(),
            goBackward: goBackward(),
            goForward: goForward(),
            pause: pause(),
            resume: resume(),
            toggle: toggle(),
        };
    }

    constructor() {
        context.create(defaultContext());
    }

    render(): string {
        const ctx = context.get();

        return `<span>${ctx.currentValue()}</span>`;
    }

    onWordParsed({ data, render }: ModeHookOnWordParsedContext): void {
        context.update(
            () => ({
                parser: { data },
            }),
            {
                shouldNotifySubscribers: false,
            },
        );

        const ctx = context.get();

        // Trigger first render based on the `wordsPerCycle` option after the first set of available words are streamed
        if (data.size % ctx.options.wordsPerCycle === 0) {
            render();
        }
    }

    onParsedFinish({ metadata }: ModeHookOnParsedFinishContext): void {
        context.update(
            () => ({
                parser: {
                    metadata,
                    isComplete: true,
                },
            }),
            {
                shouldNotifySubscribers: false,
            },
        );
    }
}
