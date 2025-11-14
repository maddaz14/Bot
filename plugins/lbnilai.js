import db from '../lib/database.js'

let handler = async (m) => {
  let murid = Object.entries(db.data.users)
    .filter(([_, u]) => u.sekolah?.peran == 'murid' && u.nilai && Object.keys(u.nilai).length >= 1)
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

  if (!murid.length) return m.reply('Belum ada murid yang memiliki nilai.')

  let teks = `*Leaderboard Rata-rata Nilai Murid*\n\n`
  murid.forEach((u, i) => {
    teks += `${i + 1}. *${u.name}* - ${u.nilai}\n`
  })

  m.reply(teks)
}

handler.help = ['lbnilai']
handler.tags = ['rpg']
handler.command = /^lbnilai$/i

export default handler