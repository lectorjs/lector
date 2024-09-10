import { type LectorContext, defaultLectorContext } from '@lector/primitives';

export const RSVP_CONTEXT_KEY = Symbol('rsvp');

export type RsvpContext = LectorContext<{
	checkpoint: number;
	isPlaying: boolean;
}>;

export const defaultContext = (): RsvpContext =>
	defaultLectorContext({
		isPlaying: false,
		checkpoint: 0,
	});
