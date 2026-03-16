import type { ZoomRoomsInstance } from '../types.js'

export function updateAddedRoomsCount(instance: ZoomRoomsInstance): void {
	instance.setVariableValues({ added_rooms_count: instance.state.addedRoomsCount })
}

export function updatePairedRoomsCount(instance: ZoomRoomsInstance): void {
	instance.setVariableValues({ paired_rooms_count: instance.state.pairedRoomsCount })
}

export function updateAddedRoomsList(instance: ZoomRoomsInstance): void {
	instance.setVariableValues({
		added_rooms_list:
			instance.state.addedRooms
				.map((r) => r.roomName)
				.filter(Boolean)
				.join(', ') || '—',
	})
}

export function updatePairedRoomsList(instance: ZoomRoomsInstance): void {
	instance.setVariableValues({
		paired_rooms_list:
			instance.state.pairedRooms
				.map((r) => r.roomName)
				.filter(Boolean)
				.join(', ') || '—',
	})
}

export function updateVariableValues(instance: ZoomRoomsInstance): void {
	const state = instance.state
	updateAddedRoomsCount(instance)
	updatePairedRoomsCount(instance)
	updateAddedRoomsList(instance)
	updatePairedRoomsList(instance)
	const roomValues: Record<string, string | number> = {}
	state.pairedRooms.slice(0, 10).forEach((r, i) => {
		const n = i + 1
		roomValues[`room_${n}_id`] = r.roomID
		roomValues[`room_${n}_name`] = r.roomName || '—'
		const room = state.rooms[r.roomID]
		roomValues[`room_${n}_meeting_status`] = room?.meetingStatus ?? '—'
		roomValues[`room_${n}_participant_count`] = room?.participantCount ?? '—'
		roomValues[`room_${n}_mute`] = room?.muteStatus === true ? 'Unmuted' : room?.muteStatus === false ? 'Muted' : '—'
		roomValues[`room_${n}_camera`] = room?.cameraStatus === true ? 'On' : room?.cameraStatus === false ? 'Off' : '—'
	})
	instance.setVariableValues(roomValues)
}
