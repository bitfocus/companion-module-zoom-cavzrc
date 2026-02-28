# Neo — History

## Project Context

- **Project:** companion-module-zoom-cavzrc
- **Description:** Bitfocus Companion module for Zoom Custom AV / Zoom Rooms Controller (CAVZRC)
- **Stack:** TypeScript, Node.js 22, yarn 4, @companion-module/base 1.12.1
- **Protocol:** OSC (using `osc` npm package)
- **OSC Config:** Header `/roomosc` (configurable), TX port 9090, RX port 1234

## Testing Focus Areas

- **Actions** (`src/actions.ts`): Validate OSC message generation and parameter handling
- **Feedbacks** (`src/feedback.ts`): Validate state parsing and condition evaluation
- **Presets** (`src/presets.ts`): Validate preset configurations and button states
- **OSC Layer** (`src/osc.ts`): Validate message send/receive, format compliance
- **Config** (`src/config.ts`): Validate configuration validation and defaults
- **Variables** (`src/variables/`): Validate variable updates and formatting

## Build Commands

- `yarn build` — TypeScript compilation
- `yarn lint` — ESLint validation
- `yarn package` — Build + companion-module-build
- `yarn dev` — Watch mode
- _Note: Check for existing test command (e.g., `yarn test`)_

## Team Context

- **Owner:** Justin James (alias: "Owner") — ultimate decision authority
- **Requested by:** Justin James
- **Universe:** The Matrix
- **Status:** Team setup complete, ready for testing work

## Current Focus

Ready to write tests for existing and new implementations. Will use Tank's spec analysis to validate OSC message formats and ensure actions/feedbacks behave correctly.
