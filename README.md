> [!IMPORTANT]
> This project is currently in a very early stage of development. As such,
> features and documentation are subject to change.

[![ci](https://github.com/ju4n97/librereader/actions/workflows/ci.yaml/badge.svg)](https://github.com/ju4n97/librereader/actions/workflows/ci.yaml)

## Packages

| Package                                                                            | Changelog                                                                                                                                  |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [@librereader/primitives](https://www.npmjs.com/package/@librereader/primitives)   | [![NPM version](https://img.shields.io/npm/v/@librereader/primitives.svg?style=flat)](https://npmjs.org/package/@librereader/primitives)   |
| [@librereader/mode-rsvp](https://www.npmjs.com/package/@librereader/mode-rsvp)     | [![NPM version](https://img.shields.io/npm/v/@librereader/mode-rsvp.svg?style=flat)](https://npmjs.org/package/@librereader/mode-rsvp)     |
| [@librereader/mode-bionic](https://www.npmjs.com/package/@librereader/mode-bionic) | [![NPM version](https://img.shields.io/npm/v/@librereader/mode-bionic.svg?style=flat)](https://npmjs.org/package/@librereader/mode-bionic) |
| [@librereader/parser-txt](https://www.npmjs.com/package/@librereader/parser-txt)   | [![NPM version](https://img.shields.io/npm/v/@librereader/parser-txt.svg?style=flat)](https://npmjs.org/package/@librereader/parser-txt)   |

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
