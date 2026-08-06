'use strict';

/**
 * Sentinel test: Verify that system events with null users are retained.
 * This test pins the behavior that events without a user field should be
 * kept with user: null, not dropped. This is critical for telemetry accuracy.
 */

const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('./parser');

const sampleInput = fs.readFileSync(
    path.join(__dirname, '../sample-input/logs.txt'),
    'utf8'
);

const events = parse(sampleInput);

// Verify null-user system events are retained
const nullUserEvents = events.filter(e => e.user === null);
assert.strictEqual(
    nullUserEvents.length,
    3,
    'Parser should retain exactly 3 system events with user: null'
);

// Verify specific system events are present
const heartbeats = nullUserEvents.filter(e => e.action === 'heartbeat');
assert.strictEqual(
    heartbeats.length,
    2,
    'Should have 2 heartbeat events with null user'
);

const cleanupEvents = nullUserEvents.filter(e => e.action === 'scheduled_cleanup');
assert.strictEqual(
    cleanupEvents.length,
    1,
    'Should have 1 scheduled_cleanup event with null user'
);

// Verify total event count includes null-user events
assert.strictEqual(
    events.length,
    8,
    'Parser should retain all 8 events (5 with users + 3 system events)'
);

console.log('✓ All sentinel checks passed: system events with null users are retained');
