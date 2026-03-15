import { InstanceStatus } from '@companion-module/base'
import { UDPPort } from 'osc'
import type { OscArgument } from 'osc'
import type { ZoomRoomsInstance } from './types.js'

export class OSC {
	private readonly instance: ZoomRoomsInstance
	private udpPort: UDPPort | null = null
	private pollInterval: ReturnType<typeof setInterval> | null = null

	constructor(instance: ZoomRoomsInstance) {
		this.instance = instance
		this.connect()
	}

	private get host(): string {
		return this.instance.config.host || '127.0.0.1'
	}

	private get txPort(): number {
		return this.instance.config.tx_port || 9090
	}

	private get rxPort(): number {
		return this.instance.config.rx_port || 0
	}

	private get outputHeader(): string {
		const h = this.instance.config.oscOutputHeader || '/roomosc'
		return h.startsWith('/') ? h : `/${h}`
	}

	public sendCommand(path: string, args: (string | number | boolean)[] = []): void {
		this.instance.log('debug', `Sending OSC command: ${path} ${JSON.stringify(args)}`)
		if (!this.udpPort) return
		const oscArgs = args.map((a) => {
			if (typeof a === 'boolean') return { type: 'i', value: a ? 1 : 0 }
			if (typeof a === 'number') return Number.isInteger(a) ? { type: 'i', value: a } : { type: 'f', value: a }
			return { type: 's', value: String(a) }
		})
		try {
			this.udpPort.send({ address: path.startsWith('/') ? path : `/${path}`, args: oscArgs })
		} catch (e) {
			this.instance.log('error', `OSC send error: ${String(e)}`)
		}
	}

	private connect(): void {
		const rxPort = this.rxPort
		if (rxPort <= 0) {
			this.instance.log('info', 'rx_port is 0; not listening for OSC outputs')
		}

		const port = new UDPPort({
			localAddress: '0.0.0.0',
			localPort: rxPort > 0 ? rxPort : 0,
			remoteAddress: this.host,
			remotePort: this.txPort,
			metadata: true,
		})
		this.udpPort = port

		port.on('error', (err: Error) => {
			this.instance.updateStatus(InstanceStatus.UnknownError, `OSC socket error: ${err.message}`)
			if ((err as Error & { code?: string }).code === 'EADDRINUSE') {
				this.instance.log(
					'error',
					`Port ${rxPort} is already in use. Choose a different "Companion listen port" in this connection's config, or close the other app using that port.`,
				)
			} else {
				this.instance.log('error', `OSC socket error: ${err.message}`)
			}
		})

		if (rxPort > 0) {
			port.on('message', (msg) => {
				this.handleMessage(msg.address, msg.args)
			})
			port.on('ready', () => {
				this.instance.log('info', `Listening for CAVZRC OSC on port ${rxPort}`)
				this.instance.updateStatus(InstanceStatus.Ok, `Listening for CAVZRC OSC on port ${rxPort}`)
			})
		} else {
			this.instance.updateStatus(InstanceStatus.Ok, `Not listening for CAVZRC OSC (rx_port is 0)`)
		}

		this.pollInterval = setInterval(() => {
			this.sendCommand('/zoomRooms/getAddedRoomList', [])
			this.sendCommand('/zoomRooms/getPairedRoomList', [])
			this.sendCommand('/zoomRooms/getAddedRoomCount', [])
			this.sendCommand('/zoomRooms/getPairedRoomCount', [])
		}, 1000)

		port.open()
	}

