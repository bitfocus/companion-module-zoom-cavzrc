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
})
