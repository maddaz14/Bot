const handler = async (m, { conn, args }) => {
    const groupId = args[0]
    if (!groupId || !groupId.endsWith('@g.us')) return m.reply('⚠️ ID grup tidak valid.')

    try {
        // Mendapatkan link undangan grup
        const inviteLink = await conn.groupInviteCode(groupId)
        m.reply(`🔗 Link Undangan Grup: https://chat.whatsapp.com/${inviteLink}`)
    } catch (err) {
        m.reply('❌ Gagal mengambil link undangan grup.')
    }
}

handler.command = ['getlinkgrup']
handler.owner = true

export default handler