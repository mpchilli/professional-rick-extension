import { mock, expect, test, describe, beforeEach, afterEach, spyOn } from "bun:test";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const mockGit = {
        push: mock(async () => {}),
        getRemotes: mock(async () => [{ name: "origin", refs: { fetch: "git@github.com:user/repo.git" } }]),
};

mock.module("simple-git", () => ({
        default: mock(() => mockGit),
        simpleGit: mock(() => mockGit),
}));

const mockExec = mock(async () => ({ stdout: "https://github.com/user/repo/pull/1", exitCode: 0 }));

import * as baseProviders from "../providers/base.js";
import * as prService from "./pr.js";

describe("PR Service", () => {
        let tempDir: string;
        let execSpy: any;

        beforeEach(async () => {
                tempDir = join(tmpdir(), `pickle-test-${Math.random().toString(36).slice(2)}`);
                await mkdir(tempDir, { recursive: true });
                mockExec.mockClear();
                Object.values(mockGit).forEach(m => m.mockClear());
                execSpy = spyOn(baseProviders, "execCommand").mockImplementation(mockExec as any);
        });

        afterEach(async () => {
                await rm(tempDir, { recursive: true, force: true });
                execSpy.mockRestore();
        });

        describe("generatePRDescription", () => {
                test("should generate description from PRD", async () => {
                        await writeFile(join(tempDir, "prd.md"), `# My PRD
## Problem Statement
This is a problem.`);
                        
                        const desc = await prService.generatePRDescription(tempDir, "feat/test", "main");

                        expect(desc.title).toBe("My");
                        expect(desc.body).toContain("**Problem:** This is a problem.");
                        expect(desc.body).toContain("**Branch:** `feat/test` → `main`")
                });
        });

        describe("pushBranch", () => {
                test("should push with upstream flag", async () => {
                        await prService.pushBranch("feat/test", undefined, mockGit as any);
                        expect(mockGit.push).toHaveBeenCalledWith("origin", "feat/test", ["--set-upstream"]);
                });
        });

        describe("createPullRequest", () => {
                test("should push branch and then call gh pr create", async () => {
                        const url = await prService.createPullRequest(
                                "feat/test",
                                "main",
                                "Title",
                                "Body",
                                false,
                                undefined,
                                mockGit as any
                        );

                        expect(mockGit.push).toHaveBeenCalled();
                        expect(mockExec).toHaveBeenCalled();
                        const args = (mockExec.mock.calls[0] as any[])[1] as string[];
                        expect(args).toContain("pr");
                        expect(args).toContain("create");
                        expect(args).toContain("feat/test");
                        expect(url).toBe("https://github.com/user/repo/pull/1");
                });

                test("should return null if push fails", async () => {
                        mockGit.push.mockRejectedValue(new Error("Push failed"));
                        const url = await prService.createPullRequest("feat/test", "main", "Title", "Body", false, undefined, mockGit as any);
                        expect(url).toBeNull();
                });
        });

        describe("isGhAvailable", () => {
                test("should return true if gh auth status succeeds", async () => {
                        mockExec.mockResolvedValueOnce({ stdout: "Logged in", exitCode: 0 });
                        expect(await prService.isGhAvailable()).toBe(true);
                });

                test("should return false if gh auth status fails", async () => {
                        mockExec.mockResolvedValueOnce({ stdout: "Not logged in", exitCode: 1 });
                        expect(await prService.isGhAvailable()).toBe(false);
                });
        });

        describe("getOriginUrl", () => {
                test("should return fetch URL for origin", async () => {
                        const url = await prService.getOriginUrl(undefined, mockGit as any);
                        expect(url).toBe("git@github.com:user/repo.git");
                });
        });
});
