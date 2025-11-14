// wm ubed bot

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const handler = async (m, { conn, args }) => {
  const user = global.db.data.users[m.sender]
  if (!user) return m.reply('⚠️ Data tidak ditemukan!')

  if (!args[0]) return m.reply('Tag atau mention orang yang ingin kamu sihir!\nContoh: .sihir @target')

  if (!user.bola_ramalan || user.bola_ramalan < 1) {
    return m.reply('🔮 Kamu belum punya *Bola Ramalan*! Beli dulu di RPG Shop sebelum bisa menyihir!')
  }

  if (!user.ramuan_xp || user.ramuan_xp < 1) {
    return m.reply('🧪 Kamu butuh *1 Ramuan XP* untuk menyihir seseorang! Beli di RPG Shop.')
  }

  // Kurangi 1 ramuan XP
  user.ramuan_xp--

  const target = args[0].replace(/[@ .+]/g, '')
  const success = Math.random() < 0.6

  const ceritaBerhasil = [
    'Kamu mulai merapal mantra kuno...',
    'Cahaya ungu muncul di tanganmu...',
    'Sosok targetmu melayang tak berdaya...',
  ]

  const ceritaGagal = [
    'Kamu membaca mantra dengan percaya diri...',
    'Tiba-tiba bola ramalanmu bergetar keras...',
    'Mantra mental! Kamu terkena efeknya sendiri...',
  ]

  const story = success ? ceritaBerhasil : ceritaGagal

  for (let i = 0; i < story.length; i++) {
    await delay(2000)
    m.reply(story[i])
  }

  if (success) {
    const hadiah = Math.floor(Math.random() * (1000 - 550 + 1)) + 550
    user.balance += hadiah
    const formatted = hadiah.toLocaleString('id-ID')
    const saldo = user.balance.toLocaleString('id-ID')
    m.reply(`✨ *Sihir Berhasil!*\nKamu menerima +ᴜ͢ᴄ.${formatted} ubed COINS\nSaldo sekarang: ᴜ͢ᴄ.${saldo}`)
  } else {
    const rugi = Math.floor(Math.random() * (100 - 50 + 1)) + 50
    user.balance = Math.max(0, user.balance - rugi)
    const formatted = rugi.toLocaleString('id-ID')
    const saldo = user.balance.toLocaleString('id-ID')
    m.reply(`❌ *Sihir Gagal!*\nKamu kehilangan -ᴜ͢ᴄ.${formatted} ubed COINS\nSaldo sekarang: ᴜ͢ᴄ.${saldo}`)
  }
}

handler.help = ['sihir @user']
handler.tags = ['rpg']
handler.command = /^sihir$/i

export default handler