# Project Context

- **Owner:** Justin James
- **Project:** BitFocus Companion module for Custom AV Controller for Zoom Room Controller application communicating via OSC protocol
- **Stack:** TypeScript, Node.js, BitFocus Companion SDK
- **Created:** 2026-03-13

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

- ESLint flat config ignores must use a dedicated `{ ignores: ['...'] }` object as a top-level array entry. The `files: ['!pattern']` negation syntax does NOT work as an exclude in flat config — it's silently ignored. Always use the `ignores` key for exclusions.
- `roomCommand` and `roomCommandWithOpts` in `action-room-utils.ts` must have explicit return type `(action: { options: Record<string, unknown> }) => void` per the `@typescript-eslint/explicit-module-boundary-types` rule. This must be maintained any time these functions are modified.

- `roomIndex` in `ROOM_TARGET_OPTIONS` is a `textinput` with `useVariables: true`, so `opt.roomIndex` is a string at runtime. The `parseRoomIndex()` helper in `src/actions.ts` converts it to an integer clamped to 1–999 (rounding, with bounds fallback). Always use `parseRoomIndex()` when consuming `opt.roomIndex` as a number.
- `parseRoomIndex()` now **throws** `Error` on invalid input (non-finite, < 1, or > 999) instead of silently clamping. Both `roomCommand` and `roomCommandWithOpts` catch that error and call `instance.log('error', message)` so the user sees a clear Companion log entry. Any future action callback that calls `getRoomTarget()` directly must also wrap in try/catch with the same pattern.
- Actions are being split into per-category files in `src/actions/`. The pilot split extracted Join Flow actions to `src/actions/action-join-flow.ts`. Shared OSC helpers (`ROOM_TARGET_OPTIONS`, `CHANNEL_NUM_OPTION`, `parseRoomIndex`, `buildRoomPath`, `getRoomTarget`, `roomCommand`, `roomCommandWithOpts`) live in `src/actions/action-room-utils.ts`. `roomCommand` and `roomCommandWithOpts` now take `instance` as their first parameter (no longer closures). The aggregator `actions.ts` imports helpers from the utils file and spreads each category factory's result into its return object.
- The aggregator `actions.ts` must assign each category factory result to a typed `const` before the `return`, not inline inside the spread. Pattern: `const actionsJoinFlow: { [id in ActionIdJoinFlow]: CompanionActionDefinition | undefined } = GetActionsJoinFlow(instance)` then `...actionsJoinFlow` in the return. This lets TypeScript enforce enum completeness at the aggregator level. `CompanionActionDefinition` (singular) must be imported alongside `CompanionActionDefinitions` (plural) for the typed-const annotation.
- `actions.ts` now exports an `ActionId` enum covering every inline action defined directly in the aggregator (not in a category file). The combined `actions` const inside `GetActions()` is typed as `{ [id in ActionId | ActionIdJoinFlow]: CompanionActionDefinition | undefined }`, and every key uses computed enum notation `[ActionId.xxx]`. This enforces completeness: TypeScript errors if any enum member is missing from the object or any extra key is added without a matching enum member.
- The `companion-action-file-pattern` skill was updated to `confidence: high`. Additions: Pattern 0 (shared helpers in `action-utils.ts`, instance-dependent helpers, `parseRangedInt` validation, try/catch error handling), instance type clarification note in Pattern 1 imports, `useVariables: true` documentation for `textinput` fields, `ActionId` enum sub-section in Pattern 2 covering inline actions in the aggregator, step 3.5 in Pattern 3 covering removal of split actions from `ActionId`, and updated References section with generic paths (removed non-existent file references).
