import type { CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../utils.js'
import { ROOM_TARGET_OPTIONS, roomCommand, roomCommandWithOpts } from './action-room-utils.js'

export enum ActionIdActiveSpeaker {
	setActiveSpeakerSelf = 'setActiveSpeakerSelf',
	setActiveSpeakerChild = 'setActiveSpeakerChild',
}

export function GetActionsActiveSpeaker(instance: ZoomRoomsInstance): {
	[id in ActionIdActiveSpeaker]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdActiveSpeaker]: CompanionActionDefinition | undefined } = {
		[ActionIdActiveSpeaker.setActiveSpeakerSelf]: {
			name: 'Set active speaker (self)',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'setActiveSpeakerSelf'),
		},

		[ActionIdActiveSpeaker.setActiveSpeakerChild]: {
			name: 'Set active speaker (participant)',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Participant name', id: 'participant_name', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setActiveSpeakerChild', (o) => [
				typeof o.participant_name === 'string' ? o.participant_name : '',
			]),
		},
	}

	return actions
}
