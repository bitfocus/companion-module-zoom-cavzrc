import type { CompanionActionDefinitions } from '@companion-module/base'

export function invoke(action: CompanionActionDefinitions[string], options: Record<string, unknown>): void {
	const cb = (action as unknown as { callback: (a: { options: Record<string, unknown> }) => void }).callback
	cb({ options })
}
