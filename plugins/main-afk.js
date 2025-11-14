import baileys from '@fuxxy-star/baileys'
const { jidNormalizedUser } = baileys

let handler = m => m
handler.before = m => {
  let sender = jidNormalizedUser(m.sender)
  let user = global.db.data.users[sender]

  if (!m.isGroup) return false

  // Cek kalau yang AFK sendiri balik
  if (user?.afk > -1) {
    m.reply(`
Masih hidup ternyata wkwk
Kamu berhenti AFK${user.afkReason ? ' setelah ' + user.afkReason : ''}
Selama ${(new Date - user.afk) / 1000 | 0} detik
`.trim())
    user.afk = -1
    user.afkReason = ''
  }

  // Ambil semua jid yang di-mention/quoted
  let jids = [
    ...(m.mentionedJid || []),
    ...(m.quoted ? [m.quoted.sender] : [])
  ]

  for (let jid of jids) {
    jid = jidNormalizedUser(jid) // FIX: normalisasi jid/lid
    let afkUser = global.db.data.users[jid]
    if (!afkUser) continue
    if (!afkUser.afk || afkUser.afk < 0) continue
    let reason = afkUser.afkReason || ''
    m.reply(`
Jangan tag dia bang!
Dia sedang AFK ${reason ? 'dengan alasan ' + reason : 'tanpa alasan'}
Sejak ${(new Date - afkUser.afk) / 1000 | 0} detik lalu
`.trim())
  }

  return true
}

export default handler