# Project Context

- **Owner:** Justin James
- **Project:** BitFocus Companion module for Custom AV Controller for Zoom Room Controller application communicating via OSC protocol
- **Stack:** TypeScript, Node.js, BitFocus Companion SDK
- **Created:** 2026-03-13

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

- `roomIndex` in `ROOM_TARGET_OPTIONS` is a `textinput` with `useVariables: true`, so `opt.roomIndex` is a string at runtime. The `parseRoomIndex()` helper in `src/actions.ts` converts it to an integer clamped to 1–999 (rounding, with bounds fallback). Always use `parseRoomIndex()` when consuming `opt.roomIndex` as a number.
- `parseRoomIndex()` now **throws** `Error` on invalid input (non-finite, < 1, or > 999) instead of silently clamping. Both `roomCommand` and `roomCommandWithOpts` catch that error and call `instance.log('error', message)` so the user sees a clear Companion log entry. Any future action callback that calls `getRoomTarget()` directly must also wrap in try/catch with the same pattern.