	private handleMessage(address: string, args: OscArgument[]): void {
		this.instance.log('debug', `OSC message received: ${address} ${JSON.stringify(args)}`)
		const header = this.outputHeader
		if (!address.startsWith(header)) {
			return
		}
		const path = address.slice(header.length).replace(/^\/+/, '') || ''
		const state = this.instance.state

		if (path === 'addedRoomsCount') {
			const count = this.argInt(args, 0)
			if (count !== undefined) {
				state.addedRoomsCount = count
				this.instance.updateVariableValues()
				this.instance.checkFeedbacks()
			}
			return
		}
		if (path === 'pairedRoomsCount') {
			const count = this.argInt(args, 0)
			if (count !== undefined) {
				state.pairedRoomsCount = count
				this.instance.updateVariableValues()
				this.instance.checkFeedbacks()
			}
			return
		}
		if (path === 'addedRoomList') {
			const maxList = this.argInt(args, 0)
			const thisIndex = this.argInt(args, 1)
			const roomID = this.argStr(args, 2)
			const roomName = this.argStr(args, 3)
			if (roomID !== undefined && roomName !== undefined && thisIndex !== undefined) {
				if (thisIndex === 0) {
					state.addedRooms = []
				}
				while (state.addedRooms.length <= thisIndex) {
					state.addedRooms.push({ roomID: '', roomName: '', roomIndex: state.addedRooms.length + 1 })
				}
				state.addedRooms[thisIndex] = { roomID, roomName, roomIndex: thisIndex + 1 }
				if (thisIndex === (maxList ?? 1) - 1) {
					state.addedRooms = state.addedRooms.slice(0, maxList ?? thisIndex + 1)
				}
				this.instance.updateVariableValues()
				this.instance.checkFeedbacks()
			}
			return
		}
		if (path === 'pairedRoomList') {
			const maxList = this.argInt(args, 0)
			const thisIndex = this.argInt(args, 1)
			const roomID = this.argStr(args, 2)
			const roomName = this.argStr(args, 3)
			if (roomID !== undefined && roomName !== undefined && thisIndex !== undefined) {
				if (thisIndex === 0) {
					state.pairedRooms = []
				}
				while (state.pairedRooms.length <= thisIndex) {
					state.pairedRooms.push({ roomID: '', roomName: '', roomIndex: state.pairedRooms.length + 1 })
				}
				state.pairedRooms[thisIndex] = { roomID, roomName, roomIndex: thisIndex + 1 }
				if (thisIndex === (maxList ?? 1) - 1) {
					state.pairedRooms = state.pairedRooms.slice(0, maxList ?? thisIndex + 1)
				}
				this.instance.updateVariableValues()
				this.instance.checkFeedbacks()
			}
			return
		}

		// Room-specific outputs: prefix is roomID, roomName, roomIndex
		const roomID = this.argStr(args, 0)
		const roomName = this.argStr(args, 1)
		const roomIndex = this.argInt(args, 2)
		if (roomID !== undefined && path) {
			const key = roomID
			if (!state.rooms[key]) {
				state.rooms[key] = { roomID, roomName: roomName ?? '', roomIndex: roomIndex ?? 0 }
			}
			const room = state.rooms[key]
			if (roomName !== undefined) room.roomName = roomName
			if (roomIndex !== undefined) room.roomIndex = roomIndex

			if (path === 'meetingStatus') {
				room.meetingStatus = this.argStr(args, 3)
				this.instance.updateVariableValues()
				this.instance.checkFeedbacks()
			} else if (path === 'participantCount') {
				room.participantCount = this.argInt(args, 3)
				this.instance.updateVariableValues()
				this.instance.checkFeedbacks()
			} else if (path === 'muteStatus') {
				const v = args[3]
				room.muteStatus = v?.type === 'i' ? (v as { value: number }).value === 1 : (v as { value: boolean })?.value
				this.instance.updateVariableValues()
				this.instance.checkFeedbacks()
			} else if (path === 'cameraStatus') {
				const v = args[3]
				room.cameraStatus = v?.type === 'i' ? (v as { value: number }).value === 1 : (v as { value: boolean })?.value
				this.instance.updateVariableValues()
				this.instance.checkFeedbacks()
			} else if (path === 'selectedPrimaryCamera') {
				room.selectedPrimaryCamera = this.argStr(args, 3)
				this.instance.updateVariableValues()
			} else if (path === 'selectedMic') {
				room.selectedMic = this.argStr(args, 3)
				this.instance.updateVariableValues()
			} else if (path === 'selectedSpeaker') {
				room.selectedSpeaker = this.argStr(args, 3)
				this.instance.updateVariableValues()
			}
		}
	}

	private argStr(args: OscArgument[], i: number): string | undefined {
		const a = args[i]
		if (!a) return undefined
		if (typeof a.value === 'string') return a.value
		if (typeof a.value === 'number' || typeof a.value === 'boolean') return String(a.value)
		return undefined
	}

	private argInt(args: OscArgument[], i: number): number | undefined {
		const a = args[i]
		if (!a) return undefined
		if (typeof a.value === 'number') return a.value
		if (typeof a.value === 'string') return parseInt(a.value, 10)
		return undefined
	}

	public destroy(): void {
		if (this.pollInterval !== null) {
			clearInterval(this.pollInterval)
			this.pollInterval = null
		}
		if (this.udpPort) {
			this.udpPort.close()
			this.udpPort = null
		}
	}
}
