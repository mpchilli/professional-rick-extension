import * as fs from 'node:fs';
import * as path from 'node:path';

export class LoopMonitor {
    static getLogDir(sessionDir) {
        const logDir = path.join(sessionDir, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        return logDir;
    }

    static trackCall(state, toolResponse) {
        // Extract tool calls from the response
        // Pattern: [call:tool_name{args}]
        const callMatches = toolResponse.matchAll(/\[call:([^:{]+):([^:{]+)\{(.*?)\}\]/g);
        const currentCalls = [];

        for (const match of callMatches) {
            currentCalls.push({
                server: match[1],
                name: match[2],
                args: match[3]
            });
        }

        if (currentCalls.length === 0) return 0;

        // Load or initialize loop history
        if (!state.loop_monitor) {
            state.loop_monitor = {
                history: [],
                repeat_count: 0,
                last_call_hash: ''
            };
        }

        const callHash = JSON.stringify(currentCalls);

        if (callHash === state.loop_monitor.last_call_hash) {
            state.loop_monitor.repeat_count++;
        } else {
            state.loop_monitor.repeat_count = 1;
        }

        state.loop_monitor.last_call_hash = callHash;

        // Push to history (limit 5)
        state.loop_monitor.history.push({
            ts: Date.now(),
            calls: currentCalls
        });
        if (state.loop_monitor.history.length > 5) {
            state.loop_monitor.history.shift();
        }

        return state.loop_monitor.repeat_count;
    }

    static dumpBlackBox(sessionDir, input, repeatCount) {
        try {
            const logDir = this.getLogDir(sessionDir);
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            const logPath = path.join(logDir, `loop_debug_${ts}.json`);

            const dump = {
                timestamp: new Date().toISOString(),
                repeat_count: repeatCount,
                input_context: input,
                system_state: {
                    cwd: process.cwd(),
                    env: Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('ARCHITECT'))
                }
            };

            fs.writeFileSync(logPath, JSON.stringify(dump, null, 2));
            return logPath;
        } catch (err) {
            console.error(`[LoopMonitor] Failed to write black box: ${err.message}`);
            return null;
        }
    }
}
