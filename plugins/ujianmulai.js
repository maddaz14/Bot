import db from '../lib/database.js'

let handler = async (m, { args, text }) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'guru') return m.reply('Hanya guru yang bisa memulai ujian.')

  let [judul, jumlahStr] = text.split('|').map(v => v.trim())
  if (!judul || !jumlahStr) return m.reply('Format salah!\nContoh: .ujianmulai Ujian Matematika | 3')

  let jumlah = parseInt(jumlahStr)
  if (isNaN(jumlah) || jumlah < 1) return m.reply('Jumlah soal minimal 1.')

  // Dummy soal (nanti bisa di-random dari soal database)
  let soal = []
  for (let i = 0; i < jumlah; i++) {
    soal.push({
      pertanyaan: `Soal nomor ${i + 1}, berapa hasil dari ${i + 2} + ${i + 3}?`,
      jawaban: String((i + 2) + (i + 3))
    })
  }

  db.data.sekolahUbed = db.data.sekolahUbed || {}
  db.data.sekolahUbed.ujianAktif = {
    nama: judul,
    soal,
    oleh: m.sender,
    waktu: new Date()
  }

  m.reply(`Ujian *${judul}* dimulai dengan ${jumlah} soal!\nMurid bisa menjawab dengan perintah *.ikutujian*`)
}

handler.help = ['ujianmulai <judul> | <jumlah soal>']
handler.tags = ['rpg']
handler.command = /^ujianmulai$/i

export default handler