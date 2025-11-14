import * as jimp from "jimp"

let handler = async (m, { conn, command, usedPrefix, isROwner }) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (!isROwner) throw '*Khusus Owner Bot!*'
	if (/image/g.test(mime) && !/webp/g.test(mime)) {
		try {
			let media = await q.download()
			let { img } = await convertImage(media)

			await conn.query({
				tag: 'iq',
				attrs: {
					to: m.chat,
					type: 'set',
					xmlns: 'w:profile:picture'
				},
				content: [
					{
						tag: 'picture',
						attrs: { type: 'image' },
						content: img
					}
				]
			})

			m.reply(`*Foto profil grup berhasil diganti!*`)
		} catch (e) {
			console.error(e)
			m.reply(`*Terjadi kesalahan, coba lagi nanti.*`)
		}
	} else {
		m.reply(`*Kirim atau balas gambar dengan caption ${usedPrefix + command}*`)
	}
}

handler.help = ['setppgcpanjang']
handler.tags = ['group']
handler.command = /^(setppgcpanjang)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler

async function convertImage(media) {
	const image = await jimp.read(media)
	return {
		img: await image.getBufferAsync(jimp.MIME_JPEG),
		preview: await image.clone().normalize().getBufferAsync(jimp.MIME_JPEG)
	}
}