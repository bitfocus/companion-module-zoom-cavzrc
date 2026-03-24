import type { CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../utils.js'
import { ROOM_TARGET_OPTIONS, roomCommand, roomCommandWithOpts } from './action-room-utils.js'

export enum ActionIdOverlays {
	setNameTagAlignment = 'setNameTagAlignment',
	enableNameTagOverlay = 'enableNameTagOverlay',
	disableNameTagOverlay = 'disableNameTagOverlay',
	enableEmojiOverlay = 'enableEmojiOverlay',
	disableEmojiOverlay = 'disableEmojiOverlay',
	enableHandRaiseOverlay = 'enableHandRaiseOverlay',
	disableHandRaiseOverlay = 'disableHandRaiseOverlay',
	enableActiveSpeakerOverlay = 'enableActiveSpeakerOverlay',
	disableActiveSpeakerOverlay = 'disableActiveSpeakerOverlay',
	getOverlaySettings = 'getOverlaySettings',
}

export function GetActionsOverlays(instance: ZoomRoomsInstance): {
	[id in ActionIdOverlays]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdOverlays]: CompanionActionDefinition | undefined } = {
		[ActionIdOverlays.setNameTagAlignment]: {
			name: 'Set name tag alignment',
			options: [
				...ROOM_TARGET_OPTIONS,
				{
					type: 'number',
					label: 'Location index (1=left,2=center,3=right)',
					id: 'location_index',
					default: 2,
					min: 1,
					max: 3,
				},
			],
			callback: roomCommandWithOpts(instance, 'setNameTagAlignment', (o) => [Number(o.location_index) || 2]),
		},

		[ActionIdOverlays.enableNameTagOverlay]: {
			name: 'Enable name tag overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'enableNameTagOverlay'),
		},

		[ActionIdOverlays.disableNameTagOverlay]: {
			name: 'Disable name tag overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'disableNameTagOverlay'),
		},

		[ActionIdOverlays.enableEmojiOverlay]: {
			name: 'Enable emoji overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'enableEmojiOverlay'),
		},

		[ActionIdOverlays.disableEmojiOverlay]: {
			name: 'Disable emoji overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'disableEmojiOverlay'),
		},

		[ActionIdOverlays.enableHandRaiseOverlay]: {
			name: 'Enable hand raise overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'enableHandRaiseOverlay'),
		},

		[ActionIdOverlays.disableHandRaiseOverlay]: {
			name: 'Disable hand raise overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'disableHandRaiseOverlay'),
		},

		[ActionIdOverlays.enableActiveSpeakerOverlay]: {
			name: 'Enable active speaker overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'enableActiveSpeakerOverlay'),
		},

		[ActionIdOverlays.disableActiveSpeakerOverlay]: {
			name: 'Disable active speaker overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'disableActiveSpeakerOverlay'),
		},

		[ActionIdOverlays.getOverlaySettings]: {
			name: 'Get overlay settings',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getOverlaySettings'),
		},
	}

	return actions
}
