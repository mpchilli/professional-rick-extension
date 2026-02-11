#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { printMinimalPanel, getExtensionRoot, Style } from '../services/core-utils.js';

function die(message) {
    console.error(`${Style.RED}❌ Error: ${message}${Style.RESET}`);
    process.exit(1);
}

// Robust workspace discovery (mirrors session-setup.js)
const findWorkspaceRoot = (startPath) => {
    if (process.env.ANTIGRAVITY_WORKSPACE_ROOT) {
        const envRoot = path.resolve(process.env.ANTIGRAVITY_WORKSPACE_ROOT);
        if (fs.existsSync(envRoot)) return envRoot;
    }
    const globalGemini = path.join(os.homedir(), '.gemini');
    let curr = startPath;
    while (curr && curr !== path.dirname(curr)) {
        const potential = path.join(curr, '.gemini');
        const isTmp = curr.toLowerCase().includes('tmp') || curr.toLowerCase().includes('temp');
        if (fs.existsSync(potential) && potential.toLowerCase() !== globalGemini.toLowerCase() && !isTmp)
            return curr;
        curr = path.dirname(curr);
    }
    // Fallback: Registry bridge for sandboxes
    const ROOT_DIR = getExtensionRoot();
    const registryPath = path.join(ROOT_DIR, 'last_workspace.txt');
    if (fs.existsSync(registryPath)) {
        const registered = fs.readFileSync(registryPath, 'utf-8').trim();
        if (fs.existsSync(registered)) return registered;
    }
    return startPath;
};

async function main() {
    const WORKSPACE_ROOT = findWorkspaceRoot(process.cwd());
    const SESSIONS_ROOT = path.join(WORKSPACE_ROOT, '.gemini', 'sessions');

    if (!fs.existsSync(SESSIONS_ROOT)) {
        console.log(`${Style.YELLOW}No sessions found in ${SESSIONS_ROOT}${Style.RESET}`);
        return;
    }

    const sessions = fs.readdirSync(SESSIONS_ROOT).filter(dir => {
        return fs.statSync(path.join(SESSIONS_ROOT, dir)).isDirectory();
    }).map(dir => {
        const statePath = path.join(SESSIONS_ROOT, dir, 'state.json');
        let state = { active: false, original_prompt: 'Unknown', step: 'Unknown', iteration: 0, started_at: 'Unknown' };
        if (fs.existsSync(statePath)) {
            try {
                state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
            } catch (e) { /* ignore */ }
        }
        return {
            id: dir,
            ...state
        };
    }).sort((a, b) => {
        // Sort by date descending (newest first)
        return (b.started_at || '').localeCompare(a.started_at || '');
    });

    if (sessions.length === 0) {
        console.log(`${Style.YELLOW}No sessions found.${Style.RESET}`);
        return;
    }

    console.log(`${Style.BOLD}Active Sessions in ${path.basename(WORKSPACE_ROOT)}${Style.RESET}`);
    console.log(`${Style.DIM}${'='.repeat(60)}${Style.RESET}`);

    // Header
    console.log(
        `${Style.BOLD}ID`.padEnd(25) +
        `Status`.padEnd(10) +
        `Iter`.padEnd(6) +
        `Task${Style.RESET}`
    );
    console.log(`${Style.DIM}${'-'.repeat(60)}${Style.RESET}`);

    sessions.forEach(s => {
        let statusColor = s.active ? Style.GREEN : Style.DIM;
        let activeIcon = s.active ? '🟢' : '⚪';
        let promptSnippet = (s.original_prompt || '').replace(/\n/g, ' ').substring(0, 40) + (s.original_prompt?.length > 40 ? '...' : '');

        console.log(
            `${Style.CYAN}${s.id.padEnd(20)}${Style.RESET}   ` +
            `${statusColor}${activeIcon} ${s.active ? 'Active' : 'Done '}${Style.RESET}   ` +
            `${s.iteration.toString().padEnd(4)}   ` +
            `${promptSnippet}`
        );
    });
    console.log(`${Style.DIM}${'='.repeat(60)}${Style.RESET}`);
    console.log(`\nTo resume a session run: ${Style.BOLD}/architect --resume <ID>${Style.RESET}`);
}

main().catch(err => die(err.message));
