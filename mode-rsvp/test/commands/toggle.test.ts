import { type Reader, createReader } from '@lectorjs/primitives';
import { createMockParser } from '@lectorjs/primitives/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { context } from '../../src/context.ts';
import { RsvpMode } from '../../src/mode.ts';

describe('toggle', () => {
    let reader: Reader<RsvpMode>;

    beforeEach(async () => {
        reader = createReader({
            mode: new RsvpMode(),
            parser: createMockParser('word1 word2 word3'),
            renderTo: document.body,
        });

        await new Promise(setImmediate); // Wait for parser to stream data into the context
    });

    afterEach(() => {
        context.destroy();
    });

    it('toggles correctly between the resume and pause states', () => {
        const ctx = context.get();

        expect(ctx.isPlaying).toBe(false);

        reader.commands.toggle();
        expect(ctx.isPlaying).toBe(true);

        reader.commands.toggle();
        expect(ctx.isPlaying).toBe(false);

        reader.commands.toggle();
        expect(ctx.isPlaying).toBe(true);
    });
});
