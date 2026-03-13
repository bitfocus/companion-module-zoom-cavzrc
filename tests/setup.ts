jest.mock('osc', () => ({
	UDPPort: jest.fn().mockImplementation(() => ({
		send: jest.fn(),
		on: jest.fn(),
		open: jest.fn(),
		close: jest.fn(),
	})),
	writeMessage: jest.fn().mockReturnValue(Buffer.alloc(0)),
	readPacket: jest.fn().mockReturnValue(null),
}))

jest.mock('dgram', () => ({
	createSocket: jest.fn().mockReturnValue({
		send: jest.fn(),
		bind: jest.fn(),
		close: jest.fn(),
		on: jest.fn(),
		address: jest.fn().mockReturnValue({ port: 0 }),
	}),
}))
