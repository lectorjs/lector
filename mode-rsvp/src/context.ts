import { type Context, initializeContext } from '@lectorjs/primitives';

export const RSVP_CONTEXT_KEY = Symbol('rsvp');

export type RsvpContext = Context<{
    checkpoint: number;
    isPlaying: boolean;
    isFinished: boolean;
}>;

export const defaultContext = (): RsvpContext =>
    initializeContext({
        checkpoint: 0,
        isPlaying: false,
        isFinished: false,
    });
