import { type Mode, defineMode } from '@librereader/primitives';

const mode = defineMode(() => {
	return {
		render() {
			const dummyText = 'This is some dummy text to test the early version of the bionic reading mode.';

			const formattedText = dummyText
				.split(' ')
				.filter(Boolean)
				.map((word) => {
					const highlightPart = word.slice(0, Math.ceil(word.length / 2));
					const restPart = word.slice(Math.ceil(word.length / 2));
					return `<span><strong>${highlightPart}</strong>${restPart}</span>`;
				})
				.join(' ');

			return formattedText;
		},
	} satisfies Mode;
});

export default mode;
