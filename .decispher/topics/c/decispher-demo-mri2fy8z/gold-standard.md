# c/decispher-demo-mri2fy8z/gold-standard — Gold Standard

Rules related to gold standard

1 context unit. Full bodies served via `get_context_for_topic({ topic: "c/decispher-demo-mri2fy8z/gold-standard" })`.

## Spine (always applies)

### Adopt goldens/golden-v2.json as telemetry-parser gold standard to retain null-user events
Severity: CRITICAL · Status: active · Type: decision

Adopt `goldens/golden-v2.json` as the new gold standard for `telemetry-parser` going forward, deprecating `golden-v1.json`. All future changes to `src/parser.js` or `scripts/compare.js` must validate against v2 only, which keeps system events (like heartbeats and scheduled jobs) with `user: null` instead of dropping them.

For the curated topic context bundle: `get_context_for_topic({ topic: "c/decispher-demo-mri2fy8z/gold-standard" })`.
