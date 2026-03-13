declare module 'osc' {
	interface OscArgument {
		type: string
		value: unknown
	}

	interface OscMessage {
		address: string
		args: OscArgument[]
	}

	interface UDPPortOptions {
		localAddress?: string
		localPort?: number
		remoteAddress?: string
		remotePort?: number
		broadcast?: boolean
		metadata?: boolean
	}

	class UDPPort {
		constructor(options: UDPPortOptions)
		on(event: 'message', listener: (message: OscMessage, timeTag: unknown, info: unknown) => void): this
		on(event: 'error', listener: (err: Error) => void): this
		on(event: 'ready', listener: () => void): this
		on(event: string, listener: (...args: unknown[]) => void): this
		open(): void
		close(): void
		send(message: { address: string; args: (string | number)[] }): void
	}

	function writeMessage(message: { address: string; args: unknown[] }): ArrayBuffer
	function readPacket(data: Buffer, options?: { metadata?: boolean }): OscMessage
}
