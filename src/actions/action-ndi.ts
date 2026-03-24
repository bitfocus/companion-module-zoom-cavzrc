import type { CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../types.js'
import { ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION, roomCommand, roomCommandWithOpts } from './action-room-utils.js'

export enum ActionIdNDI {
	setNDIContentOff = 'setNDIContentOff',
	setNDIContentParticipant = 'setNDIContentParticipant',
	setNDIContentActiveSpeaker = 'setNDIContentActiveSpeaker',
	setNDIContentGallery = 'setNDIContentGallery',
	setNDIContentScreenshare = 'setNDIContentScreenshare',
	setNDIContentSpotlight = 'setNDIContentSpotlight',
	setNDIContentPinGroup = 'setNDIContentPinGroup',
	setNDIParticipantSelection = 'setNDIParticipantSelection',
	setNDIGallerySelection = 'setNDIGallerySelection',
	setNDIScreenshareSelection = 'setNDIScreenshareSelection',
	setNDIPinGroupSelection = 'setNDIPinGroupSelection',
	getNDIChannelConfig = 'getNDIChannelConfig',
	getNDIChannelCount = 'getNDIChannelCount',
}

export function GetActionsNDI(instance: ZoomRoomsInstance): {
	[id in ActionIdNDI]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdNDI]: CompanionActionDefinition | undefined } = {
		[ActionIdNDI.setNDIContentOff]: {
			name: 'NDI: Set content off',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentOff', (o) => [Number(o.channel_num) || 1]),
		},

		[ActionIdNDI.setNDIContentParticipant]: {
			name: 'NDI: Set content to participant',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentParticipant', (o) => [Number(o.channel_num) || 1]),
		},

		[ActionIdNDI.setNDIContentActiveSpeaker]: {
			name: 'NDI: Set content to active speaker',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentActiveSpeaker', (o) => [Number(o.channel_num) || 1]),
		},

		[ActionIdNDI.setNDIContentGallery]: {
			name: 'NDI: Set content to gallery',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentGallery', (o) => [Number(o.channel_num) || 1]),
		},

		[ActionIdNDI.setNDIContentScreenshare]: {
			name: 'NDI: Set content to screenshare',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentScreenshare', (o) => [Number(o.channel_num) || 1]),
		},

		[ActionIdNDI.setNDIContentSpotlight]: {
			name: 'NDI: Set content to spotlight',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentSpotlight', (o) => [Number(o.channel_num) || 1]),
		},

		[ActionIdNDI.setNDIContentPinGroup]: {
			name: 'NDI: Set content to pin group',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentPinGroup', (o) => [Number(o.channel_num) || 1]),
		},

		[ActionIdNDI.setNDIParticipantSelection]: {
			name: 'NDI: Select participant',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'textinput', label: 'Zoom username', id: 'exact_zoom_username', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setNDIParticipantSelection', (o) => [
				Number(o.channel_num) || 1,
				typeof o.exact_zoom_username === 'string' ? o.exact_zoom_username : '',
			]),
		},

		[ActionIdNDI.setNDIGallerySelection]: {
			name: 'NDI: Select gallery',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Gallery index', id: 'gallery_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts(instance, 'setNDIGallerySelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.gallery_index || 0),
			]),
		},

		[ActionIdNDI.setNDIScreenshareSelection]: {
			name: 'NDI: Select screenshare',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Screenshare index', id: 'screenshare_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts(instance, 'setNDIScreenshareSelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.screenshare_index) || 0,
			]),
		},

		[ActionIdNDI.setNDIPinGroupSelection]: {
			name: 'NDI: Select pin group',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Pin group index', id: 'pin_group_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts(instance, 'setNDIPinGroupSelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.pin_group_index) || 0,
			]),
		},

		[ActionIdNDI.getNDIChannelConfig]: {
			name: 'NDI: Get channel config',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'getNDIChannelConfig', (o) => [Number(o.channel_num) || 1]),
		},

		[ActionIdNDI.getNDIChannelCount]: {
			name: 'NDI: Get channel count',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getNDIChannelCount'),
		},
	}

	return actions
}
