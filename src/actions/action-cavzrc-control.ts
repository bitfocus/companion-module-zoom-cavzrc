import type { CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../types.js'
import { ROOM_TARGET_OPTIONS, roomCommand, roomCommandWithOpts } from './action-room-utils.js'

export enum ActionIdCavzrcControl {
	pairRoom = 'pairRoom',
	unPairRoom = 'unPairRoom',
	renameParticipant = 'renameParticipant',
}

export function GetActionsCavzrcControl(instance: ZoomRoomsInstance): {
	[id in ActionIdCavzrcControl]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdCavzrcControl]: CompanionActionDefinition | undefined } = {
		[ActionIdCavzrcControl.pairRoom]: {
			name: 'Pair room',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'pairRoom'),
		},

		[ActionIdCavzrcControl.unPairRoom]: {
			name: 'Unpair room',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'unPairRoom'),
		},

		[ActionIdCavzrcControl.renameParticipant]: {
			name: 'Rename participant',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Current name', id: 'current_name', default: '' },
				{ type: 'textinput', label: 'New name', id: 'new_name', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'renameParticipant', (o) => [
				typeof o.current_name === 'string' ? o.current_name : '',
				typeof o.new_name === 'string' ? o.new_name : '',
			]),
		},
	}

	return actions
}
