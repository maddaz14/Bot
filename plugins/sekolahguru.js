import moment from 'moment-timezone'
import db from '../lib/database.js'

let handler = async (m) => {
  db.data ||= {}
  db.data.users ||= {}
  db.data.users[m.sender] ||= {}

  let user = db.data.users[m.sender]
  user.sekolah ||= { peran: '', waktu: 0 }

  if (user.sekolah.peran && user.sekolah.peran !== 'guru') {
    let waktuGanti = moment(user.sekolah.waktu).add(3, 'days')
    if (moment().isBefore(waktuGanti)) {
      let sisa = waktuGanti.diff(moment(), 'hours')
      return m.reply(`Kamu sudah memilih peran sebagai *${user.sekolah.peran}*.\nKamu bisa ganti peran dalam *${sisa} jam lagi*.`)
    }
  }

  user.sekolah.peran = 'guru'
  user.sekolah.waktu = Date.now()

  m.reply(
    `Peranmu telah ditetapkan sebagai *Guru* di Sekolah ubed!\n\n` +
    `Tugasmu:\n• Menyetujui pendaftaran murid\n• Menilai tugas dan ujian\n• Memberikan beasiswa\n• Mengirim murid ke BK jika perlu\n\n` +
    `Selamat mengajar dengan bijak!`
  )
}

handler.help = ['sekolahguru']
handler.tags = ['rpg']
handler.command = /^sekolahguru$/i

export default handler