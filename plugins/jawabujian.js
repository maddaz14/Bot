import db from '../lib/database.js'

let handler = async (m, { args }) => {
  let user = db.data.users[m.sender]
  if (user.sekolah?.peran !== 'murid') return m.reply('Kamu harus menjadi murid untuk menjawab ujian.')
  if (!user.ujian?.soal) return m.reply('Tidak ada soal ujian yang diberikan padamu.')

  let jawaban = args.join(' ')
  if (!jawaban) return m.reply('Tuliskan jawabanmu. Contoh: .jawabujian 15')

  user.ujian.jawaban = jawaban
  user.ujian.dijawabPada = +new Date()

  let guruJid = user.ujian.guru
  if (guruJid) {
    this.reply(guruJid, `Murid @${m.sender.split('@')[0]} telah menjawab ujian:\n\n*${user.ujian.soal}*\nJawaban: *${jawaban}*\n\nNilai dengan .nilaiujian @${m.sender.split('@')[0]} 85`, m, { mentions: [m.sender] })
  }

  m.reply('Jawabanmu sudah terkirim ke guru.')
}

handler.help = ['jawabujian']
handler.tags = ['rpg']
handler.command = /^jawabujian$/i

export default handler