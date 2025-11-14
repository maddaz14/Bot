let handler = async (m, { conn, participants }) => {
  let chat = global.db.data.chats[m.chat]
  chat.isBanned = true

  let groupMetadata = await conn.groupMetadata(m.chat)
  let groupName = groupMetadata.subject

  await conn.sendMessage(m.chat, {
    text: `✅ Done, bot sekarang *mute* di grup *${groupName}*`,
    contextInfo: {
      externalAdReply: {
        title: "Bot Sedang Offline",
        body: "Request Fitur PM 6285147777105",
        thumbnailUrl: "https://files.catbox.moe/0o03p5.jpg",
        sourceUrl: "",
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  })
}

handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^(banchat)$/i
handler.owner = false
handler.admin = true

export default handler