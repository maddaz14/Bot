let handler = async (m, { args }) => {
  const chat = db.data.chats[m.chat]
  const isEnable = /^(true|enable|on|1)$/i.test(args[0])

  chat.emoji = isEnable
  m.reply(`🎭 Fitur *Auto Emoji Sticker* telah *${isEnable ? 'diaktifkan' : 'dinonaktifkan'}*`)
}

handler.help = ['emoji [on/off]']
handler.tags = ['fun']
handler.command = /^emoji$/i

export default handler