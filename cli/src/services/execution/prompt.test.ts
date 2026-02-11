import { expect, test, describe, beforeEach, afterEach, mock, spyOn } from "bun:test";
import { buildPrompt } from "./prompt.js";
import type { SessionState } from "../config/types.js";
import type { Task } from "../../types/tasks.js";
import { join } from "node:path";
import * as fsPromises from "node:fs/promises";
import * as fs from "node:fs";
import { tmpdir } from "node:os";
import * as resources from "../../utils/resources.js";
import * as persona from "../../utils/persona.js";

describe("Prompt Logic (buildPrompt)", () => {
    let tempDir: string;
    let skillPathSpy: any;
    let extensionRootSpy: any;
    let cliCommandSpy: any;
    let personaSpy: any;

    beforeEach(async () => {
        tempDir = join(tmpdir(), `pickle-prompt-test-${Math.random().toString(36).slice(2)}`);
        await fsPromises.mkdir(tempDir, { recursive: true });

        const skillsDir = join(tempDir, "skills");
        await fsPromises.mkdir(skillsDir, { recursive: true });
        await fsPromises.writeFile(join(skillsDir, "prd-drafter.md"), "PRD Skill content");
        await fsPromises.writeFile(join(skillsDir, "ticket-manager.md"), "Ticket Skill content");
        await fsPromises.writeFile(join(skillsDir, "code-researcher.md"), "Research Skill content");

        const sessionDir = join(tempDir, "session");
        await fsPromises.mkdir(sessionDir, { recursive: true });
        const ticketDir = join(sessionDir, "ticket1");
        await fsPromises.mkdir(ticketDir, { recursive: true });
        await fsPromises.writeFile(join(ticketDir, "linear_ticket_ticket1.md"), "status: Triage\ntitle: Ticket 1");

        skillPathSpy = spyOn(resources, "resolveSkillPath").mockImplementation((name: string) => join(skillsDir, `${name}.md`));
        extensionRootSpy = spyOn(resources, "getExtensionRoot").mockReturnValue(tempDir);
        cliCommandSpy = spyOn(resources, "getCliCommand").mockReturnValue("pickle");
        personaSpy = spyOn(persona, "PICKLE_PERSONA", "get").mockReturnValue("I AM PICKLE RICK");
    });

    afterEach(async () => {
        skillPathSpy.mockRestore();
        extensionRootSpy.mockRestore();
        cliCommandSpy.mockRestore();
        personaSpy.mockRestore();
        await fsPromises.rm(tempDir, { recursive: true, force: true });
    });

    const getBaseState = (sessionDir: string): SessionState => ({
        active: true,
        working_dir: join(tempDir, "working"),
        session_dir: sessionDir,
        step: "prd",
        iteration: 1,
        max_iterations: 10,
        max_time_minutes: 30,
        worker_timeout_seconds: 300,
        start_time_epoch: Date.now(),
        completion_promise: "DONE",
        original_prompt: "Test prompt",
        current_ticket: null,
        history: [],
        started_at: new Date().toISOString()
    });

    test("should generate PRD phase prompt", async () => {
        const sessionDir = join(tempDir, "session");
        const task: Task = { id: "phase-prd", title: "PRD", body: "", completed: false };
        const prompt = await buildPrompt(getBaseState(sessionDir), task);
        
        expect(prompt).toContain("Phase: REQUIREMENTS");
        expect(prompt).toContain("PRD Skill content");
        expect(prompt).toContain("I AM PICKLE RICK");
    });

    test("should generate Breakdown phase prompt", async () => {
        const sessionDir = join(tempDir, "session");
        const task: Task = { id: "phase-breakdown", title: "Breakdown", body: "", completed: false };
        const prompt = await buildPrompt(getBaseState(sessionDir), task);
        
        expect(prompt).toContain("Phase: BREAKDOWN");
        expect(prompt).toContain("Ticket Skill content");
    });

    test("should generate Research phase prompt for a new ticket", async () => {
        const sessionDir = join(tempDir, "session");
        const task: Task = { id: "ticket1", title: "Ticket 1", body: "", completed: false };
        const prompt = await buildPrompt(getBaseState(sessionDir), task);
        
        expect(prompt).toContain("Phase: RESEARCH (Ticket: Ticket 1)");
        expect(prompt).toContain("Research Skill content");
        expect(prompt).toContain("linear_ticket_ticket1.md");
    });

    test("should fail if ticket file is missing", async () => {
        const sessionDir = join(tempDir, "session");
        const task: Task = { id: "missing", title: "Missing", body: "", completed: false };
        
        await expect(buildPrompt(getBaseState(sessionDir), task)).rejects.toThrow("CRITICAL ERROR: Ticket file missing");
    });
});
