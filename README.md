# CAVZRC Companion module

Bitfocus Companion module for **Custom AV for Zoom Rooms Controller (CAVZRC)**. Control Zoom Rooms via OSC from Companion: join/leave meetings, mute, NDI/HWIO/Dante outputs, device settings, overlays, content share, and more. Feedbacks and variables update when CAVZRC sends OSC back to Companion.

**Requirements:** Zoom Rooms 6.5.0+, CAVZRC 1.2.0+. The CAVZRC OSC API is in Beta.

**Repository:** [github.com/bitfocus/companion-module-zoom-cavzrc](https://github.com/bitfocus/companion-module-zoom-cavzrc)

---

## Configuration

Add a connection in Companion: **Connections** → **Add connection** → **Zoom** → **CAVZRC Companion module** (or **CAVZRC**). Then set:

| Field | Meaning |
| ------- | -------- |
| **CAVZRC host (IP)** | IP of the machine running CAVZRC (use `127.0.0.1` if Companion and CAVZRC are on the same machine). |
| **CAVZRC Receiving Port** | Must match CAVZRC’s **Receiving Port** (Companion sends commands here). |
| **Companion listen port** | Must match CAVZRC’s **Transmission Port** (CAVZRC sends status/feedback here). Use **0** to disable feedback and variables. |
| **OSC output header** | Must match CAVZRC’s **OSC Output Header** (default `/roomosc`). |

**In CAVZRC:** Set **Transmission IP** to the machine running Companion (e.g. `127.0.0.1` for same machine), and **Transmission Port** to the same value as **Companion listen port** above. Set **Receiving Port** to the same value as **CAVZRC Receiving Port** above.

**Room targeting:** Most actions can target a single room by **Room ID**, **Room name**, or **Room index** (1-based), or **All rooms**.

---

## What the module can do

The module exposes CAVZRC’s OSC controls so you can drive Zoom Rooms from Companion buttons, feedbacks, and variables.

### Join / leave

- **Join meeting** — Join by meeting ID (and optional password, user name). Target one room or all rooms. A 10-second cooldown is enforced between join attempts for the same room target to prevent Zoom from locking the room out after repeated wrong-passcode attempts (see [Join attempt rate limiting](#join-attempt-rate-limiting) below).
- **Start meeting** — Start an instant meeting. Target one room or all rooms.
- **Leave meeting** — Leave the current meeting. Target one room or all rooms.
- **Reset join attempt limit** — Immediately clear the join cooldown for a specific room target or all rooms, allowing a new attempt without waiting.

### Room list (global)

- **Get added room list** — Request the list of added rooms from CAVZRC.
- **Get paired room list** — Request the list of paired rooms.
- **Get added room count** / **Get paired room count** — Request counts.

### NDI

- Set NDI channel **content**: Off, Participant, Active Speaker, Gallery, Screenshare, Spotlight, Pin Group.
- Set **participant**, **gallery**, **screenshare**, or **pin group** selection (with index) for a channel.
- **Get NDI channel config** / **Get NDI channel count** — Query NDI setup.

### HWIO (hardware I/O)

- Set **mode** (e.g. pass-through, mix).
- Set **input selection** and **content**: Off, Test Signal, Participant, Active Speaker, Gallery, Screenshare, Spotlight, Pin Group.
- Set **resolution/frame rate**, **audio mix**, and participant/gallery/screenshare/pin selection per channel.
- **Get HWIO channel config** / **channel count** / **supported resolution and frame rate**.

### Dante

- Set Dante channel **content**: Off, Participant, Mix, Screenshare; set **participant selection** (with index).
- **Get Dante channel config** / **channel count**.

### Device (per room)

- **Mic:** Set room mic (by name), get mic list, **mute** / **unmute** mic, get selected mic.
- **Camera:** Set **main camera**, set **multi-camera on/off** (by name), **start** / **stop** camera, get camera list, get selected primary/multi cameras, **set camera display name**.
- **Speaker:** Set room speaker (by name), get speaker list, get selected speaker.

### Overlays (per room)

- **Name tag:** Enable/disable name tag overlay; **set name tag alignment** (left/center/right).
- **Emoji**, **hand raise**, **active speaker** overlays — enable/disable each.
- **Get overlay settings** — Query current overlay state.

### Content share (per room)

- **Start device share** / **Start camera share** (with optional camera name) / **Stop share**.

### Room / meeting (per room)

- **Get room info**, **participant count**, **meeting status**.
- **Activate camera preset** (by preset index).
- **Pair room** / **Unpair room**.
- **Rename participant** (current name → new name).
- **Set active speaker** — self or a participant by name.

### Companion rooms (Companion Room feature)

- **Get companion room list** — List Companion rooms.
- **Get companion room camera list** (by companion room ID).
- **Set companion room camera display name** / **camera off** / **camera on** (by companion room ID and camera device name).

---

## Feedbacks

- **Room is paired** — True when the chosen room is in the paired list.
- **In meeting** — True when the chosen room is in a meeting.
- **Mic unmuted** — True when the room mic is unmuted.
- **Camera on** — True when the room camera is on.

Room options for feedbacks are filled from the list of paired/added rooms reported by CAVZRC.

---

## Variables

Updated from CAVZRC when the **Companion listen port** is set (non-zero):

- **added_rooms_count**, **paired_rooms_count** — Counts of added and paired rooms.
- **added_rooms_list**, **paired_rooms_list** — Comma-separated room names.
- **room_1** … **room_10** — Per-room: **id**, **name**, **meeting_status**, **participant_count**, **mute** (Muted/Unmuted), **camera** (On/Off).

Use these in button labels, stream deck text, or conditional logic.

---

## Join attempt rate limiting

When a **Join meeting** action is triggered with an incorrect passcode, Zoom Rooms caches the bad passcode and CAVZRC may retry the join internally. If this happens too many times, Zoom locks the room out of that meeting entirely — even blocking subsequent manual join attempts from the room controller.

To prevent this, the module enforces a **10-second cooldown per room target** after each join attempt. If a second join command arrives for the same target within 10 seconds (e.g. from a held button, a rapid trigger, or an automation), it is silently dropped and a warning is logged in Companion.

The cooldown resets automatically when the room successfully enters a meeting. It can also be cleared immediately using the **Reset join attempt limit** action, which is useful when you have corrected a wrong passcode and want to retry without waiting.

> **Note:** The cooldown prevents Companion from spamming join commands, but it cannot prevent CAVZRC from retrying internally after receiving a single command. If you enter a wrong passcode, Zoom Rooms will cache it. Clearing that cached passcode requires action on the machine running Zoom Rooms — it is not something the Companion module can control.

### Clearing a cached wrong passcode

If a bad passcode has been cached and manual join attempts fail before you can enter a new passcode, clear the Zoom app cache on the machine running Zoom Rooms:

1. Click the **Finder** icon in the Dock (or press **⌘ + Space** and search for Finder).
2. In the menu bar, click **Go** → **Go to Folder**.
3. Enter `/Library/Application Support/zoom.us` and press Return.
4. Right-click the **data** folder and select **Move to Trash**.
5. Restart Zoom Rooms.

This removes the locally cached meeting credentials and allows a clean join attempt.

---

## License

MIT. See [LICENSE](LICENSE) in this repository.
