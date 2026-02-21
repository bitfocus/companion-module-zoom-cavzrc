import type { ZoomRoomsInstance } from '../osc.js'

export function updateVariableValues(instance: ZoomRoomsInstance): void {
	const state = instance.state
	const values: Record<string, string | number> = {
		added_rooms_count: state.addedRoomsCount,
		paired_rooms_count: state.pairedRoomsCount,
		added_rooms_list:
			state.addedRooms
				.map((r) => r.roomName)
				.filter(Boolean)
				.join(', ') || '—',
		paired_rooms_list:
			state.pairedRooms
				.map((r) => r.roomName)
				.filter(Boolean)
				.join(', ') || '—',
	}
	state.pairedRooms.slice(0, 10).forEach((r, i) => {
		const n = i + 1
		values[`room_${n}_id`] = r.roomID
		values[`room_${n}_name`] = r.roomName || '—'
		const room = state.rooms[r.roomID]
		values[`room_${n}_meeting_status`] = room?.meetingStatus ?? '—'
		values[`room_${n}_participant_count`] = room?.participantCount ?? '—'
		values[`room_${n}_mute`] = room?.muteStatus === true ? 'Unmuted' : room?.muteStatus === false ? 'Muted' : '—'
		values[`room_${n}_camera`] = room?.cameraStatus === true ? 'On' : room?.cameraStatus === false ? 'Off' : '—'
	})
	instance.setVariableValues(values)
}
