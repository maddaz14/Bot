let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  const cooldown = 5 * 60 * 1000 // 5 menit
  const lastMine = user.lastMineDiamond || 0 // Menggunakan lastMineDiamond untuk diamond

  if (new Date - lastMine < cooldown)
    return m.reply(`⏳ Kamu sudah menambang diamond.\nTunggu *${Math.ceil((cooldown - (new Date - lastMine)) / 60000)} menit* lagi.`)

  const messages = [
    '🪨 Menggali tanah...',
    '⛏️ Mencari diamond...',
    '💥 Memecahkan batu...',
    '✨ Menemukan kilauan diamond...',
    '🔑 Mengumpulkan hasil tambang...'
  ]

  for (let msg of messages) {
    await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
    await delay(1000 + Math.floor(Math.random() * 500)) // delay acak 1-1.5 detik
  }

  let diamond = Math.floor(Math.random() * 5) + 1 // hasil 1-5 diamond
  user.diamond = (user.diamond || 0) + diamond
  user.lastMineDiamond = +new Date // Menyimpan waktu terakhir menambang diamond

  await conn.sendMessage(m.chat, {
    text: `🎉 *Kamu mendapatkan ${diamond} diamond!*`,
    contextInfo: {
      externalAdReply: {
        title: "Tambang Diamond",
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

handler.help = ['tambangdiamond']
handler.tags = ['rpg']
handler.command = /^tambangdiamond$/i
handler.limit = true

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}