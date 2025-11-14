import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!args[0]) {
        throw `*⛌ Masukan Emoji yang ingin kamu gabungkan*\n\n*• Contoh:*\n${usedPrefix + command} 🐱+👻\n\n[ minimal 2 emoji ]`
    }

    let [emoji1, emoji2] = text.split`+`
    if (!emoji1 || !emoji2) {
        throw `Format salah!\nGunakan: ${usedPrefix + command} 🐱+👻`
    }

    const res = await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
    const anu = await res.json()

    if (!anu.results || !anu.results[0]) {
        throw '❌ Kombinasi Emojimix tidak ditemukan.'
    }

    let emix = anu.results[0].media_formats.png_transparent.url
    let stiker = await sticker(false, emix, global.packname || 'StickerBot', global.author || 'Bot')

    await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
}

handler.help = ['emojimix 🐱+👻']
handler.tags = ['sticker']
handler.command = /^(emojimix|emix)$/i

export default handler