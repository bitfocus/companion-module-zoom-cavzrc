import type { CompanionFeedbackDefinition } from '@companion-module/base'
import type { ZoomRoomsInstance } from '../utils.js'
import { getRoomOption } from './feedback-utils.js'

export enum FeedbackIdChannelStatus {
	HwioChannelActive = 'hwio_channel_active',
	HwioChannelSelection = 'hwio_channel_selection',
}

function hwioChannelOption(instance: ZoomRoomsInstance) {
	const choices: { id: string; label: string }[] = [{ id: '', label: '(Select channel)' }]
	for (const room of Object.values(instance.state.rooms)) {
		for (const name of Object.keys(room.hwioChannels ?? {})) {
			choices.push({ id: name, label: `${room.roomName || room.roomID}: ${name}` })
		}
	}
	return {
		type: 'dropdown' as const,
		label: 'HWIO channel',
		id: 'channelName',
		default: '',
		choices,
	}
}

export function GetFeedbacksChannelStatus(instance: ZoomRoomsInstance): {
	[id in FeedbackIdChannelStatus]: CompanionFeedbackDefinition | undefined
} {
	const roomOpt = getRoomOption(instance)
	const channelOpt = hwioChannelOption(instance)

	const feedbacks: { [id in FeedbackIdChannelStatus]: CompanionFeedbackDefinition | undefined } = {
		[FeedbackIdChannelStatus.HwioChannelActive]: {
			type: 'boolean',
			name: 'HWIO channel active',
			description: 'True when the selected HWIO output channel is active (routed)',
			defaultStyle: { bgcolor: 0x00ff00 },
			options: [roomOpt, channelOpt],
			callback: (feedback) => {
				const roomId = feedback.options.roomId as string
				const channelName = feedback.options.channelName as string
				if (!roomId || !channelName) return false
				return instance.state.rooms[roomId]?.hwioChannels?.[channelName]?.isActive === true
			},
		},

		[FeedbackIdChannelStatus.HwioChannelSelection]: {
			type: 'boolean',
			name: 'HWIO channel selection matches',
			description:
				'True when the selected HWIO output channel routes the given selection (e.g. a participant name). Empty match value = channel has no selection.',
			defaultStyle: { bgcolor: 0x00ff00 },
			options: [
				roomOpt,
				channelOpt,
				{
					type: 'textinput',
					label: 'Selection (empty = not routed)',
					id: 'selection',
					default: '',
				},
			],
			callback: (feedback) => {
				const roomId = feedback.options.roomId as string
				const channelName = feedback.options.channelName as string
				const expected = (feedback.options.selection as string) ?? ''
				if (!roomId || !channelName) return false
				const channel = instance.state.rooms[roomId]?.hwioChannels?.[channelName]
				if (!channel) return false
				return (channel.selection ?? '') === expected
			},
		},
	}

	return feedbacks
}