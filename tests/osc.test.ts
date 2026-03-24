import { UDPPort } from 'osc'
import { OSC } from '../src/osc.js'
import { createMockInstance } from './helpers/mock-instance.js'
import type { ZoomRoomsInstance } from '../src/utils.js'

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
	// Ensure setVariableValues is available for granular update functions
	;(instance as unknown as Record<string, unknown>).setVariableValues = jest.fn()
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
		expect(port.send).toHaveBeenCalledTimes(2)
		const addresses = port.send.mock.calls.map((c: unknown[]) => (c[0] as { address: string }).address)
		expect(addresses).toEqual(['/zoomRooms/getAddedRoomList', '/zoomRooms/getPairedRoomList'])
	})

	it('sends 2 commands immediately on connect (2 sends total even after 3 ticks without pollInterval)', () => {
		const { port } = createPollingOSCInstance()
		jest.advanceTimersByTime(3000)
		expect(port.send).toHaveBeenCalledTimes(2)
		const addresses = port.send.mock.calls.map((c: unknown[]) => (c[0] as { address: string }).address)
		expect(addresses).toEqual(['/zoomRooms/getAddedRoomList', '/zoomRooms/getPairedRoomList'])
	})

	it('sends 2 commands immediately on ready before any interval tick', () => {
		const { port } = createPollingOSCInstance()
		jest.advanceTimersByTime(999)
		// 2 immediate sends fire on 'ready' before any interval tick
		expect(port.send).toHaveBeenCalledTimes(2)
		const addresses = port.send.mock.calls.map((c: unknown[]) => (c[0] as { address: string }).address)
		expect(addresses).toEqual(['/zoomRooms/getAddedRoomList', '/zoomRooms/getPairedRoomList'])
	})

	it('stops polling after destroy()', () => {
		const { osc, port } = createPollingOSCInstance()
		jest.advanceTimersByTime(1000)
		// 2 immediate sends on ready; no interval fires (pollInterval not set in mock config)
		expect(port.send).toHaveBeenCalledTimes(2)
		const addresses = port.send.mock.calls.map((c: unknown[]) => (c[0] as { address: string }).address)
		expect(addresses).toEqual(['/zoomRooms/getAddedRoomList', '/zoomRooms/getPairedRoomList'])
		osc.destroy()
		jest.advanceTimersByTime(3000)
		// No additional sends after destroy
		expect(port.send).toHaveBeenCalledTimes(2)
	})

	it('fires 2 immediate sends on ready but no interval sends after destroy', () => {
		const { osc, port } = createPollingOSCInstance()
		// 2 immediate sends fire on 'ready' before destroy is called
		osc.destroy()
		jest.advanceTimersByTime(5000)
		expect(port.send).toHaveBeenCalledTimes(2)
		const addresses = port.send.mock.calls.map((c: unknown[]) => (c[0] as { address: string }).address)
		expect(addresses).toEqual(['/zoomRooms/getAddedRoomList', '/zoomRooms/getPairedRoomList'])
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

	it('adds a new room when roomID is not in state', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'room-id-1'),
			makeArg('s', 'Room One'),
		])
		expect(instance.state.addedRooms).toHaveLength(1)
		expect(instance.state.addedRooms[0]).toMatchObject({ roomID: 'room-id-1', roomName: 'Room One', roomIndex: 1 })
	})

	it('does not add a duplicate when same roomID arrives again', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'room-id-1'),
			makeArg('s', 'Room One'),
		])
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'room-id-1'),
			makeArg('s', 'Room One'),
		])
		expect(instance.state.addedRooms).toHaveLength(1)
	})

	it('adds multiple distinct rooms from separate messages', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 3),
			makeArg('i', 0),
			makeArg('s', 'room-id-1'),
			makeArg('s', 'Room One'),
		])
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 3),
			makeArg('i', 1),
			makeArg('s', 'room-id-2'),
			makeArg('s', 'Room Two'),
		])
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 3),
			makeArg('i', 2),
			makeArg('s', 'room-id-3'),
			makeArg('s', 'Room Three'),
		])
		expect(instance.state.addedRooms).toHaveLength(3)
		expect(instance.state.addedRooms).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ roomID: 'room-id-1' }),
				expect.objectContaining({ roomID: 'room-id-2' }),
				expect.objectContaining({ roomID: 'room-id-3' }),
			]),
		)
	})

	it('calls setVariableValues with added_rooms_list after a new room is added', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/addedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'room-id-1'),
			makeArg('s', 'Room One'),
		])
		expect(instance.setVariableValues).toHaveBeenCalledWith(expect.objectContaining({ added_rooms_list: 'Room One' }))
	})

	it('does not add when roomID is undefined', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/addedRoomList', [makeArg('i', 1), makeArg('i', 0), makeArg('s', 'Room One')])
		expect(instance.state.addedRooms).toHaveLength(0)
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

	it('adds a new paired room when roomID is not in state', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'paired-id-1'),
			makeArg('s', 'Paired Room One'),
		])
		expect(instance.state.pairedRooms).toHaveLength(1)
		expect(instance.state.pairedRooms[0]).toMatchObject({
			roomID: 'paired-id-1',
			roomName: 'Paired Room One',
			roomIndex: 1,
		})
	})

	it('does not add a duplicate when same roomID arrives again', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'paired-id-1'),
			makeArg('s', 'Paired Room One'),
		])
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'paired-id-1'),
			makeArg('s', 'Paired Room One'),
		])
		expect(instance.state.pairedRooms).toHaveLength(1)
	})

	it('adds multiple distinct paired rooms from separate messages', () => {
		const { port, instance } = createOSCInstance(1234)
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
		expect(instance.state.pairedRooms).toHaveLength(2)
		expect(instance.state.pairedRooms).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ roomID: 'paired-id-1' }),
				expect.objectContaining({ roomID: 'paired-id-2' }),
			]),
		)
	})

	it('calls setVariableValues with paired_rooms_list and checkFeedbacks after a new paired room is added', () => {
		const { port, instance, mockCheckFeedbacks } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/pairedRoomList', [
			makeArg('i', 1),
			makeArg('i', 0),
			makeArg('s', 'paired-id-1'),
			makeArg('s', 'Paired Room One'),
		])
		expect(instance.setVariableValues).toHaveBeenCalledWith(
			expect.objectContaining({ paired_rooms_list: 'Paired Room One' }),
		)
		expect(mockCheckFeedbacks).toHaveBeenCalledTimes(1)
	})

	it('does not add when roomID is undefined', () => {
		const { port, instance } = createOSCInstance(1234)
		triggerMessage(port, '/roomosc/pairedRoomList', [makeArg('i', 1), makeArg('i', 0), makeArg('s', 'Paired Room One')])
		expect(instance.state.pairedRooms).toHaveLength(0)
	})
})
