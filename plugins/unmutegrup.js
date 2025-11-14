let handler = async (m, { conn, args }) => {
    const groupId = args[0]

    if (!groupId || !groupId.endsWith('@g.us')) {
        return m.reply('⚠️ Masukkan ID grup yang valid.\n\nContoh:\n.unmutegrup 1234567890-123456@g.us')
    }

    if (!global.db.data.chats[groupId]) global.db.data.chats[groupId] = {}
    global.db.data.chats[groupId].isBanned = false

    m.reply(`✅ Bot aktif kembali di grup *${groupId}*.`)
}

handler.help = ['unmutegrup <id_grup>']
handler.tags = ['owner']
handler.command = /^unmutegrup$/i
handler.owner = true

export default handler