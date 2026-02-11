import { expect, test, describe, beforeEach, afterEach, spyOn } from "bun:test";
import { OpencodeProvider } from "./opencode.js";
import { normalize, join } from "node:path";
import * as fsPromises from "node:fs/promises";
import * as os from "node:os";
import { tmpdir } from "node:os";

describe("OpencodeProvider", () => {
  let tempDir: string;
  let homeSpy: any;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `pickle-opencode-test-${Math.random().toString(36).slice(2)}`);
    await fsPromises.mkdir(tempDir, { recursive: true });
    homeSpy = spyOn(os, "homedir").mockReturnValue(tempDir);
  });

  afterEach(async () => {
    homeSpy.mockRestore();
    await fsPromises.rm(tempDir, { recursive: true, force: true });
  });

  test("should have correct name and cliCommand", () => {
    const provider = new OpencodeProvider();
    expect(provider.name).toBe("OpenCode");
    expect(provider.cliCommand).toBe("opencode");
  });

  test("getModelName should return model from JSON config", async () => {
    const configDir = join(tempDir, ".config", "opencode");
    await fsPromises.mkdir(configDir, { recursive: true });
    await fsPromises.writeFile(join(configDir, "config.json"), JSON.stringify({
      model: "anthropic/claude-sonnet-4-5"
    }));

    const provider = new OpencodeProvider();
    const modelName = await provider.getModelName();
    expect(modelName).toBe("anthropic/claude-sonnet-4-5");
  });

  test("getModelName should return model from YAML config if JSON not found", async () => {
    const configDir = join(tempDir, ".opencode");
    await fsPromises.mkdir(configDir, { recursive: true });
    await fsPromises.writeFile(join(configDir, "config.yaml"), `model: openai/gpt-4\nother: value`);

    const provider = new OpencodeProvider();
    const modelName = await provider.getModelName();
    expect(modelName).toBe("openai/gpt-4");
  });

  test("getModelName should return undefined if no config found", async () => {
    const provider = new OpencodeProvider();
    const modelName = await provider.getModelName();
    expect(modelName).toBeUndefined();
  });

  test("isAvailable should check if opencode command exists", async () => {
    const provider = new OpencodeProvider();
    expect(typeof provider.isAvailable).toBe("function");
  });
});
