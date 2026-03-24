import type { CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../types.js'
import { ROOM_TARGET_OPTIONS, roomCommandWithOpts } from './action-room-utils.js'

export enum ActionIdCameraControl {
	activateCameraPreset = 'activateCameraPreset',
}

export function GetActionsCameraControl(instance: ZoomRoomsInstance): {
	[id in ActionIdCameraControl]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdCameraControl]: CompanionActionDefinition | undefined } = {
		[ActionIdCameraControl.activateCameraPreset]: {
			name: 'Activate camera preset',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'number', label: 'Preset index', id: 'preset_index', default: 1, min: 1, max: 99 },
			],
			callback: roomCommandWithOpts(instance, 'activateCameraPreset', (o) => [Number(o.preset_index) || 1]),
		},
	}

	return actions
}
