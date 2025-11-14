import { resolveWid } from '../lib/jid.js'

let handler = async (m, { conn, participants }) => {
  if (!m.mentionedJid?.length) throw '❌ Tag target yang mau di-demote!'

  // ambil target pertama dari mention
  const rawTarget = m.mentionedJid[0]

  // resolve ke JID final (atasi lid/nomor bebas format)
  const target = await resolveWid(m, conn, rawTarget, participants)
  if (!target) throw '⚠️ Tidak bisa menentukan target.'

  // lakukan demote
  await conn.groupParticipantsUpdate(m.chat, [target], 'demote')

  // balasan sukses
  m.reply(`✅ Sukses demote @${target.split('@')[0]}`, null, { mentions: [target] })
}

handler.help = ['odemote @user']
handler.tags = ['group']
handler.command = /^(odemote)$/i
handler.owner = true
handler.group = true
handler.botAdmin = true

export default handler