/**
 * Represents a command that can be executed by the reader.
 */
export type Command = (context: CommandExecutionContext) => void | Promise<void>;

/**
 * Execution context of a command that provides a subset of domain-specific manipulation logic for the reader.
 */
export type CommandExecutionContext = {
    render: () => void;
};
