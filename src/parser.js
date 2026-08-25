'use strict';

/**
 * Parses telemetry log lines into structured events.
 *
 * Line format:
 *   <ISO timestamp> <LEVEL> [user=<name>] action=<action> duration=<n>ms
 */

const LINE_RE = /^(\S+)\s+(INFO|WARN|ERROR)\s+(.*)$/;

function parseFields(rest) {
    const fields = {};
    for (const token of rest.trim().split(/\s+/)) {
        const eq = token.indexOf('=');
        if (eq === -1) continue;
        fields[token.slice(0, eq)] = token.slice(eq + 1);
    }
    return fields;
}

function parseLine(line) {
    const m = LINE_RE.exec(line.trim());
    if (!m) return null;
    const [, timestamp, level, rest] = m;
    const fields = parseFields(rest);

    // Events without a user are system noise — drop them.
    if (!fields.user) return null;

    return {
        timestamp,
        level,
        user: fields.user,
        action: fields.action,
        duration: fields.duration ? Number.parseInt(fields.duration, 10) : undefined,
    };
}

function parse(text) {
    const events = [];
    for (const line of text.split('\n')) {
        if (!line.trim()) continue;
        const event = parseLine(line);
        if (event) events.push(event);
    }
    return events;
}

module.exports = { parse, parseLine };
