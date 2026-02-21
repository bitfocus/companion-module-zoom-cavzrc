import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ZoomRoomsInstance } from './osc.js'

function roomChoices(instance: ZoomRoomsInstance): { id: string; label: string }[] {
	const choices = [{ id: '', label: '(Select room)' }]
	const rooms = instance.state.pairedRooms.length ? instance.state.pairedRooms : instance.state.addedRooms
	for (const r of rooms) {
		if (r.roomID) choices.push({ id: r.roomID, label: r.roomName || r.roomID })
	}
	return choices
}

export function GetFeedbacks(instance: ZoomRoomsInstance): CompanionFeedbackDefinitions {
	const roomOpt = {
		type: 'dropdown' as const,
		label: 'Room',
		id: 'roomId',
		default: '',
		choices: roomChoices(instance),
	}
	return {
		room_paired: {
			type: 'boolean',
			name: 'Room is paired',
			description: 'True when the selected room is in the paired list',
			defaultStyle: { bgcolor: 0x00ff00 },
			options: [roomOpt],
			callback: (feedback) => {
				const roomId = feedback.options.roomId as string
				if (!roomId) return false
				return instance.state.pairedRooms.some((r) => r.roomID === roomId)
			},
		},
		in_meeting: {
			type: 'boolean',
			name: 'In meeting',
			description: 'True when the selected room is in a meeting',
			defaultStyle: { bgcolor: 0x00ff00 },
			options: [roomOpt],
			callback: (feedback) => {
				const roomId = feedback.options.roomId as string
				if (!roomId) return false
				const room = instance.state.rooms[roomId]
				if (!room || room.meetingStatus === undefined) return false
				const status = (room.meetingStatus || '').toLowerCase()
				return status !== '' && status !== 'not in meeting' && status !== 'idle'
			},
		},
		mute_status: {
			type: 'boolean',
			name: 'Mic unmuted',
			description: 'True when the room mic is unmuted',
			defaultStyle: { bgcolor: 0x00ff00 },
			options: [roomOpt],
			callback: (feedback) => {
				const roomId = feedback.options.roomId as string
				if (!roomId) return false
				return instance.state.rooms[roomId]?.muteStatus === true
			},
		},
		camera_status: {
			type: 'boolean',
			name: 'Camera on',
			description: 'True when the room camera is on',
			defaultStyle: { bgcolor: 0x00ff00 },
			options: [roomOpt],
			callback: (feedback) => {
				const roomId = feedback.options.roomId as string
				if (!roomId) return false
				return instance.state.rooms[roomId]?.cameraStatus === true
			},
		},
	}
}
