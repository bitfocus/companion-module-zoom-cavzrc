import type { CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../types.js'

export enum ActionIdGlobal {
	getAddedRoomList = 'getAddedRoomList',
	getPairedRoomList = 'getPairedRoomList',
	getAddedRoomCount = 'getAddedRoomCount',
	getPairedRoomCount = 'getPairedRoomCount',
}

export function GetActionsGlobal(instance: ZoomRoomsInstance): {
	[id in ActionIdGlobal]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGlobal]: CompanionActionDefinition | undefined } = {
		[ActionIdGlobal.getAddedRoomList]: {
			name: 'Get added room list',
			options: [],
			callback: () => instance.OSC?.sendCommand('/zoomRooms/getAddedRoomList', []),
		},

		[ActionIdGlobal.getPairedRoomList]: {
			name: 'Get paired room list',
			options: [],
			callback: () => instance.OSC?.sendCommand('/zoomRooms/getPairedRoomList', []),
		},

		[ActionIdGlobal.getAddedRoomCount]: {
			name: 'Get added room count',
			options: [],
			callback: () => instance.OSC?.sendCommand('/zoomRooms/getAddedRoomCount', []),
		},

		[ActionIdGlobal.getPairedRoomCount]: {
			name: 'Get paired room count',
			options: [],
			callback: () => instance.OSC?.sendCommand('/zoomRooms/getPairedRoomCount', []),
		},
	}

	return actions
}
