# Changelog

All notable changes to this project will be documented in this file.

## [0.5.2] - 2026-05-06

### Fixed

- **Join meeting rate limiting** — A 10-second cooldown is now enforced per room target after each `joinMeeting` attempt. Rapid or automated repeat triggers within that window are dropped with a warning logged in Companion, preventing Zoom from locking the room out after too many failed passcode attempts.
- Cooldown resets automatically when the room successfully enters a meeting.

### Added

- **Reset join attempt limit** action — Immediately clears the join cooldown for a specific room target or all rooms, allowing a corrected passcode to be retried without waiting.

### Documentation

- Added a dedicated README section explaining join attempt rate limiting and its limitations.
- Added steps to clear the Zoom app cache (`/Library/Application Support/zoom.us/data`) to recover from a cached wrong passcode.

## [0.5.0] - 2025

### Changed

- Refactored OSC layer to use `osc.UDPPort` instead of raw `dgram` sockets, fixing typed OSC argument encoding.
- Split actions, feedbacks, and presets into individual category files.
- Room index option now accepts Companion variables via `textinput` with `useVariables: true`.
- Added configurable poll interval for room list refresh.
- Connection status (`InstanceStatus`) now correctly reported to Companion on socket ready/error.

### Fixed

- Incoming OSC path names corrected to `addedRoomList` / `pairedRoomList` (matching CAVZRC output).
- Room list deduplication and accumulation reset.

## [0.0.2] - 2024

### Changed

- Initial published release with OSC-based Zoom Rooms control via CAVZRC.
