import type { CompanionVariableValues } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../utils.js'

const MAX_ROOM_SLOTS = 10

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

	// Assign rooms to slots 1..N positionally, ordered by the CAVZRC list
	// index. CAVZRC roomIndex values cannot be trusted as direct slot
	// numbers (they may arrive unordered, out of range, or missing), which
	// previously landed room data on the wrong room_N_* variables — most
	// visibly participant counts. Unindexed rooms sort last, deterministically.
	const sorted = [...state.pairedRooms].sort(
		(a, b) => (a.roomIndex ?? MAX_ROOM_SLOTS + 1) - (b.roomIndex ?? MAX_ROOM_SLOTS + 1),
	)
	sorted.forEach((r, position) => {
		const n = position + 1
		if (n > MAX_ROOM_SLOTS) return
		variables[`room_${n}_id`] = r.roomID
		variables[`room_${n}_cavzrc_index`] = r.roomIndex ?? '—'
		variables[`room_${n}_name`] = r.roomName || '—'
		const room = state.rooms[r.roomID]
		variables[`room_${n}_meeting_status`] = room?.meetingStatus ?? '—'
		variables[`room_${n}_participant_count`] = room?.participantCount ?? '—'
		variables[`room_${n}_mute`] = room?.muteStatus === true ? 'Unmuted' : room?.muteStatus === false ? 'Muted' : '—'
		variables[`room_${n}_camera`] = room?.cameraStatus === true ? 'On' : room?.cameraStatus === false ? 'Off' : '—'
	})

	// Clear slots above the current room count so removed/unpaired rooms
	// do not leave stale variables behind.
	for (let k = sorted.length + 1; k <= MAX_ROOM_SLOTS; k++) {
		variables[`room_${k}_id`] = '—'
		variables[`room_${k}_cavzrc_index`] = '—'
		variables[`room_${k}_name`] = '—'
		variables[`room_${k}_meeting_status`] = '—'
		variables[`room_${k}_participant_count`] = '—'
		variables[`room_${k}_mute`] = '—'
		variables[`room_${k}_camera`] = '—'
	}

	instance.setVariableValues(variables)
}