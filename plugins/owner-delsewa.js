let handler = async (m, { conn, args, usedPrefix, command }) => {
    let id

    // Jika ada argumen dan mengandung link grup WhatsApp
    if (args[0]) {
        let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
        let match = args[0].match(linkRegex)
        if (!match) return conn.reply(m.chat, '❌ Link grup tidak valid.', m)
        
        let code = match[1]
        try {
            id = await conn.groupAcceptInvite(code) // Join grup untuk ambil ID
            await conn.groupLeave(id) // Keluar agar tidak tertinggal
        } catch (e) {
            return conn.reply(m.chat, '❌ Gagal mengambil ID grup dari link. Pastikan bot belum tergabung atau link aktif.', m)
        }
    } else {
        if (!m.isGroup) return conn.reply(m.chat, '❌ Perintah ini hanya bisa dipakai di grup atau sertakan link grup.', m)
        id = m.chat
    }

    // Pastikan data grup tersedia
    if (!global.db.data.chats[id]) global.db.data.chats[id] = {}

    // Reset masa kadaluarsa
    global.db.data.chats[id].expired = 0

    conn.reply(m.chat, `✅ Masa kadaluarsa untuk grup ${id} telah dihapus.`, m)
}

handler.help = ['delsewa [link grup]']
handler.tags = ['owner']
handler.command = /^(delexpired|delsewa)$/i
handler.rowner = true

export default handler