import { mock, expect, test, describe, beforeEach, afterEach, spyOn } from "bun:test";
import * as fsPromises from "node:fs/promises";
import { logInfo, logSuccess, logError, logWarn, logDebug } from "./logger.js";

describe("UI Logger", () => {
  let appendSpy: any;
  let mkdirSpy: any;

  beforeEach(() => {
    appendSpy = spyOn(fsPromises, "appendFile").mockResolvedValue(undefined as any);
    mkdirSpy = spyOn(fsPromises, "mkdir").mockResolvedValue(undefined as any);
  });

  afterEach(() => {
    appendSpy.mockRestore();
    mkdirSpy.mockRestore();
  });

  const waitForAppend = () => new Promise<void>((resolve) => {
    const check = () => {
      if (appendSpy.mock.calls.length > 0) {
        resolve();
      } else {
        setTimeout(check, 10);
      }
    };
    check();
  });

  test("logInfo should write [INFO] prefix to log file", async () => {
    logInfo("Test message");
    await waitForAppend();
    
    expect(mkdirSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    const content = (appendSpy.mock.calls[0] as any[])[1];
    expect(content).toContain("[INFO] Test message\n");
  });

  test("logSuccess should write [SUCCESS] prefix", async () => {
    logSuccess("Great success");
    await waitForAppend();
    expect(appendSpy).toHaveBeenCalled();
    expect((appendSpy.mock.calls[0] as any[])[1]).toContain("[SUCCESS] Great success\n");
  });

  test("logError should write [ERROR] prefix", async () => {
    logError("Terrible failure");
    await waitForAppend();
    expect(appendSpy).toHaveBeenCalled();
    expect((appendSpy.mock.calls[0] as any[])[1]).toContain("[ERROR] Terrible failure\n");
  });

  test("logWarn should write [WARN] prefix", async () => {
    logWarn("Be careful");
    await waitForAppend();
    expect(appendSpy).toHaveBeenCalled();
    expect((appendSpy.mock.calls[0] as any[])[1]).toContain("[WARN] Be careful\n");
  });

  test("logDebug should write [DEBUG] prefix", async () => {
    logDebug("Secret stuff");
    await waitForAppend();
    expect(appendSpy).toHaveBeenCalled();
    expect((appendSpy.mock.calls[0] as any[])[1]).toContain("[DEBUG] Secret stuff\n");
  });
});
