import https from "https"
import { sticker } from "../lib/sticker.js"

let handler = async (m, { conn, text }) => {
    try {
        let buffer = await IBuffer(`https://api.botcahx.eu.org/api/sticker/patrick?apikey=jagaamanah`)
        let stiker = await sticker(buffer, false, global.packname, global.author)        
        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'brat.webp', '', m)
        }
    } catch (e) {
        throw e
    }
}

handler.help = ["patrick"]
handler.tags = ["sticker"]
handler.command = /^(patrick)$/i
handler.limit = true
handler.premium = false

export default handler

async function IBuffer(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = []
            res.on('data', chunk => data.push(chunk))
            res.on('end', () => resolve(Buffer.concat(data)))
            res.on('error', reject)
        })
    })
}