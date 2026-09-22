import type { ZoomRoomsInstance } from '../../src/utils.js'

export function createMockInstance(): { instance: ZoomRoomsInstance; mockSendCommand: jest.Mock } {
	const mockSendCommand = jest.fn()
	const instance = {
		OSC: {
			sendCommand: mockSendCommand,
			// joinMeeting is guarded by a 10s cooldown check; without this the
			// action silently exits and join tests report 'Number of calls: 0'.
			canAttemptJoin: () => true,
			recordJoinAttempt: () => undefined,
			resetJoinAttempts: () => undefined,
		},
		config: { host: '127.0.0.1', tx_port: 9090, rx_port: 0, oscOutputHeader: '/roomosc' },
		state: { addedRooms: [], pairedRooms: [], addedRoomsCount: 0, pairedRoomsCount: 0, rooms: {} },
		log: jest.fn(),
		updateStatus: jest.fn(),
		updateVariableValues: jest.fn(),
		checkFeedbacks: jest.fn(),
	} as unknown as ZoomRoomsInstance

	return { instance, mockSendCommand }
}
