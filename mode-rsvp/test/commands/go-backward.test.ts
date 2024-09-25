import { type Reader, createReader } from '@lectorjs/primitives';
import { createMockParser } from '@lectorjs/primitives/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { context } from '../../src/context.ts';
import { RsvpMode } from '../../src/mode.ts';

describe('goBackward', () => {
    let reader: Reader<RsvpMode>;

    beforeEach(async () => {
        reader = createReader({
            mode: new RsvpMode(),
            parser: createMockParser('word1 word2 word3'),
            renderTo: document.body,
        });

        await new Promise(setImmediate); // Wait for parser to stream data into the context

        context.subscribe(() => reader.render());
    });

    afterEach(() => {
        context.destroy();
    });

    it('executes the goBackward command correctly and does not go beyond the first word', () => {
        reader.commands.goToEnd();
        expect(document.body.innerHTML).toMatchInlineSnapshot(`"<span>word3</span>"`);

        reader.commands.goBackward();
        expect(document.body.innerHTML).toMatchInlineSnapshot(`"<span>word2</span>"`);

        reader.commands.goBackward();
        expect(document.body.innerHTML).toMatchInlineSnapshot(`"<span>word1</span>"`);

        // Try to go beyond the last word
        reader.commands.goBackward();
        expect(document.body.innerHTML).toMatchInlineSnapshot(`"<span>word1</span>"`);
    });
});
