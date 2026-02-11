#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

async function main() {
    const args = process.argv.slice(2);
    const actionOrKey = args[0];
    if (!actionOrKey) {
        console.error('Usage: node update-state.js <action|key> <args...>');
        process.exit(1);
    }
    try {
        if (actionOrKey === 'ticket-status') {
            const [sessionRoot, ticketId, status] = args.slice(1);
            if (!sessionRoot || !ticketId || !status) {
                throw new Error('Usage: node update-state.js ticket-status <SESSION_ROOT> <ID> <STATUS>');
            }
            updateTicketStatus(sessionRoot, ticketId, status);
        }
        else {
            const [value, sessionDir] = args.slice(1);
            if (!value || !sessionDir) {
                throw new Error('Usage: node update-state.js <key> <value> <session_dir>');
            }
            updateSimpleState(actionOrKey, value, sessionDir);
        }
    }
    catch (err) {
        console.error(`Failed to update state: ${err.message}`);
        process.exit(1);
    }
}
function updateSimpleState(key, value, sessionDir) {
    const statePath = path.join(sessionDir, 'state.json');
    if (!fs.existsSync(statePath)) {
        throw new Error(`state.json not found at ${statePath}`);
    }
    const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
    state[key] = value;
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
    console.log(`Successfully updated ${key} to ${value} in ${statePath}`);
}
function updateTicketStatus(sessionRoot, ticketId, status) {
    let ticketFile = path.join(sessionRoot, `linear_ticket_${ticketId}.md`);
    if (!fs.existsSync(ticketFile)) {
        ticketFile = path.join(sessionRoot, ticketId, `linear_ticket_${ticketId}.md`);
    }
    if (!fs.existsSync(ticketFile)) {
        const findTicket = (dir) => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    const found = findTicket(fullPath);
                    if (found)
                        return found;
                }
                else if (file === `linear_ticket_${ticketId}.md`) {
                    return fullPath;
                }
            }
            return null;
        };
        ticketFile = findTicket(sessionRoot) || '';
    }
    if (!ticketFile || !fs.existsSync(ticketFile)) {
        throw new Error(`Ticket file not found for ID: ${ticketId} in ${sessionRoot}`);
    }
    let content = fs.readFileSync(ticketFile, 'utf-8');
    content = content.replace(/status: .*/, `status: ${status}`);
    content = content.replace(/updated: .*/, `updated: ${new Date().toISOString().split('T')[0]}`);
    fs.writeFileSync(ticketFile, content);
    console.log(`Successfully updated ticket ${ticketId} to status "${status}" in ${ticketFile}`);
    const statePath = path.join(sessionRoot, 'state.json');
    if (fs.existsSync(statePath)) {
        const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
        if (state.current_ticket === ticketId && status === 'Done') {
            state.current_ticket = null;
            fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
            console.log(`Cleared current_ticket in state.json as it is now "${status}"`);
        }
    }
}
main();
