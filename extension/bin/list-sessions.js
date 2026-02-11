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
        const sessionDir = path.join(SESSIONS_ROOT, dir);
        const statePath = path.join(sessionDir, 'state.json');
        const ticketPath = path.join(sessionDir, 'tickets', 'linear_ticket_parent.md');

        let state = { active: false, original_prompt: '', step: 'Unknown', iteration: 0, started_at: '', working_dir: '' };
        let title = '';
        let status = '';

        if (fs.existsSync(statePath)) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
            } catch (e) { /* ignore */ }
        }

        if (fs.existsSync(ticketPath)) {
            try {
                const ticketContent = fs.readFileSync(ticketPath, 'utf-8');
                const titleMatch = ticketContent.match(/^#\s+(.+)$/m);
                if (titleMatch) title = titleMatch[1].trim();

                const statusMatch = ticketContent.match(/\*\*Status\*\*:\s*(.+)$/m);
                if (statusMatch) status = statusMatch[1].trim();
            } catch (e) { /* ignore */ }
        }

        // Fallbacks
        if (!title) {
            title = (state.original_prompt || 'No Prompt').replace(/\n/g, ' ').substring(0, 50);
            if (state.original_prompt && state.original_prompt.length > 50) title += '...';
        }
        if (!status) {
            status = state.active ? 'In Progress' : 'Completed';
        }

        return {
            id: dir,
            title,
            status,
            active: state.active,
            iteration: state.iteration,
            started_at: state.started_at,
            step: state.step || 'Unknown',
            working_dir: state.working_dir || 'Unknown'
        };
    }).sort((a, b) => {
        // Sort by date descending (newest first)
        return (b.started_at || '').localeCompare(a.started_at || '');
    });

    if (sessions.length === 0) {
        console.log(`${Style.YELLOW}No sessions found.${Style.RESET}`);
        return;
    }

    const PHASES = ['PRD', 'Breakdown', 'Research', 'Plan', 'Implement', 'Refactor', 'Finished'];

    const renderLifecycle = (currentStep) => {
        const step = (currentStep || '').toLowerCase();
        let activeIdx = -1;

        if (step.includes('prd')) activeIdx = 0;
        else if (step.includes('breakdown')) activeIdx = 1;
        else if (step.includes('research')) activeIdx = 2;
        else if (step.includes('plan')) activeIdx = 3;
        else if (step.includes('implement')) activeIdx = 4;
        else if (step.includes('refactor')) activeIdx = 5;
        else if (step.includes('done') || step.includes('finish') || step.includes('complete')) activeIdx = 6;

        return PHASES.map((p, i) => {
            if (i === activeIdx) return `${Style.BOLD}${Style.CYAN}[${p}]${Style.RESET}`;
            if (i < activeIdx) return `${Style.DIM}${p}${Style.RESET}`;
            return `${Style.DIM}${p}${Style.RESET}`;
        }).join(' → ');
    };

    console.log(`${Style.BOLD}AI Architect Sessions${Style.RESET}`);
    console.log(`${Style.DIM}Workspace: ${WORKSPACE_ROOT}${Style.RESET}\n`);

    sessions.forEach(s => {
        let statusColor = s.active ? Style.GREEN : Style.DIM;
        let statusMarker = s.active ? '●' : '○';

        // Date formatting
        let timeDisplay = s.started_at;
        try {
            const date = new Date(s.started_at);
            if (!isNaN(date.getTime())) {
                timeDisplay = date.toLocaleString(undefined, {
                    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });
            }
        } catch (e) { /* ignore */ }

        // Line 1: ID and Start Time
        console.log(`${Style.CYAN}${Style.BOLD}${s.id}${Style.RESET}  ${Style.DIM}Started: ${timeDisplay || 'Unknown'}${Style.RESET}`);

        // Line 2: Lifecycle Bar
        console.log(`   ${statusColor}${statusMarker}${Style.RESET} ${renderLifecycle(s.step)}`);

        // Line 3: Task Title
        console.log(`   ${Style.BOLD}${s.title}${Style.RESET}`);

        // Gap
        console.log('');
    });

    console.log(`${Style.DIM}${'-'.repeat(80)}${Style.RESET}`);
    console.log(`To resume: ${Style.BOLD}/rick-architect --resume <ID>${Style.RESET}`);
}

main().catch(err => die(err.message));
