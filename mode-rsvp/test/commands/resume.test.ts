import { type Reader, createReader } from '@lectorjs/primitives';
import { createMockParser } from '@lectorjs/primitives/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { context } from '../../src/context.ts';
import { RsvpMode } from '../../src/mode.ts';

describe('resume', () => {
    let reader: Reader<RsvpMode>;

    beforeEach(async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });

        reader = createReader({
            mode: new RsvpMode(),
            parser: createMockParser('word1 word2 word3 word4 word5 word6 word7 word8 word9 word10'),
            renderTo: document.body,
        });

        await new Promise(setImmediate); // Wait for parser to stream data into the context
    });

    afterEach(() => {
        vi.useRealTimers();

        context.destroy();
    });

    it('sets `isPlaying` to `true`', () => {
        reader.commands.resume();

        expect(context.get().isPlaying).toBe(true);
    });

    it('exits if the reader is already playing', () => {
        context.update(() => ({ isPlaying: true }));

        const resumePromise = reader.commands.resume();

        expect(resumePromise).resolves.toBeUndefined();
        expect(context.get().checkpoint).toBe(0);
    });

    it('updates the checkpoint correctly when resuming', async () => {
        context.update(() => ({ checkpoint: 3, isPlaying: false }));

        reader.commands.resume();

        expect(context.get().checkpoint).toBe(4);
    });

    it('sets `isFinished` to `true` and `isPlaying` to `false` when all words have been processed', async () => {
        await reader.commands.resume();

        expect(context.get().isFinished).toBe(true);
        expect(context.get().isPlaying).toBe(false);
    });

    it('respects pauses during playback', async () => {
        reader.commands.resume();
        expect(context.get().isPlaying).toBe(true);
        expect(context.get().checkpoint).toBe(1);

        reader.commands.pause();
        expect(context.get().isPlaying).toBe(false);
        expect(context.get().checkpoint).toBe(1);

        reader.commands.resume();
        expect(context.get().isPlaying).toBe(true);
        expect(context.get().checkpoint).toBe(2);

        await vi.advanceTimersToNextTimerAsync();
        reader.commands.pause();
        expect(context.get().isPlaying).toBe(false);
        expect(context.get().checkpoint).toBe(4);
    });

    it('resumes from the beginning after resuming when finished', async () => {
        await reader.commands.resume();
        expect(context.get().isFinished).toBe(true);
        expect(context.get().isPlaying).toBe(false);
        expect(context.get().checkpoint).toBe(context.get().parser.data.size - 1);

        reader.commands.resume();
        expect(context.get().isFinished).toBe(false);
        expect(context.get().isPlaying).toBe(true);
        expect(context.get().checkpoint).toBe(1);
    });
});
