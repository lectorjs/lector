// Workaround for https://github.com/jsr-io/jsr/issues/544

import { $, Glob } from 'bun';

const glob = new Glob('packages/*/package.json');
const scannedFiles = await Array.fromAsync(glob.scan({ cwd: '.' }));

await Promise.all(
	scannedFiles.map(async (packageJsonPath) => {
		const jsrJsonPath = packageJsonPath.replace('package.json', 'jsr.json');

		try {
			await $`jq '{ name, version, exports }' ${packageJsonPath} > ${jsrJsonPath}`;
			console.log(`✅ Synced ${jsrJsonPath}`);
		} catch (error) {
			console.error(`❌ Failed to sync ${jsrJsonPath}:`, error);
		}
	}),
);
