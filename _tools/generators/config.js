const isEmpty = (value) => !value || (typeof value === "string" && value.trim().length === 0);

const isValidName = (value) => value.match(/^[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/g);

export default function (
    /** @type {import('plop').NodePlopAPI} */
    plop,
) {
    const cwd = process.cwd();

    plop.setGenerator("package", {
        description: "Generate a new package",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Enter the name of the package:",
                validate: (value) => {
                    if (isEmpty(value)) {
                        return "Package name cannot be empty";
                    }

                    if (!isValidName(value)) {
                        return "Package name must only contain letters, numbers, and hyphens.";
                    }

                    return true;
                },
            },
            {
                type: "input",
                name: "description",
                message: "Enter the description of the package:",
                validate: (value) => {
                    if (isEmpty(value)) {
                        return "Package description cannot be empty";
                    }

                    return true;
                },
            },
        ],
        actions: [
            {
                type: "add",
                path: `${cwd}/{{name}}/package.json`,
                templateFile: "package/package.json.hbs",
            },
            {
                type: "add",
                path: `${cwd}/{{name}}/jsr.json`,
                templateFile: "package/jsr.json.hbs",
            },
            {
                type: "add",
                path: `${cwd}/{{name}}/README.md`,
                templateFile: "package/README.md.hbs",
            },
            {
                type: "add",
                path: `${cwd}/{{name}}/src/mod.ts`,
                templateFile: "package/src/mod.ts.hbs",
            },
            {
                type: "add",
                path: `${cwd}/{{name}}/test/mod.test.ts`,
                templateFile: "package/test/mod.test.ts.hbs",
            },
            {
                type: "modify",
                path: `${cwd}/package.json`,
                transform(fileContent, answers) {
                    const packageJson = JSON.parse(fileContent);
                    packageJson.workspaces = [...packageJson.workspaces, answers.name].toSorted();
                    return JSON.stringify(packageJson, null, 4);
                },
            },
        ],
    });
}
