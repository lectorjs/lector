import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const PACKAGES_TO_SKIP = new Set(['lector']);

const alias: Record<string, string> = {
	lector: resolve(__dirname, './packages/lector/src/'),
};

const packagesDir = resolve(__dirname, 'packages');
const packageNames = readdirSync(packagesDir);

for (const packageName of packageNames) {
	if (!PACKAGES_TO_SKIP.has(packageName)) {
		alias[`@lectorjs/${packageName}`] = resolve(__dirname, `./packages/${packageName}/src/`);
	}
}

export { alias };
