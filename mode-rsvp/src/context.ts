import { Context, type GlobalContext, defaultGlobalContext } from '@lectorjs/primitives';

export const RSVP_CONTEXT_KEY = Symbol('rsvp');

export type RsvpContext = GlobalContext<{
    checkpoint: number;
    isPlaying: boolean;
    isFinished: boolean;
}>;

const defaultContext: RsvpContext = {
    ...defaultGlobalContext(),
    checkpoint: 0,
    isPlaying: false,
    isFinished: false,
};

export const context: Context<RsvpContext> = new Context(RSVP_CONTEXT_KEY, defaultContext);
