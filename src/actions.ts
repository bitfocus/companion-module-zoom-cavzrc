import type { CompanionActionDefinitions, SomeCompanionActionInputField } from '@companion-module/base'
import type { ZoomRoomsInstance } from './osc.js'
import type { TargetType } from './utils.js'

const ROOM_TARGET_OPTIONS: SomeCompanionActionInputField[] = [
	{
		type: 'dropdown',
		label: 'Target type',
		id: 'targetType',
		default: 'roomIndex',
		choices: [
			{ id: 'roomID', label: 'Room ID' },
			{ id: 'roomName', label: 'Room name' },
			{ id: 'roomIndex', label: 'Room index' },
			{ id: 'allRooms', label: 'All rooms' },
		],
	},
	{ type: 'textinput', label: 'Room ID', id: 'roomID', default: '', isVisible: (o) => o.targetType === 'roomID' },
	{ type: 'textinput', label: 'Room name', id: 'roomName', default: '', isVisible: (o) => o.targetType === 'roomName' },
	{
		type: 'number',
		label: 'Room index (1-based)',
		id: 'roomIndex',
		default: 1,
		min: 1,
		max: 999,
		isVisible: (o) => o.targetType === 'roomIndex',
	},
]

const CHANNEL_NUM_OPTION: SomeCompanionActionInputField = {
	type: 'number',
	label: 'Channel',
	id: 'channel_num',
	default: 1,
	min: 1,
	max: 64,
}

function buildRoomPath(
	targetType: TargetType,
	command: string,
	roomArg: string | number | undefined,
): { path: string; args: (string | number)[] } {
	const base = `/zoomRooms/${targetType}/${command}`
	const args: (string | number)[] = []
	if (targetType === 'roomID' || targetType === 'roomName') {
		if (typeof roomArg === 'string') args.push(roomArg)
	} else if (targetType === 'roomIndex') {
		if (typeof roomArg === 'number') args.push(roomArg)
	}
	return { path: base, args }
}

function getRoomTarget(opt: Record<string, unknown>): { targetType: TargetType; roomArg: string | number | undefined } {
	const targetType = (opt.targetType as TargetType) || 'roomIndex'
	const roomArg: string | number | undefined =
		targetType === 'roomID'
			? typeof opt.roomID === 'string'
				? opt.roomID
				: ''
			: targetType === 'roomName'
				? typeof opt.roomName === 'string'
					? opt.roomName
					: ''
				: targetType === 'roomIndex'
					? Number(opt.roomIndex) || 1
					: undefined
	return { targetType, roomArg }
}

