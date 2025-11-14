import db from '../lib/database.js'

let handler = async (m, { text, args, participants, mentions }) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran != 'ortu')
    return m.reply('Fitur ini hanya bisa digunakan oleh orang tua.')

  let mention = m.mentionedJid?.[0]
  if (!mention) return m.reply('Tag anakmu yang ingin kamu izin-kan.')

  let alasan = args.slice(1).join(' ')
  if (!alasan) return m.reply('Tuliskan alasan izinnya.')

  let anak = db.data.users[mention]
  if (!anak || anak.sekolah?.peran != 'murid')
    return m.reply('Pengguna yang kamu tag bukan murid.')

  if (!anak.sekolah?.ortu || anak.sekolah.ortu !== m.sender)
    return m.reply('Kamu bukan orang tua dari murid tersebut.')

  anak.izin = {
    alasan,
    waktu: +new Date(),
    valid: true
  }

  m.reply(`Surat izin untuk *${anak.name || '@' + mention.split('@')[0]}* telah dikirim.\nAlasan: *${alasan}*`)
}

handler.help = ['suratizin @murid [alasan]']
handler.tags = ['rpg']
handler.command = /^suratizin$/i

export default handler