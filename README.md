> [!IMPORTANT]
> This project is currently in a very early stage of development. As such,
> features and documentation are subject to change.

# Lector

Highly customizable reading tool that helps you read faster, stay focused, and
improve comprehension. It's available as a browser extension, web playground, or
JSR packages in case you want to build something with it (e.g., plugins or
reading modes).

- 📚 Documentation - **(🚧 WIP)**
- 🌐 Browser extension - **(🚧 WIP)**
- 🌐 Browser extension - **(🚧 WIP)**
- 🎮 Web playground - **(🚧 WIP)**
- 🔌 Plugins - **(🚧 WIP)**

## Supported reading modes

At the moment, Lector supports the following reading modes out of the box:

- **Rapid serial visual presentation (RSVP)**: This mode displays words or
  chunks of text one at a time in quick succession, allowing you to read faster
  by minimizing eye movement. RSVP is ideal for speed reading, helping you
  process text more efficiently and comfortably, while maintaining
  comprehension.

- **Bionic reading**: Inspired by the
  [Bionic reading method](https://bionic-reading.com/br-method/), this mode
  enhances your reading experience by emphasizing the initial letters of words,
  guiding your eyes through the text and improving focus, retention, and reading
  speed.

> [!NOTE]
> Additional reading modes can be created using Lector primitives.
> [Learn more](https://lector.pages.dev/docs/primitives)

## Packages

| Package                                   | Changelog                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| [@lector/primitives](packages/primitives) | [![JSR](https://jsr.io/badges/@lector/primitives)](https://jsr.io/@lector/primitives) |
| [@lector/rsvp](packages/rsvp)             | [![JSR](https://jsr.io/badges/@lector/rsvp)](https://jsr.io/@lector/rsvp)             |
| [@lector/bionic](packages/bionic)         | [![JSR](https://jsr.io/badges/@lector/bionic)](https://jsr.io/@lector/bionic)         |

## Use lector

Refer to the [user's guide](https://lector.pages.dev/docs/users) for more
information.

## Build with Lector

Refer to the [developer's guide](https://lector.pages.dev/docs/developers) for
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

</details>

Refer to the [contributor's guide](CONTRIBUTING.md) for more in-depth
information.

## License

[MIT](LICENSE)
