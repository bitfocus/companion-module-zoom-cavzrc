import { CompanionPresetExt, btn } from './preset-utils.js'
import { ActionIdGlobal } from '../actions/action-global.js'

export enum PresetIdGlobal {
	GetAddedRoomList = 'get_added_room_list',
	GetPairedRoomList = 'get_paired_room_list',
}

export function GetPresetsGlobal(): { [id in PresetIdGlobal]: CompanionPresetExt | undefined } {
	const presets: { [id in PresetIdGlobal]: CompanionPresetExt | undefined } = {
		[PresetIdGlobal.GetAddedRoomList]: btn('Get added rooms', 'Room list', ActionIdGlobal.getAddedRoomList),

		[PresetIdGlobal.GetPairedRoomList]: btn('Get paired rooms', 'Room list', ActionIdGlobal.getPairedRoomList),
	}

	return presets
}
