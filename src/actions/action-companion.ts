import type { CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../utils.js'
import { ROOM_TARGET_OPTIONS, roomCommand, roomCommandWithOpts } from './action-room-utils.js'

export enum ActionIdCompanion {
	getCompanionRoomList = 'getCompanionRoomList',
	getCompanionRoomCameraList = 'getCompanionRoomCameraList',
	setCompanionRoomCameraDisplayName = 'setCompanionRoomCameraDisplayName',
	setCompanionRoomCameraOff = 'setCompanionRoomCameraOff',
	setCompanionRoomCameraOn = 'setCompanionRoomCameraOn',
}

export function GetActionsCompanion(instance: ZoomRoomsInstance): {
	[id in ActionIdCompanion]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdCompanion]: CompanionActionDefinition | undefined } = {
		[ActionIdCompanion.getCompanionRoomList]: {
			name: 'Get companion room list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getCompanionRoomList'),
		},

		[ActionIdCompanion.getCompanionRoomCameraList]: {
			name: 'Get companion room camera list',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID (czr_id)', id: 'czr_id', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'getCompanionRoomCameraList', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
			]),
		},

		[ActionIdCompanion.setCompanionRoomCameraDisplayName]: {
			name: 'Set companion room camera display name',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID', id: 'czr_id', default: '' },
				{ type: 'textinput', label: 'Camera device name', id: 'camera_device_name', default: '' },
				{ type: 'textinput', label: 'New display name', id: 'new_camera_display_name', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setCompanionRoomCameraDisplayName', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
				typeof o.camera_device_name === 'string' ? o.camera_device_name : '',
				typeof o.new_camera_display_name === 'string' ? o.new_camera_display_name : '',
			]),
		},

		[ActionIdCompanion.setCompanionRoomCameraOff]: {
			name: 'Set companion room camera off',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID', id: 'czr_id', default: '' },
				{ type: 'textinput', label: 'Camera device name', id: 'camera_device_name', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setCompanionRoomCameraOff', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
				typeof o.camera_device_name === 'string' ? o.camera_device_name : '',
			]),
		},

		[ActionIdCompanion.setCompanionRoomCameraOn]: {
			name: 'Set companion room camera on',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID', id: 'czr_id', default: '' },
				{ type: 'textinput', label: 'Camera device name', id: 'camera_device_name', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setCompanionRoomCameraOn', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
				typeof o.camera_device_name === 'string' ? o.camera_device_name : '',
			]),
		},
	}

	return actions
}
