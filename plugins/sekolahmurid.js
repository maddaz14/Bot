import moment from 'moment-timezone'
import db from '../lib/database.js'

let handler = async (m) => {
  db.data ||= {}
  db.data.users ||= {}
  db.data.users[m.sender] ||= {}

  let user = db.data.users[m.sender]
  user.sekolah ||= { peran: '', waktu: 0 }

  if (user.sekolah.peran && user.sekolah.peran !== 'murid') {
    let waktuGanti = moment(user.sekolah.waktu).add(3, 'days')
    if (moment().isBefore(waktuGanti)) {
      let sisa = waktuGanti.diff(moment(), 'hours')
      return m.reply(`Kamu sudah memilih peran sebagai *${user.sekolah.peran}*.\nKamu bisa ganti peran dalam *${sisa} jam lagi*.`)
    }
  }

  user.sekolah.peran = 'murid'
  user.sekolah.waktu = Date.now()

  m.reply(
    `Peranmu telah ditetapkan sebagai *Siswa/Siswi* di Sekolah ubed!\n\n` +
    `Tugasmu:\n• Mendaftar sekolah melalui ortumu\n• Absen, belajar, olahraga, ujian, dll\n• Dapatkan nilai dan raih kelulusan!\n\n` +
    `Ayo semangat menuntut ilmu!`
  )
}

handler.help = ['sekolahmurid']
handler.tags = ['rpg']
handler.command = /^sekolahmurid$/i

export default handler