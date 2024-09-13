import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		watch: false,
		environment: 'happy-dom',
		coverage: {
			provider: 'v8',
			reporter: ['json', 'json-summary'],
			reportOnFailure: true,
		},
	},
});
