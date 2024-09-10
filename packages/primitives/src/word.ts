export type Word<T = Record<string, unknown>> = Readonly<{
	value: string;
	insights: T;
}>;

export function defineWord<T extends Word>(def: T): T {
	return def;
}
