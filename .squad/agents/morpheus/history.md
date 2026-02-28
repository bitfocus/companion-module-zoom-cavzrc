# Morpheus — History

## Project Context

- **Project:** companion-module-zoom-cavzrc
- **Description:** Bitfocus Companion module for Zoom Custom AV / Zoom Rooms Controller (CAVZRC)
- **Stack:** TypeScript, Node.js 22, yarn 4, @companion-module/base 1.12.1
- **Protocol:** OSC (using `osc` npm package)
- **OSC Config:** Header `/roomosc` (configurable), TX port 9090, RX port 1234

## Key Files

- `src/actions.ts` — Action definitions
- `src/osc.ts` — OSC protocol implementation
- `src/feedback.ts` — Feedback definitions
- `src/presets.ts` — Preset definitions
- `src/config.ts` — Module configuration
- `src/variables/` — Variable definitions

## Build Commands

- `yarn build` — TypeScript compilation
- `yarn lint` — ESLint validation
- `yarn package` — Build + companion-module-build
- `yarn dev` — Watch mode for development

## Team Context

- **Owner:** Justin James (alias: "Owner") — ultimate decision authority
- **Requested by:** Justin James
- **Universe:** The Matrix
- **Status:** Team setup complete, ready for work

## Current Focus

Ready to begin OSC command analysis and module development. Awaiting first work assignment.
