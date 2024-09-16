import { type Mocked, vi } from "vitest";
import type { Command } from "../../src/command.ts";
import type { Mode } from "../../src/mode.ts";

export type MockModeCommands = {
    foo: Command;
    bar: Command;
    baz: Command;
};

export class MockMode implements Mocked<Mode<MockModeCommands>> {
    commands: MockModeCommands = {
        foo: vi.fn(),
        bar: vi.fn(),
        baz: vi.fn(),
    };

    render = vi.fn().mockReturnValue("<span>foo</span>");

    onWordParsed = vi.fn();

    onParsedFinish = vi.fn();
}
