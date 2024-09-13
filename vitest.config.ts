import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		watch: false,
		environment: 'happy-dom',
		coverage: {
			reporter: ['json-summary'],
			reportOnFailure: true,
		},
	},
});
