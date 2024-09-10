/**
 * Primitives for building and extending readers.
 *
 * @example
 * ```ts
 * import { createReader } from '@lector/primitives';
 *
 * const app = document.querySelector('#app') as HTMLDivElement;
 *
 * const reader = createReader({
 *   renderTo: app,
 * });
 *
 * reader.render();
 * ```
 *
 * @module
 */

export * from './src/reader.ts';
