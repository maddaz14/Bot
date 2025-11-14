/*ubed bot
api ; api.ubed.my.id
*/
import fetch from 'node-fetch'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw `Contoh:\n${usedPrefix + command} <kode HTML>\n\nContoh:\n${usedPrefix + command} <h1>Hello World</h1>`

    try {
        // Kirim emoji reaksi 🌐 saat mulai memproses
        await conn.sendMessage(m.chat, { react: { text: '🌐', key: m.key } })

        let res = await fetch(`https://api.ubed.my.id/tool/htmltoimage?apikey=ubed2407&html=${encodeURIComponent(text)}`)
        if (!res.ok) throw await res.text()
        let buffer = await res.buffer()

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: '✅ *Berhasil mengubah HTML ke gambar!*'
        }, {
            quoted: m
        })

        // Ganti emoji reaksi jadi ✅ saat berhasil
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal memproses HTML.\n\n${e}`
    }
}

handler.help = ['htmltoimage <html>']
handler.tags = ['tools']
handler.command = /^htmltoimage$/i
handler.limit = true

export default handler