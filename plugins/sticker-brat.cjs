const fetch = require('node-fetch')
const { Sticker, StickerTypes } = require('wa-sticker-formatter')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `✳️ Contoh penggunaan:\n${usedPrefix + command} fuxxy`

    try {
        const apiUrl = `https://api.zenzxz.my.id/api/maker/brat?text=${encodeURIComponent(text)}`
        const res = await fetch(apiUrl)
        if (!res.ok) throw `Gagal mengakses API (${res.status})`

        const contentType = res.headers.get('content-type') || ''
        let imageBuffer

        if (contentType.startsWith('image/')) {
            imageBuffer = await res.buffer()
        } else if (contentType.includes('application/json')) {
            const json = await res.json()
            const imageUrl = json.url || json.result || json.image || json.data?.url
            if (!imageUrl) throw 'Tidak menemukan URL gambar dalam response JSON.'
            const imgRes = await fetch(imageUrl)
            imageBuffer = await imgRes.buffer()
        } else {
            const txt = await res.text()
            const match = txt.match(/https?:\/\/\S+\.(png|jpe?g|webp|gif)/i)
            if (!match) throw 'API tidak mengembalikan gambar yang valid.'
            const imgRes = await fetch(match[0])
            imageBuffer = await imgRes.buffer()
        }

        const stiker = new Sticker(imageBuffer, {
            author: global.botname,
            type: StickerTypes.FULL,
            quality: 70,
        })

        const buffer = await stiker.toBuffer()
        await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })

    } catch (e) {
        console.error(e)
        throw `❌ Terjadi kesalahan saat membuat stiker brat.\n\n> ${e.message || e}`
    }
}

handler.help = ['brat <teks>']
handler.tags = ['sticker']
handler.command = /^(brat)$/i

module.exports = handler