const handler = async (m, { conn, args }) => {
  conn.duel = conn.duel || []
  const who = m.mentionedJid && m.mentionedJid[0]
  if (!who) return conn.reply(m.chat, 'Tag pengguna yang ingin diajak duel!', m)

  const user = global.db.data.users[m.sender]
  const last = user.lastduel || 0
  const cooldown = 300000 // 5 menit

  if (Date.now() - last < cooldown) {
    const remaining = Math.ceil((cooldown - (Date.now() - last)) / 1000)
    return conn.reply(m.chat, `Kamu sudah bertarung! Coba lagi dalam *${remaining} detik*.`, m)
  }

  // Cek apakah duel sudah ada
  const existing = conn.duel.find(d => d.challenger === m.sender && d.opponent === who)
  if (existing) return conn.reply(m.chat, 'Kamu sudah menantang orang ini, tunggu responnya.', m)

  conn.duel.push({ challenger: m.sender, opponent: who })

  await conn.sendMessage(m.chat, {
    text: `@${m.sender.split('@')[0]} menantang @${who.split('@')[0]} untuk duel!\n\nKlik tombol untuk memilih:`,
    mentions: [m.sender, who],
    buttons: [
      { buttonId: '.duelterima', buttonText: { displayText: '✅ Terima' }, type: 1 },
      { buttonId: '.dueltolak', buttonText: { displayText: '❌ Tolak' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.help = ['duel @user']
handler.tags = ['rpg']
handler.command = /^duel$/i
handler.group = true

export default handler