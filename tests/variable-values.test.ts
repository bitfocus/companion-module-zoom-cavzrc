import type { CompanionVariableValues } from '@companion-module/base'
import {
	updateAddedRoomsCount,
	updatePairedRoomsCount,
	updateAddedRoomsList,
	updatePairedRoomsList,
} from '../src/variables/variable-values.js'
import type { ZoomRoomsInstance } from '../src/utils.js'

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
	it('writes added_rooms_count to variables object', () => {
		const { instance, setVariableValues } = makeMockInstance({ addedRoomsCount: 5 })
		const variables: CompanionVariableValues = {}
		updateAddedRoomsCount(instance, variables)
		expect(variables['added_rooms_count']).toBe(5)
		expect(setVariableValues).not.toHaveBeenCalled()
	})

	it('writes added_rooms_count as 0 when state is 0', () => {
		const { instance, setVariableValues } = makeMockInstance({ addedRoomsCount: 0 })
		const variables: CompanionVariableValues = {}
		updateAddedRoomsCount(instance, variables)
		expect(variables['added_rooms_count']).toBe(0)
		expect(setVariableValues).not.toHaveBeenCalled()
	})
})

describe('updatePairedRoomsCount', () => {
	it('writes paired_rooms_count to variables object', () => {
		const { instance, setVariableValues } = makeMockInstance({ pairedRoomsCount: 3 })
		const variables: CompanionVariableValues = {}
		updatePairedRoomsCount(instance, variables)
		expect(variables['paired_rooms_count']).toBe(3)
		expect(setVariableValues).not.toHaveBeenCalled()
	})

	it('writes paired_rooms_count as 0 when state is 0', () => {
		const { instance, setVariableValues } = makeMockInstance({ pairedRoomsCount: 0 })
		const variables: CompanionVariableValues = {}
		updatePairedRoomsCount(instance, variables)
		expect(variables['paired_rooms_count']).toBe(0)
		expect(setVariableValues).not.toHaveBeenCalled()
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
		const variables: CompanionVariableValues = {}
		updateAddedRoomsList(instance, variables)
		expect(variables['added_rooms_list']).toBe('Room One, Room Two')
		expect(setVariableValues).not.toHaveBeenCalled()
	})

	it('returns "—" when addedRooms is empty', () => {
		const { instance, setVariableValues } = makeMockInstance({ addedRooms: [] })
		const variables: CompanionVariableValues = {}
		updateAddedRoomsList(instance, variables)
		expect(variables['added_rooms_list']).toBe('—')
		expect(setVariableValues).not.toHaveBeenCalled()
	})

	it('filters out rooms with empty names', () => {
		const { instance, setVariableValues } = makeMockInstance({
			addedRooms: [
				{ roomID: 'r1', roomName: 'Room One', roomIndex: 0 },
				{ roomID: 'r2', roomName: '', roomIndex: 1 },
			],
		})
		const variables: CompanionVariableValues = {}
		updateAddedRoomsList(instance, variables)
		expect(variables['added_rooms_list']).toBe('Room One')
		expect(setVariableValues).not.toHaveBeenCalled()
	})

	it('returns "—" when all room names are empty', () => {
		const { instance, setVariableValues } = makeMockInstance({
			addedRooms: [{ roomID: 'r1', roomName: '', roomIndex: 0 }],
		})
		const variables: CompanionVariableValues = {}
		updateAddedRoomsList(instance, variables)
		expect(variables['added_rooms_list']).toBe('—')
		expect(setVariableValues).not.toHaveBeenCalled()
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
		const variables: CompanionVariableValues = {}
		updatePairedRoomsList(instance, variables)
		expect(variables['paired_rooms_list']).toBe('Paired One, Paired Two')
		expect(setVariableValues).not.toHaveBeenCalled()
	})

	it('returns "—" when pairedRooms is empty', () => {
		const { instance, setVariableValues } = makeMockInstance({ pairedRooms: [] })
		const variables: CompanionVariableValues = {}
		updatePairedRoomsList(instance, variables)
		expect(variables['paired_rooms_list']).toBe('—')
		expect(setVariableValues).not.toHaveBeenCalled()
	})

	it('filters out rooms with empty names', () => {
		const { instance, setVariableValues } = makeMockInstance({
			pairedRooms: [
				{ roomID: 'p1', roomName: 'Paired One', roomIndex: 0 },
				{ roomID: 'p2', roomName: '', roomIndex: 1 },
			],
		})
		const variables: CompanionVariableValues = {}
		updatePairedRoomsList(instance, variables)
		expect(variables['paired_rooms_list']).toBe('Paired One')
		expect(setVariableValues).not.toHaveBeenCalled()
	})

	it('returns "—" when all room names are empty', () => {
		const { instance, setVariableValues } = makeMockInstance({
			pairedRooms: [{ roomID: 'p1', roomName: '', roomIndex: 0 }],
		})
		const variables: CompanionVariableValues = {}
		updatePairedRoomsList(instance, variables)
		expect(variables['paired_rooms_list']).toBe('—')
		expect(setVariableValues).not.toHaveBeenCalled()
	})
})

describe('updateVariableValues', () => {
	it('assigns slots positionally by sorted CAVZRC index, not by raw roomIndex', () => {
		const { instance, setVariableValues } = makeMockInstance({
			pairedRooms: [
				{ roomID: 'roomB', roomName: 'Room B', roomIndex: 2 },
				{ roomID: 'roomA', roomName: 'Room A', roomIndex: 1 },
			],
			rooms: {
				roomA: { roomID: 'roomA', roomName: 'Room A', roomIndex: 1, participantCount: 7 },
				roomB: { roomID: 'roomB', roomName: 'Room B', roomIndex: 2, participantCount: 3 },
			},
		})
		const { updateVariableValues } = jest.requireActual('../src/variables/variable-values.js')
		updateVariableValues(instance)
		const vars = setVariableValues.mock.calls[0][0]
		expect(vars['room_1_id']).toBe('roomA')
		expect(vars['room_1_participant_count']).toBe(7)
		expect(vars['room_2_id']).toBe('roomB')
		expect(vars['room_2_participant_count']).toBe(3)
		expect(vars['room_1_cavzrc_index']).toBe(1)
	})

	it('clears stale slots above the current room count', () => {
		const { instance, setVariableValues } = makeMockInstance({
			pairedRooms: [{ roomID: 'roomA', roomName: 'Room A', roomIndex: 1 }],
			rooms: { roomA: { roomID: 'roomA', roomName: 'Room A', roomIndex: 1 } },
		})
		const { updateVariableValues } = jest.requireActual('../src/variables/variable-values.js')
		updateVariableValues(instance as never)
		const vars = setVariableValues.mock.calls[0][0]
		expect(vars['room_1_id']).toBe('roomA')
		expect(vars['room_2_id']).toBe('—')
		expect(vars['room_2_participant_count']).toBe('—')
	})

	it('sorts rooms with a missing index after indexed rooms', () => {
		const { instance, setVariableValues } = makeMockInstance({
			pairedRooms: [
				{ roomID: 'noIndex', roomName: 'No Index' } as never,
				{ roomID: 'roomA', roomName: 'Room A', roomIndex: 1 },
			],
			rooms: {},
		})
		const { updateVariableValues } = jest.requireActual('../src/variables/variable-values.js')
		updateVariableValues(instance)
		const vars = setVariableValues.mock.calls[0][0]
		expect(vars['room_1_id']).toBe('roomA')
		expect(vars['room_2_id']).toBe('noIndex')
	})
})
