import type { CompanionVariableDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../osc.js'

export function initVariableDefinitions(instance: ZoomRoomsInstance): void {
	const definitions: CompanionVariableDefinition[] = [
		{ variableId: 'added_rooms_count', name: 'Added rooms count' },
		{ variableId: 'paired_rooms_count', name: 'Paired rooms count' },
		{ variableId: 'added_rooms_list', name: 'Added rooms list (names)' },
		{ variableId: 'paired_rooms_list', name: 'Paired rooms list (names)' },
	]
	for (let n = 1; n <= 10; n++) {
		definitions.push({ variableId: `room_${n}_id`, name: `Room ${n} ID` })
		definitions.push({ variableId: `room_${n}_name`, name: `Room ${n} name` })
		definitions.push({ variableId: `room_${n}_meeting_status`, name: `Room ${n} meeting status` })
		definitions.push({ variableId: `room_${n}_participant_count`, name: `Room ${n} participant count` })
		definitions.push({ variableId: `room_${n}_mute`, name: `Room ${n} mute status` })
		definitions.push({ variableId: `room_${n}_camera`, name: `Room ${n} camera status` })
	}
	instance.setVariableDefinitions(definitions)
}
