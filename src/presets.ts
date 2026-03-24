import type { CompanionPresetDefinitions } from '@companion-module/base'
import type { ZoomRoomsInstance } from './utils.js'
import { CompanionPresetExt } from './presets/preset-utils.js'
import { PresetIdJoinFlow, GetPresetsJoinFlow } from './presets/preset-join-flow.js'
import { PresetIdGlobal, GetPresetsGlobal } from './presets/preset-global.js'
import { PresetIdNDI, GetPresetsNDI } from './presets/preset-ndi.js'
import { PresetIdHWIO, GetPresetsHWIO } from './presets/preset-hwio.js'
import { PresetIdDante, GetPresetsDante } from './presets/preset-dante.js'
import { PresetIdDeviceSettings, GetPresetsDeviceSettings } from './presets/preset-device-settings.js'
import { PresetIdOverlays, GetPresetsOverlays } from './presets/preset-overlays.js'

export function GetPresetList(_instance: ZoomRoomsInstance): CompanionPresetDefinitions {
	const presetsJoinFlow: { [id in PresetIdJoinFlow]: CompanionPresetExt | undefined } = GetPresetsJoinFlow()
	const presetsGlobal: { [id in PresetIdGlobal]: CompanionPresetExt | undefined } = GetPresetsGlobal()
	const presetsNDI: { [id in PresetIdNDI]: CompanionPresetExt | undefined } = GetPresetsNDI()
	const presetsHWIO: { [id in PresetIdHWIO]: CompanionPresetExt | undefined } = GetPresetsHWIO()
	const presetsDante: { [id in PresetIdDante]: CompanionPresetExt | undefined } = GetPresetsDante()
	const presetsDeviceSettings: { [id in PresetIdDeviceSettings]: CompanionPresetExt | undefined } =
		GetPresetsDeviceSettings()
	const presetsOverlays: { [id in PresetIdOverlays]: CompanionPresetExt | undefined } = GetPresetsOverlays()

	const presets: {
		[id in
			| PresetIdJoinFlow
			| PresetIdGlobal
			| PresetIdNDI
			| PresetIdHWIO
			| PresetIdDante
			| PresetIdDeviceSettings
			| PresetIdOverlays]: CompanionPresetExt | undefined
	} = {
		...presetsJoinFlow,
		...presetsGlobal,
		...presetsNDI,
		...presetsHWIO,
		...presetsDante,
		...presetsDeviceSettings,
		...presetsOverlays,
	}

	return presets as CompanionPresetDefinitions
}
