import type { Command } from "@lectorjs/primitives";
import { context } from "../context.ts";

export default function (): Command {
    return ({ render }) => {
        context.update(() => ({
            isPlaying: false,
        }));

        render();
    };
}
