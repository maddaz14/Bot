import moment from 'moment-timezone'
import db from '../lib/database.js'

let handler = async (m) => {
  // Cek dan buat struktur data aman
  db.data ||= {}
  db.data.users ||= {}
  db.data.users[m.sender] ||= {}

  let user = db.data.users[m.sender]

  // Inisialisasi jika belum ada data sekolah
  user.sekolah ||= { peran: '', waktu: 0 }

  // Cek jika sudah punya peran
  if (user.sekolah.peran) {
    let waktuGanti = moment(user.sekolah.waktu).add(3, 'days')
    let sisa = waktuGanti.diff(moment(), 'hours')

    return m.reply(
      `Kamu sudah memilih peran sebagai *${user.sekolah.peran}*.\n\n` +
      `Kamu bisa mengganti peran dalam *${sisa <= 0 ? 'sekarang!' : sisa + ' jam lagi'}*.`
    )
  }

  // Jika belum punya peran
  return m.reply(
    `Selamat datang di *Sekolah ubed!*\n\n` +
    `Silakan pilih peranmu:\n\n• .sekolahortu\n• .sekolahguru\n• .sekolahmurid\n\n` +
    `*Kamu hanya bisa memilih 1x dan bisa ganti setelah 3 hari.*`
  )
}

handler.help = ['sekolah']
handler.tags = ['rpg']
handler.command = /^sekolah$/i

export default handler