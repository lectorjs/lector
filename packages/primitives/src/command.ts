export interface Command {
	execute(context: CommandExecutionContext): void | Promise<void>;
}

export type CommandExecutionContext = {
	render: () => void;
};

export type CommandConfigFactory = () => Command;
export type CommandConfigFactoryAsync = () => Promise<Command>;
export type CommandConfigInput = CommandConfigFactory | CommandConfigFactoryAsync;

/**
 * Create a `Mode` instance from a given configuration object or factory.
 *
 * @template T The type of the mode. Since the mode needs to be inferred from the `T` type for commands to be type safe.
 * @param config An object or factory function that takes an input of type `T` and returns a `Mode` instance.
 *
 * @returns A defined `Mode` instance.
 */
export function defineCommand(config: CommandConfigFactory): CommandConfigFactory;
export function defineCommand(config: CommandConfigFactoryAsync): CommandConfigFactoryAsync;
export function defineCommand(config: CommandConfigInput) {
	return config;
}
