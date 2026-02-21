import { Regex, SomeCompanionConfigField } from '@companion-module/base'

export interface ZoomRoomsConfig {
	host: string
	tx_port: number
	rx_port: number
	oscOutputHeader: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			label: 'CAVZRC OSC',
			width: 12,
			value:
				'Same machine (127.0.0.1) works: both apps use different ports. Match CAVZRC’s OSC Settings: "CAVZRC Receiving Port" = CAVZRC’s Receiving Port (we send commands there). "Companion listen port" = CAVZRC’s Transmission Port (CAVZRC sends feedback there). In CAVZRC set Transmission IP to 127.0.0.1 when both run on this machine.',
		},
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
			label: 'CAVZRC Receiving Port (= CAVZRC’s "Receiving Port", we send commands here)',
			width: 6,
			default: 9090,
			min: 1,
			max: 65535,
			step: 1,
		},
		{
			type: 'number',
			id: 'rx_port',
			label: 'Companion listen port (= CAVZRC’s "Transmission Port", 0 = off)',
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
	]
}
