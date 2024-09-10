// Workaround for https://github.com/jsr-io/jsr/issues/544

const glob = new Bun.Glob('packages/*/package.json');
const scannedFiles = await Array.fromAsync(glob.scan({ cwd: '.' }));

for (const file of scannedFiles) {
	const packageJson = await Bun.file(file).json();
	const { version } = packageJson;

	const jsrJsonFilePath = file.replace('package.json', 'jsr.json');
	const jsrJson = await Bun.file(jsrJsonFilePath).json();

	await Bun.write(jsrJsonFilePath, JSON.stringify({ ...jsrJson, version }, null, 4));
}
