#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';

import { run_cmd, Style, getExtensionRoot } from './core-utils.js';

function getBranch(repoPath: string): string {
  try {
    return run_cmd(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd: repoPath,
      capture: true,
    }).trim();
  } catch {
    return 'unknown';
  }
}

export function addToArchive(sessionDir: string): string {
  // 1. Read state.json
  const statePath = path.join(sessionDir, 'state.json');
  if (!fs.existsSync(statePath)) {
    throw new Error(`state.json not found in ${sessionDir}`);
  }
  const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
  const repoPath = state.working_dir;
  if (!repoPath) {
    throw new Error('working_dir not found in state.json');
  }
  const branch = getBranch(repoPath);

  // 2. Check for prd.md
  const prdSrc = path.join(sessionDir, 'prd.md');
  if (!fs.existsSync(prdSrc)) {
    throw new Error(`prd.md not found in ${sessionDir}`);
  }

  // 3. Setup Archive storage
  const today = new Date().toISOString().split('T')[0];
  const sessionId = path.basename(sessionDir);
  const archiveRoot = path.join(getExtensionRoot(), 'archive');
  const taskDir = path.join(archiveRoot, today, sessionId);
  fs.mkdirSync(taskDir, { recursive: true });

  // 4. Copy PRD
  fs.copyFileSync(prdSrc, path.join(taskDir, 'prd.md'));

  // 5. Write meta.json
  const meta = {
    repo_path: repoPath,
    branch: branch,
    prd_path: 'prd.md',
    created_at: new Date().toISOString(),
    task_id: sessionId,
    status: 'archived',
  };
  fs.writeFileSync(path.join(taskDir, 'meta.json'), JSON.stringify(meta, null, 2));

  // 6. Deactivate the current session to prevent immediate execution
  state.active = false;
  state.completion_promise = 'ARCHIVED'; // Signal completion
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

  return taskDir;
}

// CLI Support
// CLI Support
if (process.argv[1] && path.basename(process.argv[1]).startsWith('store-utils')) {
  const args = process.argv.slice(2);
  const sessionIndex = args.indexOf('--session');
  if (sessionIndex === -1) {
    console.log('Usage: node store-utils.js add --session <path>');
    process.exit(1);
  }
  const sessionDir = args[sessionIndex + 1];
  try {
    const resultPath = addToArchive(sessionDir);
    console.log(`Task successfully archived at: ${resultPath}`);
  } catch (err: any) {
    console.error(`${Style.RED}Error: ${err.message}${Style.RESET}`);
    process.exit(1);
  }
}
