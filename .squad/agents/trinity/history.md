# Trinity — History

## Project Context

- **Project:** companion-module-zoom-cavzrc
- **Description:** Bitfocus Companion module for Zoom Custom AV / Zoom Rooms Controller (CAVZRC)
- **Stack:** TypeScript, Node.js 22, yarn 4, @companion-module/base 1.12.1
- **Protocol:** OSC (using `osc` npm package)
- **OSC Config:** Header `/roomosc` (configurable), TX port 9090, RX port 1234

## Key Files I Own

- `src/actions.ts` — Action definitions and handlers
- `src/osc.ts` — OSC protocol send/receive implementation
- `src/feedback.ts` — Feedback definitions and state tracking
- `src/presets.ts` — Preset button configurations
- `src/config.ts` — Module configuration schema
- `src/variables/` — Dynamic variable definitions

## Build Commands

- `yarn build` — TypeScript compilation (tsc)
- `yarn lint` — ESLint validation
- `yarn package` — Build + companion-module-build packaging
- `yarn dev` — Watch mode for development

## Team Context

- **Owner:** Justin James (alias: "Owner") — ultimate decision authority
- **Requested by:** Justin James
- **Universe:** The Matrix
- **Status:** Team setup complete, ready for implementation work

## Current Focus

Ready to implement OSC commands, actions, feedbacks, and presets. Awaiting spec analysis from Tank before starting new command implementations.
