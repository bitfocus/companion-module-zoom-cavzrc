import type { CompanionPresetDefinitions, CompanionOptionValues } from '@companion-module/base'
import type { ZoomRoomsInstance } from './osc.js'

export function GetPresetList(_instance: ZoomRoomsInstance): CompanionPresetDefinitions {
	const presets: CompanionPresetDefinitions = {}

	// Join/Leave
	presets['join_meeting'] = {
		type: 'button',
		category: 'Join / Leave',
		name: 'Join meeting',
		style: {
			text: 'Join',
			size: '18',
			color: 16777215,
			bgcolor: 0,
		},
		steps: [
			{
				down: [{ actionId: 'joinMeeting', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['leave_meeting'] = {
		type: 'button',
		category: 'Join / Leave',
		name: 'Leave meeting',
		style: {
			text: 'Leave',
			size: '18',
			color: 16777215,
			bgcolor: 0,
		},
		steps: [
			{
				down: [{ actionId: 'leaveMeeting', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['start_meeting'] = {
		type: 'button',
		category: 'Join / Leave',
		name: 'Start meeting',
		style: {
			text: 'Start',
			size: '18',
			color: 16777215,
			bgcolor: 0,
		},
		steps: [
			{
				down: [{ actionId: 'startMeeting', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Global
	presets['get_added_room_list'] = {
		type: 'button',
		category: 'Room list',
		name: 'Get added room list',
		style: {
			text: 'Get added rooms',
			size: '14',
			color: 16777215,
			bgcolor: 0,
		},
		steps: [
			{
				down: [{ actionId: 'getAddedRoomList', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['get_paired_room_list'] = {
		type: 'button',
		category: 'Room list',
		name: 'Get paired room list',
		style: {
			text: 'Get paired rooms',
			size: '14',
			color: 16777215,
			bgcolor: 0,
		},
		steps: [
			{
				down: [{ actionId: 'getPairedRoomList', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	const btn = (
		text: string,
		category: string,
		actionId: string,
		options: CompanionOptionValues = {},
	): CompanionPresetDefinitions[string] => ({
		type: 'button',
		category,
		name: text,
		style: { text, size: '14' as const, color: 16777215, bgcolor: 0 },
		steps: [{ down: [{ actionId, options }], up: [] }],
		feedbacks: [],
	})

	// NDI
	presets['ndi_content_off'] = btn('NDI Off', 'NDI', 'setNDIContentOff', {
		targetType: 'roomIndex',
		roomIndex: 1,
		channel_num: 1,
	})
	presets['ndi_content_participant'] = btn('NDI Participant', 'NDI', 'setNDIContentParticipant', {
		targetType: 'roomIndex',
		roomIndex: 1,
		channel_num: 1,
	})
	presets['ndi_content_gallery'] = btn('NDI Gallery', 'NDI', 'setNDIContentGallery', {
		targetType: 'roomIndex',
		roomIndex: 1,
		channel_num: 1,
	})

	// HWIO
	presets['hwio_content_off'] = btn('HWIO Off', 'HWIO', 'setHWIOContentOff', {
		targetType: 'roomIndex',
		roomIndex: 1,
		channel_num: 1,
	})
	presets['hwio_content_participant'] = btn('HWIO Participant', 'HWIO', 'setHWIOContentParticipant', {
		targetType: 'roomIndex',
		roomIndex: 1,
		channel_num: 1,
	})

	// Dante
	presets['dante_content_off'] = btn('Dante Off', 'Dante', 'setDanteContentOff', {
		targetType: 'roomIndex',
		roomIndex: 1,
		channel_num: 1,
	})
	presets['dante_content_mix'] = btn('Dante Mix', 'Dante', 'setDanteContentMix', {
		targetType: 'roomIndex',
		roomIndex: 1,
		channel_num: 1,
	})

	// Device
	presets['mute_mic'] = btn('Mute mic', 'Device', 'muteMic', { targetType: 'roomIndex', roomIndex: 1 })
	presets['unmute_mic'] = btn('Unmute mic', 'Device', 'unMuteMic', { targetType: 'roomIndex', roomIndex: 1 })
	presets['start_camera'] = btn('Start camera', 'Device', 'startCamera', { targetType: 'roomIndex', roomIndex: 1 })
	presets['stop_camera'] = btn('Stop camera', 'Device', 'stopCamera', { targetType: 'roomIndex', roomIndex: 1 })

	// Overlays
	presets['enable_nametag'] = btn('Name tag on', 'Overlays', 'enableNameTagOverlay', {
		targetType: 'roomIndex',
		roomIndex: 1,
	})
	presets['disable_nametag'] = btn('Name tag off', 'Overlays', 'disableNameTagOverlay', {
		targetType: 'roomIndex',
		roomIndex: 1,
	})
	presets['enable_emoji'] = btn('Emoji on', 'Overlays', 'enableEmojiOverlay', { targetType: 'roomIndex', roomIndex: 1 })
	presets['disable_emoji'] = btn('Emoji off', 'Overlays', 'disableEmojiOverlay', {
		targetType: 'roomIndex',
		roomIndex: 1,
	})

	return presets
}
