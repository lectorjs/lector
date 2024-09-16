import type { Command } from "@lectorjs/primitives";
import { context } from "../context.ts";
import pauseCommand from "./pause.ts";
import resumeCommand from "./resume.ts";

export default function (): Command {
    const pause = pauseCommand();
    const resume = resumeCommand();

    return (execCtx) => {
        context.get().isPlaying ? pause(execCtx) : resume(execCtx);
    };
}
