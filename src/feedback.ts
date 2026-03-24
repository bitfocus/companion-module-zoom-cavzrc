import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ZoomRoomsInstance } from './utils.js'
import { FeedbackIdRoomStatus, GetFeedbacksRoomStatus } from './feedbacks/feedback-room-status.js'

export function GetFeedbacks(instance: ZoomRoomsInstance): CompanionFeedbackDefinitions {
	const feedbacksRoomStatus: { [id in FeedbackIdRoomStatus]: CompanionFeedbackDefinition | undefined } =
		GetFeedbacksRoomStatus(instance)

	const feedbacks: {
		[id in FeedbackIdRoomStatus]: CompanionFeedbackDefinition | undefined
	} = {
		...feedbacksRoomStatus,
	}

	return feedbacks
}
