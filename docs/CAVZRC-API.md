# Custom AV for Zoom Rooms: OSC API (Beta)

**CAVZRC 1.2.0 | 8/29/2025**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Requirements](#requirements)
3. [OSC Control Settings](#osc-control-settings)
4. [Syntax Guidance](#syntax-guidance)
5. ["Added" and "Paired"](#added-and-paired)
6. [Inputs](#inputs)
   - [Targeted Commands](#targeted-commands)
   - [Global Commands](#global-commands)
7. [Outputs](#outputs)
   - [Format](#format)
8. [OSC Command List](#osc-command-list)
   - [Input Room Commands](#input-room-commands)
   - [Input Global Commands](#input-global-commands)
   - [Output Room Commands](#output-room-commands)
   - [Output Global Commands](#output-global-commands)

---

## Introduction

OSC control is available within the Custom AV Zoom Rooms Controller (CAVZRC) application on Windows or macOS. Please note that control commands are sent to the CAVZRC application, not to the Zoom Room device itself. This allows for control over multiple Zoom Room devices simultaneously and over the WAN.

This API is primarily intended for production use cases and integration with show control for automation. Unlike ZoomOSC, this API is focused on control actions and not meeting data outputs.

> **Note:** The OSC API is currently in Beta.

---

## Requirements

- Zoom Rooms version **6.5.0+**
- Custom AV Zoom Rooms Controller **1.2.0+**

---

## OSC Control Settings

Within the CAVZRC, adjust network settings for OSC control via the gear icon (top right, next to "logout").

| Setting                            | Description                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Enable OSC for network control** | When enabled, the application will listen for incoming commands and output events                       |
| **Transmission IP**                | The IP of the receiving device where the CAVZRC will send messages                                      |
| **Transmission Port**              | The port of the receiving device where the CAVZRC will send messages                                    |
| **OSC Network Interface**          | Select the network interface for incoming commands, or "All" for all interfaces                         |
| **Receiving Port**                 | The port where the CAVZRC will listen for incoming messages                                             |
| **OSC Output Header**              | The first part of the OSC address for output messages. Customizable string. Default: `/roomosc`         |
| **Use IP Allow List**              | When enabled, load a `.txt` file with IPs (one per line). CAVZRC will only allow control from those IPs |

---

## Syntax Guidance

- This document outlines Open Sound Control (OSC) syntax for use with the CAVZRC.
- OSC data is expected to be transmitted as **UDP** network traffic.
- **camelCase** is used in documentation but is not enforced by the protocol:
  - `/zoomRooms` and `/zoomrooms` are both legal prefixes
  - `../roomID` and `../roomid` are both legal target types
- OSC commands are documented as:
  - **OSC address** — the slash-delimited part of an OSC message
  - **OSC payload** — the list of arguments that follow the address
- A single whitespace separates an OSC address from its payload argument(s).
- "Quotes" in documentation indicate a string parameter; quotes are **not** included in actual strings.
- UTF-8 characters are allowed in strings.
- `../` indicates unspecified components of the address before the shown component.
- `…` indicates unspecified arguments included in the payload.
- `bool` = unsigned integer where `0` = False, `1` = True.
- `str` = UTF-8 string.
- In command tables, payload arguments are separated by commas.
- Sending a `get` command instructs the CAVZRC to respond with the corresponding output for that command.

---

## "Added" and "Paired"

- A Zoom Room (ZR) is considered **"added"** if it is selected by the CAVZRC to appear in the quick navigation tabs, regardless of pairing state.
- A ZR is only considered **"paired"** if it is actively paired to the CAVZRC for control.

---

## Inputs

Inputs are commands received by the CAVZRC sent by 3rd party apps. Commands can either target specific Zoom Rooms or operate globally on the CAVZRC application.

All input command addresses must begin with `/zoomRooms`.

### Targeted Commands

Targeted Commands operate on specific ZR(s):

```
/zoomRooms/<targetType>/<room-command>
```

#### Target Types for Address

| Target Type    | Description                                                                    |
| -------------- | ------------------------------------------------------------------------------ |
| `../roomID`    | Specify the ZR by its unique ID                                                |
| `../roomName`  | Specify the ZR by its display name                                             |
| `../roomIndex` | Specify the ZR using its 1-indexed position in the list of ZRs added to CAVZRC |
| `../allRooms`  | Command applies to all ZRs added to the CAVZRC                                 |

#### Target Payload Arguments

The first argument in the payload depends on the target type:

| Target Type    | First Argument           | Example                                            |
| -------------- | ------------------------ | -------------------------------------------------- |
| `../roomID`    | string                   | `/zoomRooms/roomID/joinMeeting "DSKIJ3DG63125S" …` |
| `../roomName`  | string                   | `/zoomRooms/roomName/joinMeeting "Eyal's Room" …`  |
| `../roomIndex` | unsigned int (1-indexed) | `/zoomRooms/roomIndex/joinMeeting 3 …`             |
| `../allRooms`  | _(no target argument)_   | `/zoomRooms/allRooms/joinMeeting …`                |

### Global Commands

Global Commands operate on the CAVZRC itself and do not specify any Zoom Rooms:

```
/zoomRooms/<global-command>
```

---

## Outputs

Outputs are commands sent by the CAVZRC to 3rd party receivers.

### Format

By default, the CAVZRC output header is `/roomosc`. The user can customize this to any legal OSC address string (useful when multiple CAVZRCs are deployed and need address-level differentiation).

#### Output Payload Prefix Arguments

Outputs specific to a Zoom Room include a prefix list of arguments containing multiple ZR identifiers that appear **before** the output-specific arguments:

```
"roomID" "roomName" roomIndex …
```

Where:

- `roomID` and `roomName` are strings
- `roomIndex` is an unsigned integer (1-indexed position in the list of ZRs added to CAVZRC)

---

## OSC Command List

### Input Room Commands

> All commands must take their target argument before command-specific arguments.

#### Join Flow

| Address           | Command Payload Arguments                      | Description     |
| ----------------- | ---------------------------------------------- | --------------- |
| `../joinMeeting`  | `str meetingID, str meetingPass, str userName` | Join a meeting  |
| `../startMeeting` | `str meetingID, str meetingPass, str userName` | Start a meeting |
| `../leaveMeeting` | `str meetingID, str meetingPass, str userName` | Leave a meeting |

#### NDI

| Address                         | Command Payload Arguments                  | Description                               |
| ------------------------------- | ------------------------------------------ | ----------------------------------------- |
| `../setNDIContentOff`           | `int channel_num`                          | Set NDI Channel Content to Off            |
| `../setNDIContentParticipant`   | `int channel_num`                          | Set NDI Channel Content to Participant    |
| `../setNDIContentActiveSpeaker` | `int channel_num`                          | Set NDI Channel Content to Active Speaker |
| `../setNDIContentGallery`       | `int channel_num`                          | Set NDI Channel Content to Gallery        |
| `../setNDIContentScreenshare`   | `int channel_num`                          | Set NDI Channel Content to Screenshare    |
| `../setNDIContentSpotlight`     | `int channel_num`                          | Set NDI Channel to Spotlight Content      |
| `../setNDIContentPinGroup`      | `int channel_num`                          | Set NDI Channel to Pin Group              |
| `../setNDIParticipantSelection` | `int channel_num, str exact_zoom_username` | Select Participant for NDI Channel        |
| `../setNDIGallerySelection`     | `int channel_num, int gallery_index`       | Select Gallery for NDI Channel            |
| `../setNDIScreenshareSelection` | `int channel_num, int screenshare_index`   | Select Screenshare for NDI Channel        |
| `../setNDIPinGroupSelection`    | `int channel_num, int pin_group_index`     | Select Pin Group for NDI Channel          |
| `../getNDIChannelConfig`        | `int channel_num`                          | Get the configuration of an NDI channel   |
| `../getNDIChannelCount`         | _(none)_                                   | Get the number of NDI channels available  |

#### HWIO

| Address                                  | Command Payload Arguments                   | Description                                |
| ---------------------------------------- | ------------------------------------------- | ------------------------------------------ |
| `../setHWIOMode`                         | `int channel_num, int mode_index`           | Set HWIO Mode                              |
| `../setHWIOInputSelection`               | `int channel_num, int video_index`          | Set HWIO Channel to video at index         |
| `../setHWIOContentOff`                   | `int channel_num`                           | Set HWIO Channel Content to Off            |
| `../setHWIOContentTestSignal`            | `int channel_num`                           | Set HWIO Channel Content to Test Signal    |
| `../setHWIOContentParticipant`           | `int channel_num`                           | Set HWIO Channel Content to Participant    |
| `../setHWIOContentActiveSpeaker`         | `int channel_num`                           | Set HWIO Channel Content to Active Speaker |
| `../setHWIOContentGallery`               | `int channel_num`                           | Set HWIO Channel Content to Gallery        |
| `../setHWIOContentScreenshare`           | `int channel_num`                           | Set HWIO Channel Content to Screenshare    |
| `../setHWIOContentSpotlight`             | `int channel_num`                           | Set HWIO Channel to Spotlight Content      |
| `../setHWIOContentPinGroup`              | `int channel_num`                           | Set HWIO Channel to Pin Group              |
| `../setHWIOResolutionFrameRate`          | `int channel_num, str resolution_framerate` | Set HWIO channel resolution and framerate  |
| `../getHWIOSupportedResolutionFrameRate` | `int channel_num`                           | Get HWIO channel resolution and framerate  |
| `../setHWIOAudioMix`                     | `int channel_num, int setting_index`        | Set HWIO channel audio mix                 |
| `../setHWIOParticipantSelection`         | `int channel_num, str zoom_username`        | Select Participant for HWIO Channel        |
| `../setHWIOGallerySelection`             | `int channel_num, int gallery_index`        | Select Gallery for HWIO Channel            |
| `../setHWIOScreenshareSelection`         | `int channel_num, int screenshare_index`    | Select Screenshare for HWIO Channel        |
| `../setHWIOPinGroupSelection`            | `int channel_num, int pin_group_index`      | Select Pin Group for HWIO Channel          |
| `../getHWIOChannelConfig`                | `int channel_num`                           | Get the configuration of a HWIO channel    |
| `../getHWIOChannelCount`                 | _(none)_                                    | Get the number of HWIO channels available  |

#### Dante

| Address                           | Command Payload Arguments            | Description                                |
| --------------------------------- | ------------------------------------ | ------------------------------------------ |
| `../setDanteContentOff`           | `int channel_num`                    | Set Dante Channel Content to Off           |
| `../setDanteContentParticipant`   | `int channel_num`                    | Set Dante Channel Content to Participant   |
| `../setDanteContentMix`           | `int channel_num`                    | Set Dante Channel Content to Mixed Audio   |
| `../setDanteContentScreenshare`   | `int channel_num`                    | Set Dante Channel Content to Screenshare   |
| `../setDanteParticipantSelection` | `int channel_num, str zoom_username` | Select Participant for Dante Channel       |
| `../getDanteChannelConfig`        | `int channel_num`                    | Get the configuration of a Dante channel   |
| `../getDanteChannelCount`         | _(none)_                             | Get the number of Dante channels available |

#### Device Settings

| Address                       | Command Payload Arguments | Description                                |
| ----------------------------- | ------------------------- | ------------------------------------------ |
| `../setRoomMic`               | `str mic_name`            | Set the microphone device for the room     |
| `../setRoomMainCamera`        | `str camera_name`         | Set the primary camera for the room        |
| `../setRoomMultiCameraOn`     | `str camera_name`         | Set a multi-camera device on for the room  |
| `../setRoomMultiCameraOff`    | `str camera_name`         | Set a multi-camera device off for the room |
| `../setRoomSpeaker`           | `str speaker_name`        | Set the speaker device for the room        |
| `../getRoomMicList`           | _(none)_                  | Get a list of mic devices                  |
| `../getRoomCameraList`        | _(none)_                  | Get a list of camera devices               |
| `../getRoomSpeakerList`       | _(none)_                  | Get a list of speaker devices              |
| `../muteMic`                  | _(none)_                  | Mute the mic                               |
| `../unMuteMic`                | _(none)_                  | Unmute the mic                             |
| `../startCamera`              | _(none)_                  | Start the camera                           |
| `../stopCamera`               | _(none)_                  | Stop the camera                            |
| `../getSelectedPrimaryCamera` | _(none)_                  | Get selected primary camera                |
| `../getSelectedMultiCameras`  | _(none)_                  | Get selected multi camera                  |
| `../getSelectedMic`           | _(none)_                  | Get selected mic                           |
| `../getSelectedSpeaker`       | _(none)_                  | Get selected speaker                       |

#### Overlays

| Address                          | Command Payload Arguments | Description                             |
| -------------------------------- | ------------------------- | --------------------------------------- |
| `../setNameTagAlignment`         | `int location_index`      | Set the name tag overlay location       |
| `../enableNameTagOverlay`        | _(none)_                  | Enable the name tag overlay             |
| `../disableNameTagOverlay`       | _(none)_                  | Disable the name tag overlay            |
| `../enableEmojiOverlay`          | _(none)_                  | Enable the emoji overlay                |
| `../disableEmojiOverlay`         | _(none)_                  | Disable the emoji overlay               |
| `../enableHandRaiseOverlay`      | _(none)_                  | Enable the hand raise overlay           |
| `../disableHandRaiseOverlay`     | _(none)_                  | Disable the hand raise overlay          |
| `../enableActiveSpeakerOverlay`  | _(none)_                  | Enable the green active speaker border  |
| `../disableActiveSpeakerOverlay` | _(none)_                  | Disable the green active speaker border |
| `../getOverlaySettings`          | _(none)_                  | Get the overlay settings                |

#### Content Share

| Address               | Command Payload Arguments | Description                       |
| --------------------- | ------------------------- | --------------------------------- |
| `../startDeviceShare` | _(none)_                  | Start sharing from a capture card |
| `../startCameraShare` | `str camera_name`         | Start sharing from a camera       |
| `../stopShare`        | _(none)_                  | Stop sharing                      |

#### Room Info

| Address               | Command Payload Arguments | Description                    |
| --------------------- | ------------------------- | ------------------------------ |
| `../getRoomInfo`      | _(none)_                  | Get information about the room |
| `../getMeetingStatus` | _(none)_                  | Get meeting status             |

#### Participant Info

| Address                  | Command Payload Arguments | Description                                   |
| ------------------------ | ------------------------- | --------------------------------------------- |
| `../getParticipantCount` | _(none)_                  | Get the number of participants in the meeting |

#### Camera Control

| Address                   | Command Payload Arguments | Description                            |
| ------------------------- | ------------------------- | -------------------------------------- |
| `../activateCameraPreset` | `int preset_index`        | Activate the PTZ preset for the camera |

#### CAVZRC Control

| Address         | Command Payload Arguments | Description                      |
| --------------- | ------------------------- | -------------------------------- |
| `../pairRoom`   | _(none)_                  | Pair to the target Zoom Room     |
| `../unPairRoom` | _(none)_                  | Unpair from the target Zoom Room |

#### Name

| Address                | Command Payload Arguments        | Description                                                  |
| ---------------------- | -------------------------------- | ------------------------------------------------------------ |
| `../renameParticipant` | `str current_name, str new_name` | Change the name of the Zoom Room participant(s) in a meeting |

---

### Input Global Commands

| Address                         | Description                                  |
| ------------------------------- | -------------------------------------------- |
| `/zoomRooms/getAddedRoomList`   | Get the list of rooms added to the CAVZRC    |
| `/zoomRooms/getPairedRoomList`  | Get the list of rooms paired to the CAVZRC   |
| `/zoomRooms/getAddedRoomCount`  | Get the number of rooms added to the CAVZRC  |
| `/zoomRooms/getPairedRoomCount` | Get the number of rooms paired to the CAVZRC |

---

### Output Room Commands

> All room outputs include the prefix: `"roomID" "roomName" roomIndex` before command-specific arguments.

#### NDI

| Address               | Command Payload Arguments                           | Description                                  |
| --------------------- | --------------------------------------------------- | -------------------------------------------- |
| `../channelConfigNDI` | `int index, int status, str content, str selection` | Returns the configuration of an NDI channel  |
| `../channelCountNDI`  | `int count`                                         | Returns the number of NDI channels available |

#### HWIO

| Address                               | Command Payload Arguments                                                                                                                                                                                                                      | Description                                                      |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `../supportedResolutionFrameRateHWIO` | `int channel_num, str supported_settings…`                                                                                                                                                                                                     | Returns the supported resolutions/frame rates for a HWIO channel |
| `../channelConfigHWIO`                | `bool isActive, str channel_name, int mode (1=output, 2=input), int content (0=not available, 1–X=index in dropdown), str selection (empty string if nothing, otherwise name), str resolution_fps, int audio_mix (0=n/a, otherwise int index)` | Returns the configuration of a HWIO channel                      |
| `../channelCountHWIO`                 | `int count`                                                                                                                                                                                                                                    | Returns the number of HWIO channels available                    |

#### Dante

| Address                 | Command Payload Arguments                                       | Description                                    |
| ----------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| `../channelConfigDante` | `int index, int status, str content, str selection, str signal` | Returns the configuration of a Dante channel   |
| `../channelCountDante`  | `int count`                                                     | Returns the number of Dante channels available |

#### Device Settings

| Address              | Command Payload Arguments | Description                       |
| -------------------- | ------------------------- | --------------------------------- |
| `../roomMicList`     | `array of str`            | Returns a list of mic devices     |
| `../roomCameraList`  | `array of str`            | Returns a list of camera devices  |
| `../roomSpeakerList` | `array of str`            | Returns a list of speaker devices |

#### Overlays

| Address                | Command Payload Arguments                                                                 | Description                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `../roomOverlayConfig` | `int name_position, bool show_nametag, bool show_emoji, bool show_hand, bool show_border` | Returns the overlay settings. `name_position`: 1=left, 2=center, 3=right |

#### Room Info

| Address       | Command Payload Arguments                                                     | Description                                                                      |
| ------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `../roomInfo` | `str availability, str room_type, str location, str web_zrc_url, str version` | Returns information about the room (prefix already includes id, name, and index) |

---

### Output Global Commands

| Address               | Command Payload Arguments                                | Description                                                           |
| --------------------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| `../addedRoomsList`   | `int max_list, int this_index, str roomID, str roomName` | Returns the list of rooms added to the CAVZRC (one message per room)  |
| `../pairedRoomsList`  | `int max_list, int this_index, str roomID, str roomName` | Returns the list of rooms paired to the CAVZRC (one message per room) |
| `../addedRoomsCount`  | `int count`                                              | Returns the number of rooms added to the CAVZRC                       |
| `../pairedRoomsCount` | `int count`                                              | Returns the number of rooms paired to the CAVZRC                      |

---

## Undocumented Commands

These output commands are implemented in the CAVZRC but are not documented in the official API spec. Behavior may change without notice.

### Undocumented Output Room Commands

> All room outputs include the prefix: `"roomID" "roomName" roomIndex` before command-specific arguments.

#### Room Info

| Address               | Command Payload Arguments | Description                                       |
| --------------------- | ------------------------- | ------------------------------------------------- |
| `../meetingStatus`    | `str status`              | Returns the current meeting status of the room    |
| `../participantCount` | `int count`               | Returns the number of participants in the meeting |

#### Device Settings

| Address                    | Command Payload Arguments | Description                                                          |
| -------------------------- | ------------------------- | -------------------------------------------------------------------- |
| `../muteStatus`            | `bool isMuted`            | Returns the current mic mute state (`1` = unmuted, `0` = muted)      |
| `../cameraStatus`          | `bool isOn`               | Returns the current camera state (`1` = on, `0` = off)               |
| `../selectedPrimaryCamera` | `str camera_name`         | Returns the currently selected primary camera (empty string if none) |
| `../selectedMic`           | `str mic_name`            | Returns the currently selected microphone (empty string if none)     |
| `../selectedSpeaker`       | `str speaker_name`        | Returns the currently selected speaker (empty string if none)        |
