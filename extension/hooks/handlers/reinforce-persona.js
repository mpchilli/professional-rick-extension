import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
async function main() {
    const extensionDir = process.env.EXTENSION_DIR || path.join(os.homedir(), '.gemini/extensions/Pro-Rick-GPro');
    const debugLog = path.join(extensionDir, 'debug.log');
    const log = (msg) => {
        const ts = new Date().toISOString();
        try {
            fs.appendFileSync(debugLog, `[${ts}] [ReinforcePersonaJS] ${msg}${os.EOL}`);
        }
        catch {
            /* ignore */
        }
    };
    // 1. Determine State File
    let stateFile = process.env.ARCHITECT_STATE_FILE;
    if (!stateFile) {
        const sessionsMapPath = path.join(extensionDir, 'current_sessions.json');
        log(`Checking sessions map at: ${sessionsMapPath}`);
        if (fs.existsSync(sessionsMapPath)) {
            const map = JSON.parse(fs.readFileSync(sessionsMapPath, 'utf8'));
            const sessionPath = map[process.cwd()];
            if (sessionPath) {
                log(`Found session path in map: ${sessionPath}`);
                stateFile = path.join(sessionPath, 'state.json');
            }
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
    if (!state.active) {
        console.log(JSON.stringify({ decision: 'allow' }));
        return;
    }
    // 3. Reinforce Persona
    log('Reinforcing persona');

    // Construct context-aware system message
    let contextMsg = `You are the AI Architect. Maintain professional, intent-oriented focus. Verify every step. Do not hallucinate.`;

    if (state.step) {
        contextMsg += `\n\nCURRENT STATE:
- Iteration: ${state.iteration || 0}/${state.max_iterations || 'Infinite'}
- Phase: ${state.step.toUpperCase()}
- Current Ticket: ${state.current_ticket || 'None'}
- Goal: ${state.original_prompt || 'Unknown'}

You must invoke the appropriate skill for the "${state.step}" phase. Do not start over at PRD unless explicitly instructed.`;
    }

    console.log(JSON.stringify({
        decision: 'allow',
        systemMessage: contextMsg,
    }));
}
main().catch(() => console.log(JSON.stringify({ decision: 'allow' })));
