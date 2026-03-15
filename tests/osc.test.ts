import { UDPPort } from 'osc'
import { OSC } from '../src/osc.js'
import { createMockInstance } from './helpers/mock-instance.js'
import type { ZoomRoomsInstance } from '../src/types.js'

type MockPort = { send: jest.Mock; on: jest.Mock; open: jest.Mock; close: jest.Mock }

function getLastMockPort(): MockPort {
	const results = (UDPPort as jest.Mock).mock.results
	return results[results.length - 1]?.value as MockPort
}

function getEventHandler(port: MockPort, event: string): ((...args: unknown[]) => void) | undefined {
	const call = port.on.mock.calls.find((c: unknown[]) => c[0] === event)
	return call?.[1] as ((...args: unknown[]) => void) | undefined
}

function makeArg(type: string, value: unknown) {
	return { type, value }
}

function createOSCInstance(rxPort = 0): {
	osc: OSC
	port: MockPort
	instance: ZoomRoomsInstance
	mockUpdateVariableValues: jest.Mock
	mockCheckFeedbacks: jest.Mock
} {
	const { instance } = createMockInstance()
	// Override rx_port for tests that need message handling
	;(instance as unknown as Record<string, unknown>).config = {
		host: '127.0.0.1',
		tx_port: 9090,
		rx_port: rxPort,
		oscOutputHeader: '/roomosc',
	}
	const mockUpdateVariableValues = instance.updateVariableValues as jest.Mock
	const mockCheckFeedbacks = instance.checkFeedbacks as jest.Mock
	const osc = new OSC(instance)
	const port = getLastMockPort()
	return { osc, port, instance, mockUpdateVariableValues, mockCheckFeedbacks }
}

function triggerMessage(port: MockPort, address: string, args: ReturnType<typeof makeArg>[]) {
	const handler = getEventHandler(port, 'message')
	if (!handler) throw new Error('No message handler registered — ensure rx_port > 0')
	handler({ address, args })
}

