import { expect, test, describe, beforeEach, afterEach, mock, spyOn } from "bun:test";
import { loadSettings, saveSettings, getConfiguredProvider, getConfiguredModel, updateModelSettings } from "./settings.js";
import * as fsPromises from "node:fs/promises";
import { join } from "node:path";
import { tmpdir, homedir } from "node:os";
import * as os from "node:os";

describe("Settings", () => {
  let tempDir: string;
  let homeSpy: any;
  let readFileSpy: any;
  let writeFileSpy: any;
  let mkdirSpy: any;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `pickle-settings-test-${Math.random().toString(36).slice(2)}`);
    await fsPromises.mkdir(tempDir, { recursive: true });
    
    homeSpy = spyOn(os, "homedir").mockReturnValue(tempDir);
    readFileSpy = spyOn(fsPromises, "readFile");
    writeFileSpy = spyOn(fsPromises, "writeFile");
    mkdirSpy = spyOn(fsPromises, "mkdir");
  });

  afterEach(async () => {
    homeSpy.mockRestore();
    readFileSpy.mockRestore();
    writeFileSpy.mockRestore();
    mkdirSpy.mockRestore();
    await fsPromises.rm(tempDir, { recursive: true, force: true });
  });

  test("loadSettings should parse settings.json", async () => {
    const settingsDir = join(tempDir, ".pickle");
    await fsPromises.mkdir(settingsDir, { recursive: true });
    await fsPromises.writeFile(join(settingsDir, "settings.json"), JSON.stringify({
      model: {
        provider: "gemini",
        model: "gemini-3-flash"
      }
    }));

    const settings = await loadSettings();
    expect(settings.model?.provider).toBe("gemini");
    expect(settings.model?.model).toBe("gemini-3-flash");
  });

  test("getConfiguredProvider should return provider from settings", async () => {
    const settingsDir = join(tempDir, ".pickle");
    await fsPromises.mkdir(settingsDir, { recursive: true });
    await fsPromises.writeFile(join(settingsDir, "settings.json"), JSON.stringify({
      model: {
        provider: "gemini"
      }
    }));

    const provider = await getConfiguredProvider();
    expect(provider).toBe("gemini");
  });

  test("getConfiguredModel should return model from settings", async () => {
    const settingsDir = join(tempDir, ".pickle");
    await fsPromises.mkdir(settingsDir, { recursive: true });
    await fsPromises.writeFile(join(settingsDir, "settings.json"), JSON.stringify({
      model: {
        model: "gemini-3-flash"
      }
    }));

    const model = await getConfiguredModel();
    expect(model).toBe("gemini-3-flash");
  });
  
  test("saveSettings should write to settings.json", async () => {
    await saveSettings({
      model: {
        provider: "claude",
        model: "claude-3-opus"
      }
    });
    
    const content = await fsPromises.readFile(join(tempDir, ".pickle", "settings.json"), "utf-8");
    const json = JSON.parse(content);
    expect(json.model.provider).toBe("claude");
  });
});
