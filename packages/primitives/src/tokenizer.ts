export function tokenize(text: string): string[] {
	return text.match(/\S+/g) || [];
}
