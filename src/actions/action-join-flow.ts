import type { CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../utils.js'
import { ROOM_TARGET_OPTIONS, roomCommand, roomCommandWithOpts } from './action-room-utils.js'

export enum ActionIdJoinFlow {
	joinMeeting = 'joinMeeting',
	startMeeting = 'startMeeting',
	leaveMeeting = 'leaveMeeting',
}

export function GetActionsJoinFlow(instance: ZoomRoomsInstance): {
	[id in ActionIdJoinFlow]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdJoinFlow]: CompanionActionDefinition | undefined } = {
		[ActionIdJoinFlow.joinMeeting]: {
			name: 'Join meeting',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Meeting ID', id: 'meetingID', default: '', useVariables: true },
				{ type: 'textinput', label: 'Meeting password', id: 'meetingPass', default: '', useVariables: true },
				{ type: 'textinput', label: 'User name', id: 'userName', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'joinMeeting', (o) => [
				typeof o.meetingID === 'string' ? o.meetingID : '',
				typeof o.meetingPass === 'string' ? o.meetingPass : '',
				typeof o.userName === 'string' ? o.userName : '',
			]),
		},

		[ActionIdJoinFlow.startMeeting]: {
			name: 'Start meeting',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'startMeeting'),
		},

		[ActionIdJoinFlow.leaveMeeting]: {
			name: 'Leave meeting',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'leaveMeeting'),
		},
	}

	return actions
}
