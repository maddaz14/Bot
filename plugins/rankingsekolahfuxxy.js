import db from '../lib/database.js'

let handler = async (m) => {
  let users = Object.entries(db.data.users)
    .filter(([_, u]) => u.sekolah?.peran == 'murid' && u.nilai && Object.keys(u.nilai).length >= 3)
    .map(([jid, u]) => {
      let total = Object.values(u.nilai).reduce((a, b) => a + b, 0)
      let rata2 = total / Object.keys(u.nilai).length
      return {
        jid,
        name: u.name || jid.split('@')[0],
        nilai: rata2.toFixed(2)
      }
    })
    .sort((a, b) => b.nilai - a.nilai)
    .slice(0, 10)

  if (!users.length) return m.reply('Belum ada murid yang memenuhi syarat untuk ranking.')

  let teks = `*Ranking Sekolah*\n\n`
  users.forEach((u, i) => {
    teks += `${i + 1}. *${u.name}* - Rata-rata Nilai: ${u.nilai}\n`
  })

  m.reply(teks)
}

handler.help = ['rankingsekolah']
handler.tags = ['rpg']
handler.command = /^rankingsekolah$/i

export default handler