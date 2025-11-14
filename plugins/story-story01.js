import { stories } from '../lib/story.js'

let handler = async (m, { conn }) => {
	let text = stories.story1;
	conn.sendMessage(m.chat, {
		text: text,
		contextInfo: {
			externalAdReply: {
				title: global.namebot,
				body: wm,
				thumbnailUrl: global.thumb,
				mediaType: 1,
				renderLargerThumbnail: true
			}
		}
	})
}
handler.help = ['story01 *<level_06>*']
handler.tags= ['story']
handler.command = /^(story01)$/i;
handler.register = true
handler.level = 6

export default handler;