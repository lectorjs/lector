export interface Command {
	execute(context: CommandExecutionContext): void | Promise<void>;
}

export type CommandExecutionContext = {
	render: () => void;
};
