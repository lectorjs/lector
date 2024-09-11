> [!IMPORTANT]
> This project is currently in a very early stage of development. As such,
> features and documentation are subject to change.

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/ju4n97/librereader/ci.yaml?style=flat-square)

## Packages

| Package                                                                            | Changelog                                                                                                                                                      |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@librereader/primitives](https://www.npmjs.com/package/@librereader/primitives)   | [![NPM Version](https://img.shields.io/npm/v/@librereader/primitives?style=flat-square&color=yellow)](https://www.npmjs.com/package/@librereader/primitives)   |
| [@librereader/mode-rsvp](https://www.npmjs.com/package/@librereader/mode-rsvp)     | [![NPM Version](https://img.shields.io/npm/v/@librereader/mode-rsvp?style=flat-square&color=yellow)](https://www.npmjs.com/package/@librereader/mode-rsvp)     |
| [@librereader/mode-bionic](https://www.npmjs.com/package/@librereader/mode-bionic) | [![NPM Version](https://img.shields.io/npm/v/@librereader/mode-bionic?style=flat-square&color=yellow)](https://www.npmjs.com/package/@librereader/mode-bionic) |
| [@librereader/parser-txt](https://www.npmjs.com/package/@librereader/parser-txt)   | [![NPM Version](https://img.shields.io/npm/v/@librereader/parser-txt?style=flat-square&color=yellow)](https://www.npmjs.com/package/@librereader/parser-txt)   |

## Use LibreReader

Refer to the [user's guide](https://librereader.pages.dev/docs/users) for more
information.

## Build with LibreReader

Refer to the [developer's guide](https://librereader.pages.dev/docs/developers) for
more information.

## Contributing

<details>
    <summary>Local development</summary>

- Clone this repository.
- Install the latest version of [Bun](https://bun.sh/).
- Install the project dependencies with `bun install`.
- Run:
  - `bun run dev:play` to start the development server of the web playground.
  - `bun run dev:browser` to start the development server of the browser extension.
  - `bun run test` to run the unit tests.
  - `bun run lint` to run the linter.
  - `bun run format` to run the formatter.

</details>

Refer to the [contributor's guide](CONTRIBUTING.md) for more in-depth
information.

## License

[MIT](LICENSE)
