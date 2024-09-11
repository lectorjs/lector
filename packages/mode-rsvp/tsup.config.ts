import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
	entry: ['src/index.ts'],
	format: ['esm'],
	dts: true,
	clean: true,
	minify: !options.watch,
	sourcemap: !!options.watch,
}));
