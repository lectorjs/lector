import { defineContext } from '@lectorjs/primitives';

export type RsvpContext = {
    checkpoint: number;
    isPlaying: boolean;
    isFinished: boolean;
};

export const { getContext, updateContext, subscribeContext, destroyContext } = defineContext<RsvpContext>(
    Symbol('rsvp'),
    {
        checkpoint: 0,
        isPlaying: false,
        isFinished: false,
    },
);
