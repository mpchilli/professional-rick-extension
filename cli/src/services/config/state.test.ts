import { expect, test, describe, beforeEach, afterEach, mock, spyOn } from "bun:test";
import { join } from "node:path";
import * as fsPromises from "node:fs/promises";
import * as fs from "node:fs";
import { tmpdir } from "node:os";
import * as os from "node:os";
import { getSessionPath, loadState, saveState, createSession, listSessions } from "./state.js";
import * as settings from "./settings.js";
import * as projectRoot from "../../utils/project-root.js";

describe("Config State", () => {
  let tempDir: string;
  let homeSpy: any;
  let rootSpy: any;
  let settingsSpy: any;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `pickle-state-test-${Math.random().toString(36).slice(2)}`);
    await fsPromises.mkdir(tempDir, { recursive: true });
    
    homeSpy = spyOn(os, "homedir").mockReturnValue(tempDir);
    rootSpy = spyOn(projectRoot, "findProjectRoot").mockReturnValue(tempDir);
    settingsSpy = spyOn(settings, "loadSettings").mockResolvedValue({ max_iterations: 15 });
  });

  afterEach(async () => {
    homeSpy.mockRestore();
    rootSpy.mockRestore();
    settingsSpy.mockRestore();
    await fsPromises.rm(tempDir, { recursive: true, force: true });
  });

  test("getSessionPath should return correct path", () => {
    const path = getSessionPath(tempDir, "sid");
    expect(path).toContain(join(".pickle", "sessions", "sid"));
  });

  test("saveState and loadState should work together", async () => {
    const sessionDir = join(tempDir, ".pickle", "sessions", "test-session");
    await fsPromises.mkdir(sessionDir, { recursive: true });
    
    const state: any = {
      active: true,
      working_dir: tempDir,
      step: "prd",
      iteration: 1,
      max_iterations: 10,
      max_time_minutes: 60,
      worker_timeout_seconds: 1200,
      start_time_epoch: Math.floor(Date.now() / 1000),
      completion_promise: "DONE",
      original_prompt: "test prompt",
      current_ticket: "t1",
      history: [],
      started_at: new Date().toISOString(),
      session_dir: sessionDir
    };

    await saveState(sessionDir, state);
    const loaded = await loadState(sessionDir);
    expect(loaded).not.toBeNull();
    expect(loaded?.original_prompt).toBe("test prompt");
  });

  test("loadState should return null if file does not exist", async () => {
    const loaded = await loadState(join(tempDir, "non-existent"));
    expect(loaded).toBeNull();
  });

  test("createSession should initialize a valid session", async () => {
    const state = await createSession(tempDir, "new session prompt");
    expect(state.original_prompt).toBe("new session prompt");
    expect(state.working_dir).toBe(tempDir);
    
    // Verify it was actually saved
    const loaded = await loadState(state.session_dir);
    expect(loaded).not.toBeNull();
    expect(loaded?.original_prompt).toBe("new session prompt");
  });
});
