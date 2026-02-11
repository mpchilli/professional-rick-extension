import { expect, test, describe, beforeEach, afterEach, spyOn } from "bun:test";
import { CodexProvider } from "./codex.js";
import { normalize, join } from "node:path";
import * as fsPromises from "node:fs/promises";
import * as os from "node:os";
import { tmpdir } from "node:os";

describe("CodexProvider", () => {
  let tempDir: string;
  let homeSpy: any;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `pickle-codex-test-${Math.random().toString(36).slice(2)}`);
    await fsPromises.mkdir(tempDir, { recursive: true });
    homeSpy = spyOn(os, "homedir").mockReturnValue(tempDir);
  });

  afterEach(async () => {
    homeSpy.mockRestore();
    await fsPromises.rm(tempDir, { recursive: true, force: true });
  });

  test("should have correct name and cliCommand", () => {
    const provider = new CodexProvider();
    expect(provider.name).toBe("Codex");
    expect(provider.cliCommand).toBe("codex");
  });

  test("getModelName should return model from config", async () => {
    const configDir = join(tempDir, ".codex");
    await fsPromises.mkdir(configDir, { recursive: true });
    await fsPromises.writeFile(join(configDir, "config.toml"), 'model = "gpt-5.2"');

    const provider = new CodexProvider();
    const modelName = await provider.getModelName();
    expect(modelName).toBe("gpt-5.2");
  });

  test("getModelName should return undefined if config missing", async () => {
    const provider = new CodexProvider();
    const modelName = await provider.getModelName();
    expect(modelName).toBeUndefined();
  });
});
