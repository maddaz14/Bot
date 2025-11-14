let handler = async (m, { conn, args }) => {
    const groupId = args[0]
    if (!groupId || !groupId.endsWith('@g.us')) {
        return m.reply('⚠️ Masukkan ID grup yang valid.\n\nContoh:\n.opengrup 1234567890-123456@g.us')
    }

    try {
        await conn.groupSettingUpdate(groupId, 'not_announcement')
        m.reply(`✅ Grup *${groupId}* berhasil *dibuka*.`)
    } catch (e) {
        m.reply('❌ Gagal membuka grup. Pastikan bot adalah admin di grup tersebut.')
    }
}

handler.command = ['opengrup']
handler.owner = true

export default handler