import { type Reader, createReader } from '@lectorjs/primitives';
import { createMockParser } from '@lectorjs/primitives/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { context } from '../../src/context.ts';
import { RsvpMode } from '../../src/mode.ts';

describe('pause', () => {
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

    it('sets `isPlaying` to `false`', () => {
        reader.commands.pause();

        expect(context.get().isPlaying).toBe(false);
    });
});
