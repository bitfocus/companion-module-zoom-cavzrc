import { CompanionPresetExt, btn } from './preset-utils.js'
import { ActionIdOverlays } from '../actions/action-overlays.js'

export enum PresetIdOverlays {
	EnableNametag = 'enable_nametag',
	DisableNametag = 'disable_nametag',
	EnableEmoji = 'enable_emoji',
	DisableEmoji = 'disable_emoji',
}

const defaultOpts = { targetType: 'roomIndex', roomIndex: 1 }

export function GetPresetsOverlays(): { [id in PresetIdOverlays]: CompanionPresetExt | undefined } {
	const presets: { [id in PresetIdOverlays]: CompanionPresetExt | undefined } = {
		[PresetIdOverlays.EnableNametag]: btn(
			'Name tag on',
			'Overlays',
			ActionIdOverlays.enableNameTagOverlay,
			defaultOpts,
		),

		[PresetIdOverlays.DisableNametag]: btn(
			'Name tag off',
			'Overlays',
			ActionIdOverlays.disableNameTagOverlay,
			defaultOpts,
		),

		[PresetIdOverlays.EnableEmoji]: btn('Emoji on', 'Overlays', ActionIdOverlays.enableEmojiOverlay, defaultOpts),

		[PresetIdOverlays.DisableEmoji]: btn('Emoji off', 'Overlays', ActionIdOverlays.disableEmojiOverlay, defaultOpts),
	}

	return presets
}
