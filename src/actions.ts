import type { CompanionActionDefinitions, CompanionActionDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from './types.js'
import {
	ROOM_TARGET_OPTIONS,
	CHANNEL_NUM_OPTION,
	roomCommand,
	roomCommandWithOpts,
} from './actions/action-room-utils.js'
import { ActionIdJoinFlow, GetActionsJoinFlow } from './actions/action-join-flow.js'

export enum ActionId {
	// ---- Global ----
	getAddedRoomList = 'getAddedRoomList',
	getPairedRoomList = 'getPairedRoomList',
	getAddedRoomCount = 'getAddedRoomCount',
	getPairedRoomCount = 'getPairedRoomCount',

	// ---- NDI ----
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

	// ---- HWIO ----
	setHWIOMode = 'setHWIOMode',
	setHWIOInputSelection = 'setHWIOInputSelection',
	setHWIOContentOff = 'setHWIOContentOff',
	setHWIOContentTestSignal = 'setHWIOContentTestSignal',
	setHWIOContentParticipant = 'setHWIOContentParticipant',
	setHWIOContentActiveSpeaker = 'setHWIOContentActiveSpeaker',
	setHWIOContentGallery = 'setHWIOContentGallery',
	setHWIOContentScreenshare = 'setHWIOContentScreenshare',
	setHWIOContentSpotlight = 'setHWIOContentSpotlight',
	setHWIOContentPinGroup = 'setHWIOContentPinGroup',
	setHWIOResolutionFrameRate = 'setHWIOResolutionFrameRate',
	setHWIOAudioMix = 'setHWIOAudioMix',
	setHWIOParticipantSelection = 'setHWIOParticipantSelection',
	setHWIOGallerySelection = 'setHWIOGallerySelection',
	setHWIOScreenshareSelection = 'setHWIOScreenshareSelection',
	setHWIOPinGroupSelection = 'setHWIOPinGroupSelection',
	getHWIOChannelConfig = 'getHWIOChannelConfig',
	getHWIOChannelCount = 'getHWIOChannelCount',
	getHWIOSupportedResolutionFrameRate = 'getHWIOSupportedResolutionFrameRate',

	// ---- Dante ----
	setDanteContentOff = 'setDanteContentOff',
	setDanteContentParticipant = 'setDanteContentParticipant',
	setDanteContentMix = 'setDanteContentMix',
	setDanteContentScreenshare = 'setDanteContentScreenshare',
	setDanteParticipantSelection = 'setDanteParticipantSelection',
	getDanteChannelConfig = 'getDanteChannelConfig',
	getDanteChannelCount = 'getDanteChannelCount',

	// ---- Device settings ----
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

	// ---- Overlays ----
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

	// ---- Content share ----
	startDeviceShare = 'startDeviceShare',
	startCameraShare = 'startCameraShare',
	stopShare = 'stopShare',

	// ---- Room / meeting ----
	getRoomInfo = 'getRoomInfo',
	getParticipantCount = 'getParticipantCount',
	getMeetingStatus = 'getMeetingStatus',
	activateCameraPreset = 'activateCameraPreset',
	pairRoom = 'pairRoom',
	unPairRoom = 'unPairRoom',
	renameParticipant = 'renameParticipant',
	setActiveSpeakerSelf = 'setActiveSpeakerSelf',
	setActiveSpeakerChild = 'setActiveSpeakerChild',

	// ---- Companion ----
	getCompanionRoomList = 'getCompanionRoomList',
	getCompanionRoomCameraList = 'getCompanionRoomCameraList',
	setCompanionRoomCameraDisplayName = 'setCompanionRoomCameraDisplayName',
	setCompanionRoomCameraOff = 'setCompanionRoomCameraOff',
	setCompanionRoomCameraOn = 'setCompanionRoomCameraOn',
}

export function GetActions(instance: ZoomRoomsInstance): CompanionActionDefinitions {
	const send = (path: string, args: (string | number)[]) => {
		instance.OSC?.sendCommand(path, args)
	}

	const actionsJoinFlow: { [id in ActionIdJoinFlow]: CompanionActionDefinition | undefined } =
		GetActionsJoinFlow(instance)

	const actions: { [id in ActionId | ActionIdJoinFlow]: CompanionActionDefinition | undefined } = {
		...actionsJoinFlow,

		// ---- Global ----
		[ActionId.getAddedRoomList]: {
			name: 'Get added room list',
			options: [],
			callback: () => send('/zoomRooms/getAddedRoomList', []),
		},
		[ActionId.getPairedRoomList]: {
			name: 'Get paired room list',
			options: [],
			callback: () => send('/zoomRooms/getPairedRoomList', []),
		},
		[ActionId.getAddedRoomCount]: {
			name: 'Get added room count',
			options: [],
			callback: () => send('/zoomRooms/getAddedRoomCount', []),
		},
		[ActionId.getPairedRoomCount]: {
			name: 'Get paired room count',
			options: [],
			callback: () => send('/zoomRooms/getPairedRoomCount', []),
		},

		// ---- NDI ----
		[ActionId.setNDIContentOff]: {
			name: 'NDI: Set content off',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentOff', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setNDIContentParticipant]: {
			name: 'NDI: Set content to participant',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentParticipant', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setNDIContentActiveSpeaker]: {
			name: 'NDI: Set content to active speaker',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentActiveSpeaker', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setNDIContentGallery]: {
			name: 'NDI: Set content to gallery',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentGallery', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setNDIContentScreenshare]: {
			name: 'NDI: Set content to screenshare',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentScreenshare', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setNDIContentSpotlight]: {
			name: 'NDI: Set content to spotlight',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentSpotlight', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setNDIContentPinGroup]: {
			name: 'NDI: Set content to pin group',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setNDIContentPinGroup', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setNDIParticipantSelection]: {
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
		[ActionId.setNDIGallerySelection]: {
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
		[ActionId.setNDIScreenshareSelection]: {
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
		[ActionId.setNDIPinGroupSelection]: {
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
		[ActionId.getNDIChannelConfig]: {
			name: 'NDI: Get channel config',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'getNDIChannelConfig', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.getNDIChannelCount]: {
			name: 'NDI: Get channel count',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getNDIChannelCount'),
		},

		// ---- HWIO ----
		[ActionId.setHWIOMode]: {
			name: 'HWIO: Set mode',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Mode index', id: 'mode_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts(instance, 'setHWIOMode', (o) => [
				Number(o.channel_num) || 1,
				Number(o.mode_index) || 0,
			]),
		},
		[ActionId.setHWIOInputSelection]: {
			name: 'HWIO: Set input selection',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Video index', id: 'video_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts(instance, 'setHWIOInputSelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.video_index) || 0,
			]),
		},
		[ActionId.setHWIOContentOff]: {
			name: 'HWIO: Content off',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setHWIOContentOff', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setHWIOContentTestSignal]: {
			name: 'HWIO: Content test signal',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setHWIOContentTestSignal', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setHWIOContentParticipant]: {
			name: 'HWIO: Content participant',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setHWIOContentParticipant', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setHWIOContentActiveSpeaker]: {
			name: 'HWIO: Content active speaker',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setHWIOContentActiveSpeaker', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setHWIOContentGallery]: {
			name: 'HWIO: Content gallery',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setHWIOContentGallery', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setHWIOContentScreenshare]: {
			name: 'HWIO: Content screenshare',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setHWIOContentScreenshare', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setHWIOContentSpotlight]: {
			name: 'HWIO: Content spotlight',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setHWIOContentSpotlight', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setHWIOContentPinGroup]: {
			name: 'HWIO: Content pin group',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setHWIOContentPinGroup', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setHWIOResolutionFrameRate]: {
			name: 'HWIO: Set resolution/framerate',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'textinput', label: 'Resolution/framerate', id: 'resolution_framerate', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setHWIOResolutionFrameRate', (o) => [
				Number(o.channel_num) || 1,
				typeof o.resolution_framerate === 'string' ? o.resolution_framerate : '',
			]),
		},
		[ActionId.setHWIOAudioMix]: {
			name: 'HWIO: Set audio mix',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Setting index', id: 'setting_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts(instance, 'setHWIOAudioMix', (o) => [
				Number(o.channel_num) || 1,
				Number(o.setting_index) || 0,
			]),
		},
		[ActionId.setHWIOParticipantSelection]: {
			name: 'HWIO: Select participant',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'textinput', label: 'Zoom username', id: 'zoom_username', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setHWIOParticipantSelection', (o) => [
				Number(o.channel_num) || 1,
				typeof o.zoom_username === 'string' ? o.zoom_username : '',
			]),
		},
		[ActionId.setHWIOGallerySelection]: {
			name: 'HWIO: Select gallery',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Gallery index', id: 'gallery_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts(instance, 'setHWIOGallerySelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.gallery_index) || 0,
			]),
		},
		[ActionId.setHWIOScreenshareSelection]: {
			name: 'HWIO: Select screenshare',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Screenshare index', id: 'screenshare_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts(instance, 'setHWIOScreenshareSelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.screenshare_index) || 0,
			]),
		},
		[ActionId.setHWIOPinGroupSelection]: {
			name: 'HWIO: Select pin group',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Pin group index', id: 'pin_group_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts(instance, 'setHWIOPinGroupSelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.pin_group_index) || 0,
			]),
		},
		[ActionId.getHWIOChannelConfig]: {
			name: 'HWIO: Get channel config',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'getHWIOChannelConfig', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.getHWIOChannelCount]: {
			name: 'HWIO: Get channel count',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getHWIOChannelCount'),
		},
		[ActionId.getHWIOSupportedResolutionFrameRate]: {
			name: 'HWIO: Get supported resolution/framerate',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'getHWIOSupportedResolutionFrameRate', (o) => [
				Number(o.channel_num) || 1,
			]),
		},

		// ---- Dante ----
		[ActionId.setDanteContentOff]: {
			name: 'Dante: Content off',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setDanteContentOff', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setDanteContentParticipant]: {
			name: 'Dante: Content participant',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setDanteContentParticipant', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setDanteContentMix]: {
			name: 'Dante: Content mixed audio',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setDanteContentMix', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setDanteContentScreenshare]: {
			name: 'Dante: Content screenshare',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'setDanteContentScreenshare', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.setDanteParticipantSelection]: {
			name: 'Dante: Select participant',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'textinput', label: 'Zoom username', id: 'zoom_username', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setDanteParticipantSelection', (o) => [
				Number(o.channel_num) || 1,
				typeof o.zoom_username === 'string' ? o.zoom_username : '',
			]),
		},
		[ActionId.getDanteChannelConfig]: {
			name: 'Dante: Get channel config',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts(instance, 'getDanteChannelConfig', (o) => [Number(o.channel_num) || 1]),
		},
		[ActionId.getDanteChannelCount]: {
			name: 'Dante: Get channel count',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getDanteChannelCount'),
		},

		// ---- Device settings ----
		[ActionId.setRoomMic]: {
			name: 'Set room mic',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Mic name', id: 'mic_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'setRoomMic', (o) => [typeof o.mic_name === 'string' ? o.mic_name : '']),
		},
		[ActionId.setRoomMainCamera]: {
			name: 'Set main camera',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'setRoomMainCamera', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},
		[ActionId.setRoomMultiCameraOn]: {
			name: 'Set multi-camera on',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'setRoomMultiCameraOn', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},
		[ActionId.setRoomMultiCameraOff]: {
			name: 'Set multi-camera off',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'setRoomMultiCameraOff', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},
		[ActionId.setRoomSpeaker]: {
			name: 'Set room speaker',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Speaker name', id: 'speaker_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'setRoomSpeaker', (o) => [
				typeof o.speaker_name === 'string' ? o.speaker_name : '',
			]),
		},
		[ActionId.getRoomMicList]: {
			name: 'Get room mic list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getRoomMicList'),
		},
		[ActionId.getRoomCameraList]: {
			name: 'Get room camera list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getRoomCameraList'),
		},
		[ActionId.getRoomSpeakerList]: {
			name: 'Get room speaker list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getRoomSpeakerList'),
		},
		[ActionId.muteMic]: {
			name: 'Mute mic',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'muteMic'),
		},
		[ActionId.unMuteMic]: {
			name: 'Unmute mic',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'unMuteMic'),
		},
		[ActionId.startCamera]: {
			name: 'Start camera',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'startCamera'),
		},
		[ActionId.stopCamera]: {
			name: 'Stop camera',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'stopCamera'),
		},
		[ActionId.getSelectedPrimaryCamera]: {
			name: 'Get selected primary camera',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getSelectedPrimaryCamera'),
		},
		[ActionId.getSelectedMultiCameras]: {
			name: 'Get selected multi cameras',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getSelectedMultiCameras'),
		},
		[ActionId.getSelectedMic]: {
			name: 'Get selected mic',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getSelectedMic'),
		},
		[ActionId.getSelectedSpeaker]: {
			name: 'Get selected speaker',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getSelectedSpeaker'),
		},
		[ActionId.setCameraDisplayName]: {
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

		// ---- Overlays ----
		[ActionId.setNameTagAlignment]: {
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
		[ActionId.enableNameTagOverlay]: {
			name: 'Enable name tag overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'enableNameTagOverlay'),
		},
		[ActionId.disableNameTagOverlay]: {
			name: 'Disable name tag overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'disableNameTagOverlay'),
		},
		[ActionId.enableEmojiOverlay]: {
			name: 'Enable emoji overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'enableEmojiOverlay'),
		},
		[ActionId.disableEmojiOverlay]: {
			name: 'Disable emoji overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'disableEmojiOverlay'),
		},
		[ActionId.enableHandRaiseOverlay]: {
			name: 'Enable hand raise overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'enableHandRaiseOverlay'),
		},
		[ActionId.disableHandRaiseOverlay]: {
			name: 'Disable hand raise overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'disableHandRaiseOverlay'),
		},
		[ActionId.enableActiveSpeakerOverlay]: {
			name: 'Enable active speaker overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'enableActiveSpeakerOverlay'),
		},
		[ActionId.disableActiveSpeakerOverlay]: {
			name: 'Disable active speaker overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'disableActiveSpeakerOverlay'),
		},
		[ActionId.getOverlaySettings]: {
			name: 'Get overlay settings',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getOverlaySettings'),
		},

		// ---- Content share ----
		[ActionId.startDeviceShare]: {
			name: 'Start device share',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'startDeviceShare'),
		},
		[ActionId.startCameraShare]: {
			name: 'Start camera share',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts(instance, 'startCameraShare', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},
		[ActionId.stopShare]: {
			name: 'Stop share',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'stopShare'),
		},

		// ---- Room / meeting ----
		[ActionId.getRoomInfo]: {
			name: 'Get room info',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getRoomInfo'),
		},
		[ActionId.getParticipantCount]: {
			name: 'Get participant count',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getParticipantCount'),
		},
		[ActionId.getMeetingStatus]: {
			name: 'Get meeting status',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getMeetingStatus'),
		},
		[ActionId.activateCameraPreset]: {
			name: 'Activate camera preset',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'number', label: 'Preset index', id: 'preset_index', default: 1, min: 1, max: 99 },
			],
			callback: roomCommandWithOpts(instance, 'activateCameraPreset', (o) => [Number(o.preset_index) || 1]),
		},
		[ActionId.pairRoom]: {
			name: 'Pair room',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'pairRoom'),
		},
		[ActionId.unPairRoom]: {
			name: 'Unpair room',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'unPairRoom'),
		},
		[ActionId.renameParticipant]: {
			name: 'Rename participant',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Current name', id: 'current_name', default: '' },
				{ type: 'textinput', label: 'New name', id: 'new_name', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'renameParticipant', (o) => [
				typeof o.current_name === 'string' ? o.current_name : '',
				typeof o.new_name === 'string' ? o.new_name : '',
			]),
		},
		[ActionId.setActiveSpeakerSelf]: {
			name: 'Set active speaker (self)',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'setActiveSpeakerSelf'),
		},
		[ActionId.setActiveSpeakerChild]: {
			name: 'Set active speaker (participant)',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Participant name', id: 'participant_name', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setActiveSpeakerChild', (o) => [
				typeof o.participant_name === 'string' ? o.participant_name : '',
			]),
		},

		// ---- Companion ----
		[ActionId.getCompanionRoomList]: {
			name: 'Get companion room list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand(instance, 'getCompanionRoomList'),
		},
		[ActionId.getCompanionRoomCameraList]: {
			name: 'Get companion room camera list',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID (czr_id)', id: 'czr_id', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'getCompanionRoomCameraList', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
			]),
		},
		[ActionId.setCompanionRoomCameraDisplayName]: {
			name: 'Set companion room camera display name',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID', id: 'czr_id', default: '' },
				{ type: 'textinput', label: 'Camera device name', id: 'camera_device_name', default: '' },
				{ type: 'textinput', label: 'New display name', id: 'new_camera_display_name', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setCompanionRoomCameraDisplayName', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
				typeof o.camera_device_name === 'string' ? o.camera_device_name : '',
				typeof o.new_camera_display_name === 'string' ? o.new_camera_display_name : '',
			]),
		},
		[ActionId.setCompanionRoomCameraOff]: {
			name: 'Set companion room camera off',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID', id: 'czr_id', default: '' },
				{ type: 'textinput', label: 'Camera device name', id: 'camera_device_name', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setCompanionRoomCameraOff', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
				typeof o.camera_device_name === 'string' ? o.camera_device_name : '',
			]),
		},
		[ActionId.setCompanionRoomCameraOn]: {
			name: 'Set companion room camera on',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID', id: 'czr_id', default: '' },
				{ type: 'textinput', label: 'Camera device name', id: 'camera_device_name', default: '' },
			],
			callback: roomCommandWithOpts(instance, 'setCompanionRoomCameraOn', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
				typeof o.camera_device_name === 'string' ? o.camera_device_name : '',
			]),
		},
	}
	return actions
}
