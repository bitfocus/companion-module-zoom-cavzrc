import { Regex, SomeCompanionConfigField } from '@companion-module/base'

export interface ZoomRoomsConfig {
	host: string
	tx_port: number
	rx_port: number
	oscOutputHeader: string
	pollInterval: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'CAVZRC host (IP)',
			width: 6,
			default: '127.0.0.1',
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'tx_port',
			label: 'Receiving Port',
			width: 6,
			default: 9090,
			min: 1,
			max: 65535,
			step: 1,
		},
		{
			type: 'number',
			id: 'rx_port',
			label: 'Transmission Port.  Set to 0 = off)',
			width: 6,
			default: 1234,
			min: 0,
			max: 65535,
			step: 1,
		},
		{
			type: 'textinput',
			id: 'oscOutputHeader',
			label: 'OSC output header (must match CAVZRC)',
			width: 6,
			default: '/roomosc',
		},
		{
			type: 'dropdown',
			id: 'pollInterval',
			label: 'Poll Interval (how often to request room data from CAVZRC)',
			width: 6,
			default: 0,
			choices: [
				{ id: 0, label: 'Disabled' },
				{ id: 1000, label: '1 second' },
				{ id: 2500, label: '2.5 seconds' },
				{ id: 5000, label: '5 seconds' },
				{ id: 10000, label: '10 seconds' },
			],
		},
	]
}
