import { sticker5 } from '../lib/sticker.js'
let handler = async (m, { conn, text, usedPrefix, command }) => {
let stiker = await sticker5(null, `https://telegra.ph/file/99bc4314bf4ee696c4636.jpg`, global.packname, global.author)
    if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
}

handler.customPrefix = /^(nyimak)$/i;
handler.command = new RegExp();
export default handler