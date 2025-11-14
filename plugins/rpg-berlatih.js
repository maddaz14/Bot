function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

const handler = async (m, { conn, text }) => {
  try {
    let user = global.db.data.users[m.sender]

    if (new Date() - user.lastpractice < 3600000) {
      return conn.reply(m.chat, '⏰ Anda hanya dapat berlatih sekali dalam 1 jam.', m)
    }

    user.lastpractice = new Date()

    let userAttack = Math.floor(Math.random() * 100) + 50
    let healthIncrease = userAttack * 3
    user.health += healthIncrease

    let message = `🏋️ Anda sedang berlatih dan mendapatkan peningkatan kesehatan:\n\n`
    message += `❤️ Kesehatan pengguna sekarang: ${user.health}\n`
    message += `⚔️ Serangan yang dihasilkan: ${userAttack}\n`
    message += `🔄 Anda dapat berlatih lagi dalam 1 jam.\n`

    conn.reply(m.chat, message, m)
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, 'Terjadi kesalahan saat berlatih.', m)
  }
}

handler.help = ['berlatih']
handler.tags = ['rpg']
handler.command = /^berlatih$/i
handler.rpg = true
handler.limit = true
handler.group = true
handler.fail = null

export default handler