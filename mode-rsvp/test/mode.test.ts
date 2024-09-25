import { type Reader, createReader } from '@lectorjs/primitives';
import { createMockParser } from '@lectorjs/primitives/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { context } from '../src/context.ts';
import { RsvpMode } from '../src/mode.ts';

describe('rsvp', () => {
    let reader: Reader<RsvpMode>;

    beforeEach(async () => {
        reader = createReader({
            mode: new RsvpMode(),
            parser: createMockParser('word1 word2 word3 word4 word5 word6 word7 word8 word9 word10'),
            renderTo: document.body,
        });

        await new Promise(setImmediate); // Wait for parser to stream data into the context
    });

    afterEach(() => {
        context.destroy();
    });

    it('initializes with correct context defaults', () => {
        const ctx = context.get();

        expect(ctx.checkpoint).toBe(0);
        expect(ctx.isPlaying).toBe(false);
        expect(ctx.isFinished).toBe(false);
        expect(ctx.options.wordsPerMinute).toBe(300);
        expect(ctx.options.wordsPerCycle).toBe(1);
    });

    describe('firstWord', () => {
        it('returns the first word correctly', () => {
            expect(context.get().firstWord()).toEqual(
                expect.objectContaining({
                    value: 'word1',
                }),
            );
        });
    });

    describe('lastWord', () => {
        it('returns the last word correctly', () => {
            expect(context.get().lastWord()).toEqual(
                expect.objectContaining({
                    value: 'word10',
                }),
            );
        });
    });

    describe('currentValue', () => {
        it('returns the current value correctly', () => {
            expect(context.get().currentValue()).toBe('word1');

            reader.commands.goForward();
            expect(context.get().currentValue()).toBe('word2');

            reader.commands.goToEnd();
            expect(context.get().currentValue()).toBe('word10');
        });

        it('returns the current value correctly with increased words per cycle', () => {
            context.update(() => ({
                options: { wordsPerCycle: 2 },
            }));
            expect(context.get().currentValue()).toBe('word1 word2');

            context.update(() => ({
                options: { wordsPerCycle: 3 },
            }));
            expect(context.get().currentValue()).toBe('word1 word2 word3');

            context.update(() => ({
                options: { wordsPerCycle: 6 },
            }));
            expect(context.get().currentValue()).toBe('word1 word2 word3 word4 word5 word6');
        });
    });

    describe('currentProgress', () => {
        it('calculates progress correctly', () => {
            expect(context.get().currentProgress()).toBe(0);

            reader.commands.goForward();
            reader.commands.goForward();
            expect(context.get().currentProgress()).toBeGreaterThan(20);

            reader.commands.goForward();
            reader.commands.goForward();
            expect(context.get().currentProgress()).toBeGreaterThanOrEqual(40);

            reader.commands.goToEnd();
            expect(context.get().currentProgress()).toBe(100);
        });
    });

    describe('precedingWords', () => {
        it('gets preceding words correctly', () => {
            reader.commands.goToEnd();
            expect(context.get().precedingWords()).toHaveLength(9);

            reader.commands.goBackward();
            expect(context.get().precedingWords()).toHaveLength(8);

            reader.commands.goToStart();
            expect(context.get().precedingWords()).toHaveLength(0);
        });

        it('gets preceding words correctly with custom chunk size', () => {
            reader.commands.goToEnd();
            expect(context.get().precedingWords({ chunkSize: 3 })).toHaveLength(3);
        });

        it('gets preceding words correctly with custom checkpoint', () => {
            expect(context.get().precedingWords({ overrideCheckpoint: 3 })).toHaveLength(3);
        });
    });

    describe('succeedingWords', () => {
        it('gets succeeding words correctly', () => {
            expect(context.get().succeedingWords()).toHaveLength(9);

            reader.commands.goForward();
            expect(context.get().succeedingWords()).toHaveLength(8);

            reader.commands.goToEnd();
            expect(context.get().succeedingWords()).toHaveLength(0);
        });

        it('gets succeeding words correctly with custom chunk size', () => {
            expect(context.get().succeedingWords({ chunkSize: 3 })).toHaveLength(3);
        });

        it('gets succeeding words correctly with custom checkpoint', () => {
            expect(context.get().succeedingWords({ overrideCheckpoint: 3 })).toHaveLength(6);
        });

        it('gets succeeding nodes correctly with increased words per cycle', async () => {
            context.update(() => ({
                options: { wordsPerCycle: 3 },
            }));

            expect(context.get().succeedingWords()).toHaveLength(7);
        });
    });
});
