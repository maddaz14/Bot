let handler = async (m, { conn }) => {
  let sender = m.sender
  let user = global.db.data.users[sender]

  if (!user.isMarried) return m.reply('⚠️ Kamu harus menikah dulu untuk bisa membeli rumah bersama pasangan.')
  if (!user.pasangan) return m.reply('⚠️ Data pasangan tidak ditemukan.')

  let hargaRumah = 100000000
  if (user.money < hargaRumah) return m.reply(`💰 Uangmu tidak cukup!\nButuh Rp ${hargaRumah.toLocaleString()} untuk membeli rumah.`)

  // Kurangi uang
  user.money -= hargaRumah
  user.rumah = 'Rumah Mewah'

  // Update pasangan
  let pasanganData = global.db.data.users[user.pasangan]
  if (pasanganData) {
    pasanganData.rumah = 'Rumah Mewah'
  }

  await conn.sendMessage(m.chat, {
    text: `🏠 Selamat! Kamu dan pasanganmu berhasil membeli *Rumah Mewah* seharga Rp ${hargaRumah.toLocaleString()}.\n\n📌 Rumah sudah otomatis tercatat di status keluarga.`,
    mentions: [sender, user.pasangan]
  }, { quoted: m })
}

handler.help = ['buyrumah']
handler.tags = ['rpg']
handler.command = /^buyrumah$/i

export default handler