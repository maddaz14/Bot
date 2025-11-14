import db from '../lib/database.js'
import moment from 'moment-timezone'

let handler = async (m, { args, mentionedJid }) => {
  let sender = db.data.users[m.sender]
  if (sender.sekolah?.peran !== 'guru') return m.reply('Hanya guru yang bisa memberikan surat peringatan.')

  let targetJid = mentionedJid[0]
  if (!targetJid) return m.reply('Tag murid yang ingin diberi surat peringatan.')

  let target = db.data.users[targetJid]
  if (!target.sekolah || target.sekolah.peran !== 'murid') return m.reply('Yang kamu tag bukan murid.')

  target.bk = target.bk || { sp: 0, bannedUjianUntil: 0 }
  target.bk.sp++

  let status = ''
  if (target.bk.sp === 1) status = 'SP 1 - Teguran pertama.'
  else if (target.bk.sp === 2) status = 'SP 2 - Teguran keras.'
  else if (target.bk.sp >= 3) {
    status = 'SP 3 - Murid dilarang mengikuti ujian selama 1 hari.'
    target.bk.bannedUjianUntil = Date.now() + 24 * 60 * 60 * 1000 // 1 hari
  }

  m.reply(`@${targetJid.split('@')[0]} mendapatkan ${status}`, null, { mentions: [targetJid] })
  this.reply(targetJid, `Kamu mendapatkan *${status}* dari guru.`, m)
}

handler.help = ['peringatanbk @tag']
handler.tags = ['rpg']
handler.command = /^peringatanbk$/i

export default handler