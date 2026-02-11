import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
async function main() {
    const extensionDir = process.env.EXTENSION_DIR || path.join(os.homedir(), '.gemini/extensions/Pro-Rick-GPro');
    const globalDebugLog = path.join(extensionDir, 'debug.log');
    let sessionHooksLog = null;
    const log = (msg) => {
        const ts = new Date().toISOString();
        const formatted = `[${ts}] [IncrementIterationJS] ${msg}\n`;
        try {
            fs.appendFileSync(globalDebugLog, formatted);
        }
        catch {
            /* ignore */
        }
        if (sessionHooksLog) {
            try {
                fs.appendFileSync(sessionHooksLog, formatted);
            }
            catch {
                /* ignore */
            }
        }
    };
    // 1. Determine State File
    let stateFile = process.env.ARCHITECT_STATE_FILE;
    if (!stateFile) {
        const sessionsMapPath = path.join(extensionDir, 'current_sessions.json');
        if (fs.existsSync(sessionsMapPath)) {
            const map = JSON.parse(fs.readFileSync(sessionsMapPath, 'utf8'));
            const sessionPath = map[process.cwd()];
            if (sessionPath)
                stateFile = path.join(sessionPath, 'state.json');
        }
    }
    if (!stateFile || !fs.existsSync(stateFile)) {
        console.log(JSON.stringify({ decision: 'allow' }));
        return;
    }
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    // 2. Check Context
    if (state.working_dir && path.resolve(state.working_dir) !== path.resolve(process.cwd())) {
        console.log(JSON.stringify({ decision: 'allow' }));
        return;
    }
    const role = process.env.ARCHITECT_ROLE;
    if (state.active && role !== 'worker') {
        const now = Date.now();
        const lastIncrement = state.last_increment_ts || 0;

        // Debounce: Only increment if 0.5 seconds have passed since last increment
        if (now - lastIncrement > 500) {
            sessionHooksLog = path.join(path.dirname(stateFile), 'hooks.log');
            state.iteration = (state.iteration || 0) + 1;
            state.last_increment_ts = now;
            log(`Incrementing iteration to ${state.iteration}`);
            fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
        } else {
            log(`Debounced increment request (last increment was ${now - lastIncrement}ms ago)`);
        }
    }
    console.log(JSON.stringify({ decision: 'allow' }));
}
main().catch(() => console.log(JSON.stringify({ decision: 'allow' })));
