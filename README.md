> [!IMPORTANT]
> This project is currently in a very early stage of development. As such,
> features and documentation are subject to change.

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/ju4n97/lector/ci.yaml?style=flat&colorA=000000)

## Packages

| Package                                                   | Changelog                                                                               |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [@lectorjs/primitives](https://jsr.io/@lectorjs/primitives)   | [![JSR](https://jsr.io/badges/@lectorjs/primitives)](https://jsr.io/@lectorjs/primitives)   |
| [@lectorjs/mode-rsvp](https://jsr.io/@lectorjs/mode-rsvp)     | [![JSR](https://jsr.io/badges/@lectorjs/mode-rsvp)](https://jsr.io/@lectorjs/mode-rsvp)     |
| [@lectorjs/mode-bionic](https://jsr.io/@lectorjs/mode-bionic) | [![JSR](https://jsr.io/badges/@lectorjs/mode-bionic)](https://jsr.io/@lectorjs/mode-bionic) |
| [@lectorjs/parser-text](https://jsr.io/@lectorjs/parser-text)   | [![JSR](https://jsr.io/badges/@lectorjs/parser-text)](https://jsr.io/@lectorjs/parser-text)   |

## Use Lector

Refer to the [user's guide](https://lectorjs.pages.dev/docs/users) for more
information.

## Build with Lector

Refer to the [developer's guide](https://lectorjs.pages.dev/docs/developers) for
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
