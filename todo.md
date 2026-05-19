# TODO — Implementation Gaps

Generated from gap analysis against `docs/CAVZRC-API.md`.

> **Actions are 100% complete.** All documented input room commands and global commands are implemented.

---

## Feedbacks

Currently only 4 feedbacks exist (`RoomPaired`, `InMeeting`, `MuteStatus`, `CameraStatus`). The following are missing:

### NDI

- [ ] `channelConfigNDI` — channel index, status, content, selection
- [ ] `channelCountNDI` — count of NDI channels

### HWIO

- [ ] `channelConfigHWIO` — isActive, channel name, mode, content, selection, resolution/fps, audio mix
- [ ] `channelCountHWIO` — count of HWIO channels
- [ ] `supportedResolutionFrameRateHWIO` — supported resolutions/frame rates for a channel

### Dante

- [ ] `channelConfigDante` — index, status, content, selection, signal
- [ ] `channelCountDante` — count of Dante channels

### Device Settings

- [ ] `roomMicList` — list of mic devices
- [ ] `roomCameraList` — list of camera devices
- [ ] `roomSpeakerList` — list of speaker devices
- [ ] `selectedPrimaryCamera` — currently selected primary camera (undocumented output)
- [ ] `selectedMic` — currently selected mic (undocumented output)
- [ ] `selectedSpeaker` — currently selected speaker (undocumented output)

### Overlays

- [ ] `roomOverlayConfig` — name_position, show_nametag, show_emoji, show_hand, show_border

### Room Info

- [ ] `roomInfo` — availability, room_type, location, web_zrc_url, version
- [ ] `participantCount` — raw participant count (undocumented output)

---

## Presets

Currently 7 preset category files exist (`join-flow`, `global`, `ndi`, `hwio`, `dante`, `device-settings`, `overlays`). The following are missing:

- [ ] `preset-active-speaker.ts` — `setActiveSpeakerSelf`, `setActiveSpeakerChild`
- [ ] `preset-camera-control.ts` — `activateCameraPreset`
- [ ] `preset-room-info.ts` — `getRoomInfo`, `getMeetingStatus`, `getParticipantCount`
- [ ] `preset-content-share.ts` — `startDeviceShare`, `startCameraShare`, `stopShare`
- [ ] `preset-cavzrc-control.ts` — `pairRoom`, `unPairRoom`, `renameParticipant`
- [ ] `preset-companion.ts` — `getCompanionRoomList`, `getCompanionRoomCameraList`, `setCompanionRoomCameraDisplayName`, `setCompanionRoomCameraOff`, `setCompanionRoomCameraOn`

---

## OSC Output State Handling

These output messages are sent by the CAVZRC but are not yet captured in `osc.ts` or stored in state. Each is a prerequisite for the corresponding feedback above.

> Note: Adding state also requires updating `CavzrcState` / `RoomState` types in `src/utils.ts`.

### Room-specific outputs (prefix: `roomID roomName roomIndex`)

- [ ] `channelConfigNDI` → store NDI channel config in state
- [ ] `channelCountNDI` → store NDI channel count in state
- [ ] `channelConfigHWIO` → store HWIO channel config in state
- [ ] `channelCountHWIO` → store HWIO channel count in state
- [ ] `supportedResolutionFrameRateHWIO` → store supported resolutions in state
- [ ] `channelConfigDante` → store Dante channel config in state
- [ ] `channelCountDante` → store Dante channel count in state
- [ ] `roomMicList` → store mic list in state
- [ ] `roomCameraList` → store camera list in state
- [ ] `roomSpeakerList` → store speaker list in state
- [ ] `roomOverlayConfig` → store overlay settings in state
- [ ] `roomInfo` → store room info (availability, type, location, url, version) in state
- [ ] `participantCount` → store participant count in state (undocumented)
- [ ] `selectedPrimaryCamera` → store selected primary camera in state (undocumented)
- [ ] `selectedMic` → store selected mic in state (undocumented)
- [ ] `selectedSpeaker` → store selected speaker in state (undocumented)
