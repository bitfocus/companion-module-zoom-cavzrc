import type { SomeCompanionFeedbackInputField } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../types.js'

export function roomChoices(instance: ZoomRoomsInstance): { id: string; label: string }[] {
	const choices = [{ id: '', label: '(Select room)' }]
	const rooms = instance.state.pairedRooms.length ? instance.state.pairedRooms : instance.state.addedRooms
	for (const r of rooms) {
		if (r.roomID) choices.push({ id: r.roomID, label: r.roomName || r.roomID })
	}
	return choices
}

export function getRoomOption(instance: ZoomRoomsInstance): SomeCompanionFeedbackInputField {
	return {
		type: 'dropdown',
		label: 'Room',
		id: 'roomId',
		default: '',
		choices: roomChoices(instance),
	}
}
