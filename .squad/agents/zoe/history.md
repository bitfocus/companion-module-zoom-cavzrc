# Project Context

- **Owner:** Justin James
- **Project:** BitFocus Companion module for Custom AV Controller for Zoom Room Controller application communicating via OSC protocol
- **Stack:** TypeScript, Node.js, BitFocus Companion SDK
- **Created:** 2026-03-13

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-13: OSC poll timer — command address assertion pattern

All 5 poll-timer tests now assert the exact commands sent, not just the call count. After extracting addresses via `port.send.mock.calls.map((c) => (c[0] as { address: string }).address)`, each test uses `toEqual(['/zoomRooms/getAddedRoomList', '/zoomRooms/getPairedRoomList'])` to verify exact order and completeness. The first test also retains a `toHaveBeenCalledTimes(2)` guard before the address check.

### 2026-03-13: OSC poll timer — 2-command-per-tick change + immediate sends

The OSC ready handler fires **2 immediate sends** on connect (`getAddedRoomList` + `getPairedRoomList`) before the interval starts. Two commands (`getAddedRoomCount`, `getPairedRoomCount`) were commented out, reducing interval sends from 4 to 2 per tick.

Critically: the mock config in `createPollingOSCInstance` does NOT include `pollInterval`, so the `if (this.instance.config.pollInterval && ...)` guard prevents the interval from running in tests. Only the 2 immediate sends fire. All 4 poll-timer test assertions were updated to reflect 2 sends total (not 4, 6, or 12).

### 2026-03-13: Bare-count assertion audit

Full audit of all three test files for bare `toHaveBeenCalledTimes` assertions without accompanying command/args verification.

**Changed:** `actions.test.ts` line 190 — the `does not double-send` test previously only asserted `toHaveBeenCalledTimes(1)`. Added `toHaveBeenCalledWith('/zoomRooms/allRooms/muteMic', [])` so it now verifies both the count and the exact command.

**Left as-is (with reasons):**
- `osc.test.ts` lines 73, 81, 90, 99, 105, 113 — all poll-timer `toHaveBeenCalledTimes(2)` assertions are already followed by address-extraction + `toEqual(['/zoomRooms/getAddedRoomList', '/zoomRooms/getPairedRoomList'])`. Already strengthened in prior session.
- `osc.test.ts` line 283 — `mockCheckFeedbacks.toHaveBeenCalledTimes(1)`: `checkFeedbacks` carries no command/arg payload; count is the only meaningful assertion here.
- `variable-values.test.ts` — all 12 `not.toHaveBeenCalled()` assertions are paired with a positive assertion on the variables object (e.g., `expect(variables['added_rooms_count']).toBe(5)`). They correctly verify that these accumulator functions write to the passed-in object rather than calling `setVariableValues` directly. All are meaningful, none are vacuous.
