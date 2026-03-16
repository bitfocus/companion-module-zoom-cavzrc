import type { CompanionVariableValues } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../types.js'

export function updateAddedRoomsCount(instance: ZoomRoomsInstance, variables: CompanionVariableValues): void {
	variables['added_rooms_count'] = instance.state.addedRoomsCount
}

export function updatePairedRoomsCount(instance: ZoomRoomsInstance, variables: CompanionVariableValues): void {
	variables['paired_rooms_count'] = instance.state.pairedRoomsCount
}

export function updateAddedRoomsList(instance: ZoomRoomsInstance, variables: CompanionVariableValues): void {
	variables['added_rooms_list'] =
		instance.state.addedRooms
			.map((r) => r.roomName)
			.filter(Boolean)
			.join(', ') || '—'
}

export function updatePairedRoomsList(instance: ZoomRoomsInstance, variables: CompanionVariableValues): void {
	variables['paired_rooms_list'] =
		instance.state.pairedRooms
			.map((r) => r.roomName)
			.filter(Boolean)
			.join(', ') || '—'
}

export function updateVariableValues(instance: ZoomRoomsInstance): void {
	const variables: CompanionVariableValues = {}
	updateAddedRoomsCount(instance, variables)
	updatePairedRoomsCount(instance, variables)
	updateAddedRoomsList(instance, variables)
	updatePairedRoomsList(instance, variables)
	const state = instance.state
	state.pairedRooms.slice(0, 10).forEach((r, i) => {
		const n = i + 1
		variables[`room_${n}_id`] = r.roomID
		variables[`room_${n}_name`] = r.roomName || '—'
		const room = state.rooms[r.roomID]
		variables[`room_${n}_meeting_status`] = room?.meetingStatus ?? '—'
		variables[`room_${n}_participant_count`] = room?.participantCount ?? '—'
		variables[`room_${n}_mute`] = room?.muteStatus === true ? 'Unmuted' : room?.muteStatus === false ? 'Muted' : '—'
		variables[`room_${n}_camera`] = room?.cameraStatus === true ? 'On' : room?.cameraStatus === false ? 'Off' : '—'
	})
	instance.setVariableValues(variables)
}
