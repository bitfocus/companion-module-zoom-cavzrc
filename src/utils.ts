import type { InstanceBase } from '@companion-module/base'
import type { ZoomRoomsConfig } from './config.js'
import type { OSC } from './osc.js'

export type TargetType = 'roomID' | 'roomName' | 'roomIndex' | 'allRooms'

export interface RoomInfo {
	roomID: string
	roomName: string
	roomIndex: number
}

export interface RoomState {
	roomID: string
	roomName: string
	roomIndex: number
	meetingStatus?: string
	participantCount?: number
	muteStatus?: boolean
	cameraStatus?: boolean
	selectedPrimaryCamera?: string
	selectedMic?: string
	selectedSpeaker?: string
	overlayConfig?: {
		namePosition: number
		showNametag: boolean
		showEmoji: boolean
		showHand: boolean
		showBorder: boolean
	}
}

export interface CavzrcState {
	addedRooms: RoomInfo[]
	pairedRooms: RoomInfo[]
	addedRoomsCount: number
	pairedRoomsCount: number
	rooms: Record<string, RoomState>
}

export function createDefaultState(): CavzrcState {
	return {
		addedRooms: [],
		pairedRooms: [],
		addedRoomsCount: 0,
		pairedRoomsCount: 0,
		rooms: {},
	}
}

export interface ZoomRoomsInstance extends InstanceBase<ZoomRoomsConfig> {
	config: ZoomRoomsConfig
	state: CavzrcState
	OSC: OSC | null
	updateVariableValues: () => void
}
