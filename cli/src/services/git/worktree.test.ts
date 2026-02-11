import { mock, expect, test, describe, beforeEach, afterEach, spyOn } from "bun:test";
import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";

const mockGit = {
  raw: mock(async () => []),
  revparse: mock(async () => "/root"),
  status: mock(async () => ({ files: [] })),
  add: mock(async () => {}),
  commit: mock(async () => {}),
  fetch: mock(async () => {}),
  merge: mock(async () => {}),
};

mock.module("simple-git", () => ({
  default: mock(() => mockGit),
  simpleGit: mock(() => mockGit),
}));

import * as worktreeService from "./worktree.js";

describe("Worktree Service", () => {
  let existsSpy: any;
  let mkdirSpy: any;
  let readdirSpy: any;
  let copyFileSpy: any;

  beforeEach(() => {
    Object.values(mockGit).forEach(m => m.mockClear());
    existsSpy = spyOn(fs, "existsSync");
    mkdirSpy = spyOn(fsPromises, "mkdir").mockResolvedValue(undefined as any);
    readdirSpy = spyOn(fsPromises, "readdir").mockResolvedValue([]);
    copyFileSpy = spyOn(fsPromises, "copyFile").mockResolvedValue(undefined as any);
  });

  afterEach(() => {
    existsSpy.mockRestore();
    mkdirSpy.mockRestore();
    readdirSpy.mockRestore();
    copyFileSpy.mockRestore();
  });

  describe("createPickleWorktree", () => {
    test("should call git worktree add", async () => {
      // Ensure worktree doesn't exist so it triggers the prune and add
      existsSpy.mockReturnValueOnce(true); // .pickle exists
      existsSpy.mockReturnValueOnce(false); // session-test doesn't exist

      const { worktreeDir, branchName } = await worktreeService.createPickleWorktree("test", "main", "/wd", mockGit as any);

      expect(branchName).toBe("pickle/session-test");
      expect(mockGit.raw).toHaveBeenCalledWith(["worktree", "prune"]);
      expect(mockGit.raw).toHaveBeenCalledWith([
        "worktree", "add", "-B", branchName, worktreeDir, "main"
      ]);
    });
  });

  describe("getGitRoot", () => {
    test("should return revparse toplevel", async () => {
      mockGit.revparse.mockResolvedValueOnce("/git/root");
      const root = await worktreeService.getGitRoot("/git/root/subdir", mockGit as any);
      expect(root).toBe("/git/root");
    });

    test("should fallback to provided dir on error", async () => {
      mockGit.revparse.mockRejectedValueOnce(new Error("Not a git repo"));
      const root = await worktreeService.getGitRoot("/some/dir", mockGit as any);
      expect(root).toBe("/some/dir");
    });
  });

  describe("syncWorktreeToOriginal", () => {
    test("should commit worktree changes and merge", async () => {
      // Mock worktree exists
      existsSpy.mockReturnValue(true);
      // Mock worktree has changes
      mockGit.status.mockResolvedValueOnce({ files: ["mod.ts"] } as any);

      await worktreeService.syncWorktreeToOriginal("/wt", "/orig", "pickle/test", mockGit as any, mockGit as any);

      expect(mockGit.add).toHaveBeenCalledWith("-A");
      expect(mockGit.commit).toHaveBeenCalled();
      expect(mockGit.merge).toHaveBeenCalled();
    });
  });

  describe("cleanupPickleWorktree", () => {
    test("should call worktree remove", async () => {
      // Mock worktree exists
      existsSpy.mockReturnValue(true);

      await worktreeService.cleanupPickleWorktree("/wt", "/orig", mockGit as any);

      expect(mockGit.raw).toHaveBeenCalledWith(["worktree", "remove", "-f", "/wt"]);
      expect(mockGit.raw).toHaveBeenCalledWith(["worktree", "prune"]);
    });
  });
});
