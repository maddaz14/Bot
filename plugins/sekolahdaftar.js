import db from '../lib/database.js'

let handler = async (m, { conn, args, participants }) => {
  db.data ||= {}
  db.data.users ||= {}
  let user = db.data.users[m.sender]

  if (!user.sekolah || user.sekolah.peran !== 'ortu')
    return m.reply('Kamu bukan orang tua. Hanya orang tua yang bisa mendaftarkan anak ke sekolah.')

  let target = m.mentionedJid && m.mentionedJid[0]
  if (!target) return m.reply('Tag anak yang ingin kamu daftarkan.\nContoh: *.daftarkan @anakmu*')

  let targetUser = db.data.users[target]
  if (!targetUser || !targetUser.sekolah || targetUser.sekolah.peran !== 'murid')
    return m.reply('Orang yang kamu tag belum memilih peran sebagai murid.')

  if (targetUser.sekolah.status === 'terdaftar')
    return m.reply('Anak ini sudah terdaftar di sekolah.')

  // Simpan status pendaftaran
  targetUser.sekolah.status = 'menunggu'
  targetUser.sekolah.ortu = m.sender

  conn.reply(m.chat, `Permohonan pendaftaran sekolah untuk anak berhasil dikirim.\nMenunggu persetujuan dari guru.`, m)
}
handler.help = ['daftarkan @tag']
handler.tags = ['rpg']
handler.command = /^daftarkan$/i

export default handler