import { Context, extendGlobalContextDefaults } from '@lectorjs/primitives';

export const RSVP_CONTEXT_KEY = Symbol('rsvp');

export type RsvpContext = {
    checkpoint: number;
    isPlaying: boolean;
    isFinished: boolean;
};

const defaultContext = extendGlobalContextDefaults<RsvpContext>({
    checkpoint: 0,
    isPlaying: false,
    isFinished: false,
});

export const context = new Context(RSVP_CONTEXT_KEY, defaultContext);
