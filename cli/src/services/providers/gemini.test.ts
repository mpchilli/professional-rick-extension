import { expect, test, describe, beforeEach, afterEach, spyOn } from "bun:test";
import { GeminiProvider } from "./gemini.js";
import { normalize, join } from "node:path";
import * as fsPromises from "node:fs/promises";
import * as os from "node:os";
import { tmpdir } from "node:os";

describe("GeminiProvider", () => {
  let tempDir: string;
  let homeSpy: any;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `pickle-gemini-test-${Math.random().toString(36).slice(2)}`);
    await fsPromises.mkdir(tempDir, { recursive: true });
    homeSpy = spyOn(os, "homedir").mockReturnValue(tempDir);
  });

  afterEach(async () => {
    homeSpy.mockRestore();
    await fsPromises.rm(tempDir, { recursive: true, force: true });
  });

  test("getModelName should return model name from settings", async () => {
    const settingsDir = join(tempDir, ".gemini");
    await fsPromises.mkdir(settingsDir, { recursive: true });
    await fsPromises.writeFile(join(settingsDir, "settings.json"), JSON.stringify({
      model: {
        name: "gemini-3-flash-preview"
      }
    }));

    const provider = new GeminiProvider();
    const modelName = await provider.getModelName();
    expect(modelName).toBe("gemini-3-flash-preview");
  });

  test("getModelName should return undefined if file reading fails", async () => {
    const provider = new GeminiProvider();
    const modelName = await provider.getModelName();
    expect(modelName).toBeUndefined();
  });
});
