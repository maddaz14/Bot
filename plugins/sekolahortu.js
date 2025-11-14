import moment from 'moment-timezone'
import db from '../lib/database.js'

let handler = async (m) => {
  db.data ||= {}
  db.data.users ||= {}
  db.data.users[m.sender] ||= {}

  let user = db.data.users[m.sender]
  user.sekolah ||= { peran: '', waktu: 0 }

  if (user.sekolah.peran && user.sekolah.peran !== 'ortu') {
    let waktuGanti = moment(user.sekolah.waktu).add(3, 'days')
    if (moment().isBefore(waktuGanti)) {
      let sisa = waktuGanti.diff(moment(), 'hours')
      return m.reply(`Kamu sudah memilih peran sebagai *${user.sekolah.peran}*.\nKamu bisa ganti peran dalam *${sisa} jam lagi*.`)
    }
  }

  user.sekolah.peran = 'ortu'
  user.sekolah.waktu = Date.now()

  m.reply(
    `Peranmu telah ditetapkan sebagai *Orang Tua* di Sekolah ubed!\n\n` +
    `Tugasmu:\n• Mengawasi anak\n• Mendaftarkan anak ke sekolah\n• Membantu mengerjakan PR\n• Memberikan ucapan jika nilai anak bagus\n\n` +
    `Selamat berperan sebagai orang tua yang baik!`
  )
}

handler.help = ['sekolahortu']
handler.tags = ['rpg']
handler.command = /^sekolahortu$/i

export default handler