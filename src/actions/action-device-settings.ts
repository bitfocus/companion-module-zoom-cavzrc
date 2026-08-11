import type { CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../utils.js'
import { ROOM_TARGET_OPTIONS, roomCommand, roomCommandWithOpts } from './action-room-utils.js'

export enum ActionIdDeviceSettings {
	setRoomMic = 'setRoomMic',
	setRoomMainCamera = 'setRoomMainCamera',
	setRoomMultiCameraOn = 'setRoomMultiCameraOn',
	setRoomMultiCameraOff = 'setRoomMultiCameraOff',
	setRoomSpeaker = 'setRoomSpeaker',
	getRoomMicList = 'getRoomMicList',
	getRoomCameraList = 'getRoomCameraList',
	getRoomSpeakerList = 'getRoomSpeakerList',
	muteMic = 'muteMic',
	unMuteMic = 'unMuteMic',
	startCamera = 'startCamera',
	stopCamera = 'stopCamera',
	getSelectedPrimaryCamera = 'getSelectedPrimaryCamera',
	getSelectedMultiCameras = 'getSelectedMultiCameras',
	getSelectedMic = 'getSelectedMic',
	getSelectedSpeaker = 'getSelectedSpeaker',
	setCameraDisplayName = 'setCameraDisplayName',
}

export function GetActionsDeviceSettings(instance: ZoomRoomsInstance): {
	[id in ActionIdDeviceSettings]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdDeviceSettings]: CompanionActionDefinition | undefined } = {
		[ActionIdDeviceSettings.setRoomMic]: {
			name: 'Set room mic',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Mic name', id: 'mic_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'setRoomMic', (o) => [typeof o.mic_name === 'string' ? o.mic_name : '']),
		},

		[ActionIdDeviceSettings.setRoomMainCamera]: {
			name: 'Set main camera',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'setRoomMainCamera', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},

		[ActionIdDeviceSettings.setRoomMultiCameraOn]: {
			name: 'Set multi-camera on',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'setRoomMultiCameraOn', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},

		[ActionIdDeviceSettings.setRoomMultiCameraOff]: {
			name: 'Set multi-camera off',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'setRoomMultiCameraOff', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},

		[ActionIdDeviceSettings.setRoomSpeaker]: {
			name: 'Set room speaker',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Speaker name', id: 'speaker_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'setRoomSpeaker', (o) => [
				typeof o.speaker_name === 'string' ? o.speaker_name : '',
			]),
		},

		[ActionIdDeviceSettings.getRoomMicList]: {
			name: 'Get room mic list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getRoomMicList'),
		},

		[ActionIdDeviceSettings.getRoomCameraList]: {
			name: 'Get room camera list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getRoomCameraList'),
		},

		[ActionIdDeviceSettings.getRoomSpeakerList]: {
			name: 'Get room speaker list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getRoomSpeakerList'),
		},

		[ActionIdDeviceSettings.muteMic]: {
			name: 'Mute mic',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'muteMic'),
		},

		[ActionIdDeviceSettings.unMuteMic]: {
			name: 'Unmute mic',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'unMuteMic'),
		},

		[ActionIdDeviceSettings.startCamera]: {
			name: 'Start camera',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'startCamera'),
		},

		[ActionIdDeviceSettings.stopCamera]: {
			name: 'Stop camera',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'stopCamera'),
		},

		[ActionIdDeviceSettings.getSelectedPrimaryCamera]: {
			name: 'Get selected primary camera',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getSelectedPrimaryCamera'),
		},

		[ActionIdDeviceSettings.getSelectedMultiCameras]: {
			name: 'Get selected multi cameras',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getSelectedMultiCameras'),
		},

		[ActionIdDeviceSettings.getSelectedMic]: {
			name: 'Get selected mic',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getSelectedMic'),
		},

		[ActionIdDeviceSettings.getSelectedSpeaker]: {
			name: 'Get selected speaker',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getSelectedSpeaker'),
		},

		[ActionIdDeviceSettings.setCameraDisplayName]: {
			name: 'Set camera display name',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Camera device name', id: 'camera_device_name', default: '' },
				{ type: 'textinput', label: 'New display name', id: 'new_camera_display_name', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setCameraDisplayName', (o) => [
				typeof o.camera_device_name === 'string' ? o.camera_device_name : '',
				typeof o.new_camera_display_name === 'string' ? o.new_camera_display_name : '',
			]),
		},
	}

	return actions
}
