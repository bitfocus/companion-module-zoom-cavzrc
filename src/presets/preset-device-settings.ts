import { CompanionPresetExt, btn } from './preset-utils.js'
import { ActionIdDeviceSettings } from '../actions/action-device-settings.js'

export enum PresetIdDeviceSettings {
	MuteMic = 'mute_mic',
	UnmuteMic = 'unmute_mic',
	StartCamera = 'start_camera',
	StopCamera = 'stop_camera',
}

const defaultOpts = { targetType: 'roomIndex', roomIndex: 1 }

export function GetPresetsDeviceSettings(): { [id in PresetIdDeviceSettings]: CompanionPresetExt | undefined } {
	const presets: { [id in PresetIdDeviceSettings]: CompanionPresetExt | undefined } = {
		[PresetIdDeviceSettings.MuteMic]: btn('Mute mic', 'Device', ActionIdDeviceSettings.muteMic, defaultOpts),

		[PresetIdDeviceSettings.UnmuteMic]: btn('Unmute mic', 'Device', ActionIdDeviceSettings.unMuteMic, defaultOpts),

		[PresetIdDeviceSettings.StartCamera]: btn(
			'Start camera',
			'Device',
			ActionIdDeviceSettings.startCamera,
			defaultOpts,
		),

		[PresetIdDeviceSettings.StopCamera]: btn('Stop camera', 'Device', ActionIdDeviceSettings.stopCamera, defaultOpts),
	}

	return presets
}