export function GetActions(instance: ZoomRoomsInstance): CompanionActionDefinitions {
	const send = (path: string, args: (string | number)[]) => {
		instance.OSC?.sendCommand(path, args)
	}

	const roomCommand =
		(command: string, extraArgs: (string | number)[] = []) =>
		(action: { options: Record<string, unknown> }) => {
			const opt = action.options
			const { targetType, roomArg } = getRoomTarget(opt)
			const { path, args } = buildRoomPath(targetType, command, roomArg)
			send(path, [...args, ...extraArgs])
		}

	const roomCommandWithOpts =
		(command: string, getExtra: (opt: Record<string, unknown>) => (string | number)[]) =>
		(action: { options: Record<string, unknown> }) => {
			const opt = action.options
			const { targetType, roomArg } = getRoomTarget(opt)
			const { path, args } = buildRoomPath(targetType, command, roomArg)
			send(path, [...args, ...getExtra(opt)])
		}

	return {
		// ---- Join Flow ----
		joinMeeting: {
			name: 'Join meeting',
			options: [
				{
					type: 'dropdown',
					label: 'Target type',
					id: 'targetType',
					default: 'roomIndex',
					choices: [
						{ id: 'roomID', label: 'Room ID' },
						{ id: 'roomName', label: 'Room name' },
						{ id: 'roomIndex', label: 'Room index' },
						{ id: 'allRooms', label: 'All rooms' },
					],
				},
				{ type: 'textinput', label: 'Room ID', id: 'roomID', default: '', isVisible: (o) => o.targetType === 'roomID' },
				{
					type: 'textinput',
					label: 'Room name',
					id: 'roomName',
					default: '',
					isVisible: (o) => o.targetType === 'roomName',
				},
				{
					type: 'number',
					label: 'Room index (1-based)',
					id: 'roomIndex',
					default: 1,
					min: 1,
					max: 999,
					isVisible: (o) => o.targetType === 'roomIndex',
				},
				{ type: 'textinput', label: 'Meeting ID', id: 'meetingID', default: '' },
				{ type: 'textinput', label: 'Meeting password', id: 'meetingPass', default: '' },
				{ type: 'textinput', label: 'User name', id: 'userName', default: '' },
			],
			callback: (action) => {
				const opt = action.options
				const targetType = (opt.targetType as TargetType) || 'roomIndex'
				const roomArg: string | number | undefined =
					targetType === 'roomID'
						? typeof opt.roomID === 'string'
							? opt.roomID
							: ''
						: targetType === 'roomName'
							? typeof opt.roomName === 'string'
								? opt.roomName
								: ''
							: targetType === 'roomIndex'
								? Number(opt.roomIndex) || 1
								: undefined
				const { path, args } = buildRoomPath(targetType, 'joinMeeting', roomArg)
				send(path, [
					...args,
					typeof opt.meetingID === 'string' ? opt.meetingID : '',
					typeof opt.meetingPass === 'string' ? opt.meetingPass : '',
					typeof opt.userName === 'string' ? opt.userName : '',
				])
			},
		},
		startMeeting: {
			name: 'Start meeting',
			options: [
				{
					type: 'dropdown',
					label: 'Target type',
					id: 'targetType',
					default: 'roomIndex',
					choices: [
						{ id: 'roomID', label: 'Room ID' },
						{ id: 'roomName', label: 'Room name' },
						{ id: 'roomIndex', label: 'Room index' },
						{ id: 'allRooms', label: 'All rooms' },
					],
				},
				{ type: 'textinput', label: 'Room ID', id: 'roomID', default: '', isVisible: (o) => o.targetType === 'roomID' },
				{
					type: 'textinput',
					label: 'Room name',
					id: 'roomName',
					default: '',
					isVisible: (o) => o.targetType === 'roomName',
				},
				{
					type: 'number',
					label: 'Room index (1-based)',
					id: 'roomIndex',
					default: 1,
					min: 1,
					max: 999,
					isVisible: (o) => o.targetType === 'roomIndex',
				},
			],
			callback: (action) => {
				const opt = action.options
				const targetType = (opt.targetType as TargetType) || 'roomIndex'
				const roomArg: string | number | undefined =
					targetType === 'roomID'
						? typeof opt.roomID === 'string'
							? opt.roomID
							: ''
						: targetType === 'roomName'
							? typeof opt.roomName === 'string'
								? opt.roomName
								: ''
							: targetType === 'roomIndex'
								? Number(opt.roomIndex) || 1
								: undefined
				const { path, args } = buildRoomPath(targetType, 'startMeeting', roomArg)
				send(path, args)
			},
		},
		leaveMeeting: {
			name: 'Leave meeting',
			options: [
				{
					type: 'dropdown',
					label: 'Target type',
					id: 'targetType',
					default: 'roomIndex',
					choices: [
						{ id: 'roomID', label: 'Room ID' },
						{ id: 'roomName', label: 'Room name' },
						{ id: 'roomIndex', label: 'Room index' },
						{ id: 'allRooms', label: 'All rooms' },
					],
				},
				{ type: 'textinput', label: 'Room ID', id: 'roomID', default: '', isVisible: (o) => o.targetType === 'roomID' },
				{
					type: 'textinput',
					label: 'Room name',
					id: 'roomName',
					default: '',
					isVisible: (o) => o.targetType === 'roomName',
				},
				{
					type: 'number',
					label: 'Room index (1-based)',
					id: 'roomIndex',
					default: 1,
					min: 1,
					max: 999,
					isVisible: (o) => o.targetType === 'roomIndex',
				},
			],
			callback: (action) => {
				const opt = action.options
				const targetType = (opt.targetType as TargetType) || 'roomIndex'
				const roomArg: string | number | undefined =
					targetType === 'roomID'
						? typeof opt.roomID === 'string'
							? opt.roomID
							: ''
						: targetType === 'roomName'
							? typeof opt.roomName === 'string'
								? opt.roomName
								: ''
							: targetType === 'roomIndex'
								? Number(opt.roomIndex) || 1
								: undefined
				const { path, args } = buildRoomPath(targetType, 'leaveMeeting', roomArg)
				send(path, args)
			},
		},
		// ---- Global ----
		getAddedRoomList: {
			name: 'Get added room list',
			options: [],
			callback: () => send('/zoomRooms/getAddedRoomList', []),
		},
		getPairedRoomList: {
			name: 'Get paired room list',
			options: [],
			callback: () => send('/zoomRooms/getPairedRoomList', []),
		},
		getAddedRoomCount: {
			name: 'Get added room count',
			options: [],
			callback: () => send('/zoomRooms/getAddedRoomCount', []),
		},
		getPairedRoomCount: {
			name: 'Get paired room count',
			options: [],
			callback: () => send('/zoomRooms/getPairedRoomCount', []),
		},

		// ---- NDI ----
		setNDIContentOff: {
			name: 'NDI: Set content off',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setNDIContentOff', (o) => [Number(o.channel_num) || 1]),
		},
		setNDIContentParticipant: {
			name: 'NDI: Set content to participant',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setNDIContentParticipant', (o) => [Number(o.channel_num) || 1]),
		},
		setNDIContentActiveSpeaker: {
			name: 'NDI: Set content to active speaker',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setNDIContentActiveSpeaker', (o) => [Number(o.channel_num) || 1]),
		},
		setNDIContentGallery: {
			name: 'NDI: Set content to gallery',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setNDIContentGallery', (o) => [Number(o.channel_num) || 1]),
		},
		setNDIContentScreenshare: {
			name: 'NDI: Set content to screenshare',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setNDIContentScreenshare', (o) => [Number(o.channel_num) || 1]),
		},
		setNDIContentSpotlight: {
			name: 'NDI: Set content to spotlight',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setNDIContentSpotlight', (o) => [Number(o.channel_num) || 1]),
		},
		setNDIContentPinGroup: {
			name: 'NDI: Set content to pin group',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setNDIContentPinGroup', (o) => [Number(o.channel_num) || 1]),
		},
		setNDIParticipantSelection: {
			name: 'NDI: Select participant',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'textinput', label: 'Zoom username', id: 'exact_zoom_username', default: '' },
			],
			callback: roomCommandWithOpts('setNDIParticipantSelection', (o) => [
				Number(o.channel_num) || 1,
				typeof o.exact_zoom_username === 'string' ? o.exact_zoom_username : '',
			]),
		},
		setNDIGallerySelection: {
			name: 'NDI: Select gallery',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Gallery index', id: 'gallery_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts('setNDIGallerySelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.gallery_index || 0),
			]),
		},
		setNDIScreenshareSelection: {
			name: 'NDI: Select screenshare',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Screenshare index', id: 'screenshare_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts('setNDIScreenshareSelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.screenshare_index) || 0,
			]),
		},
		setNDIPinGroupSelection: {
			name: 'NDI: Select pin group',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Pin group index', id: 'pin_group_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts('setNDIPinGroupSelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.pin_group_index) || 0,
			]),
		},
		getNDIChannelConfig: {
			name: 'NDI: Get channel config',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('getNDIChannelConfig', (o) => [Number(o.channel_num) || 1]),
		},
		getNDIChannelCount: {
			name: 'NDI: Get channel count',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getNDIChannelCount'),
		},

		// ---- HWIO ----
		setHWIOMode: {
			name: 'HWIO: Set mode',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Mode index', id: 'mode_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts('setHWIOMode', (o) => [Number(o.channel_num) || 1, Number(o.mode_index) || 0]),
		},
		setHWIOInputSelection: {
			name: 'HWIO: Set input selection',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Video index', id: 'video_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts('setHWIOInputSelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.video_index) || 0,
			]),
		},
		setHWIOContentOff: {
			name: 'HWIO: Content off',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setHWIOContentOff', (o) => [Number(o.channel_num) || 1]),
		},
		setHWIOContentTestSignal: {
			name: 'HWIO: Content test signal',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setHWIOContentTestSignal', (o) => [Number(o.channel_num) || 1]),
		},
		setHWIOContentParticipant: {
			name: 'HWIO: Content participant',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setHWIOContentParticipant', (o) => [Number(o.channel_num) || 1]),
		},
		setHWIOContentActiveSpeaker: {
			name: 'HWIO: Content active speaker',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setHWIOContentActiveSpeaker', (o) => [Number(o.channel_num) || 1]),
		},
		setHWIOContentGallery: {
			name: 'HWIO: Content gallery',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setHWIOContentGallery', (o) => [Number(o.channel_num) || 1]),
		},
		setHWIOContentScreenshare: {
			name: 'HWIO: Content screenshare',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setHWIOContentScreenshare', (o) => [Number(o.channel_num) || 1]),
		},
		setHWIOContentSpotlight: {
			name: 'HWIO: Content spotlight',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setHWIOContentSpotlight', (o) => [Number(o.channel_num) || 1]),
		},
		setHWIOContentPinGroup: {
			name: 'HWIO: Content pin group',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setHWIOContentPinGroup', (o) => [Number(o.channel_num) || 1]),
		},
		setHWIOResolutionFrameRate: {
			name: 'HWIO: Set resolution/framerate',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'textinput', label: 'Resolution/framerate', id: 'resolution_framerate', default: '' },
			],
			callback: roomCommandWithOpts('setHWIOResolutionFrameRate', (o) => [
				Number(o.channel_num) || 1,
				typeof o.resolution_framerate === 'string' ? o.resolution_framerate : '',
			]),
		},
		setHWIOAudioMix: {
			name: 'HWIO: Set audio mix',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Setting index', id: 'setting_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts('setHWIOAudioMix', (o) => [
				Number(o.channel_num) || 1,
				Number(o.setting_index) || 0,
			]),
		},
		setHWIOParticipantSelection: {
			name: 'HWIO: Select participant',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'textinput', label: 'Zoom username', id: 'zoom_username', default: '' },
			],
			callback: roomCommandWithOpts('setHWIOParticipantSelection', (o) => [
				Number(o.channel_num) || 1,
				typeof o.zoom_username === 'string' ? o.zoom_username : '',
			]),
		},
		setHWIOGallerySelection: {
			name: 'HWIO: Select gallery',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Gallery index', id: 'gallery_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts('setHWIOGallerySelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.gallery_index) || 0,
			]),
		},
		setHWIOScreenshareSelection: {
			name: 'HWIO: Select screenshare',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Screenshare index', id: 'screenshare_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts('setHWIOScreenshareSelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.screenshare_index) || 0,
			]),
		},
		setHWIOPinGroupSelection: {
			name: 'HWIO: Select pin group',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'number', label: 'Pin group index', id: 'pin_group_index', default: 0, min: 0, max: 99 },
			],
			callback: roomCommandWithOpts('setHWIOPinGroupSelection', (o) => [
				Number(o.channel_num) || 1,
				Number(o.pin_group_index) || 0,
			]),
		},
		getHWIOChannelConfig: {
			name: 'HWIO: Get channel config',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('getHWIOChannelConfig', (o) => [Number(o.channel_num) || 1]),
		},
		getHWIOChannelCount: {
			name: 'HWIO: Get channel count',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getHWIOChannelCount'),
		},
		getHWIOSupportedResolutionFrameRate: {
			name: 'HWIO: Get supported resolution/framerate',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('getHWIOSupportedResolutionFrameRate', (o) => [Number(o.channel_num) || 1]),
		},

		// ---- Dante ----
		setDanteContentOff: {
			name: 'Dante: Content off',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setDanteContentOff', (o) => [Number(o.channel_num) || 1]),
		},
		setDanteContentParticipant: {
			name: 'Dante: Content participant',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setDanteContentParticipant', (o) => [Number(o.channel_num) || 1]),
		},
		setDanteContentMix: {
			name: 'Dante: Content mixed audio',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setDanteContentMix', (o) => [Number(o.channel_num) || 1]),
		},
		setDanteContentScreenshare: {
			name: 'Dante: Content screenshare',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('setDanteContentScreenshare', (o) => [Number(o.channel_num) || 1]),
		},
		setDanteParticipantSelection: {
			name: 'Dante: Select participant',
			options: [
				...ROOM_TARGET_OPTIONS,
				CHANNEL_NUM_OPTION,
				{ type: 'textinput', label: 'Zoom username', id: 'zoom_username', default: '' },
			],
			callback: roomCommandWithOpts('setDanteParticipantSelection', (o) => [
				Number(o.channel_num) || 1,
				typeof o.zoom_username === 'string' ? o.zoom_username : '',
			]),
		},
		getDanteChannelConfig: {
			name: 'Dante: Get channel config',
			options: [...ROOM_TARGET_OPTIONS, CHANNEL_NUM_OPTION],
			callback: roomCommandWithOpts('getDanteChannelConfig', (o) => [Number(o.channel_num) || 1]),
		},
		getDanteChannelCount: {
			name: 'Dante: Get channel count',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getDanteChannelCount'),
		},

		// ---- Device settings ----
		setRoomMic: {
			name: 'Set room mic',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Mic name', id: 'mic_name', default: '' }],
			callback: roomCommandWithOpts('setRoomMic', (o) => [typeof o.mic_name === 'string' ? o.mic_name : '']),
		},
		setRoomMainCamera: {
			name: 'Set main camera',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts('setRoomMainCamera', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},
		setRoomMultiCameraOn: {
			name: 'Set multi-camera on',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts('setRoomMultiCameraOn', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},
		setRoomMultiCameraOff: {
			name: 'Set multi-camera off',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts('setRoomMultiCameraOff', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},
		setRoomSpeaker: {
			name: 'Set room speaker',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Speaker name', id: 'speaker_name', default: '' }],
			callback: roomCommandWithOpts('setRoomSpeaker', (o) => [
				typeof o.speaker_name === 'string' ? o.speaker_name : '',
			]),
		},
		getRoomMicList: {
			name: 'Get room mic list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getRoomMicList'),
		},
		getRoomCameraList: {
			name: 'Get room camera list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getRoomCameraList'),
		},
		getRoomSpeakerList: {
			name: 'Get room speaker list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getRoomSpeakerList'),
		},
		muteMic: { name: 'Mute mic', options: [...ROOM_TARGET_OPTIONS], callback: roomCommand('muteMic') },
		unMuteMic: { name: 'Unmute mic', options: [...ROOM_TARGET_OPTIONS], callback: roomCommand('unMuteMic') },
		startCamera: { name: 'Start camera', options: [...ROOM_TARGET_OPTIONS], callback: roomCommand('startCamera') },
		stopCamera: { name: 'Stop camera', options: [...ROOM_TARGET_OPTIONS], callback: roomCommand('stopCamera') },
		getSelectedPrimaryCamera: {
			name: 'Get selected primary camera',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getSelectedPrimaryCamera'),
		},
		getSelectedMultiCameras: {
			name: 'Get selected multi cameras',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getSelectedMultiCameras'),
		},
		getSelectedMic: {
			name: 'Get selected mic',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getSelectedMic'),
		},
		getSelectedSpeaker: {
			name: 'Get selected speaker',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getSelectedSpeaker'),
		},
		setCameraDisplayName: {
			name: 'Set camera display name',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Camera device name', id: 'camera_device_name', default: '' },
				{ type: 'textinput', label: 'New display name', id: 'new_camera_display_name', default: '' },
			],
			callback: roomCommandWithOpts('setCameraDisplayName', (o) => [
				typeof o.camera_device_name === 'string' ? o.camera_device_name : '',
				typeof o.new_camera_display_name === 'string' ? o.new_camera_display_name : '',
			]),
		},

		// ---- Overlays ----
		setNameTagAlignment: {
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
			callback: roomCommandWithOpts('setNameTagAlignment', (o) => [Number(o.location_index) || 2]),
		},
		enableNameTagOverlay: {
			name: 'Enable name tag overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('enableNameTagOverlay'),
		},
		disableNameTagOverlay: {
			name: 'Disable name tag overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('disableNameTagOverlay'),
		},
		enableEmojiOverlay: {
			name: 'Enable emoji overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('enableEmojiOverlay'),
		},
		disableEmojiOverlay: {
			name: 'Disable emoji overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('disableEmojiOverlay'),
		},
		enableHandRaiseOverlay: {
			name: 'Enable hand raise overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('enableHandRaiseOverlay'),
		},
		disableHandRaiseOverlay: {
			name: 'Disable hand raise overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('disableHandRaiseOverlay'),
		},
		enableActiveSpeakerOverlay: {
			name: 'Enable active speaker overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('enableActiveSpeakerOverlay'),
		},
		disableActiveSpeakerOverlay: {
			name: 'Disable active speaker overlay',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('disableActiveSpeakerOverlay'),
		},
		getOverlaySettings: {
			name: 'Get overlay settings',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getOverlaySettings'),
		},

		// ---- Content share ----
		startDeviceShare: {
			name: 'Start device share',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('startDeviceShare'),
		},
		startCameraShare: {
			name: 'Start camera share',
			options: [...ROOM_TARGET_OPTIONS, { type: 'textinput', label: 'Camera name', id: 'camera_name', default: '' }],
			callback: roomCommandWithOpts('startCameraShare', (o) => [
				typeof o.camera_name === 'string' ? o.camera_name : '',
			]),
		},
		stopShare: { name: 'Stop share', options: [...ROOM_TARGET_OPTIONS], callback: roomCommand('stopShare') },

		// ---- Room / meeting ----
		getRoomInfo: { name: 'Get room info', options: [...ROOM_TARGET_OPTIONS], callback: roomCommand('getRoomInfo') },
		getParticipantCount: {
			name: 'Get participant count',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getParticipantCount'),
		},
		getMeetingStatus: {
			name: 'Get meeting status',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getMeetingStatus'),
		},
		activateCameraPreset: {
			name: 'Activate camera preset',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'number', label: 'Preset index', id: 'preset_index', default: 1, min: 1, max: 99 },
			],
			callback: roomCommandWithOpts('activateCameraPreset', (o) => [Number(o.preset_index) || 1]),
		},
		pairRoom: { name: 'Pair room', options: [...ROOM_TARGET_OPTIONS], callback: roomCommand('pairRoom') },
		unPairRoom: { name: 'Unpair room', options: [...ROOM_TARGET_OPTIONS], callback: roomCommand('unPairRoom') },
		renameParticipant: {
			name: 'Rename participant',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Current name', id: 'current_name', default: '' },
				{ type: 'textinput', label: 'New name', id: 'new_name', default: '' },
			],
			callback: roomCommandWithOpts('renameParticipant', (o) => [
				typeof o.current_name === 'string' ? o.current_name : '',
				typeof o.new_name === 'string' ? o.new_name : '',
			]),
		},
		setActiveSpeakerSelf: {
			name: 'Set active speaker (self)',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('setActiveSpeakerSelf'),
		},
		setActiveSpeakerChild: {
			name: 'Set active speaker (participant)',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Participant name', id: 'participant_name', default: '' },
			],
			callback: roomCommandWithOpts('setActiveSpeakerChild', (o) => [
				typeof o.participant_name === 'string' ? o.participant_name : '',
			]),
		},
		getCompanionRoomList: {
			name: 'Get companion room list',
			options: [...ROOM_TARGET_OPTIONS],
			callback: roomCommand('getCompanionRoomList'),
		},
		getCompanionRoomCameraList: {
			name: 'Get companion room camera list',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID (czr_id)', id: 'czr_id', default: '' },
			],
			callback: roomCommandWithOpts('getCompanionRoomCameraList', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
			]),
		},
		setCompanionRoomCameraDisplayName: {
			name: 'Set companion room camera display name',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID', id: 'czr_id', default: '' },
				{ type: 'textinput', label: 'Camera device name', id: 'camera_device_name', default: '' },
				{ type: 'textinput', label: 'New display name', id: 'new_camera_display_name', default: '' },
			],
			callback: roomCommandWithOpts('setCompanionRoomCameraDisplayName', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
				typeof o.camera_device_name === 'string' ? o.camera_device_name : '',
				typeof o.new_camera_display_name === 'string' ? o.new_camera_display_name : '',
			]),
		},
		setCompanionRoomCameraOff: {
			name: 'Set companion room camera off',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID', id: 'czr_id', default: '' },
				{ type: 'textinput', label: 'Camera device name', id: 'camera_device_name', default: '' },
			],
			callback: roomCommandWithOpts('setCompanionRoomCameraOff', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
				typeof o.camera_device_name === 'string' ? o.camera_device_name : '',
			]),
		},
		setCompanionRoomCameraOn: {
			name: 'Set companion room camera on',
			options: [
				...ROOM_TARGET_OPTIONS,
				{ type: 'textinput', label: 'Companion room ID', id: 'czr_id', default: '' },
				{ type: 'textinput', label: 'Camera device name', id: 'camera_device_name', default: '' },
			],
			callback: roomCommandWithOpts('setCompanionRoomCameraOn', (o) => [
				typeof o.czr_id === 'string' ? o.czr_id : '',
				typeof o.camera_device_name === 'string' ? o.camera_device_name : '',
			]),
		},
	}
}
