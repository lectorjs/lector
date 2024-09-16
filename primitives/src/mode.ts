import type { Command } from './command.ts';
import type { ParsedData, ParsedMetadata } from './parser.ts';
import type { Word } from './word.ts';

/**
 * Represents a reading mode in Lector.
 *
 * @template T The type of the mode's commands.
 */
export interface Mode<T extends Record<string, Command> = Record<string, Command>> {
    /**
     * The reading mode's list of commands.
     */
    commands?: T;

    /**
     * Renders the mode's content strategy.
     */
    render(): string;

    /**
     * Called when a word is parsed.
     *
     * @param context The hook context object - {@link ModeHookOnWordParsedContext}
     */
    onWordParsed?: (context: ModeHookOnWordParsedContext) => void | Promise<void>;

    /**
     * Called when the parsing operation is finished.
     *
     * @param context The hook context object - {@link ModeHookOnParsedFinishContext}
     */
    onParsedFinish?: (context: ModeHookOnParsedFinishContext) => void | Promise<void>;
}

/**
 * Context object passed to the `onWordParsed` hook.
 */
export type ModeHookOnWordParsedContext = {
    data: ParsedData;
    word: Word;
    render: () => void;
};

/**
 * Context object passed to the `onParsedFinish` hook.
 */
export type ModeHookOnParsedFinishContext = {
    metadata: ParsedMetadata;
    render: () => void;
};
