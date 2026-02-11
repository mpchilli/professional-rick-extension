#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawn_cmd, printBanner, Style, getExtensionRoot } from '../services/core-utils.js';
async function main() {
    const ROOT_DIR = getExtensionRoot();
    const JAR_ROOT = path.join(ROOT_DIR, 'archive');
    if (!fs.existsSync(JAR_ROOT)) {
        console.log('Archive is empty. No tasks to run.');
        return;
    }
    const days = fs.readdirSync(JAR_ROOT).sort();
    for (const day of days) {
        const dayPath = path.join(JAR_ROOT, day);
        if (!fs.statSync(dayPath).isDirectory())
            continue;
        const tasks = fs.readdirSync(dayPath);
        for (const taskId of tasks) {
            const taskPath = path.join(dayPath, taskId);
            const metaPath = path.join(taskPath, 'meta.json');
            if (fs.existsSync(metaPath)) {
                const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
                if (meta.status === 'marinating' || meta.status === 'archived') {
                    printBanner(`Opening Archive: ${taskId}`, 'MAGENTA');
                    // Resume logic here
                    const sessionDir = path.join(ROOT_DIR, 'sessions', taskId);
                    if (fs.existsSync(sessionDir)) {
                        const statePath = path.join(sessionDir, 'state.json');
                        const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
                        state.active = true;
                        fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
                        // Execute loop
                        const cmd = ['gemini', '/rick-architect', '--resume', sessionDir];
                        await spawn_cmd(cmd, { cwd: meta.repo_path });
                        // Update status
                        meta.status = 'consumed';
                        fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
                    }
                }
            }
        }
    }
}
main().catch((err) => {
    console.error(`${Style.RED}Error: ${err.message}${Style.RESET}`);
    process.exit(1);
});
