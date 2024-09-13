/**
 * Tokenizes a string into an array of words.
 */
export function tokenize(text: string): string[] {
    return text.match(/\S+/g) || [];
}
