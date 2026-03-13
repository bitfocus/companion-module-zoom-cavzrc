import { GetActions } from '../src/actions.js'

const mockSendCommand = jest.fn()

const mockInstance = {
	OSC: { sendCommand: mockSendCommand },
	config: { host: '127.0.0.1', tx_port: 9090, rx_port: 0, oscOutputHeader: '/roomosc' },
	state: { addedRooms: [], pairedRooms: [], addedRoomsCount: 0, pairedRoomsCount: 0, rooms: {} },
	log: jest.fn(),
	updateStatus: jest.fn(),
	updateVariableValues: jest.fn(),
}

function invoke(action: ReturnType<typeof GetActions>[string], options: Record<string, unknown>): void {
	const cb = (action as unknown as { callback: (a: { options: Record<string, unknown> }) => void }).callback
	cb({ options })
}

describe('GetActions', () => {
	let actions: ReturnType<typeof GetActions>

	beforeEach(() => {
		mockSendCommand.mockClear()
		actions = GetActions(mockInstance as any)
	})

	describe('room target routing', () => {
		it('roomIndex target → path uses roomIndex segment, args start with index', () => {
			invoke(actions.muteMic, { targetType: 'roomIndex', roomIndex: 3 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/muteMic', [3])
		})

		it('roomID target → path uses roomID segment, args start with id string', () => {
			invoke(actions.muteMic, { targetType: 'roomID', roomID: 'abc-room' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomID/muteMic', ['abc-room'])
		})

		it('roomName target → path uses roomName segment, args start with name string', () => {
			invoke(actions.muteMic, { targetType: 'roomName', roomName: 'Conference A' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomName/muteMic', ['Conference A'])
		})

		it('allRooms target → path uses allRooms segment, args are empty', () => {
			invoke(actions.muteMic, { targetType: 'allRooms' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/allRooms/muteMic', [])
		})
	})

	describe('joinMeeting', () => {
		it('sends correct path and args with roomIndex target', () => {
			invoke(actions.joinMeeting, {
				targetType: 'roomIndex',
				roomIndex: 1,
				meetingID: '123456789',
				meetingPass: 'secret',
				userName: 'TestUser',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/joinMeeting', [
				1,
				'123456789',
				'secret',
				'TestUser',
			])
		})

		it('sends correct path and args with roomName target', () => {
			invoke(actions.joinMeeting, {
				targetType: 'roomName',
				roomName: 'Boardroom',
				meetingID: '987',
				meetingPass: '',
				userName: '',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomName/joinMeeting', ['Boardroom', '987', '', ''])
		})

		it('uses allRooms target with no room arg prepended', () => {
			invoke(actions.joinMeeting, {
				targetType: 'allRooms',
				meetingID: '555',
				meetingPass: 'pw',
				userName: 'Zoe',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/allRooms/joinMeeting', ['555', 'pw', 'Zoe'])
		})
	})

	describe('leaveMeeting', () => {
		it('sends correct path with roomIndex', () => {
			invoke(actions.leaveMeeting, { targetType: 'roomIndex', roomIndex: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/leaveMeeting', [2])
		})

		it('sends correct path with allRooms', () => {
			invoke(actions.leaveMeeting, { targetType: 'allRooms' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/allRooms/leaveMeeting', [])
		})
	})

	describe('muteMic / unMuteMic', () => {
		it('muteMic sends correct OSC path', () => {
			invoke(actions.muteMic, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/muteMic', [1])
		})

		it('unMuteMic sends correct OSC path', () => {
			invoke(actions.unMuteMic, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/unMuteMic', [1])
		})
	})

	describe('startCamera / stopCamera', () => {
		it('startCamera sends correct OSC path', () => {
			invoke(actions.startCamera, { targetType: 'roomIndex', roomIndex: 5 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/startCamera', [5])
		})

		it('stopCamera sends correct OSC path', () => {
			invoke(actions.stopCamera, { targetType: 'roomID', roomID: 'room-42' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomID/stopCamera', ['room-42'])
		})
	})

	describe('setActiveSpeakerSelf', () => {
		it('sends correct path with roomIndex target', () => {
			invoke(actions.setActiveSpeakerSelf, { targetType: 'roomIndex', roomIndex: 7 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setActiveSpeakerSelf', [7])
		})

		it('sends correct path with allRooms target', () => {
			invoke(actions.setActiveSpeakerSelf, { targetType: 'allRooms' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/allRooms/setActiveSpeakerSelf', [])
		})
	})

	describe('renameParticipant (multi-arg roomCommandWithOpts)', () => {
		it('appends current_name and new_name to the args', () => {
			invoke(actions.renameParticipant, {
				targetType: 'roomIndex',
				roomIndex: 2,
				current_name: 'Alice',
				new_name: 'Bob',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/renameParticipant', [2, 'Alice', 'Bob'])
		})

		it('works with roomName target', () => {
			invoke(actions.renameParticipant, {
				targetType: 'roomName',
				roomName: 'Lab',
				current_name: 'Charlie',
				new_name: 'Dave',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomName/renameParticipant', ['Lab', 'Charlie', 'Dave'])
		})
	})

	describe('activateCameraPreset (roomCommandWithOpts with numeric arg)', () => {
		it('appends preset_index to args', () => {
			invoke(actions.activateCameraPreset, { targetType: 'roomIndex', roomIndex: 1, preset_index: 4 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/activateCameraPreset', [1, 4])
		})

		it('defaults preset_index to 1 when not provided', () => {
			invoke(actions.activateCameraPreset, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/activateCameraPreset', [1, 1])
		})

		it('works with allRooms target', () => {
			invoke(actions.activateCameraPreset, { targetType: 'allRooms', preset_index: 3 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/allRooms/activateCameraPreset', [3])
		})
	})

	describe('setNDIContentOff (roomCommandWithOpts with channel_num arg)', () => {
		it('appends channel_num to args', () => {
			invoke(actions.setNDIContentOff, { targetType: 'roomIndex', roomIndex: 1, channel_num: 3 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIContentOff', [1, 3])
		})

		it('defaults channel_num to 1 when not provided', () => {
			invoke(actions.setNDIContentOff, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIContentOff', [1, 1])
		})
	})

	describe('global actions (no room target)', () => {
		it('getAddedRoomList sends fixed path with no args', () => {
			invoke(actions.getAddedRoomList, {})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/getAddedRoomList', [])
		})

		it('getPairedRoomList sends fixed path with no args', () => {
			invoke(actions.getPairedRoomList, {})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/getPairedRoomList', [])
		})
	})

	describe('sendCommand is called exactly once per action invocation', () => {
		it('does not double-send', () => {
			invoke(actions.muteMic, { targetType: 'allRooms' })
			expect(mockSendCommand).toHaveBeenCalledTimes(1)
		})
	})

	describe('startMeeting', () => {
		it('sends correct path with roomIndex target', () => {
			invoke(actions.startMeeting, { targetType: 'roomIndex', roomIndex: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/startMeeting', [2])
		})

		it('sends correct path with allRooms target', () => {
			invoke(actions.startMeeting, { targetType: 'allRooms' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/allRooms/startMeeting', [])
		})
	})

	describe('global room list actions', () => {
		it('getAddedRoomCount sends fixed path with no args', () => {
			invoke(actions.getAddedRoomCount, {})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/getAddedRoomCount', [])
		})

		it('getPairedRoomCount sends fixed path with no args', () => {
			invoke(actions.getPairedRoomCount, {})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/getPairedRoomCount', [])
		})
	})

	describe('NDI content type actions', () => {
		it('setNDIContentParticipant appends channel_num', () => {
			invoke(actions.setNDIContentParticipant, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIContentParticipant', [1, 2])
		})

		it('setNDIContentActiveSpeaker appends channel_num', () => {
			invoke(actions.setNDIContentActiveSpeaker, { targetType: 'roomIndex', roomIndex: 1, channel_num: 3 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIContentActiveSpeaker', [1, 3])
		})

		it('setNDIContentGallery appends channel_num', () => {
			invoke(actions.setNDIContentGallery, { targetType: 'roomIndex', roomIndex: 1, channel_num: 4 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIContentGallery', [1, 4])
		})

		it('setNDIContentScreenshare appends channel_num', () => {
			invoke(actions.setNDIContentScreenshare, { targetType: 'roomIndex', roomIndex: 1, channel_num: 5 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIContentScreenshare', [1, 5])
		})

		it('setNDIContentSpotlight appends channel_num', () => {
			invoke(actions.setNDIContentSpotlight, { targetType: 'roomIndex', roomIndex: 1, channel_num: 6 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIContentSpotlight', [1, 6])
		})

		it('setNDIContentPinGroup appends channel_num', () => {
			invoke(actions.setNDIContentPinGroup, { targetType: 'roomIndex', roomIndex: 1, channel_num: 7 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIContentPinGroup', [1, 7])
		})
	})

	describe('NDI selection actions', () => {
		it('setNDIParticipantSelection appends channel_num and username', () => {
			invoke(actions.setNDIParticipantSelection, {
				targetType: 'roomIndex',
				roomIndex: 1,
				channel_num: 2,
				exact_zoom_username: 'Alice',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIParticipantSelection', [1, 2, 'Alice'])
		})

		it('setNDIParticipantSelection defaults channel_num to 1 when missing', () => {
			invoke(actions.setNDIParticipantSelection, {
				targetType: 'roomIndex',
				roomIndex: 1,
				exact_zoom_username: 'Bob',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIParticipantSelection', [1, 1, 'Bob'])
		})

		it('setNDIGallerySelection appends channel_num and gallery_index', () => {
			invoke(actions.setNDIGallerySelection, {
				targetType: 'roomIndex',
				roomIndex: 1,
				channel_num: 2,
				gallery_index: 3,
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIGallerySelection', [1, 2, 3])
		})

		it('setNDIScreenshareSelection appends channel_num and screenshare_index', () => {
			invoke(actions.setNDIScreenshareSelection, {
				targetType: 'roomIndex',
				roomIndex: 1,
				channel_num: 2,
				screenshare_index: 4,
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIScreenshareSelection', [1, 2, 4])
		})

		it('setNDIPinGroupSelection appends channel_num and pin_group_index', () => {
			invoke(actions.setNDIPinGroupSelection, {
				targetType: 'roomIndex',
				roomIndex: 1,
				channel_num: 2,
				pin_group_index: 5,
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNDIPinGroupSelection', [1, 2, 5])
		})
	})

	describe('NDI channel info actions', () => {
		it('getNDIChannelConfig appends channel_num', () => {
			invoke(actions.getNDIChannelConfig, { targetType: 'roomIndex', roomIndex: 1, channel_num: 3 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getNDIChannelConfig', [1, 3])
		})

		it('getNDIChannelCount sends path with no extra args', () => {
			invoke(actions.getNDIChannelCount, { targetType: 'roomIndex', roomIndex: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getNDIChannelCount', [2])
		})
	})

	describe('HWIO mode and input', () => {
		it('setHWIOMode appends channel_num and mode_index', () => {
			invoke(actions.setHWIOMode, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2, mode_index: 3 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOMode', [1, 2, 3])
		})

		it('setHWIOMode defaults mode_index to 0 when missing', () => {
			invoke(actions.setHWIOMode, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOMode', [1, 2, 0])
		})

		it('setHWIOInputSelection appends channel_num and video_index', () => {
			invoke(actions.setHWIOInputSelection, { targetType: 'roomIndex', roomIndex: 1, channel_num: 1, video_index: 5 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOInputSelection', [1, 1, 5])
		})
	})

	describe('HWIO content type actions', () => {
		it('setHWIOContentOff appends channel_num', () => {
			invoke(actions.setHWIOContentOff, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOContentOff', [1, 2])
		})

		it('setHWIOContentTestSignal appends channel_num', () => {
			invoke(actions.setHWIOContentTestSignal, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOContentTestSignal', [1, 2])
		})

		it('setHWIOContentParticipant appends channel_num', () => {
			invoke(actions.setHWIOContentParticipant, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOContentParticipant', [1, 2])
		})

		it('setHWIOContentActiveSpeaker appends channel_num', () => {
			invoke(actions.setHWIOContentActiveSpeaker, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOContentActiveSpeaker', [1, 2])
		})

		it('setHWIOContentGallery appends channel_num', () => {
			invoke(actions.setHWIOContentGallery, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOContentGallery', [1, 2])
		})

		it('setHWIOContentScreenshare appends channel_num', () => {
			invoke(actions.setHWIOContentScreenshare, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOContentScreenshare', [1, 2])
		})

		it('setHWIOContentSpotlight appends channel_num', () => {
			invoke(actions.setHWIOContentSpotlight, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOContentSpotlight', [1, 2])
		})

		it('setHWIOContentPinGroup appends channel_num', () => {
			invoke(actions.setHWIOContentPinGroup, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOContentPinGroup', [1, 2])
		})
	})

	describe('HWIO config and selection actions', () => {
		it('setHWIOResolutionFrameRate appends channel_num and resolution string', () => {
			invoke(actions.setHWIOResolutionFrameRate, {
				targetType: 'roomIndex',
				roomIndex: 1,
				channel_num: 1,
				resolution_framerate: '1920x1080p60',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOResolutionFrameRate', [
				1,
				1,
				'1920x1080p60',
			])
		})

		it('setHWIOAudioMix appends channel_num and setting_index', () => {
			invoke(actions.setHWIOAudioMix, { targetType: 'roomIndex', roomIndex: 1, channel_num: 1, setting_index: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOAudioMix', [1, 1, 2])
		})

		it('setHWIOParticipantSelection appends channel_num and username', () => {
			invoke(actions.setHWIOParticipantSelection, {
				targetType: 'roomIndex',
				roomIndex: 1,
				channel_num: 1,
				zoom_username: 'Charlie',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOParticipantSelection', [
				1,
				1,
				'Charlie',
			])
		})

		it('setHWIOGallerySelection appends channel_num and gallery_index', () => {
			invoke(actions.setHWIOGallerySelection, {
				targetType: 'roomIndex',
				roomIndex: 1,
				channel_num: 1,
				gallery_index: 3,
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOGallerySelection', [1, 1, 3])
		})

		it('setHWIOScreenshareSelection appends channel_num and screenshare_index', () => {
			invoke(actions.setHWIOScreenshareSelection, {
				targetType: 'roomIndex',
				roomIndex: 1,
				channel_num: 1,
				screenshare_index: 2,
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOScreenshareSelection', [1, 1, 2])
		})

		it('setHWIOPinGroupSelection appends channel_num and pin_group_index', () => {
			invoke(actions.setHWIOPinGroupSelection, {
				targetType: 'roomIndex',
				roomIndex: 1,
				channel_num: 1,
				pin_group_index: 4,
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setHWIOPinGroupSelection', [1, 1, 4])
		})

		it('getHWIOChannelConfig appends channel_num', () => {
			invoke(actions.getHWIOChannelConfig, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getHWIOChannelConfig', [1, 2])
		})

		it('getHWIOChannelCount sends path with room arg only', () => {
			invoke(actions.getHWIOChannelCount, { targetType: 'roomIndex', roomIndex: 3 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getHWIOChannelCount', [3])
		})

		it('getHWIOSupportedResolutionFrameRate appends channel_num', () => {
			invoke(actions.getHWIOSupportedResolutionFrameRate, { targetType: 'roomIndex', roomIndex: 1, channel_num: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getHWIOSupportedResolutionFrameRate', [1, 1])
		})
	})

	describe('Dante content type actions', () => {
		it('setDanteContentOff appends channel_num', () => {
			invoke(actions.setDanteContentOff, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setDanteContentOff', [1, 2])
		})

		it('setDanteContentParticipant appends channel_num', () => {
			invoke(actions.setDanteContentParticipant, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setDanteContentParticipant', [1, 2])
		})

		it('setDanteContentMix appends channel_num', () => {
			invoke(actions.setDanteContentMix, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setDanteContentMix', [1, 2])
		})

		it('setDanteContentScreenshare appends channel_num', () => {
			invoke(actions.setDanteContentScreenshare, { targetType: 'roomIndex', roomIndex: 1, channel_num: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setDanteContentScreenshare', [1, 2])
		})

		it('setDanteParticipantSelection appends channel_num and username', () => {
			invoke(actions.setDanteParticipantSelection, {
				targetType: 'roomIndex',
				roomIndex: 1,
				channel_num: 1,
				zoom_username: 'Dana',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setDanteParticipantSelection', [1, 1, 'Dana'])
		})

		it('getDanteChannelConfig appends channel_num', () => {
			invoke(actions.getDanteChannelConfig, { targetType: 'roomIndex', roomIndex: 1, channel_num: 3 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getDanteChannelConfig', [1, 3])
		})

		it('getDanteChannelCount sends path with room arg only', () => {
			invoke(actions.getDanteChannelCount, { targetType: 'roomIndex', roomIndex: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getDanteChannelCount', [2])
		})
	})

	describe('room device actions', () => {
		it('setRoomMic appends mic_name', () => {
			invoke(actions.setRoomMic, { targetType: 'roomIndex', roomIndex: 1, mic_name: 'USB Mic' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setRoomMic', [1, 'USB Mic'])
		})

		it('setRoomMainCamera appends camera_name', () => {
			invoke(actions.setRoomMainCamera, { targetType: 'roomIndex', roomIndex: 1, camera_name: 'PTZ Cam' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setRoomMainCamera', [1, 'PTZ Cam'])
		})

		it('setRoomMultiCameraOn appends camera_name', () => {
			invoke(actions.setRoomMultiCameraOn, { targetType: 'roomIndex', roomIndex: 1, camera_name: 'Wide Cam' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setRoomMultiCameraOn', [1, 'Wide Cam'])
		})

		it('setRoomMultiCameraOff appends camera_name', () => {
			invoke(actions.setRoomMultiCameraOff, { targetType: 'roomIndex', roomIndex: 1, camera_name: 'Wide Cam' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setRoomMultiCameraOff', [1, 'Wide Cam'])
		})

		it('setRoomSpeaker appends speaker_name', () => {
			invoke(actions.setRoomSpeaker, { targetType: 'roomIndex', roomIndex: 1, speaker_name: 'Main Speaker' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setRoomSpeaker', [1, 'Main Speaker'])
		})
	})

	describe('room list query actions', () => {
		it('getRoomMicList sends path with room arg', () => {
			invoke(actions.getRoomMicList, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getRoomMicList', [1])
		})

		it('getRoomCameraList sends path with room arg', () => {
			invoke(actions.getRoomCameraList, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getRoomCameraList', [1])
		})

		it('getRoomSpeakerList sends path with room arg', () => {
			invoke(actions.getRoomSpeakerList, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getRoomSpeakerList', [1])
		})

		it('getSelectedPrimaryCamera sends path with room arg', () => {
			invoke(actions.getSelectedPrimaryCamera, { targetType: 'roomIndex', roomIndex: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getSelectedPrimaryCamera', [2])
		})

		it('getSelectedMultiCameras sends path with room arg', () => {
			invoke(actions.getSelectedMultiCameras, { targetType: 'roomIndex', roomIndex: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getSelectedMultiCameras', [2])
		})

		it('getSelectedMic sends path with room arg', () => {
			invoke(actions.getSelectedMic, { targetType: 'roomIndex', roomIndex: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getSelectedMic', [2])
		})

		it('getSelectedSpeaker sends path with room arg', () => {
			invoke(actions.getSelectedSpeaker, { targetType: 'roomIndex', roomIndex: 2 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getSelectedSpeaker', [2])
		})
	})

	describe('setCameraDisplayName', () => {
		it('appends camera_device_name and new_camera_display_name', () => {
			invoke(actions.setCameraDisplayName, {
				targetType: 'roomIndex',
				roomIndex: 1,
				camera_device_name: 'CAM1',
				new_camera_display_name: 'Front Camera',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setCameraDisplayName', [
				1,
				'CAM1',
				'Front Camera',
			])
		})

		it('works with roomName target', () => {
			invoke(actions.setCameraDisplayName, {
				targetType: 'roomName',
				roomName: 'Lab',
				camera_device_name: 'CAM2',
				new_camera_display_name: 'Side Camera',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomName/setCameraDisplayName', [
				'Lab',
				'CAM2',
				'Side Camera',
			])
		})
	})

	describe('overlay actions', () => {
		it('setNameTagAlignment appends location_index', () => {
			invoke(actions.setNameTagAlignment, { targetType: 'roomIndex', roomIndex: 1, location_index: 3 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNameTagAlignment', [1, 3])
		})

		it('setNameTagAlignment defaults location_index to 2 when missing', () => {
			invoke(actions.setNameTagAlignment, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setNameTagAlignment', [1, 2])
		})

		it('enableNameTagOverlay sends path with room arg', () => {
			invoke(actions.enableNameTagOverlay, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/enableNameTagOverlay', [1])
		})

		it('disableNameTagOverlay sends path with room arg', () => {
			invoke(actions.disableNameTagOverlay, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/disableNameTagOverlay', [1])
		})

		it('enableEmojiOverlay sends path with room arg', () => {
			invoke(actions.enableEmojiOverlay, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/enableEmojiOverlay', [1])
		})

		it('disableEmojiOverlay sends path with room arg', () => {
			invoke(actions.disableEmojiOverlay, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/disableEmojiOverlay', [1])
		})

		it('enableHandRaiseOverlay sends path with room arg', () => {
			invoke(actions.enableHandRaiseOverlay, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/enableHandRaiseOverlay', [1])
		})

		it('disableHandRaiseOverlay sends path with room arg', () => {
			invoke(actions.disableHandRaiseOverlay, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/disableHandRaiseOverlay', [1])
		})

		it('enableActiveSpeakerOverlay sends path with room arg', () => {
			invoke(actions.enableActiveSpeakerOverlay, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/enableActiveSpeakerOverlay', [1])
		})

		it('disableActiveSpeakerOverlay sends path with room arg', () => {
			invoke(actions.disableActiveSpeakerOverlay, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/disableActiveSpeakerOverlay', [1])
		})

		it('getOverlaySettings sends path with room arg', () => {
			invoke(actions.getOverlaySettings, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getOverlaySettings', [1])
		})
	})

	describe('content share actions', () => {
		it('startDeviceShare sends path with room arg', () => {
			invoke(actions.startDeviceShare, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/startDeviceShare', [1])
		})

		it('startCameraShare appends camera_name', () => {
			invoke(actions.startCameraShare, { targetType: 'roomIndex', roomIndex: 1, camera_name: 'DocCam' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/startCameraShare', [1, 'DocCam'])
		})

		it('stopShare sends path with room arg', () => {
			invoke(actions.stopShare, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/stopShare', [1])
		})
	})

	describe('room/meeting status actions', () => {
		it('getRoomInfo sends path with room arg', () => {
			invoke(actions.getRoomInfo, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getRoomInfo', [1])
		})

		it('getParticipantCount sends path with room arg', () => {
			invoke(actions.getParticipantCount, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getParticipantCount', [1])
		})

		it('getMeetingStatus sends path with room arg', () => {
			invoke(actions.getMeetingStatus, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getMeetingStatus', [1])
		})

		it('pairRoom sends path with room arg', () => {
			invoke(actions.pairRoom, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/pairRoom', [1])
		})

		it('unPairRoom sends path with room arg', () => {
			invoke(actions.unPairRoom, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/unPairRoom', [1])
		})
	})

	describe('setActiveSpeakerChild', () => {
		it('appends participant_name', () => {
			invoke(actions.setActiveSpeakerChild, {
				targetType: 'roomIndex',
				roomIndex: 1,
				participant_name: 'Eve',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setActiveSpeakerChild', [1, 'Eve'])
		})

		it('works with allRooms target', () => {
			invoke(actions.setActiveSpeakerChild, { targetType: 'allRooms', participant_name: 'Frank' })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/allRooms/setActiveSpeakerChild', ['Frank'])
		})
	})

	describe('companion room actions', () => {
		it('getCompanionRoomList sends path with room arg', () => {
			invoke(actions.getCompanionRoomList, { targetType: 'roomIndex', roomIndex: 1 })
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getCompanionRoomList', [1])
		})

		it('getCompanionRoomCameraList appends czr_id', () => {
			invoke(actions.getCompanionRoomCameraList, {
				targetType: 'roomIndex',
				roomIndex: 1,
				czr_id: 'czr-123',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/getCompanionRoomCameraList', [1, 'czr-123'])
		})

		it('setCompanionRoomCameraDisplayName appends czr_id, camera_device_name, new_camera_display_name', () => {
			invoke(actions.setCompanionRoomCameraDisplayName, {
				targetType: 'roomIndex',
				roomIndex: 1,
				czr_id: 'czr-123',
				camera_device_name: 'CAM1',
				new_camera_display_name: 'Front',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setCompanionRoomCameraDisplayName', [
				1,
				'czr-123',
				'CAM1',
				'Front',
			])
		})

		it('setCompanionRoomCameraOff appends czr_id and camera_device_name', () => {
			invoke(actions.setCompanionRoomCameraOff, {
				targetType: 'roomIndex',
				roomIndex: 1,
				czr_id: 'czr-123',
				camera_device_name: 'CAM1',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setCompanionRoomCameraOff', [
				1,
				'czr-123',
				'CAM1',
			])
		})

		it('setCompanionRoomCameraOn appends czr_id and camera_device_name', () => {
			invoke(actions.setCompanionRoomCameraOn, {
				targetType: 'roomIndex',
				roomIndex: 1,
				czr_id: 'czr-456',
				camera_device_name: 'CAM2',
			})
			expect(mockSendCommand).toHaveBeenCalledWith('/zoomRooms/roomIndex/setCompanionRoomCameraOn', [
				1,
				'czr-456',
				'CAM2',
			])
		})
	})
})
