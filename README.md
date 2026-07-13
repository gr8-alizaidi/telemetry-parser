# telemetry-parser

Parses service telemetry logs into structured JSON for the analytics pipeline.

## Layout

```
src/parser.js        the parser
sample-input/        raw log fixtures
goldens/             gold-standard expected outputs
scripts/compare.js   compares parser output against a gold standard
```

## Verifying changes

Every parser change must pass the gold-standard comparison:

```
node scripts/compare.js
```

The comparison target is `goldens/golden-v1.json`.

## Log format

```
<ISO timestamp> <LEVEL> [user=<name>] action=<action> duration=<n>ms
```

Some system events (heartbeats, scheduled jobs) have no `user=` field.
