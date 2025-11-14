let handler = async (m, { conn, command, isAdmin, isBotAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('❌ Perintah ini hanya untuk grup.')
  if (!isAdmin && !isOwner) return m.reply('❌ Hanya admin atau owner yang bisa mengatur fitur ini.')

  let type = command.toLowerCase().includes('on') ? true : false
  global.db.data.chats[m.chat].nsfw = type
  m.reply(`✅ Fitur NSFW berhasil ${type ? 'diaktifkan' : 'dinonaktifkan'} di grup ini.`)
}

handler.command = /^nsfw(on|off)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.tags = ['group']
handler.help = ['nswfon', 'nswfoff']

export default handler