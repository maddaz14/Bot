const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  if (!user || typeof user.balance !== 'number') {
    return m.reply('⚠️ Data ubed COINS tidak ditemukan. Kamu belum punya dompet!')
  }

  const required = {
    sword: 5,
    shield: 5,
    map: 1
  }

  for (const [item, amount] of Object.entries(required)) {
    if ((user[item] || 0) < amount) {
      return m.reply(`❌ Kamu butuh:\n🗡️ Sword: ${required.sword}\n🛡️ Shield: ${required.shield}\n📜 Map: ${required.map}`)
    }
  }

  // Kurangi item
  user.sword -= required.sword
  user.shield -= required.shield
  user.map -= required.map

  const menang = Math.random() < 0.6 // 60% peluang menang

  if (menang) {
    const hadiahUC = Math.floor(Math.random() * 141) + 10 // 10–150 ubed COINS
    user.balance += hadiahUC

    const formatted = hadiahUC.toLocaleString('id-ID')
    const balanceFormatted = user.balance.toLocaleString('id-ID')

    return m.reply(`
⚔️ *Pertempuran Dimulai!*
Kamu bertarung dengan gagah berani...

✅ *MENANG!*
+ᴜ͢ᴄ.${formatted} ubed COINS
Saldo sekarang: ᴜ͢ᴄ.${balanceFormatted}
`)
  } else {
    const rugiUC = 50 // Kerugian kecil
    user.balance = Math.max(0, user.balance - rugiUC)

    const formattedRugi = rugiUC.toLocaleString('id-ID')
    const balanceFormatted = user.balance.toLocaleString('id-ID')

    return m.reply(`
⚔️ *Pertempuran Dimulai!*
Sayangnya musuh terlalu kuat...

❌ *KALAH!*
-ᴜ͢ᴄ.${formattedRugi} ubed COINS
Saldo sekarang: ᴜ͢ᴄ.${balanceFormatted}
`)
  }
}

handler.help = ['warr']
handler.tags = ['rpg']
handler.command = /^warr$/i

export default handler