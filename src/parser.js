'use strict';

/**
 * Parses telemetry log lines into structured events.
 *
 * Line format:
 *   <ISO timestamp> <LEVEL> [user=<name>] action=<action> duration=<n>ms
 */

const LINE_RE = /^(\S+)\s+(INFO|WARN|ERROR)\s+(.*)$/;
const DURATION_RE = /^(\d+(?:\.\d+)?)(ms|s)$/;

/**
 * All durations normalize to integer milliseconds at the parse boundary.
 * Upstream Go services emit seconds ("1.2s") while Node services emit
 * milliseconds ("42ms"); mixing units downstream skewed p95 dashboards.
 */
function normalizeDuration(raw) {
    if (raw == null) return null;
    const m = DURATION_RE.exec(raw);
    if (!m) return null;
    const value = Number(m[1]);
    return Math.round(m[2] === 's' ? value * 1000 : value);
}

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
        duration: normalizeDuration(fields.duration),
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
