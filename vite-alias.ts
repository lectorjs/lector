// TODO: Workaround for https://github.com/unjs/unbuild/issues/121 and https://github.com/unjs/jiti/issues/150

import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const PACKAGES_TO_SKIP = new Set(['librereader']);

const alias: Record<string, string> = {
	librereader: resolve(__dirname, './packages/librereader/src/'),
};

const packagesDir = resolve(__dirname, 'packages');
const packageNames = readdirSync(packagesDir);

for (const packageName of packageNames) {
	if (!PACKAGES_TO_SKIP.has(packageName)) {
		alias[`@librereader/${packageName}`] = resolve(__dirname, `./packages/${packageName}/src/`);
	}
}

export { alias };
