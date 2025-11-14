import db from '../lib/database.js'

let handler = async (m, { args, mentionedJid }) => {
  let user = db.data.users[m.sender]
  if (user.sekolah?.peran !== 'guru') return m.reply('Hanya guru yang bisa menilai ujian.')

  let targetJid = mentionedJid && mentionedJid[0]
  if (!targetJid) return m.reply('Tag murid yang ingin diberi nilai.')
  let nilai = parseInt(args[1])
  if (isNaN(nilai) || nilai < 0 || nilai > 100) return m.reply('Nilai harus antara 0 - 100.')

  let target = db.data.users[targetJid]
  if (!target?.ujian?.soal) return m.reply('Murid ini belum punya ujian.')

  target.ujian.nilai = nilai
  target.ujian.dinilaiPada = +new Date()

  this.reply(targetJid, `Ujian kamu telah dinilai.\n\nSoal: *${target.ujian.soal}*\nJawaban: *${target.ujian.jawaban}*\nNilai: *${nilai}*`, m)

  m.reply(`Nilai ${nilai} berhasil dikirim.`)
}

handler.help = ['nilaiujian @tag 85']
handler.tags = ['rpg']
handler.command = /^nilaiujian$/i

export default handler