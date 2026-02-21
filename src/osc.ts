import type { InstanceBase } from '@companion-module/base'
import type { ZoomRoomsConfig } from './config.js'
import type { CavzrcState } from './utils.js'
const osc = require('osc') // eslint-disable-line
const dgram = require('dgram') // eslint-disable-line
export interface ZoomRoomsInstance extends InstanceBase<ZoomRoomsConfig> {
	config: ZoomRoomsConfig
	state: CavzrcState
	OSC: OSC | null
	updateVariableValues: () => void
}

export class OSC {
	private readonly instance: ZoomRoomsInstance
	private udpSocket: import('dgram').Socket | null = null
	private sendSocket: import('dgram').Socket | null = null

	constructor(instance: ZoomRoomsInstance) {
		this.instance = instance
		this.sendSocket = dgram.createSocket({ type: 'udp4' })
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
		const oscArgs = args.map((a) => (typeof a === 'boolean' ? (a ? 1 : 0) : a))
		const msg = { address: path.startsWith('/') ? path : `/${path}`, args: oscArgs }
		let buf: Buffer
		try {
			buf = Buffer.from(osc.writeMessage(msg))
		} catch (e) {
			this.instance.log('error', `OSC encode error: ${String(e)}`)
			return
		}
		if (!this.sendSocket) return
		this.sendSocket.send(buf, 0, buf.length, this.txPort, this.host, (err) => {
			if (err) this.instance.log('error', `OSC send error: ${err.message}`)
		})
	}

	private connect(): void {
		if (this.rxPort <= 0) {
			this.instance.log('info', 'rx_port is 0; not listening for OSC outputs')
			return
		}

		const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true })
		this.udpSocket = socket
		socket.on('error', (err: Error & { code?: string }) => {
			if (err.code === 'EADDRINUSE') {
				this.instance.log(
					'error',
					`Port ${this.rxPort} is already in use. Choose a different "Companion listen port" in this connection's config, or close the other app using that port.`,
				)
			} else {
				this.instance.log('error', `OSC socket error: ${err.message}`)
			}
		})
		socket.on('message', (msg: Buffer) => {
			try {
				const packet = osc.readPacket(msg, { metadata: true })
				if (packet && packet.address) {
					this.handleMessage(packet.address, packet.args || [])
				}
			} catch (e) {
				this.instance.log('debug', `OSC parse error: ${String(e)}`)
			}
		})
		socket.bind({ port: this.rxPort, address: '0.0.0.0' }, () => {
			this.instance.log('info', `Listening for CAVZRC OSC on port ${this.rxPort}`)
		})
	}

	private handleMessage(address: string, args: { type: string; value: unknown }[]): void {
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
		if (path === 'addedRoomsList') {
			const maxList = this.argInt(args, 0)
			const thisIndex = this.argInt(args, 1)
			const roomID = this.argStr(args, 2)
			const roomName = this.argStr(args, 3)
			if (roomID !== undefined && roomName !== undefined && thisIndex !== undefined) {
				while (state.addedRooms.length <= thisIndex) {
					state.addedRooms.push({ roomID: '', roomName: '', roomIndex: state.addedRooms.length + 1 })
				}
				state.addedRooms[thisIndex] = { roomID, roomName, roomIndex: thisIndex + 1 }
				if (thisIndex === (maxList ?? 1) - 1) {
					state.addedRooms = state.addedRooms.slice(0, maxList ?? thisIndex + 1)
					this.instance.updateVariableValues()
					this.instance.checkFeedbacks()
				}
			}
			return
		}
		if (path === 'pairedRoomsList') {
			const maxList = this.argInt(args, 0)
			const thisIndex = this.argInt(args, 1)
			const roomID = this.argStr(args, 2)
			const roomName = this.argStr(args, 3)
			if (roomID !== undefined && roomName !== undefined && thisIndex !== undefined) {
				while (state.pairedRooms.length <= thisIndex) {
					state.pairedRooms.push({ roomID: '', roomName: '', roomIndex: state.pairedRooms.length + 1 })
				}
				state.pairedRooms[thisIndex] = { roomID, roomName, roomIndex: thisIndex + 1 }
				if (thisIndex === (maxList ?? 1) - 1) {
					state.pairedRooms = state.pairedRooms.slice(0, maxList ?? thisIndex + 1)
					this.instance.updateVariableValues()
					this.instance.checkFeedbacks()
				}
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

	private argStr(args: { type: string; value: unknown }[], i: number): string | undefined {
		const a = args[i]
		if (!a) return undefined
		if (typeof a.value === 'string') return a.value
		if (typeof a.value === 'number' || typeof a.value === 'boolean') return String(a.value)
		return undefined
	}

	private argInt(args: { type: string; value: unknown }[], i: number): number | undefined {
		const a = args[i]
		if (!a) return undefined
		if (typeof a.value === 'number') return a.value
		if (typeof a.value === 'string') return parseInt(a.value, 10)
		return undefined
	}

	public destroy(): void {
		if (this.udpSocket) {
			this.udpSocket.close()
			this.udpSocket = null
		}
		if (this.sendSocket) {
			this.sendSocket.close()
			this.sendSocket = null
		}
	}
}
