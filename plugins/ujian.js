import db from '../lib/database.js'

let handler = async (m) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'murid' || user.sekolah.status !== 'terdaftar')
    return m.reply('Kamu belum terdaftar sebagai murid di Sekolah ubed.')

  let nilai = Math.floor(Math.random() * 51) + 50 // antara 50 - 100
  let money = Math.floor(Math.random() * (10000000 - 10000 + 1)) + 10000
  let exp = Math.floor(Math.random() * (9999 - 500 + 1)) + 500

  user.sekolah.nilaiUjian = nilai
  user.money += money
  user.exp += exp

  m.reply(`Kamu menyelesaikan ujian dengan nilai *${nilai}*!\nKamu mendapatkan:\n+ Rp${money.toLocaleString()}\n+ ${exp} exp`)
}

handler.help = ['ujian']
handler.tags = ['rpg']
handler.command = /^ujian$/i

export default handler