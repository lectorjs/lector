import { defineConfig } from 'vite';
import { alias } from '../vite-alias.ts';

export default defineConfig({
    resolve: {
        alias,
    },
});
