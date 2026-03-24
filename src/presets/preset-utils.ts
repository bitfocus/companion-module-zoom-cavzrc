import type { CompanionPresetDefinitions, CompanionOptionValues } from '@companion-module/base'

export type CompanionPresetExt = CompanionPresetDefinitions[string]

export const colorWhite = 0xffffff
export const colorBlack = 0x000000
export const colorLightGray = 0xaaaaaa

export function btn(
	text: string,
	category: string,
	actionId: string,
	options: CompanionOptionValues = {},
): CompanionPresetExt {
	return {
		type: 'button',
		category,
		name: text,
		style: { text, size: '14', color: colorWhite, bgcolor: colorBlack },
		steps: [{ down: [{ actionId, options }], up: [] }],
		feedbacks: [],
	}
}
