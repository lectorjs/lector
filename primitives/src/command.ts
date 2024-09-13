export interface Command {
    execute(context: CommandExecutionContext): void | Promise<void>;
}

export type CommandExecutionContext = {
    render: () => void;
};

export type CommandConfigFactory<T extends Command> = () => T;
export type CommandConfigFactoryAsync<T extends Command> = (input: T) => Promise<T>;
export type CommandConfigInput<T extends Command> = CommandConfigFactory<T> | CommandConfigFactoryAsync<T>;

export function defineCommand<T extends Command>(config: CommandConfigFactory<T>): CommandConfigFactory<T>;
export function defineCommand<T extends Command>(config: CommandConfigFactoryAsync<T>): CommandConfigFactoryAsync<T>;
export function defineCommand<T extends Command>(config: CommandConfigInput<T>) {
    return config;
}
