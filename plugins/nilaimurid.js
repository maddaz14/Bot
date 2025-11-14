import db from '../lib/database.js'

let handler = async (m) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'murid' || user.sekolah.status !== 'terdaftar')
    return m.reply('Kamu belum terdaftar sebagai murid di Sekolah ubed.')

  let nilai = user.sekolah.nilaiUjian || 0
  if (nilai === 0) return m.reply('Kamu belum mengikuti ujian.')

  m.reply(`Nilai ujian terakhirmu adalah *${nilai}*.\nTetap semangat belajar ya!`)
}

handler.help = ['nilaimurid']
handler.tags = ['rpg']
handler.command = /^nilaimurid$/i

export default handler