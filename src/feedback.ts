import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ZoomRoomsInstance } from './types.js'

export enum FeedbackId {
	RoomPaired = 'room_paired',
	InMeeting = 'in_meeting',
	MuteStatus = 'mute_status',
	CameraStatus = 'camera_status',
}

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

	const feedbacks: { [id in FeedbackId]: CompanionFeedbackDefinition | undefined } = {
		[FeedbackId.RoomPaired]: {
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
		[FeedbackId.InMeeting]: {
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
		[FeedbackId.MuteStatus]: {
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
		[FeedbackId.CameraStatus]: {
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

	return feedbacks
}
