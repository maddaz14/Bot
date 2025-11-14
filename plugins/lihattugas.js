import db from '../lib/database.js'

let handler = async (m) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'murid')
    return m.reply('Kamu bukan murid di Sekolah ubed.')

  let tugas = db.data.sekolahUbed?.tugasAktif
  if (!tugas) return m.reply('Belum ada tugas dari guru.')

  m.reply(`*Tugas dari guru:*\n${tugas.deskripsi}\n\nSegera dikerjakan ya!`)
}

handler.help = ['lihatugas']
handler.tags = ['rpg']
handler.command = /^lihatugas$/i

export default handler