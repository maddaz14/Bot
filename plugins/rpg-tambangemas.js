let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  const cooldown = 5 * 60 * 1000 // 5 menit
  const lastMine = user.lastMineGold || 0

  if (new Date - lastMine < cooldown)
    return m.reply(`⏳ Kamu sudah menambang emas.\nTunggu *${Math.ceil((cooldown - (new Date - lastMine)) / 60000)} menit* lagi.`)

  const messages = [
    '🪨 Menggali tanah...',
    '⛏️ Mencari emas...',
    '💥 Memecahkan batu...',
    '✨ Menemukan kilauan emas...',
    '🔑 Mengumpulkan hasil tambang...'
  ]

  for (let msg of messages) {
    await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
    await delay(1000 + Math.floor(Math.random() * 500)) // delay acak 1-1.5 detik
  }

  let gold = Math.floor(Math.random() * 15) + 5 // hasil 5-19 emas
  user.gold = (user.gold || 0) + gold
  user.lastMineGold = +new Date

  await conn.sendMessage(m.chat, {
    text: `🎉 *Kamu mendapatkan ${gold} emas!*`,
    contextInfo: {
      externalAdReply: {
        title: "Tambang Emas",
        body: "Harta karun tersembunyi ditemukan!",
        thumbnailUrl: "https://files.catbox.moe/xbkko2.jpg",
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true,
        sourceUrl: ''
      }
    }
  }, { quoted: m })
}

handler.help = ['tambangemas']
handler.tags = ['rpg']
handler.command = /^tambangemas$/i
handler.limit = true

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}