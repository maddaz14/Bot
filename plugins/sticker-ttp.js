let handler = async (m, { conn, text }) => {
    if (!text) throw 'Example: .ttp Hello'
    
    // Fetching TTP sticker URL
    let res = `https://api.lolhuman.xyz/api/ttp?apikey=${global.lolkey}&text=${encodeURIComponent(text)}`
    
    // Sending the TTP sticker
    conn.sendFile(m.chat, res, 'ttp_sticker.png', '', m, false, { asSticker: true })
}

handler.help = ['ttp <text>']
handler.tags = ['sticker']
handler.command = /^(ttp)$/i
handler.limit = true
handler.premium = false

export default handler