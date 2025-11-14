import { areJidsSameUser } from '@fuxxy-star/baileys'
import { resolveWid } from '../lib/jid.js'

let handler = async (m, { conn, participants }) => {
  if (!m.mentionedJid?.length) throw '❌ Tag target yang mau di-promote!'

  const targets = []
  for (let rawTarget of m.mentionedJid) {
    // skip kalau target adalah bot sendiri
    if (areJidsSameUser(rawTarget, conn.user.id)) continue

    // resolve JID final (atasi lid / nomor bebas)
    const jid = await resolveWid(m, conn, rawTarget, participants)
    if (!jid) continue

    // cek apakah sudah admin
    const part = participants.find(v => areJidsSameUser(v.id, jid))
    if (!part?.admin) targets.push(jid)
  }

  if (!targets.length) throw '⚠️ Tidak ada user valid untuk dipromote.'

  for (let jid of targets) {
    await conn.groupParticipantsUpdate(m.chat, [jid], 'promote')
    await delay(1 * 1000) // kasih jeda biar aman
  }

  m.reply(`✅ Sukses promote ${targets.map(u => '@' + u.split('@')[0]).join(', ')}`, null, {
    mentions: targets
  })
}

handler.help = ['opromote @user']
handler.tags = ['owner']
handler.command = /^(opromote)$/i
handler.owner = true
handler.group = true
handler.botAdmin = true

export default handler

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))