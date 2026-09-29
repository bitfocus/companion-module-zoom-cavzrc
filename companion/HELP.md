# Zoom Rooms (CAVZRC) Module

Control **Custom AV for Zoom Rooms Controller (CAVZRC)** via its OSC API. Commands are sent to the CAVZRC application (not directly to the Zoom Room device), allowing control over multiple Zoom Rooms and over the WAN.

**Note:** The CAVZRC OSC API is currently in **Beta**.

## Requirements

- Zoom Rooms version **6.5.0** or later
- **Custom AV Zoom Rooms Controller 1.2.0** or later

## Configuration

- **Host** — IP address of the machine running CAVZRC (where this module sends OSC commands).
- **tx_port** — CAVZRC "Receiving Port" (port where CAVZRC listens for incoming OSC).
- **rx_port** — Port where Companion listens for OSC **outputs** from CAVZRC (set to 0 to disable listening for feedbacks/variables).
- **OSC output header** — Must match the "OSC Output Header" setting in CAVZRC (default: `/roomosc`).

In CAVZRC, configure **Transmission IP** and **Transmission Port** to point to the machine running Companion and the **rx_port** value above, so that CAVZRC can send status and events back to this module.

## Target types (room commands)

Room-targeted actions can target Zoom Rooms by:

- **roomID** — Unique room ID (string).
- **roomName** — Display name of the room (string).
- **roomIndex** — One-based index in the list of rooms added to CAVZRC.
- **allRooms** — Apply to all rooms added to CAVZRC.

## Variables and feedbacks

- **Variables**: Added/paired room count and list; per-room (room 1–10) ID, name, meeting status, participant count, mute and camera status. Populated when CAVZRC sends OSC outputs to this module (configure rx_port and CAVZRC Transmission settings).
- **Feedbacks**: Room paired, in meeting, mic unmuted, camera on. Room dropdown is filled from the paired or added room list after you request room lists (e.g. Get added room list / Get paired room list).

## References

- Zoom Custom AV for Zoom Rooms Controller (CAVZRC) and its OSC API documentation.
- [Companion developer docs](https://companion.free/for-developers/).

## Channel status (NDI / HWIO / Dante)

CAVZRC reports channel configuration replies (`channelConfig*`, `channelCount*`)
are parsed into room state and exposed as:

- `room_N_ndi_count` / `room_N_hwio_count` / `room_N_dante_count` — channel counts
- `room_N_ndi_<index>_status/content/selection` — NDI channel details
- `room_N_hwio_<name>_active/mode/content/selection/resolution_fps/audio_mix`
  — HWIO channel details, keyed by the CAVZRC channel name (lowercased,
  non-alphanumerics become `_`)
- `room_N_dante_<index>_status/content/selection/signal` — Dante channel details

Feedbacks: "HWIO channel active" and "HWIO channel selection matches" let
buttons/triggers react to routing changes (e.g. detect a frozen or unrouted
screen).

## Connection health

"No-data warning" (config): when listening and no OSC arrives from CAVZRC for
the configured silence window, the connection is marked failed and a probe is
sent. Data arriving restores the status automatically.
