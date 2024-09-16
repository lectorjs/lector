import type { Command } from "@lectorjs/primitives";
import { context } from "../context.ts";

export default function (): Command {
    return ({ render }) => {
        context.update((ctx) => ({
            checkpoint: Math.max(0, ctx.checkpoint - 1),
        }));

        render();
    };
}