describe('OSC poll timer', () => {
	beforeEach(() => {
		jest.useFakeTimers()
		;(UDPPort as jest.Mock).mockClear()
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	function createPollingOSCInstance() {
		const result = createOSCInstance(1234)
		// The mock port.on() records calls but never fires events; trigger 'ready' manually.
		const readyHandler = getEventHandler(result.port, 'ready')
		if (readyHandler) readyHandler()
		return result
	}

	it('sends getAddedRoomList after the first 1000ms tick', () => {
		const { port } = createPollingOSCInstance()
		jest.advanceTimersByTime(1000)
		const addresses = port.send.mock.calls.map((c: unknown[]) => (c[0] as { address: string }).address)
		expect(addresses).toContain('/zoomRooms/getAddedRoomList')
	})

	it('sends 1 command per tick (3 sends after 3 ticks)', () => {
		const { port } = createPollingOSCInstance()
		jest.advanceTimersByTime(3000)
		expect(port.send).toHaveBeenCalledTimes(3)
	})

	it('does not send before the first tick', () => {
		const { port } = createPollingOSCInstance()
		jest.advanceTimersByTime(999)
		expect(port.send).not.toHaveBeenCalled()
	})

	it('stops polling after destroy()', () => {
		const { osc, port } = createPollingOSCInstance()
		jest.advanceTimersByTime(1000)
		expect(port.send).toHaveBeenCalledTimes(1)
		osc.destroy()
		jest.advanceTimersByTime(3000)
		// No additional sends after destroy
		expect(port.send).toHaveBeenCalledTimes(1)
	})

	it('clears the interval even when destroy is called before first tick', () => {
		const { osc, port } = createPollingOSCInstance()
		osc.destroy()
		jest.advanceTimersByTime(5000)
		expect(port.send).not.toHaveBeenCalled()
	})
})

describe('OSC addedRoomList message handler', () => {
	beforeEach(() => {
		jest.useFakeTimers()
		;(UDPPort as jest.Mock).mockClear()
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	it('calls updateVariableValues on the first message (not just the last)', () => {
		const { port, mockUpdateVariableValues } = createOSCInstance(1234)
		// Simulate first of two rooms: maxList=2, thisIndex=0
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 2),
			makeArg('i', 0),
			makeArg('s', 'room-id-1'),
			makeArg('s', 'Room One'),
		])
		expect(mockUpdateVariableValues).toHaveBeenCalledTimes(1)
	})

	it('calls updateVariableValues on every message in a multi-room list', () => {
		const { port, mockUpdateVariableValues } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 2),
			makeArg('i', 0),
			makeArg('s', 'room-id-1'),
			makeArg('s', 'Room One'),
		])
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 2),
			makeArg('i', 1),
			makeArg('s', 'room-id-2'),
			makeArg('s', 'Room Two'),
		])
		expect(mockUpdateVariableValues).toHaveBeenCalledTimes(2)
	})

	it('updates state.addedRooms after first message', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'room-id-a'),
			makeArg('s', 'Alpha Room'),
		])
		expect(instance.state.addedRooms[0]).toMatchObject({ roomID: 'room-id-a', roomName: 'Alpha Room' })
	})

	it('trims addedRooms to maxList on the last message', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'room-id-a'),
			makeArg('s', 'Alpha Room'),
		])
		expect(instance.state.addedRooms).toHaveLength(1)
	})

	it('trims stale rooms when maxList decreases in a new poll batch', () => {
		const { port, instance } = createOSCInstance(1234)
		// First batch: 3 rooms
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 3),
			makeArg('i', 0),
			makeArg('s', 'id-1'),
			makeArg('s', 'Room One'),
		])
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 3),
			makeArg('i', 1),
			makeArg('s', 'id-2'),
			makeArg('s', 'Room Two'),
		])
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 3),
			makeArg('i', 2),
			makeArg('s', 'id-3'),
			makeArg('s', 'Room Three'),
		])
		expect(instance.state.addedRooms).toHaveLength(3)
		// Second batch: only 1 room (a room was removed)
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'id-1'),
			makeArg('s', 'Room One'),
		])
		expect(instance.state.addedRooms).toHaveLength(1)
		expect(instance.state.addedRooms[0]).toMatchObject({ roomID: 'id-1', roomName: 'Room One' })
	})

	it('handles out-of-order messages (index 1 before index 0)', () => {
		const { port, instance } = createOSCInstance(1234)
		// index 1 arrives first
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 2),
			makeArg('i', 1),
			makeArg('s', 'room-id-2'),
			makeArg('s', 'Room Two'),
		])
		// index 0 arrives second
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 2),
			makeArg('i', 0),
			makeArg('s', 'room-id-1'),
			makeArg('s', 'Room One'),
		])
		expect(instance.state.addedRooms).toHaveLength(2)
		expect(instance.state.addedRooms[0]).toMatchObject({ roomID: 'room-id-1', roomName: 'Room One' })
		expect(instance.state.addedRooms[1]).toMatchObject({ roomID: 'room-id-2', roomName: 'Room Two' })
	})

	it('trims array to maxList immediately when maxList shrinks (first message of new batch)', () => {
		const { port, instance } = createOSCInstance(1234)
		// First batch: 3 rooms
		for (let i = 0; i < 3; i++) {
			triggerMessage(port, '/roomosc/addedRoomList', [
				makeArg('i', 3),
				makeArg('i', i),
				makeArg('s', `id-${i + 1}`),
				makeArg('s', `Room ${i + 1}`),
			])
		}
		expect(instance.state.addedRooms).toHaveLength(3)
		// First message of second batch has maxList=1 — array must be trimmed immediately
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'id-1'),
			makeArg('s', 'Room One'),
		])
		expect(instance.state.addedRooms).toHaveLength(1)
		expect(instance.state.addedRooms[0]).toMatchObject({ roomID: 'id-1' })
	})
})

