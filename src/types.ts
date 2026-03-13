import type { InstanceBase } from '@companion-module/base'
import type { ZoomRoomsConfig } from './config.js'
import type { CavzrcState } from './utils.js'
import type { OSC } from './osc.js'

export interface ZoomRoomsInstance extends InstanceBase<ZoomRoomsConfig> {
	config: ZoomRoomsConfig
	state: CavzrcState
	OSC: OSC | null
	updateVariableValues: () => void
}
