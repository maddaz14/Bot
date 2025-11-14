const handler = async (m, { conn, args }) => {
    const groupId = args[0]
    if (!groupId || !groupId.endsWith('@g.us')) return m.reply('⚠️ ID grup tidak valid.')

    try {
        // Bot meninggalkan grup
        await conn.groupLeave(groupId)
        m.reply(`✅ Bot berhasil meninggalkan grup ${groupId}.`)
    } catch (err) {
        m.reply('❌ Gagal meninggalkan grup.')
    }
}

handler.command = ['leavegrup']
handler.owner = true

export default handler