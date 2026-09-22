import { Regex, SomeCompanionConfigField } from '@companion-module/base'

export interface ZoomRoomsConfig {
	host: string
	tx_port: number
	rx_port: number
	oscOutputHeader: string
	pollInterval: number
	roomListInterval: number
	stalenessTimeoutSec: number
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
			label: 'Poll Interval (how often to request per-room status from CAVZRC)',
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
		{
			type: 'dropdown',
			id: 'roomListInterval',
			label: 'Room List Refresh (full added/paired room lists)',
			width: 6,
			default: 0,
			choices: [
				{ id: 0, label: 'On connect only (recommended)' },
				{ id: 30000, label: '30 seconds' },
				{ id: 60000, label: '60 seconds' },
				{ id: 300000, label: '5 minutes' },
			],
		},
		{
			type: 'dropdown',
			id: 'stalenessTimeoutSec',
			label: 'No-data warning: mark CAVZRC unreachable after',
			width: 6,
			default: 60,
			choices: [
				{ id: 0, label: 'Disabled' },
				{ id: 30, label: '30 seconds of silence' },
				{ id: 60, label: '60 seconds of silence' },
				{ id: 120, label: '2 minutes of silence' },
				{ id: 300, label: '5 minutes of silence' },
			],
		},
	]
}
