let handler = async (m, { text }) => {
  let user = global.db.data.users[m.sender]
  if (!text) return m.reply(`Ketik: .anticolong on / off`)
  if (text.toLowerCase() == 'on') {
    user.anticolong = true
    m.reply('Fitur *Anticolong* telah diaktifkan. Stiker kamu tidak bisa disimpan oleh orang lain.')
  } else if (text.toLowerCase() == 'off') {
    user.anticolong = false
    m.reply('Fitur *Anticolong* telah dinonaktifkan.')
  } else {
    m.reply('Gunakan: .anticolong on / off')
  }
}
handler.help = ['anticolong on/off']
handler.tags = ['sticker']
handler.command = /^anticolong$/i
handler.group = false

export default handler