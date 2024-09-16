// Workaround for https://github.com/jsr-io/jsr/issues/544

import { $, Glob } from "bun";

const glob = new Glob("**/*/package.json");
const scannedFiles = (await Array.fromAsync(glob.scan({ cwd: "." }))).filter(
    (path) => !path.startsWith("_") && !path.includes("node_modules"),
);

await Promise.all(
    scannedFiles.map(async (packageJsonPath) => {
        const jsrJsonPath = packageJsonPath.replace("package.json", "jsr.json");

        try {
            await $`jq '{ name, version, description, exports }' ${packageJsonPath} > ${jsrJsonPath}`;
            console.info(`✅ Synced ${jsrJsonPath}`);
        } catch (error) {
            console.error(`❌ Failed to sync ${jsrJsonPath}:`, error);
        }
    }),
);
