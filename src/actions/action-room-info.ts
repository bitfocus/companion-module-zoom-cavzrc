import type { CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../types.js'
import { ROOM_TARGET_OPTIONS, roomCommand } from './action-room-utils.js'

export enum ActionIdRoomInfo {
	getRoomInfo = 'getRoomInfo',
	getMeetingStatus = 'getMeetingStatus',
	getParticipantCount = 'getParticipantCount',
}

export function GetActionsRoomInfo(instance: ZoomRoomsInstance): {
	[id in ActionIdRoomInfo]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdRoomInfo]: CompanionActionDefinition | undefined } = {
		[ActionIdRoomInfo.getRoomInfo]: {
			name: 'Get room info',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getRoomInfo'),
		},

		[ActionIdRoomInfo.getMeetingStatus]: {
			name: 'Get meeting status',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getMeetingStatus'),
		},

		[ActionIdRoomInfo.getParticipantCount]: {
			name: 'Get participant count',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getParticipantCount'),
		},
	}

	return actions
}
