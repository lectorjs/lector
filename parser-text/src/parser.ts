import { type Parser, tokenize } from '@lectorjs/primitives';

function parser(input: string): Parser {
    const words = tokenize(input);
    const metadata = {};

    return {
        *getWord() {
            for (const word of words) {
                yield {
                    value: word,
                    insights: {
                        difficulty: 1,
                    },
                };
            }
        },
        getMetadata: () => metadata,
    };
}

export default parser;
