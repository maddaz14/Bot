import axios from 'axios'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn }) => {
    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const apiUrl = `https://api.ubed.my.id/sticker/dinokuning?apikey=ubed2407`
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' })

        const sticker = new Sticker(response.data, {
            pack: 'Stiker By',
            author: 'ubed Bot',
            type: 'image/png',
        })

        const buffer = await sticker.toBuffer()
        let sentMsg = await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '🦖', key: sentMsg.key } })
    } catch (error) {
        console.error(error)
        await conn.reply(m.chat, 'Gagal membuat stiker dino kuning. Coba lagi nanti.', m)
    }
}

handler.help = ['dinokuning']
handler.tags = ['sticker']
handler.command = /^dinokuning$/i
handler.limit = 3
handler.register = true

export default handler