describe('OSC pairedRoomList message handler', () => {
	beforeEach(() => {
		jest.useFakeTimers()
		;(UDPPort as jest.Mock).mockClear()
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	it('calls updateVariableValues on the first message (not just the last)', () => {
		const { port, mockUpdateVariableValues } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 3),
			makeArg('i', 0),
			makeArg('s', 'paired-id-1'),
			makeArg('s', 'Paired Room One'),
		])
		expect(mockUpdateVariableValues).toHaveBeenCalledTimes(1)
	})

	it('calls updateVariableValues on every message in a multi-room list', () => {
		const { port, mockUpdateVariableValues } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 2),
			makeArg('i', 0),
			makeArg('s', 'paired-id-1'),
			makeArg('s', 'Paired Room One'),
		])
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 2),
			makeArg('i', 1),
			makeArg('s', 'paired-id-2'),
			makeArg('s', 'Paired Room Two'),
		])
		expect(mockUpdateVariableValues).toHaveBeenCalledTimes(2)
	})

	it('updates state.pairedRooms after first message', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'paired-id-b'),
			makeArg('s', 'Beta Room'),
		])
		expect(instance.state.pairedRooms[0]).toMatchObject({ roomID: 'paired-id-b', roomName: 'Beta Room' })
	})

	it('trims pairedRooms to maxList on the last message', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'paired-id-b'),
			makeArg('s', 'Beta Room'),
		])
		expect(instance.state.pairedRooms).toHaveLength(1)
	})

	it('trims stale rooms when maxList decreases in a new poll batch', () => {
		const { port, instance } = createOSCInstance(1234)
		// First batch: 2 rooms
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 2),
			makeArg('i', 0),
			makeArg('s', 'pid-1'),
			makeArg('s', 'Paired One'),
		])
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 2),
			makeArg('i', 1),
			makeArg('s', 'pid-2'),
			makeArg('s', 'Paired Two'),
		])
		expect(instance.state.pairedRooms).toHaveLength(2)
		// Second batch: only 1 room
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'pid-1'),
			makeArg('s', 'Paired One'),
		])
		expect(instance.state.pairedRooms).toHaveLength(1)
		expect(instance.state.pairedRooms[0]).toMatchObject({ roomID: 'pid-1', roomName: 'Paired One' })
	})

	it('handles out-of-order messages (index 1 before index 0)', () => {
		const { port, instance } = createOSCInstance(1234)
		// index 1 arrives first
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 2),
			makeArg('i', 1),
			makeArg('s', 'paired-id-2'),
			makeArg('s', 'Paired Two'),
		])
		// index 0 arrives second
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 2),
			makeArg('i', 0),
			makeArg('s', 'paired-id-1'),
			makeArg('s', 'Paired One'),
		])
		expect(instance.state.pairedRooms).toHaveLength(2)
		expect(instance.state.pairedRooms[0]).toMatchObject({ roomID: 'paired-id-1', roomName: 'Paired One' })
		expect(instance.state.pairedRooms[1]).toMatchObject({ roomID: 'paired-id-2', roomName: 'Paired Two' })
	})

	it('trims array to maxList immediately when maxList shrinks (first message of new batch)', () => {
		const { port, instance } = createOSCInstance(1234)
		// First batch: 3 rooms
		for (let i = 0; i < 3; i++) {
			triggerMessage(port, '/roomosc/pairedRoomList', [
				makeArg('i', 3),
				makeArg('i', i),
				makeArg('s', `pid-${i + 1}`),
				makeArg('s', `Paired ${i + 1}`),
			])
		}
		expect(instance.state.pairedRooms).toHaveLength(3)
		// First message of second batch has maxList=1 — array must be trimmed immediately
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'pid-1'),
			makeArg('s', 'Paired One'),
		])
		expect(instance.state.pairedRooms).toHaveLength(1)
		expect(instance.state.pairedRooms[0]).toMatchObject({ roomID: 'pid-1' })
	})
})
