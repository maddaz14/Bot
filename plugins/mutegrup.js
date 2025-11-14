const cooldown = 60000 // 1 menit
const defaultDuration = 1440 // 24 jam

let handler = async (m, { conn, args }) => {
    const groupId = args[0]

    if (!groupId || !groupId.endsWith('@g.us')) {
        return m.reply('⚠️ Masukkan ID grup yang valid.\n\nContoh:\n.mutegrup 1234567890-123456@g.us')
    }

    // Set status bot mute di grup
    if (!global.db.data.chats[groupId]) global.db.data.chats[groupId] = {}
    global.db.data.chats[groupId].isBanned = true

    m.reply(`✅ Bot akan diam di grup *${groupId}* selama *24 jam*.`)

    setTimeout(() => {
        global.db.data.chats[groupId].isBanned = false
        conn.sendMessage(groupId, { text: '✅ Bot aktif kembali setelah diam 24 jam.' }).catch(() => {})
    }, cooldown * defaultDuration)

    global.db.data.chats[groupId].lastmute = Date.now() + cooldown * defaultDuration
}

handler.help = ['mutegrup <id_grup>']
handler.tags = ['owner']
handler.command = /^mutegrup$/i
handler.owner = true

export default handler