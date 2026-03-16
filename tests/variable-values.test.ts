import {
	updateAddedRoomsCount,
	updatePairedRoomsCount,
	updateAddedRoomsList,
	updatePairedRoomsList,
} from '../src/variables/variable-values.js'
import type { ZoomRoomsInstance } from '../src/types.js'

function makeMockInstance(stateOverrides: Partial<ZoomRoomsInstance['state']> = {}): {
	instance: ZoomRoomsInstance
	setVariableValues: jest.Mock
} {
	const setVariableValues = jest.fn()
	const instance = {
		state: {
			addedRooms: [],
			pairedRooms: [],
			addedRoomsCount: 0,
			pairedRoomsCount: 0,
			rooms: {},
			...stateOverrides,
		},
		setVariableValues,
	} as unknown as ZoomRoomsInstance
	return { instance, setVariableValues }
}

describe('updateAddedRoomsCount', () => {
	it('sets added_rooms_count to state value', () => {
		const { instance, setVariableValues } = makeMockInstance({ addedRoomsCount: 5 })
		updateAddedRoomsCount(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ added_rooms_count: 5 })
	})

	it('sets added_rooms_count to 0 when state is 0', () => {
		const { instance, setVariableValues } = makeMockInstance({ addedRoomsCount: 0 })
		updateAddedRoomsCount(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ added_rooms_count: 0 })
	})
})

describe('updatePairedRoomsCount', () => {
	it('sets paired_rooms_count to state value', () => {
		const { instance, setVariableValues } = makeMockInstance({ pairedRoomsCount: 3 })
		updatePairedRoomsCount(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ paired_rooms_count: 3 })
	})

	it('sets paired_rooms_count to 0 when state is 0', () => {
		const { instance, setVariableValues } = makeMockInstance({ pairedRoomsCount: 0 })
		updatePairedRoomsCount(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ paired_rooms_count: 0 })
	})
})

describe('updateAddedRoomsList', () => {
	it('joins room names with ", "', () => {
		const { instance, setVariableValues } = makeMockInstance({
			addedRooms: [
				{ roomID: 'r1', roomName: 'Room One', roomIndex: 0 },
				{ roomID: 'r2', roomName: 'Room Two', roomIndex: 1 },
			],
		})
		updateAddedRoomsList(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ added_rooms_list: 'Room One, Room Two' })
	})

	it('returns "—" when addedRooms is empty', () => {
		const { instance, setVariableValues } = makeMockInstance({ addedRooms: [] })
		updateAddedRoomsList(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ added_rooms_list: '—' })
	})

	it('filters out rooms with empty names', () => {
		const { instance, setVariableValues } = makeMockInstance({
			addedRooms: [
				{ roomID: 'r1', roomName: 'Room One', roomIndex: 0 },
				{ roomID: 'r2', roomName: '', roomIndex: 1 },
			],
		})
		updateAddedRoomsList(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ added_rooms_list: 'Room One' })
	})

	it('returns "—" when all room names are empty', () => {
		const { instance, setVariableValues } = makeMockInstance({
			addedRooms: [{ roomID: 'r1', roomName: '', roomIndex: 0 }],
		})
		updateAddedRoomsList(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ added_rooms_list: '—' })
	})
})

describe('updatePairedRoomsList', () => {
	it('joins room names with ", "', () => {
		const { instance, setVariableValues } = makeMockInstance({
			pairedRooms: [
				{ roomID: 'p1', roomName: 'Paired One', roomIndex: 0 },
				{ roomID: 'p2', roomName: 'Paired Two', roomIndex: 1 },
			],
		})
		updatePairedRoomsList(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ paired_rooms_list: 'Paired One, Paired Two' })
	})

	it('returns "—" when pairedRooms is empty', () => {
		const { instance, setVariableValues } = makeMockInstance({ pairedRooms: [] })
		updatePairedRoomsList(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ paired_rooms_list: '—' })
	})

	it('filters out rooms with empty names', () => {
		const { instance, setVariableValues } = makeMockInstance({
			pairedRooms: [
				{ roomID: 'p1', roomName: 'Paired One', roomIndex: 0 },
				{ roomID: 'p2', roomName: '', roomIndex: 1 },
			],
		})
		updatePairedRoomsList(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ paired_rooms_list: 'Paired One' })
	})

	it('returns "—" when all room names are empty', () => {
		const { instance, setVariableValues } = makeMockInstance({
			pairedRooms: [{ roomID: 'p1', roomName: '', roomIndex: 0 }],
		})
		updatePairedRoomsList(instance)
		expect(setVariableValues).toHaveBeenCalledWith({ paired_rooms_list: '—' })
	})
})
