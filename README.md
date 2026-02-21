# CAVZRC Companion module

**Version 0.0.1 (alpha)** — Bitfocus Companion module for **Custom AV for Zoom Rooms Controller (CAVZRC)** using its OSC API. Control Zoom Rooms (join/leave meetings, mute, NDI/HWIO/Dante, device settings, overlays, etc.) from Companion; feedbacks and variables work when CAVZRC sends OSC back to Companion.

**Requirements:** Zoom Rooms 6.5.0+, CAVZRC 1.2.0+. The CAVZRC OSC API is in Beta.

**Repository:** [github.com/bitfocus/companion-module-zoom-cavzrc](https://github.com/bitfocus/companion-module-zoom-cavzrc)

---

## Recommended: Use the Developer module path (most reliable)

If **Import module package** doesn’t show the module in the list or when adding a connection, use the **Developer module path** instead. Companion will load the module directly from this folder.

1. **Build the module** (in this repo):
   ```bash
   yarn build
   ```

2. **Create a “dev modules” folder** (if you don’t have one), e.g.:
   - Mac: `~/companion-dev-modules`
   - Put **this entire project folder** inside it so you have:
   - `~/companion-dev-modules/companion-module-zoom-rooms/` (with `companion/`, `dist/`, `package.json` inside).

3. **Point Companion at the parent folder** (not the module folder itself):
   - Open the **Companion launcher** (the small window with the gear).
   - Click the **gear** → open **Advanced** / **Developer** (or similar).
   - Turn **Enable Developer Modules** **on**.
   - Set **Developer module path** (or “Select”) to the **parent** folder, e.g. `~/companion-dev-modules` (the one that *contains* `companion-module-zoom-rooms`).

4. **Apply / OK** and (if needed) restart Companion or click **Launch GUI**.

5. **Add a connection:**
   - Go to **Connections** → **Add connection**.
   - In the connection type list, search or browse for **Zoom** → **CAVZRC Companion module** or **CAVZRC**.
   - Add it and configure Host, tx_port, rx_port, OSC output header.

The module will now appear when adding a connection. You can edit code, run `yarn build` again, and Companion will reload the module when you disable/re-enable the connection (or restart).

---

## Alternative: Install via Import module package

1. Build the package: run **`yarn run package`** in this repo. This produces **`zoom-rooms-0.0.1.tgz`** (or the current version).
2. In Companion, open the **Modules** page (left panel or Settings → Modules).
3. Click **“Import module package”** and select the **`.tgz`** file.
4. If Companion says **“module already exists”**, the module is already installed (but if you still don’t see it when adding a connection, use the **Developer path** method above).

---

## Building a package for other machines

To test the module on another computer (without cloning the repo or using the developer path):

1. **On your dev machine**, in this repo:
   ```bash
   yarn run package
   ```
   This builds the module and produces **`zoom-rooms-0.0.1.tgz`** in the project root (version matches `package.json`).

2. **Copy the `.tgz`** to the other machine (USB, cloud, etc.).

3. **On the other machine**, in Companion:
   - Go to **Modules** → **Import module package** and select the `.tgz` file.
   - Go to **Connections** → **Add connection** → **Zoom** → **CAVZRC Companion module**.
   - Configure Host, CAVZRC Receiving Port, and Companion listen port to match that machine's CAVZRC/network.

No repo or dev setup is required on the other machine.

---

## Adding a connection (where to find it)

The module does **not** show up as a separate “connection” until you **add** one:

1. Go to **Connections** → **Add connection** (or “+” / “New connection”).
2. In the **connection type** list, find **Zoom** (manufacturer). Under it select **“Zoom Rooms (CAVZRC)”** or **“Zoom Rooms”**.
3. Give the connection a name and add it, then configure **Host**, **tx_port**, **rx_port**, and **OSC output header**.

If you don’t see **CAVZRC Companion module** in the list:

- Use the **Developer module path** method above (recommended for this module).
- Or search in the connection type list for **“Zoom”**, **“Zoom Rooms”**, or **“CAVZRC”**.
- Restart Companion after setting the Developer path or after importing.

---

## Configuration

- **Host** — IP of the machine running CAVZRC.
- **tx_port** — CAVZRC “Receiving Port” (where we send OSC).
- **rx_port** — Port where Companion listens for OSC from CAVZRC (use **0** to disable feedbacks/variables).
- **OSC output header** — Must match CAVZRC’s “OSC Output Header” (default `/roomosc`).

In CAVZRC, set **Transmission IP** and **Transmission Port** to the machine running Companion and the **rx_port** value above.

More detail and target types (roomID, roomName, roomIndex, allRooms) are in the in-app help: add a connection, then open the **?** / **Help** for this module (that shows `companion/HELP.md`).

---

## Development

This module uses **Yarn** (same as other Bitfocus Companion modules).

- **Install dependencies:** `yarn` or `yarn install`
- **Build:** `yarn build`
- **Package (for import):** `yarn run package` → produces `zoom-rooms-<version>.tgz`
- **Dev modules path:** You can also point Companion’s **Developer modules path** at the **parent** of this folder (the folder that contains `companion-module-zoom-rooms`), then run `yarn build` and use the dev module without importing a `.tgz`.

---

## Repository

This module is part of the Bitfocus Companion project:

- **Official repo:** [github.com/bitfocus/companion-module-zoom-cavzrc](https://github.com/bitfocus/companion-module-zoom-cavzrc)

To push updates (if you have write access), set the remote and push:

```bash
git remote set-url origin https://github.com/bitfocus/companion-module-zoom-cavzrc.git
git push -u origin main
```

To contribute without write access: fork the repo on GitHub, push to your fork, then open a Pull Request to `bitfocus/companion-module-zoom-cavzrc`.

---

## License

MIT.
