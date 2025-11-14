import db from '../lib/database.js'
import { parsePhoneNumber } from 'libphonenumber-js'

let handler = async (m, { args }) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'ortu' || user.sekolah.status !== 'terdaftar')
    return m.reply('Kamu belum terdaftar sebagai orang tua di Sekolah ubed.')

  if (!args[0]) return m.reply('Contoh: .pantauan 628xxx')

  let nomor = args[0].replace(/[^0-9]/g, '')
  let anak = db.data.users[nomor + '@s.whatsapp.net']

  if (!anak || !anak.sekolah || anak.sekolah.peran !== 'murid')
    return m.reply('Anak dengan nomor tersebut belum terdaftar sebagai murid.')

  let nilai = anak.sekolah.nilaiUjian || 0
  let lastAbsen = anak.sekolah.lastAbsen || 0
  let absenStatus = lastAbsen ? 'Sudah absen hari ini' : 'Belum absen'

  m.reply(`Pantauan untuk anak ${nomor}:\n• Nilai Ujian: ${nilai || 'Belum ujian'}\n• Status Absen: ${absenStatus}`)
}

handler.help = ['pantauan <nomor>']
handler.tags = ['rpg']
handler.command = /^pantauan$/i

export default handler