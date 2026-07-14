<!-- DECISION-8C7A724F -->
## Decision: Adopt goldens/golden-v2.json as telemetry-parser gold standard to retain null-user events

**Status**: Active  
**Date**: 2026-07-14  
**Severity**: Critical

**Files**:
- `goldens/golden-v2.json`
- `golden-v1.json`
- `src/parser.js`
- `scripts/compare.js`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "src/parser.js",
      "content_rules": [
        {
          "mode": "string",
          "patterns": [
            "golden-v1.json"
          ]
        }
      ],
      "content_match_mode": "any"
    },
    {
      "type": "file",
      "pattern": "scripts/compare.js",
      "content_rules": [
        {
          "mode": "string",
          "patterns": [
            "golden-v1.json"
          ]
        }
      ],
      "content_match_mode": "any"
    }
  ],
  "match_mode": "any"
}
```

### Context

**Decision:** Adopt `goldens/golden-v2.json` as the new gold standard for `telemetry-parser` going forward, deprecating `golden-v1.json`. All future changes to `src/parser.js` or `scripts/compare.js` must validate against v2 only, which keeps system events (like heartbeats and scheduled jobs) with `user: null` instead of dropping them.
