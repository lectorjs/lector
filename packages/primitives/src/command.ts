export type CommandExecutionContext = {
	render: () => void;
};

export type Command = {
	execute: (context: CommandExecutionContext) => void | Promise<void>;
};

export function defineCommand<T extends () => Command>(def: T): T {
	return def;
}
