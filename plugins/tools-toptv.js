// plugins/tools-toptv.js
import pkg from '@fuxxy-star/baileys'
const { generateWAMessageContent } = pkg

let handler = async (m, { sock, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''

    if (!/webp|image|video|gif|viewOnce/g.test(mime)) {
        return m.reply(`Reply Media dengan perintah\n\n${usedPrefix + command}`)
    }

    let media
    try {
        media = await q.download?.()
    } catch {
        return m.reply('Gagal mengunduh media.')
    }

    await m.reply(global.wait || '⏳ Processing...')

    try {
        let msg = await generateWAMessageContent(
            { video: media },
            { upload: sock.waUploadToServer }
        )

        await sock.relayMessage(
            m.key.remoteJid,
            { ptvMessage: msg.videoMessage },
            { quoted: m }
        )

    } catch (e) {
        try {
            let dataVideo = {
                ptvMessage: m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage
            }

            if (!dataVideo.ptvMessage) throw new Error('Tidak ada videoMessage di quoted.')

            await sock.relayMessage(
                m.key.remoteJid,
                dataVideo,
                {}
            )
        } catch (err) {
            console.error(err)
            await m.reply(global.eror || 'Terjadi kesalahan.')
        }
    }
}

handler.help = ['toptv (reply)']
handler.tags = ['tools']
handler.command = /^(toptv)$/i

export default handler