import type { CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../utils.js'
import { ROOM_TARGET_OPTIONS, roomCommand, roomCommandWithOpts } from './action-room-utils.js'

export enum ActionIdContentShare {
	startDeviceShare = 'startDeviceShare',
	startCameraShare = 'startCameraShare',
	stopShare = 'stopShare',
}

export function GetActionsContentShare(instance: ZoomRoomsInstance): {
	[id in ActionIdContentShare]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdContentShare]: CompanionActionDefinition | undefined } = {
		[ActionIdContentShare.startDeviceShare]: {
			name: 'Start device share',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'startDeviceShare'),
		},

		[ActionIdContentShare.startCameraShare]: {
			name: 'Start camera share',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'startCameraShare', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},

		[ActionIdContentShare.stopShare]: {
			name: 'Stop share',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'stopShare'),
		},
	}

	return actions
}
