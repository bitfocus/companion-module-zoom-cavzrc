# Switch — History

## Project Context

- **Project:** companion-module-zoom-cavzrc
- **Description:** Bitfocus Companion module for Zoom Custom AV / Zoom Rooms Controller (CAVZRC)
- **Stack:** TypeScript, Node.js 22, yarn 4, @companion-module/base 1.12.1
- **Protocol:** OSC (using `osc` npm package)

## Build Pipeline I Maintain

- `yarn build` — TypeScript compilation (tsc)
- `yarn lint` — ESLint validation
- `yarn package` — Build + companion-module-build packaging
- `yarn dev` — Watch mode for development

## Configuration Files

- `package.json` — Dependencies, scripts, metadata
- `tsconfig.json` — TypeScript compiler configuration
- `tsconfig.build.json` — Build-specific TypeScript config
- `eslint.config.mjs` — ESLint rules
- `.husky/` (if present) — Git hooks
- `.lintstagedrc` (if present) — Pre-commit lint configuration

## Team Context

- **Owner:** Justin James (alias: "Owner") — ultimate decision authority
- **Requested by:** Justin James
- **Universe:** The Matrix
- **Status:** Team setup complete, ready for build validation

## Current Focus

Ready to validate builds, enforce lint rules, and ensure clean commits. Will block any commit that doesn't build or lint cleanly.
