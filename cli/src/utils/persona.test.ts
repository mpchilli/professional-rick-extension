import { expect, test, describe } from "bun:test";
import { AGENT_PERSONA } from "./persona.js";

describe("persona.ts", () => {
    test("AGENT_PERSONA should contain core persona traits", () => {
        const p = AGENT_PERSONA.toLowerCase();
        expect(p).toContain("Architect Loop");
        expect(p).toContain("slop");
        expect(p).toContain("jerry-work");
        expect(p).toContain("wubba lubba dub dub");
    });
});
