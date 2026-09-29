import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ZoomRoomsInstance } from './utils.js'
import { FeedbackIdRoomStatus, GetFeedbacksRoomStatus } from './feedbacks/feedback-room-status.js'
import { FeedbackIdChannelStatus, GetFeedbacksChannelStatus } from './feedbacks/feedback-channels.js'

export function GetFeedbacks(instance: ZoomRoomsInstance): CompanionFeedbackDefinitions {
	const feedbacksRoomStatus: { [id in FeedbackIdRoomStatus]: CompanionFeedbackDefinition | undefined } =
		GetFeedbacksRoomStatus(instance)
	const feedbacksChannelStatus: { [id in FeedbackIdChannelStatus]: CompanionFeedbackDefinition | undefined } =
		GetFeedbacksChannelStatus(instance)

	return {
		...feedbacksRoomStatus,
		...feedbacksChannelStatus,
	}
}