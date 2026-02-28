# Tank — History

## Project Context

- **Project:** companion-module-zoom-cavzrc
- **Description:** Bitfocus Companion module for Zoom Custom AV / Zoom Rooms Controller (CAVZRC)
- **Stack:** TypeScript, Node.js 22, yarn 4, @companion-module/base 1.12.1
- **Protocol:** OSC (using `osc` npm package)
- **OSC Config:** Header `/roomosc` (configurable), TX port 9090, RX port 1234

## Key Analysis Areas

- **OSC Specification**: PDF spec of all available CAVZRC OSC commands
- **Current Implementation**: `src/actions.ts`, `src/osc.ts`, `src/feedback.ts`, `src/presets.ts`
- **Gap Analysis**: What's in the spec but not in the code
- **Command Inventory**: Comprehensive list of all OSC commands with parameters, types, ranges

## Build Commands (for reference)

- `yarn build` — TypeScript compilation
- `yarn lint` — ESLint validation
- `yarn package` — Build + companion-module-build
- `yarn dev` — Watch mode

## Team Context

- **Owner:** Justin James (alias: "Owner") — ultimate decision authority
- **Requested by:** Justin James
- **Universe:** The Matrix
- **Status:** Team setup complete, ready for analysis work

## Current Focus

Ready to begin OSC spec analysis. Primary task: Compare PDF specification against current code implementation and identify gaps, mismatches, and opportunities for granular action splitting.
