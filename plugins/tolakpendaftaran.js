import db from '../lib/database.js'

let handler = async (m, { conn, mentionedJid }) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'guru') 
    return m.reply('Perintah ini hanya untuk guru.')

  let target = mentionedJid && mentionedJid[0]
  if (!target) return m.reply('Tag murid yang ingin kamu tolak.\nContoh: *.tolakpendaftaran @murid*')

  let murid = db.data.users[target]
  if (!murid || murid.sekolah?.status !== 'menunggu')
    return m.reply('Murid tidak ditemukan atau tidak mengajukan pendaftaran.')

  murid.sekolah.status = 'ditolak'

  conn.reply(m.chat, `Murid @${target.split('@')[0]} ditolak masuk sekolah.`, m, {
    mentions: [target]
  })
}
handler.help = ['tolakpendaftaran @tag']
handler.tags = ['rpg']
handler.command = /^tolakpendaftaran$/i

export default handler