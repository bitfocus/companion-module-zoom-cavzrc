import type { ZoomRoomsInstance } from '../../src/types.js'

export function createMockInstance(): { instance: ZoomRoomsInstance; mockSendCommand: jest.Mock } {
	const mockSendCommand = jest.fn()
	const instance = {
		OSC: { sendCommand: mockSendCommand },
		config: { host: '127.0.0.1', tx_port: 9090, rx_port: 0, oscOutputHeader: '/roomosc' },
		state: { addedRooms: [], pairedRooms: [], addedRoomsCount: 0, pairedRoomsCount: 0, rooms: {} },
		log: jest.fn(),
		updateStatus: jest.fn(),
		updateVariableValues: jest.fn(),
	} as unknown as ZoomRoomsInstance

	return { instance, mockSendCommand }
}
