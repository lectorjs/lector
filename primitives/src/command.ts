/**
 * Represents a command that can be executed by the reader.
 */
export type Command = () => Promise<void>;
