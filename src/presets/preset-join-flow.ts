import { CompanionPresetExt, colorWhite, colorBlack } from './preset-utils.js'
import { ActionIdJoinFlow } from '../actions/action-join-flow.js'

export enum PresetIdJoinFlow {
	JoinMeeting = 'join_meeting',
	LeaveMeeting = 'leave_meeting',
	StartMeeting = 'start_meeting',
}

export function GetPresetsJoinFlow(): { [id in PresetIdJoinFlow]: CompanionPresetExt | undefined } {
	const presets: { [id in PresetIdJoinFlow]: CompanionPresetExt | undefined } = {
		[PresetIdJoinFlow.JoinMeeting]: {
			type: 'button',
			category: 'Join / Leave',
			name: 'Join meeting',
			style: { text: 'Join', size: '18', color: colorWhite, bgcolor: colorBlack },
			steps: [{ down: [{ actionId: ActionIdJoinFlow.joinMeeting, options: {} }], up: [] }],
			feedbacks: [],
		},

		[PresetIdJoinFlow.LeaveMeeting]: {
			type: 'button',
			category: 'Join / Leave',
			name: 'Leave meeting',
			style: { text: 'Leave', size: '18', color: colorWhite, bgcolor: colorBlack },
			steps: [{ down: [{ actionId: ActionIdJoinFlow.leaveMeeting, options: {} }], up: [] }],
			feedbacks: [],
		},

		[PresetIdJoinFlow.StartMeeting]: {
			type: 'button',
			category: 'Join / Leave',
			name: 'Start meeting',
			style: { text: 'Start', size: '18', color: colorWhite, bgcolor: colorBlack },
			steps: [{ down: [{ actionId: ActionIdJoinFlow.startMeeting, options: {} }], up: [] }],
			feedbacks: [],
		},
	}

	return presets
}
